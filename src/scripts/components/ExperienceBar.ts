import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { colorToString } from "../utils";
import { COLOR } from "../constants";

export class ExperienceBar extends Button {
	public scene: GameScene;

	private bg: RoundRectangle;
	private fg: RoundRectangle;
	private levelText: Phaser.GameObjects.Text;
	private xpText: Phaser.GameObjects.Text;
	private barRatio: number;

	constructor(scene: GameScene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);
		this.scene = scene;

		this.bg = new RoundRectangle(scene, 0, 0, width, height, height/2, COLOR.BUTTON);
		this.add(this.bg);
		this.makeInteractive(this.bg);

		this.fg = new RoundRectangle(scene, 0, 0, width, height, height/2, COLOR.SUCCESS);
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


	resize(width: number, height: number, unit: number) {
		this.bg.setRadius(height/2);
		this.bg.setWidth(width);
		this.bg.setHeight(height);

		let barWidth = this.bg.width * this.barRatio;
		this.fg.setRadius(height/2);
		this.fg.setWidth(barWidth);
		this.fg.setHeight(height);
		this.fg.x = -this.bg.width/2 + barWidth/2;

		this.levelText.x = -0.48*width;
		this.levelText.setFontSize(2.5*unit);
		this.xpText.setFontSize(2.5*unit);
		this.xpText.setStroke("#FFF", unit/2);
	}

	get enabled() {
		return this.bg.input!.enabled;
	}

	set enabled(value: boolean) {
		this.bg.input!.enabled = value;
	}

	set color(value: number) {
		this.bg.setColor(value);
	}

	set textColor(value: number) {
		this.xpText.setColor(colorToString(value));
	}

	setText(level: number, experience: number, requirement: number) {
		this.barRatio = experience / requirement;

		let width = this.bg.width * this.barRatio;
		this.fg.x = -this.bg.width/2 + width/2;
		this.fg.setWidth(width);
		this.fg.setVisible(width > 0);

		this.levelText.setText(`Level: ${level}`);
		this.xpText.setText(`${experience}/${requirement}`);
	}
}