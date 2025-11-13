import { GameScene } from "../scenes/GameScene";

// Data shapes persisted to localStorage
export interface NodeData {
	id: number;
	x: number;
	y: number;
	primary?: boolean;
}

export interface EdgeData {
	source: number;
	target: number;
}

// SaveState matches what's stored in localStorage
export interface SaveState {
	nodes: NodeData[];
	edges: EdgeData[];
}

// A draggable node represented by a Phaser Image. It owns its own interactivity
// (no global scene.input.on usage). The image texture used is "cell".
class PathNode extends Phaser.GameObjects.Image {
	public id: number;

	public worldX: number;
	public worldY: number;
	private prevWorldX: number;
	private prevWorldY: number;

	public selected: boolean = false;
	public primary: boolean = true;

	// transform params used to map between world and screen during drag
	private cameraLeft = 0;
	private cameraTop = 0;
	private cameraTileSize = 16;

	// For distinguishing between click and drag
	private dragStartX = 0;
	private dragStartY = 0;
	private isDragging = false;

	constructor(
		scene: Phaser.Scene,
		id: number,
		worldX: number,
		worldY: number,
		primary: boolean
	) {
		// create image at (0,0) initially; MapPaths will position it each frame
		super(scene, 0, 0, "cell");
		this.id = id;
		this.worldX = worldX;
		this.worldY = worldY;
		this.primary = primary;

		this.setInteractive({ useHandCursor: true, draggable: true });
		this.setScale(this.primary ? 1.0 : 0.5);

		// Track drag start position
		this.on("dragstart", (pointer: Phaser.Input.Pointer) => {
			this.isDragging = false;
			this.dragStartX = pointer.x;
			this.dragStartY = pointer.y;
			this.prevWorldX = this.worldX;
			this.prevWorldY = this.worldY;

			this.emit("click");
		});

		// When dragged, update position and check if we've moved enough to consider it a drag
		this.on(
			"drag",
			(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
				const dx = pointer.x - this.dragStartX;
				const dy = pointer.y - this.dragStartY;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (!this.isDragging && distance >= 8) {
					this.isDragging = true;
				}

				this.x = dragX;
				this.y = dragY;

				if (!this.cameraTileSize) return;
				const tileSize = this.cameraTileSize;

				// Convert screen coords to world coords
				const rawX = this.x / tileSize + this.cameraLeft - 0.5;
				const rawY = this.y / tileSize + this.cameraTop - 0.5;

				// Snap to nearest .5 or whole number
				this.worldX = Math.round(rawX * 2) / 2;
				this.worldY = Math.round(rawY * 2) / 2;

				// Update screen position to reflect snapped coords
				const screenX =
					(this.worldX + 0.5) * tileSize - this.cameraLeft * tileSize;
				const screenY =
					(this.worldY + 0.5) * tileSize - this.cameraTop * tileSize;
				this.setPosition(screenX, screenY);

				// Emit an event so parent containers can react if needed
				if (this.prevWorldX != this.worldX || this.prevWorldY != this.worldY) {
					this.emit("moved", this);
				}

				this.prevWorldX = this.worldX;
				this.prevWorldY = this.worldY;
			}
		);

		// Handle pointerup - if we never entered drag mode, it's a click
		this.on("dragend", (pointer: Phaser.Input.Pointer) => {
			this.isDragging = false;
		});
	}

	// Update transform parameters and reposition the image according to world coords
	public updateTransform(left: number, top: number, tileSize: number) {
		this.cameraLeft = left;
		this.cameraTop = top;
		this.cameraTileSize = tileSize;

		const screenX = (this.worldX + 0.5) * tileSize - left * tileSize;
		const screenY = (this.worldY + 0.5) * tileSize - top * tileSize;
		this.setPosition(screenX, screenY);

		this.setTileSize(tileSize);
	}

	public setSelected(selected: boolean) {
		this.selected = selected;
		this.setTint(selected ? 0xffff00 : 0xffffff);
	}

	public setTileSize(size: number) {
		const scale = this.primary ? 1.0 : 0.5;
		this.setDisplaySize(size * scale, size * scale);
	}
}

// use EdgeData for edge shape

