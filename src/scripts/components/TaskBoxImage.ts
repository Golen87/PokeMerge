import { GameScene } from "../scenes/GameScene";
import { RoundRectangle } from "./RoundRectangle";
import { Button } from "./Button";

export class TaskBoxImage extends Button {
	public scene: GameScene;

	public size: number;
	private background: RoundRectangle;
	private image: Phaser.GameObjects.Image;
	private countText: Phaser.GameObjects.Text;
	private tierText: Phaser.GameObjects.Text;
	private itemData: any;
	private maxCount: number;

	constructor(scene: GameScene, x: number, y: number, size: number) {
		super(scene, x, y);
		this.scene = scene;
		this.size = size;

		this.background = new RoundRectangle(scene, 0, 0, size, size, 25, 0xAAAAAA);
		this.background.setAlpha(0.5);
		this.add(this.background);

		this.image = scene.add.image(0, 0, "selection");
		this.image.setScale(size / this.image.width);
		this.add(this.image);

		this.tierText = scene.createText(-size/2, -size/2, 0.2*size, scene.weights.bold, "#000", "lvl");
		this.tierText.setOrigin(0);
		this.add(this.tierText);

		this.countText = scene.createText(size/2, size/2, 0.25*size, scene.weights.bold, "#000", "0/1");
		this.countText.setOrigin(1);
		this.add(this.countText);
	}


	resize(size: number, unit: number) {
		this.size = size;

		this.background.setRadius(size/3);
		this.background.setWidth(size);
		this.background.setHeight(size);

		this.tierText.x = -size/2;
		this.tierText.y = -size/2;
		this.tierText.setFontSize(size/5);
		this.tierText.setStroke("#FFF", size/5/4);

		this.countText.x = size/2;
		this.countText.y = size/2;
		this.countText.setFontSize(size/4);
		this.countText.setStroke("#FFF", size/4/4);

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
		this.background.setColor(success ? 0x4CAF50 : 0xC9AC7F);
	}
}