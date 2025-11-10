import { GameScene } from "../scenes/GameScene";
import tilemap from "../tilemap";
import { MapPaths } from "./MapPaths";

// https://github.com/huderlem/porymap
// https://github.com/pret/pokefirered/blob/master/data/maps/ViridianForest/map.json

export class Map extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private overlay: Phaser.GameObjects.Rectangle;

	private gridContainer: Phaser.GameObjects.Container;
	private tileInstances: Phaser.GameObjects.Image[];
	private grid: Phaser.GameObjects.Image[][];

	private tileSize: number;
	private tileColumns: number;
	private tileRows: number;
	private minTileSize: number;
	private maxTileSize: number;
	private targetTileSize: number;
	private smoothTileSize: number;

	// Camera position in grid coordinates (e.g. x=11.3 means centered on tile 11)
	private cameraTargetX: number;
	private cameraTargetY: number;
	private cameraSmoothX: number;
	private cameraSmoothY: number;

	private dragStartX: number;
	private dragStartY: number;

	// Multi-touch / pinch state (we only track up to 2 pointers)
	private activePointers: { [id: number]: Phaser.Input.Pointer } = {};
	private pinchStartDistance: number = 0;
	private pinchStartTileSize: number = 0;
	private pinchStartCameraX: number = 0;
	private pinchStartCameraY: number = 0;
	private pinchStartCenterX: number = 0;
	private pinchStartCenterY: number = 0;

	private paths: MapPaths;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

		this.overlay = scene.add.rectangle(0, 0, scene.W, scene.H, 0xff0000);
		this.overlay.setOrigin(0);
		this.overlay.setInteractive();
		this.add(this.overlay);

		this.tileSize = 50;
		this.targetTileSize = this.tileSize;
		this.smoothTileSize = this.tileSize;
		this.tileColumns = Math.floor(scene.W / this.tileSize) + 1;
		this.tileRows = Math.floor(scene.H / this.tileSize) + 1;

		this.gridContainer = scene.add.container();
		this.add(this.gridContainer);
		this.tileInstances = [];
		this.grid = [];
		this.populateGrid();

		this.cameraTargetX = 0;
		this.cameraTargetY = 0;
		this.cameraSmoothX = 0;
		this.cameraSmoothY = 0;

		this.paths = new MapPaths(scene);
		this.add(this.paths);

		this.panCameraTo(74 + 6, 275 + 2, true);

		this.scene.input.on("pointerdown", this.onPointerDown, this);
		this.scene.input.on("pointermove", this.onPointerMove, this);
		this.scene.input.on("wheel", this.onWheel, this);

		// Enable multi-touch pointers and listen for pointerup to track active touches
		this.scene.input.on("pointerup", this.onPointerUp, this);
	}

	private newTile() {
		const tile = this.scene.add.image(0, 0, "tileset", 0);
		tile.setOrigin(0);
		this.gridContainer.add(tile);
		this.tileInstances.push(tile);

		return tile;
	}

	populateGrid() {
		const tilesNeeded = this.tileRows * this.tileColumns;
		while (this.tileInstances.length < tilesNeeded) {
			this.newTile();
		}
		this.tileInstances.forEach((tile) => tile.setVisible(false));

		this.grid = [];
		for (let iy = 0; iy < this.tileRows; iy++) {
			this.grid[iy] = [];
			for (let ix = 0; ix < this.tileColumns; ix++) {
				const tile = this.tileInstances[iy + ix * this.tileRows];
				tile.setVisible(true);
				tile.setScale(this.tileSize / 64);
				this.grid[iy][ix] = tile;
			}
		}
	}

	onScreenResize(screenWidth: number, screenHeight: number) {
		const width = Math.max(screenWidth, 0.5 * screenHeight);
		const height = Math.max(screenHeight, 0.5 * screenWidth);
		const tileCount = 25 * 25;
		const baseTileSize = Math.sqrt((width * height) / tileCount);

		this.minTileSize = baseTileSize * 0.75; // Allow zooming out 75%
		this.maxTileSize = baseTileSize * 3.0; // Allow zooming in 300%
		this.targetTileSize = Math.min(
			Math.max(baseTileSize, this.minTileSize),
			this.maxTileSize
		);
		this.smoothTileSize = this.targetTileSize;
		this.tileSize = this.targetTileSize;

		this.tileColumns = Math.ceil(screenWidth / this.tileSize) + 1;
		this.tileRows = Math.ceil(screenHeight / this.tileSize) + 1;

		this.populateGrid();
		this.drawMap();
	}

	update(time, delta) {
		let needsRedraw = false;

		const distance = Phaser.Math.Distance.Between(
			this.cameraSmoothX,
			this.cameraSmoothY,
			this.cameraTargetX,
			this.cameraTargetY
		);
		if (distance > 0.1) {
			this.cameraSmoothX += (this.cameraTargetX - this.cameraSmoothX) * 0.2;
			this.cameraSmoothY += (this.cameraTargetY - this.cameraSmoothY) * 0.2;
			needsRedraw = true;
		}

		const sizeDiff = Math.abs(this.smoothTileSize - this.targetTileSize);
		if (sizeDiff > 0.1) {
			this.smoothTileSize += (this.targetTileSize - this.smoothTileSize) * 0.2;
			this.tileSize = this.smoothTileSize;
			this.tileColumns = Math.ceil(this.scene.W / this.tileSize) + 1;
			this.tileRows = Math.ceil(this.scene.H / this.tileSize) + 1;
			this.populateGrid();
			needsRedraw = true;
		}

		if (needsRedraw) {
			this.drawMap();
		}
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		// Track active pointers

		this.activePointers[pointer.id] = pointer;
		const pointers = Object.values(this.activePointers);

		if (pointers.length === 1) {
			// Single-finger start: prepare for panning
			this.dragStartX = this.cameraTargetX + pointer.x / this.tileSize;
			this.dragStartY = this.cameraTargetY + pointer.y / this.tileSize;
		} else if (pointers.length === 2) {
			// Two-finger start: prepare for pinch-zoom + pan
			const [p1, p2] = pointers;
			this.pinchStartDistance = Phaser.Math.Distance.Between(
				p1.x,
				p1.y,
				p2.x,
				p2.y
			);
			this.pinchStartTileSize = this.targetTileSize;
			this.pinchStartCameraX = this.cameraTargetX;
			this.pinchStartCameraY = this.cameraTargetY;
			this.pinchStartCenterX = (p1.x + p2.x) / 2;
			this.pinchStartCenterY = (p1.y + p2.y) / 2;
		}
	}

	onPointerMove(pointer: Phaser.Input.Pointer) {
		if (this.alpha != 1) return;

		// Update tracked pointer position
		if (this.activePointers[pointer.id])
			this.activePointers[pointer.id] = pointer;

		const pointers = Object.values(this.activePointers);
		if (pointers.length === 1) {
			const p = pointers[0];
			if (p.isDown) {
				this.cameraTargetX = this.dragStartX - p.x / this.tileSize;
				this.cameraTargetY = this.dragStartY - p.y / this.tileSize;
			}
		} else if (pointers.length === 2) {
			const [p1, p2] = pointers;
			if (!this.pinchStartDistance) return; // safety

			const currentDistance = Phaser.Math.Distance.Between(
				p1.x,
				p1.y,
				p2.x,
				p2.y
			);
			const scaleFactor = currentDistance / this.pinchStartDistance;

			const centerX = (p1.x + p2.x) / 2;
			const centerY = (p1.y + p2.y) / 2;

			// Calculate the movement of the pinch center
			const centerDeltaX = centerX - this.pinchStartCenterX;
			const centerDeltaY = centerY - this.pinchStartCenterY;

			// Use the pinch-start camera/tileSize as the base so simultaneous pan+zoom works
			const newTileSize = Math.min(
				Math.max(this.pinchStartTileSize * scaleFactor, this.minTileSize),
				this.maxTileSize
			);

			// Compute grid position under the gesture center at the start, accounting for pan
			const gridX =
				this.pinchStartCameraX +
				(centerX - centerDeltaX - this.scene.CX) / this.pinchStartTileSize;
			const gridY =
				this.pinchStartCameraY +
				(centerY - centerDeltaY - this.scene.CY) / this.pinchStartTileSize;

			// Compute new camera so the same grid point remains under the center
			const newCenterOffsetX = (centerX - this.scene.CX) / newTileSize;
			const newCenterOffsetY = (centerY - this.scene.CY) / newTileSize;

			this.targetTileSize = newTileSize;
			this.cameraTargetX = gridX - newCenterOffsetX;
			this.cameraTargetY = gridY - newCenterOffsetY;
		}
	}

	onPointerUp(pointer: Phaser.Input.Pointer) {
		// Remove from active pointers
		delete this.activePointers[pointer.id];

		const pointers = Object.values(this.activePointers);
		if (pointers.length === 1) {
			// If one pointer remains, reset drag start so panning continues smoothly
			const p = pointers[0];
			this.dragStartX = this.cameraTargetX + p.x / this.tileSize;
			this.dragStartY = this.cameraTargetY + p.y / this.tileSize;
		} else if (pointers.length === 0) {
			// clear pinch start
			this.pinchStartDistance = 0;
		}
	}

	panCameraTo(tileX: number, tileY: number, instantly = false) {
		if (this.alpha != 1) return;

		this.cameraTargetX = tileX;
		this.cameraTargetY = tileY;
		if (instantly) {
			this.cameraSmoothX = this.cameraTargetX;
			this.cameraSmoothY = this.cameraTargetY;
		}
		this.drawMap();
	}

	private zoomCamera(scaleFactor: number, centerX: number, centerY: number) {
		// Convert center point to grid coordinates before zoom
		const gridX =
			this.cameraSmoothX + (centerX - this.scene.CX) / this.tileSize;
		const gridY =
			this.cameraSmoothY + (centerY - this.scene.CY) / this.tileSize;

		// Calculate new tile size
		const newTileSize = Math.min(
			Math.max(this.targetTileSize * scaleFactor, this.minTileSize),
			this.maxTileSize
		);

		// If the new size would be out of bounds, don't zoom
		if (newTileSize === this.targetTileSize) return;

		this.targetTileSize = newTileSize;

		// Adjust camera position to maintain the center point
		const newCenterOffsetX = (centerX - this.scene.CX) / this.targetTileSize;
		const newCenterOffsetY = (centerY - this.scene.CY) / this.targetTileSize;

		this.cameraTargetX = gridX - newCenterOffsetX;
		this.cameraTargetY = gridY - newCenterOffsetY;
	}

	private onWheel = (
		pointer: Phaser.Input.Pointer,
		gameObjects: any,
		deltaX: number,
		deltaY: number
	) => {
		if (this.alpha != 1) return;

		const scaleFactor = 1 - deltaY * 0.001;
		this.zoomCamera(scaleFactor, pointer.x, pointer.y);
	};

	// (Pinch handlers removed — we rely on pointerdown/pointermove/pointerup multi-touch)

	drawMap() {
		const left = this.cameraSmoothX - this.scene.CX / this.tileSize;
		const top = this.cameraSmoothY - this.scene.CY / this.tileSize;

		for (let iy = 0; iy < this.tileRows; iy++) {
			for (let ix = 0; ix < this.tileColumns; ix++) {
				const x =
					(ix - 1) * this.tileSize +
					((((-left * this.tileSize) % this.tileSize) + this.tileSize) %
						this.tileSize);
				const y =
					(iy - 1) * this.tileSize +
					((((-top * this.tileSize) % this.tileSize) + this.tileSize) %
						this.tileSize);
				let jx = ix - 1 + Math.ceil(left);
				let jy = iy - 1 + Math.ceil(top);

				// If the tile is off the screen, loop the last two tiles
				if (jx < 0) jx = ((jx - 1) % 2) + 1;
				if (jy < 0) jy = ((jy - 1) % 2) + 1;
				if (jx >= tilemap[0].length) jx = tilemap[0].length - 1;
				if (jy >= tilemap.length) jy = tilemap.length - 1;

				const frame = tilemap[jy][jx];

				if (this.grid[iy] && this.grid[iy][ix]) {
					this.grid[iy][ix].x = x;
					this.grid[iy][ix].y = y;
					this.grid[iy][ix].setFrame(frame);
					this.grid[iy][ix].setVisible(true);
				}
			}
		}

		this.paths.drawTaskPaths(
			this.cameraSmoothX,
			this.cameraSmoothY,
			this.tileSize
		);
	}
}
