import { BaseScene } from "../scenes/BaseScene";
import { RoundRectangle } from "./RoundRectangle";

export class InfoItemPreview extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public size: number;

	private bg: RoundRectangle;
	private image: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, x: number, y: number, size: number, radius: number, color: number) {
		super(scene, x, y);
		this.scene = scene;
		this.size = size;

		this.bg = new RoundRectangle(scene, 0, 0, size, size, radius, color);
		this.add(this.bg);

		this.image = scene.add.image(0, 0, "");
		this.add(this.image);

		this.text = scene.createText(0.45*size, 0.45*size, 0.3*size, scene.weights.bold, "#FF4400", "0");
		this.text.setOrigin(1);
		this.text.setAlpha(0.75);
		this.text.setStroke("#000", 6);
		this.add(this.text);
	}

	setImage(itemData: any) {
		this.setVisible(true);

		this.image.setTexture(itemData.key);
		this.image.setScale((itemData.scale || 1.0) * this.size / this.image.width);
		let h = Math.max(this.image.width, this.image.height);
		let origY = 1 - this.image.width / h / 2;
		this.image.setOrigin(0.5, origY);
	}

	setTier(tier: number) {
		this.text.setText(tier.toString());
	}

	setExplored(discovered: boolean) {
		this.image.setTint(discovered ? 0xFFFFFF : 0);
		this.image.setAlpha(discovered ? 1.0 : 0.5);
	}
}