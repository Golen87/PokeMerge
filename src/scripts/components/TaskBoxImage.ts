import { BaseScene } from "../scenes/BaseScene";
import { RoundRectangle } from "./RoundRectangle";
import { Button } from "./Button";

export class TaskBoxImage extends Button {
	public scene: BaseScene;

	public size: number;
	private bg: RoundRectangle;
	private image: Phaser.GameObjects.Image;
	private countText: Phaser.GameObjects.Text;
	private tierText: Phaser.GameObjects.Text;
	private itemData: any;
	private maxCount: number;

	constructor(scene: BaseScene, x: number, y: number, size: number) {
		super(scene, x, y);
		this.scene = scene;
		this.size = size;

		this.bg = new RoundRectangle(scene, 0, 0, size, size, 25, 0x777777);
		this.add(this.bg);
		// this.makeInteractive(this.bg);

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


	resize(size: number) {
		this.size = size;

		this.bg.setRadius(25);
		this.bg.setWidth(size);
		this.bg.setHeight(size);

		this.tierText.x = -size/2;
		this.tierText.y = -size/2;
		this.tierText.setFontSize(size/5);

		this.countText.x = size/2;
		this.countText.y = size/2;
		this.countText.setFontSize(size/4);

		this.updateImage();
	}

	setItem(itemData: any, tier: number, maxCount: number) {
		this.itemData = itemData;
		this.updateImage();

		this.tierText.setText(`lvl. ${tier}`);
		this.maxCount = maxCount;
		this.setCount(0);
	}

	updateImage() {
		if (this.itemData) {
			this.image.setTexture(this.itemData.key);
			this.image.setScale((this.itemData.scale || 1.0) * this.size / this.image.width);
		}
	}

	setCount(amount: number) {
		let success = (amount >= this.maxCount);
		amount = Math.min(amount, this.maxCount);

		this.countText.setText(`${amount}/${this.maxCount}`);
		this.bg.setColor(success ? 0x4CAF50 : 0xC9AC7F);
	}
}