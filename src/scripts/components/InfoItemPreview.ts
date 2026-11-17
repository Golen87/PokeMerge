import { GameScene } from "../scenes/GameScene";
import type ItemData from "../items/ItemData";
import { COLOR } from "../constants";
import { colorToString } from "../utils";

export class InfoItemPreview extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public size: number;

	private bg: Phaser.GameObjects.Image;
	private image: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;
	private itemData?: ItemData;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		size: number,
		radius: number,
		color: number,
		showTier = false,
	) {
		super(scene, x, y);
		this.scene = scene;
		this.size = size;

		this.bg = scene.add.image(0, 0, "cell");
		this.bg.setTint(color);
		this.bg.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => this.emit("click"), this);
		this.add(this.bg);

		this.image = scene.add.image(0, 0, "");
		this.add(this.image);

		this.text = scene.createText(
			0,
			0,
			1,
			scene.weights.bold,
			colorToString(COLOR.BORDER),
			"0",
		);
		this.text.setOrigin(0.5, 0);
		this.text.setAlpha(0.6);
		this.text.setVisible(showTier);
		this.add(this.text);
	}

	resize(size: number, unit: number) {
		this.size = size;

		this.bg.setScale(size / this.bg.width);

		this.text.x = 0;
		this.text.y = 0.52 * size;
		this.text.setFontSize(0.2 * size);

		this.updateImage();
	}

	setImage(itemData: ItemData) {
		this.itemData = itemData;
		this.setVisible(true);

		this.updateImage();
	}

	updateImage() {
		if (this.itemData) {
			this.image.setTexture(this.itemData.key);
			this.image.setScale(
				((this.itemData.scale || 1.0) * this.size) / this.image.width
			);
			let h = Math.max(this.image.width, this.image.height);
			let origY = 1 - this.image.width / h / 2;
			this.image.setOrigin(0.5, origY);
		}
	}

	setTier(tier: number) {
		this.text.setText(tier.toString());
	}

	setExplored(discovered: boolean) {
		this.image.setTint(discovered ? 0xffffff : 0);
		this.image.setAlpha(discovered ? 1.0 : 0.5);
	}
}
