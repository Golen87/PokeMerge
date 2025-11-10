import { GameScene } from "../scenes/GameScene";

export class MapPaths extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private graphics: Phaser.GameObjects.Graphics;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;

		this.graphics = scene.add.graphics();
		this.add(this.graphics);
	}

	drawTaskPaths(cameraX: number, cameraY: number, tileSize: number) {
		const left = cameraX - this.scene.CX / tileSize;
		const top = cameraY - this.scene.CY / tileSize;
        const color = 0xffffff;

		this.graphics.clear();
		this.graphics.fillStyle(color, 1.0);
		this.graphics.lineStyle(8, color, 1.0);

		const points = [
			{ x: 74, y: 275 },
			{ x: 84, y: 281 },
			{ x: 83, y: 275 },
			{ x: 80.5, y: 267.5 },
		];
		points.forEach(({ x, y }) => {
			x = (x + 0.5) * tileSize - left * tileSize;
			y = (y + 0.5) * tileSize - top * tileSize;

			this.graphics.fillCircle(x, y, tileSize / 2);
		});

		const curve = new Phaser.Curves.Spline(
			points.map(({ x, y }) => [
				(x + 0.5) * tileSize - left * tileSize,
				(y + 0.5) * tileSize - top * tileSize,
			])
		);
		curve.draw(this.graphics);
	}
}
