import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { colorToString } from "../utils";

export class WideButton extends Button {
	public scene: BaseScene;

	private bg: RoundRectangle;
	private text: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number, text: string) {
		super(scene, x, y);
		this.scene = scene;

		this.bg = new RoundRectangle(scene, 0, 0, width, height, height/2, 0xC9AC7F);
		this.add(this.bg);
		this.makeInteractive(this.bg);

		this.text = scene.createText(0, 0, 0.5*height, scene.weights.bold, "#000", text);
		this.text.setOrigin(0.5);
		this.add(this.text);

		this.makeInteractive(this.bg);
	}

	update(time, delta) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
		this.setAlpha(this.enabled ? 1.0 : 0.5);
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
		this.text.setColor(colorToString(value));
	}
}