import { BaseScene } from "../scenes/BaseScene";
import { RoundRectangle } from "./RoundRectangle";
import { Button } from "./Button";

export class TaskBoxImage extends Button {
	public scene: BaseScene;

	private size: number;
	private bg: RoundRectangle;
	private image: Phaser.GameObjects.Image;
	private countText: Phaser.GameObjects.Text;
	private tierText: Phaser.GameObjects.Text;
	private maxCount: number;

	constructor(scene: BaseScene, x: number, y: number, size: number) {
		super(scene, x, y);
		this.scene = scene;
		this.size = size;

		this.bg = new RoundRectangle(scene, 0, 0, size, size, 25, 0x777777);
		this.add(this.bg);
		this.makeInteractive(this.bg);

		this.image = scene.add.image(0, 0, "selection");
		this.image.setScale(size / this.image.width);
		this.add(this.image);

		this.tierText = scene.createText(-size/2, -size/2, 0.2*size, scene.weights.bold, "#000", "lvl");
		this.tierText.setOrigin(0);
		this.tierText.setStroke("#FFF", 5);
		this.add(this.tierText);

		this.countText = scene.createText(size/2, size/2, 0.25*size, scene.weights.bold, "#000", "0/1");
		this.countText.setOrigin(1);
		this.countText.setStroke("#FFF", 6);
		this.add(this.countText);
	}


	setItem(itemData: any, tier: number, max: number) {
		this.image.setTexture(itemData.key);
		this.image.setScale((itemData.scale || 1.0) * this.size / this.image.width);

		this.tierText.setText(`lvl. ${tier}`);

		this.maxCount = max;
		this.setCount(0);
	}

	setCount(amount: number) {
		let success = (amount >= this.maxCount);
		amount = Math.min(amount, this.maxCount);

		this.countText.setText(`${amount}/${this.maxCount}`);
		this.bg.setColor(success ? 0x4CAF50 : 0xC9AC7F);
	}
}