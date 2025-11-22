import { GameScene } from "../scenes/GameScene";
import pathData from "../assets/paths.json"

const DEBUG = false;

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
	private startWorldX: number;
	private startWorldY: number;

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

		if (DEBUG) {
			this.setInteractive({ useHandCursor: true, draggable: true });
		}

		// Track drag start position
		this.on("dragstart", (pointer: Phaser.Input.Pointer) => {
			this.isDragging = false;
			this.dragStartX = pointer.x;
			this.dragStartY = pointer.y;
			this.prevWorldX = this.worldX;
			this.prevWorldY = this.worldY;
			this.startWorldX = this.worldX;
			this.startWorldY = this.worldY;
		});

		// When dragged, update position and check if we've moved enough to consider it a drag
		this.on(
			"drag",
			(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
				const distance = Phaser.Math.Distance.Between(
					pointer.x,
					this.dragStartX,
					pointer.y,
					this.dragStartY
				);
				if (!this.isDragging && distance >= 8) {
					this.isDragging = true;
					this.emit("select");
				}

				if (!this.cameraTileSize) return;
				const tileSize = this.cameraTileSize;

				// Convert screen coords to world coords
				const rawX = dragX / tileSize + this.cameraLeft - 0.5;
				const rawY = dragY / tileSize + this.cameraTop - 0.5;

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
			if (this.worldX != this.startWorldX || this.worldY != this.startWorldY) {
				this.emit("save");
			} else if (!this.isDragging && this.selected) {
				this.emit("toggle");
			} else {
				this.emit("select");
			}
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
		const scale = this.primary ? 1.0 : 0.75;
		this.setDisplaySize(size * scale, size * scale);
		this.setAlpha(this.primary ? 1.0 : (DEBUG ? 0.5 : 0.0));
	}
}

// use EdgeData for edge shape

