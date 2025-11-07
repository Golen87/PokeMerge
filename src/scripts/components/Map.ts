import { GameScene } from "../scenes/GameScene";
import tilemap from "../tilemap";

// https://github.com/huderlem/porymap
// https://github.com/pret/pokefirered/blob/master/data/maps/ViridianForest/map.json

export class Map extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private overlay: Phaser.GameObjects.Rectangle;

	private gridContainer: Phaser.GameObjects.Container;
	private tileInstances: Phaser.GameObjects.Image[];
	private grid: Phaser.GameObjects.Image[][];
	private graphics: Phaser.GameObjects.Graphics;

	private tileSize: number;
	private tileColumns: number;
	private tileRows: number;

	// Camera position in grid coordinates (e.g. x=11.3 means centered on tile 11)
	private cameraTargetX: number;
	private cameraTargetY: number;
	private cameraSmoothX: number;
	private cameraSmoothY: number;

	private dragStartX: number;
	private dragStartY: number;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

		this.overlay = scene.add.rectangle(0, 0, 1920, 1080, 0xff0000);
		this.overlay.setOrigin(0);
		this.overlay.setInteractive();
		this.add(this.overlay);

		this.tileSize = 50;
		this.tileColumns = Math.floor(1920 / this.tileSize) + 1;
		this.tileRows = Math.floor(1080 / this.tileSize) + 1;

		this.gridContainer = scene.add.container();
		this.add(this.gridContainer);
		this.tileInstances = [];
		this.grid = [];
		this.populateGrid();

		this.graphics = scene.add.graphics();
		this.add(this.graphics);

		this.cameraTargetX = 0;
		this.cameraTargetY = 0;
		this.cameraSmoothX = 0;
		this.cameraSmoothY = 0;

		this.panCameraTo(74 + 6, 275 + 2, true);

		this.scene.input.on("pointerdown", this.onPointerDown, this);
		this.scene.input.on("pointermove", this.onPointerMove, this);
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

	onScreenResize(screenWidth: number, screenHeight: number, unit: number) {
		this.tileSize = Math.max(screenWidth / 30, screenHeight / 30);
		this.tileColumns = Math.ceil(screenWidth / this.tileSize) + 1;
		this.tileRows = Math.ceil(screenHeight / this.tileSize) + 1;

		this.overlay.setSize(screenWidth, screenHeight);

		this.populateGrid();
		this.drawMap();
	}

	update(time, delta) {
		const distance = Phaser.Math.Distance.Between(
			this.cameraSmoothX,
			this.cameraSmoothY,
			this.cameraTargetX,
			this.cameraTargetY
		);
		if (distance > 0.1) {
			this.cameraSmoothX += (this.cameraTargetX - this.cameraSmoothX) * 0.2;
			this.cameraSmoothY += (this.cameraTargetY - this.cameraSmoothY) * 0.2;
			this.drawMap();
		}
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		this.dragStartX = this.cameraTargetX + pointer.x / this.tileSize;
		this.dragStartY = this.cameraTargetY + pointer.y / this.tileSize;
	}

	onPointerMove(pointer: Phaser.Input.Pointer) {
		if (this.alpha != 1) return;

		if (pointer.isDown) {
			this.cameraTargetX = this.dragStartX - pointer.x / this.tileSize;
			this.cameraTargetY = this.dragStartY - pointer.y / this.tileSize;
			this.drawMap();
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

		this.drawTaskPaths();
	}

	drawTaskPaths() {
		const left = this.cameraSmoothX - this.scene.CX / this.tileSize;
		const top = this.cameraSmoothY - this.scene.CY / this.tileSize;

		this.graphics.clear();
		this.graphics.fillStyle(0xff0000, 1.0);
		this.graphics.lineStyle(8, 0xff0000, 1.0);

		const points = [
			{ x: 74, y: 275 },
			{ x: 84, y: 281 },
			{ x: 83, y: 275 },
			{ x: 80.5, y: 267.5 },
		];
		points.forEach(({ x, y }) => {
			x = (x + 0.5) * this.tileSize - left * this.tileSize;
			y = (y + 0.5) * this.tileSize - top * this.tileSize;

			this.graphics.fillCircle(x, y, this.tileSize / 2);
		});

		const curve = new Phaser.Curves.Spline(
			points.map(({ x, y }) => [
				(x + 0.5) * this.tileSize - left * this.tileSize,
				(y + 0.5) * this.tileSize - top * this.tileSize,
			])
		);
		curve.draw(this.graphics);
	}
}