export class MapPaths extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private graphics: Phaser.GameObjects.Graphics;

	private static readonly STORAGE_KEY = "poke-merge-paths";
	private static readonly DEFAULT_NODES: NodeData[] = [
		{ id: 1, x: 74, y: 275, primary: true },
		{ id: 2, x: 84, y: 281, primary: true },
		{ id: 3, x: 83, y: 275, primary: true },
		{ id: 4, x: 80.5, y: 267.5, primary: true },
	];
	private static readonly DEFAULT_EDGES: EdgeData[] = [
		{ source: 1, target: 2 },
		{ source: 2, target: 3 },
		{ source: 3, target: 4 },
	];

	// nodes are PathNode game objects
	private nodes: PathNode[] = [];
	private edges: EdgeData[] = [];

	// Last camera/tile info used to map between screen and world coords during drag
	private cameraLeft = 0;
	private cameraTop = 0;
	private cameraTileSize = 16;

	// Curve graphics element for smooth spline rendering
	private curveGraphics: Phaser.GameObjects.Graphics;
	private curves: Phaser.Curves.Spline[] = [];
	private chains: number[][] = [];

	// Undo/Redo functionality
	private history: SaveState[] = [];
	private static readonly MAX_SAVE_STATES = 10;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;

		this.graphics = scene.add.graphics();
		this.add(this.graphics);

		this.curveGraphics = scene.add.graphics();
		this.add(this.curveGraphics);

		// Load saved data or use defaults
		const savedData = this.loadFromStorage();
		const stateData = savedData || {
			nodes: MapPaths.DEFAULT_NODES,
			edges: MapPaths.DEFAULT_EDGES,
		};

		// Load the state (clears and recreates all nodes/edges)
		this.loadState(stateData);

		// Keyboard shortcuts: toggle primary on selected nodes with key '1'
		if (scene.input && scene.input.keyboard) {
			scene.input.keyboard.on("keydown-ONE", this.onToggleNodePrimary, this);
			scene.input.keyboard.on("keydown-TWO", this.onAddNode, this);
			scene.input.keyboard.on("keydown-THREE", this.onRemoveNode, this);
			scene.input.keyboard.on("keydown-FOUR", this.onSplitEdge, this);

			// Undo
			scene.input.keyboard.on("keydown-Z", (event: KeyboardEvent) => {
				if (event.metaKey || event.ctrlKey) {
					this.onUndo();
				}
			});
		}
	}

	private addNode(id: number, x: number, y: number, primary: boolean) {
		const node = new PathNode(this.scene, id, x, y, primary);
		node.on("moved", this.redrawEdges, this);
		node.on("dragend", this.saveToStorage, this);
		node.on("click", () => {
			this.nodes.forEach((n) => n.setSelected(n == node));
		});
		this.add(node);
		this.nodes.push(node);
	}

	private redrawEdges() {
		console.warn("redrawEdges");

		// clear only edges so nodes (images) remain visible
		this.graphics.clear();
		const color = 0xffffff;
		this.graphics.lineStyle(4, color, 1.0);

		for (const e of this.edges) {
			const s = this.nodes.find((n) => n.id === e.source);
			const t = this.nodes.find((n) => n.id === e.target);
			if (!s || !t) continue;
			this.graphics.strokeLineShape(new Phaser.Geom.Line(s.x, s.y, t.x, t.y));
		}

		// Update and draw curves
		this.updateCurves();
	}

	private rebuildChains() {
		console.warn("rebuildChains");
		this.chains = [];
		const visited = new Set<number>();

		// Find all root nodes (primary nodes or nodes with no incoming edges)
		const rootNodes = this.findRootNodes();

		// For each root node, traverse and build chains
		for (const rootId of rootNodes) {
			this.buildChainsFromNode(rootId, visited);
		}

		this.updateCurves();
	}

	private findRootNodes(): number[] {
		const roots: number[] = [];

		for (const node of this.nodes) {
			// Check if this is a root node
			const hasIncomingEdge = this.edges.some((e) => e.target === node.id);

			// Root nodes are primary nodes with no incoming edges, or primary nodes with multiple incoming edges
			if (node.primary && !hasIncomingEdge) {
				roots.push(node.id);
			}
		}

		// If no proper roots found, use all primary nodes
		if (roots.length === 0) {
			return this.nodes.filter((n) => n.primary).map((n) => n.id);
		}

		return roots;
	}

	private buildChainsFromNode(nodeId: number, visited: Set<number>) {
		// Get all child edges from this node
		const childEdges = this.edges.filter((e) => e.source === nodeId);

		for (const edge of childEdges) {
			const chain = this.traceChain(nodeId, edge.target, visited);
			if (chain.length > 0) {
				this.chains.push(chain);

				// After tracing a chain, continue building from the endpoint if it's a branching node
				const endpoint = chain[chain.length - 1];
				const endpointNode = this.nodes.find((n) => n.id === endpoint);
				if (endpointNode) {
					const outgoingEdges = this.edges.filter((e) => e.source === endpoint);
					if (
						(endpointNode.primary && outgoingEdges.length > 0) ||
						outgoingEdges.length > 1
					) {
						// Primary node with children, or branching node - recursively build chains from it
						this.buildChainsFromNode(endpoint, visited);
					}
				}
			}
		}
	}

	private traceChain(
		start: number,
		current: number,
		visited: Set<number>
	): number[] {
		const chain: number[] = [start];
		let currentNode = current;

		while (true) {
			chain.push(currentNode);
			const node = this.nodes.find((n) => n.id === currentNode);

			if (!node) break;

			// Check if current node is a stopping point (primary or has multiple outgoing edges)
			const outgoingEdges = this.edges.filter((e) => e.source === currentNode);
			const isStoppingPoint = node.primary || outgoingEdges.length !== 1;

			if (isStoppingPoint) {
				visited.add(currentNode);
				break;
			}

			// Find the single child edge and continue
			if (outgoingEdges.length === 0) {
				visited.add(currentNode);
				break;
			}

			currentNode = outgoingEdges[0].target;

			// Prevent infinite loops
			if (visited.has(currentNode)) {
				break;
			}
		}

		return chain;
	}

	private updateCurves() {
		// Clear curves array and graphics
		this.curves = [];
		this.curveGraphics.clear();

		// Convert chains to splines and collect them
		for (const chain of this.chains) {
			const points: Phaser.Math.Vector2[] = [];

			for (const nodeId of chain) {
				const node = this.nodes.find((n) => n.id === nodeId);
				if (node) {
					points.push(new Phaser.Math.Vector2(node.x, node.y));
				}
			}

			// Create spline with at least 2 points
			if (points.length >= 2) {
				const spline = new Phaser.Curves.Spline(points);
				this.curves.push(spline);
			}
		}

		// Draw all curves
		const curveColor = 0xff0000;
		this.curveGraphics.lineStyle(10, curveColor, 1.0);

		for (const curve of this.curves) {
			curve.draw(this.curveGraphics);
		}
	}

	updateCamera(cameraX: number, cameraY: number, tileSize: number) {
		this.cameraLeft = cameraX - this.scene.CX / tileSize;
		this.cameraTop = cameraY - this.scene.CY / tileSize;
		this.cameraTileSize = tileSize;

		this.draw();
	}

	draw() {
		console.warn("draw");
		// update each node's screen position from its world coords
		for (const node of this.nodes) {
			node.updateTransform(
				this.cameraLeft,
				this.cameraTop,
				this.cameraTileSize
			);
		}

		this.redrawEdges();
	}

	private saveToStorage(addToHistory: boolean) {
		console.warn("saveToStorage");
		// Before overwriting localStorage, push the currently stored state (if any)
		if (addToHistory) {
			const savedData = this.loadFromStorage();
			if (savedData) {
				this.history.push(savedData);
				if (this.history.length > MapPaths.MAX_SAVE_STATES) {
					this.history.shift();
				}
			}
		}

		const data: SaveState = {
			nodes: this.nodes.map((n) => ({
				id: n.id,
				x: n.worldX,
				y: n.worldY,
				primary: n.primary,
			})),
			edges: this.edges,
		};
		localStorage.setItem(MapPaths.STORAGE_KEY, JSON.stringify(data));
	}

	private loadFromStorage(): SaveState | null {
		const data = localStorage.getItem(MapPaths.STORAGE_KEY);
		if (!data) return null;
		try {
			return JSON.parse(data) as SaveState;
		} catch (e) {
			console.warn("Failed to parse saved path data:", e);
			return null;
		}
	}

	private loadState(state: { nodes: NodeData[]; edges: EdgeData[] }) {
		this.nodes.forEach((node) => node.destroy());
		this.nodes = [];
		this.edges = [];

		// Recreate nodes
		state.nodes.forEach((node) =>
			this.addNode(node.id, node.x, node.y, node.primary != false)
		);
		this.edges = state.edges;

		// Rebuild chains and redraw
		this.rebuildChains();
		this.draw();
	}

	/* User actions */

	private onToggleNodePrimary() {
		const selected = this.nodes.find((node) => node.selected);
		if (!selected) return;

		selected.primary = !selected.primary;
		selected.setTileSize(this.cameraTileSize);

		this.saveToStorage(true);
		this.rebuildChains();
	}

	private onAddNode() {
		const selected = this.nodes.find((n) => n.selected);
		if (!selected) return;

		const newId = Math.max(...this.nodes.map((n) => n.id)) + 1;
		this.addNode(newId, selected.worldX + 2, selected.worldY, false);

		// Select the new node
		for (const node of this.nodes) {
			node.setSelected(node.id === newId);
		}

		// Connect with edge
		this.edges.push({ source: selected.id, target: newId });

		this.rebuildChains();
		this.saveToStorage(true);
		this.draw();
	}

	private onRemoveNode() {
		const selected = this.nodes.find((n) => n.selected);
		if (!selected) return;

		const nodeId = selected.id;

		// Find all edges connected to this node
		const connectedEdges = this.edges.filter(
			(e) => e.source === nodeId || e.target === nodeId
		);

		let parentId: number | null = null;

		if (connectedEdges.length === 0) {
			// Just remove node if no edges
			this.nodes = this.nodes.filter((n) => n.id !== nodeId);
			selected.destroy();
		} else if (connectedEdges.length === 1) {
			// Leaf node: remove node and its single edge
			const parentEdge = connectedEdges[0];
			parentId =
				parentEdge.source === nodeId ? parentEdge.target : parentEdge.source;

			this.edges = this.edges.filter(
				(e) => e.source !== nodeId && e.target !== nodeId
			);
			this.nodes = this.nodes.filter((n) => n.id !== nodeId);
			selected.destroy();
		} else {
			// Branch: multiple edges
			// Identify parent edge (the one where this node is the target)
			const parentEdge = connectedEdges.find((e) => e.target === nodeId);
			if (!parentEdge) {
				console.warn("Node has multiple edges but no parent edge?", nodeId);
				return;
			}

			parentId = parentEdge.source;

			// Reparent child edges (where node is the source)
			for (const e of connectedEdges) {
				if (e.source === nodeId) {
					e.source = parentId;
				}
			}

			// Remove the parent edge itself
			this.edges = this.edges.filter((e) => e !== parentEdge);

			// Remove the node
			this.nodes = this.nodes.filter((n) => n.id !== nodeId);
			selected.destroy();
		}

		// Select the parent node if one was found
		if (parentId !== null) {
			const parentNode = this.nodes.find((n) => n.id === parentId);
			if (parentNode) {
				this.nodes.forEach((n) => n.setSelected(n === parentNode));
			}
		}

		this.saveToStorage(true);
		this.rebuildChains();
		this.draw();
	}

	private onSplitEdge() {
		const selected = this.nodes.find((n) => n.selected);
		if (!selected) return;

		// Find the parent edge (where selected is the target)
		const parentEdge = this.edges.find((e) => e.target === selected.id);
		if (!parentEdge) return; // No parent, can't insert

		const parentId = parentEdge.source;
		const newId = Math.max(...this.nodes.map((n) => n.id)) + 1;

		// Calculate position between parent and selected node
		const parentNode = this.nodes.find((n) => n.id === parentId);
		if (!parentNode) return;

		const midX = (parentNode.worldX + selected.worldX) / 2;
		const midY = (parentNode.worldY + selected.worldY) / 2;

		// Create new non-primary node at midpoint
		this.addNode(newId, midX, midY, false);

		// Update parent edge: parent -> newNode
		parentEdge.target = newId;

		// Add edge: newNode -> selected
		this.edges.push({ source: newId, target: selected.id });

		// Select the new node
		for (const node of this.nodes) {
			node.setSelected(node.id === newId);
		}

		// Rebuild chains after all edges are set up
		this.rebuildChains();
		this.draw();
		this.saveToStorage(true);
	}

	private onUndo() {
		const previousState = this.history.pop();
		if (previousState) {
			this.loadState(previousState);
		}
	}
}
