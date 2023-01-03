import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { colorToString } from "../utils";
import { SUCCESS_COLOR } from "../constants";

export class ExperienceBar extends Button {
	public scene: BaseScene;

	private bg: RoundRectangle;
	private fg: RoundRectangle;
	private levelText: Phaser.GameObjects.Text;
	private xpText: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);
		this.scene = scene;

		this.bg = new RoundRectangle(scene, 0, 0, width, height, height/2, 0xC9AC7F);
		this.add(this.bg);
		this.makeInteractive(this.bg);

		this.fg = new RoundRectangle(scene, 0, 0, width, height, height/2, SUCCESS_COLOR);
		this.add(this.fg);
		this.makeInteractive(this.fg);

		this.levelText = scene.createText(0, 0, 0.85*height, scene.weights.bold, "#000", "Level: 1");
		this.levelText.setOrigin(0.0, 0.5);
		// this.levelText.setStroke("#FFF", 5);
		this.add(this.levelText);

		this.xpText = scene.createText(0, 0, 0.85*height, scene.weights.bold, "#000", "0/8");
		this.xpText.setOrigin(0.5);
		this.xpText.setStroke("#FFF", 5);
		this.add(this.xpText);

		this.makeInteractive(this.bg);
	}

	update(time, delta) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
		this.setAlpha(this.enabled ? 1.0 : 0.25);
	}


	resize(width: number, height: number) {
		let ratio = this.fg.width / this.bg.width;

		this.bg.setRadius(height/2);
		this.bg.setWidth(width);
		this.bg.setHeight(height);

		this.fg.setRadius(height/2);
		this.fg.setWidth(width * ratio);
		this.fg.setHeight(height);
		this.fg.x = -this.bg.width/2 + this.fg.width/2;

		this.levelText.x = -0.48*width;
		this.levelText.setFontSize(0.85*height);
		this.xpText.setFontSize(0.85*height);
	}

	get enabled() {
		return this.bg.input.enabled;
	}

	set enabled(value: boolean) {
		this.bg.input.enabled = value;
	}

	set color(value: number) {
		this.bg.setColor(value);
	}

	set textColor(value: number) {
		this.xpText.setColor(colorToString(value));
	}

	setText(level: number, experience: number, requirement: number) {
		let width = this.bg.width * (experience / requirement);
		this.fg.x = -this.bg.width/2 + width/2;
		this.fg.setWidth(width);
		this.fg.setVisible(width > 0);

		this.levelText.setText(`Level: ${level}`);
		this.xpText.setText(`${experience}/${requirement}`);
	}
}