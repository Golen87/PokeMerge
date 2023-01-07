import { GameScene } from "../scenes/GameScene";
import tilemap from "../tilemap";

// https://github.com/huderlem/porymap
// https://github.com/pret/pokefirered/blob/master/data/maps/ViridianForest/map.json

export class Map extends Phaser.GameObjects.Container {
	public scene: GameScene;
	private grid: Phaser.GameObjects.Image[][];

	private tileSize: number;
	private tileWidth: number;
	private tileHeight: number;

	private cx: number;
	private cy: number;
	private keys: any;


	constructor(scene: GameScene) {
		super(scene, 10000, 0);
		this.scene = scene;
		this.scene.add.existing(this);

		this.tileSize = 64;
		this.tileWidth = 1920 / this.tileSize + 1;
		this.tileHeight = 1080 / this.tileSize + 1;

		this.grid = [];
		for (let iy = 0; iy < this.tileHeight; iy++) {
			this.grid[iy] = [];
			for (let ix = 0; ix < this.tileWidth; ix++) {
				let tile = scene.add.image(0, 0, "tileset", tilemap[iy][ix]);
				// tile.setScale(0.95);
				tile.setOrigin(0);
				this.add(tile);
				this.grid[iy][ix] = tile;
			}
		}

		this.cx = 0;
		this.cy = 0;

		// const size = 64;
		// for (let iy = 0; iy < tilemap.length; iy++) {
		// 	for (let ix = 0; ix < tilemap[iy].length; ix++) {
		// 		let x = -3700 + ix*size;
		// 		let y = -16500 + iy*size;
		// 		if (tilemap[iy][ix] > -1 && x > -size && y > -size && x < this.W && y < this.H) {
		// 			let temp = this.add.image(x, y, "tileset", tilemap[iy][ix]);
		// 			temp.setOrigin(0);
		// 			temp.setDepth(100000);
		// 		}
		// 	}
		// }
		// map.setOrigin(0.163, 0.669);
		// map.setScale(8, 8);
		this.keys = scene.input.keyboard.addKeys('W,S,A,D');
	}

	onScreenResize(screenWidth: number, screenHeight: number) {
		this.tileSize = 64;
		// this.tileWidth = screenWidth / this.tileSize + 1;
		// this.tileHeight = screenHeight / this.tileSize + 1;
	}

	update(time, delta) {
		if (this.keys.A.isDown) this.cx -= 50;
		if (this.keys.D.isDown) this.cx += 50;
		if (this.keys.W.isDown) this.cy -= 50;
		if (this.keys.S.isDown) this.cy += 50;
		// let cx = 0 + 300 * Math.cos(time/1000);
		// let cy = 0 + 300 * Math.sin(time/1000);

		for (let iy = 0; iy < this.tileHeight; iy++) {
			for (let ix = 0; ix < this.tileWidth; ix++) {

				let x = (ix-1)*this.tileSize + ((-this.cx % this.tileSize) + this.tileSize) % this.tileSize;
				let y = (iy-1)*this.tileSize + ((-this.cy % this.tileSize) + this.tileSize) % this.tileSize;
				let jx = (ix-1) + Math.ceil(this.cx / this.tileSize);
				let jy = (iy-1) + Math.ceil(this.cy / this.tileSize);

				if (jx >= 0 && jy >= 0 && jy < tilemap.length && jx < tilemap[jy].length) {
					let frame = tilemap[jy][jx];

					// x = (x + this.tileSize + (this.scene.W + this.tileSize)) % (this.scene.W + this.tileSize) - this.tileSize;
					// y = (y + this.tileSize + (this.scene.H + this.tileSize)) % (this.scene.H + this.tileSize) - this.tileSize;

					this.grid[iy][ix].x = x;
					this.grid[iy][ix].y = y;
					this.grid[iy][ix].setFrame(frame);
					this.grid[iy][ix].setVisible(true);
				}
				else {
					if (this.grid[iy][ix]) {
						this.grid[iy][ix].setVisible(false);
					}
				}
			}
		}
	}
}