export class MapPaths extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private static readonly STORAGE_KEY = "poke-merge-paths";
	private static readonly DEFAULT_NODES: NodeData[] = [
		{ id: 1, x: 74, y: 275, primary: true },
		{ id: 2, x: 84, y: 281, primary: true },
	];
	private static readonly DEFAULT_EDGES: EdgeData[] = [
		{ source: 1, target: 2 },
	];

	// nodes are PathNode game objects
	private nodes: PathNode[] = [];
	private edges: EdgeData[] = [];

	// Last camera/tile info used to map between screen and world coords during drag
	private cameraLeft = 0;
	private cameraTop = 0;
	private cameraTileSize = 16;

	// Curve graphics element for smooth spline rendering
	private graphics: Phaser.GameObjects.Graphics;
	private chains: number[][] = [];

	// Undo/Redo functionality
	private history: SaveState[] = [];
	private static readonly MAX_SAVE_STATES = 30;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;

		this.graphics = scene.add.graphics();
		this.add(this.graphics);

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
			scene.input.keyboard.on("keyup-DELETE", this.onRemoveNode, this);
			scene.input.keyboard.on("keyup-SPACE", (event: KeyboardEvent) => {
				if (event.ctrlKey) {
					this.onSplitEdge();
				} else {
					this.onToggleNodePrimary();
				}
			});
			scene.input.keyboard.on("keydown-ESC", this.clearSelection, this);

			// Undo
			scene.input.keyboard.on("keydown-Z", (event: KeyboardEvent) => {
				if (event.metaKey || event.ctrlKey) {
					this.onUndo();
				}
			});
		}
	}

	clearSelection() {
		this.nodes.forEach((node) => node.setSelected(false));
	}

	private addNode(id: number, x: number, y: number, primary: boolean) {
		const node = new PathNode(this.scene, id, x, y, primary);
		node.on("moved", this.drawEdges, this);
		node.on("save", this.saveToStorage, this);
		node.on("select", () => {
			this.clearSelection();
			node.setSelected(true);
		});
		node.on("toggle", this.onToggleNodePrimary, this);
		this.add(node);
		this.nodes.push(node);
	}

	private rebuildChains() {
		this.chains = [];
		const visited = new Set<number>();
		this.buildChainsFromNode(this.nodes[0].id, visited);
		console.log("rebuildChains", this.chains.length);

		this.drawEdges();
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

	updateCamera(cameraX: number, cameraY: number, tileSize: number) {
		this.cameraLeft = cameraX - this.scene.CX / tileSize;
		this.cameraTop = cameraY - this.scene.CY / tileSize;
		this.cameraTileSize = tileSize;

		this.draw();
	}

	draw() {
		// update each node's screen position from its world coords
		for (const node of this.nodes) {
			node.updateTransform(
				this.cameraLeft,
				this.cameraTop,
				this.cameraTileSize
			);
		}

		this.drawEdges();
	}

	private isInView(x: number, y: number): boolean {
		const padding = 20;
		return (
			x >= -padding &&
			x <= this.scene.W + padding &&
			y >= -padding &&
			y <= this.scene.H + padding
		);
	}

	private drawEdges() {
		/* Draw straight line edges for debugging */

		this.graphics.clear();
		this.chains.forEach((chain) => {
			const points: Phaser.Math.Vector2[] = [];

			for (const nodeId of chain) {
				const node = this.nodes.find((n) => n.id === nodeId);
				if (node) {
					points.push(new Phaser.Math.Vector2(node.x, node.y));
				}
			}

			// Create spline with at least 2 points
			if (points.length >= 2) {
				// Skip drawing if the curve's bounding box is outside camera bounds
				if (points.every((point) => !this.isInView(point.x, point.y))) {
					return;
				}

				const curve = new Phaser.Curves.Spline(points);

				this.graphics.lineStyle(8, 0xffffff, 1.0);

				curve.draw(this.graphics);

				/* Draw curve dots */

				// this.graphics.fillStyle(0xffffff, 1.0);
				// const dotGap = 0.8 * this.cameraTileSize;
				// const dotSize = 0.13 * this.cameraTileSize;

				// const dots = curve.getDistancePoints(dotGap);
				// dots.slice(1, dots.length - 1).forEach((point) => {
				// 	this.graphics.fillCircle(point.x, point.y, dotSize);
				// });
			}
		});

		// this.bringToTop(this.graphics);
	}

	private saveToStorage(addToHistory: boolean = true) {
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
		if (DEBUG) {
			localStorage.setItem(MapPaths.STORAGE_KEY, JSON.stringify(data));
		}
	}

	private loadFromStorage(): SaveState | null {
		if (DEBUG) {
			const data = localStorage.getItem(MapPaths.STORAGE_KEY);
			if (!data) return null;
			try {
				return JSON.parse(data) as SaveState;
			} catch (e) {
				console.warn("Failed to parse saved path data:", e);
				return null;
			}
		}
		else {
			return pathData as SaveState;
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
		this.saveToStorage(false);
	}

	/* User actions */

	private onToggleNodePrimary() {
		const selected = this.nodes.find((node) => node.selected);
		if (!selected) return;

		selected.primary = !selected.primary;
		selected.setTileSize(this.cameraTileSize);

		this.saveToStorage();
		this.rebuildChains();
	}

	public onAddNode(
		pointer: Phaser.Input.Pointer,
		cameraX: number,
		cameraY: number,
		tileSize: number
	) {
		const selected = this.nodes.find((n) => n.selected);
		if (!selected) return;

		// Convert screen coordinates to world coordinates
		const rawX =
			pointer.x / tileSize + cameraX - this.scene.CX / tileSize - 0.5;
		const rawY =
			pointer.y / tileSize + cameraY - this.scene.CY / tileSize - 0.5;

		// Snap to nearest .5 or whole number
		const worldX = Math.round(rawX * 2) / 2;
		const worldY = Math.round(rawY * 2) / 2;

		const newId = Math.max(...this.nodes.map((n) => n.id)) + 1;
		this.addNode(newId, worldX, worldY, true);

		// Select the new node
		this.nodes.forEach((node) => node.setSelected(node.id === newId));

		// Connect with edge
		this.edges.push({ source: selected.id, target: newId });

		this.rebuildChains();
		this.saveToStorage();
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

		this.saveToStorage();
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

		const midX = Math.round(parentNode.worldX + selected.worldX) / 2;
		const midY = Math.round(parentNode.worldY + selected.worldY) / 2;

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
		this.saveToStorage();
	}

	private onUndo() {
		const previousState = this.history.pop();
		if (previousState) {
			this.loadState(previousState);
		}
	}
}
