import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { colorToString } from "../utils";

export class WideButton extends Button {
	public scene: BaseScene;

	private bg: RoundRectangle;
	private text: Phaser.GameObjects.Text;
	private color: number;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number, text: string, color: number) {
		super(scene, x, y);
		this.scene = scene;
		this.width = width;
		this.height = height;
		this.color = color;

		this.bg = new RoundRectangle(scene, 0, 0, width, height, height/2, color);
		this.add(this.bg);
		this.makeInteractive(this.bg);

		this.text = scene.createText(0, 0, 0.5*height, scene.weights.bold, "#000", text);
		this.text.setOrigin(0.5);
		this.add(this.text);
	}

	update(time, delta) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
		this.setAlpha(this.enabled ? 1.0 : 0.25);
		this.bg.setColor(this.enabled ? this.color : 0xC9AC7F);
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.bg.setRadius(height/2);
		this.bg.setWidth(width);
		this.bg.setHeight(height);
		const pad = height/4;
		this.bg.input.hitArea.setTo(-pad, -pad, width+2*pad, height+2*pad);
		this.text.setFontSize(0.5*height);
	}

	setText(text: string) {
		this.text.setText(text);
	}

	get enabled() {
		return this.bg.input.enabled;
	}

	set enabled(value: boolean) {
		this.bg.input.enabled = value;
	}

	// set color(value: number) {
		// this.bg.setColor(value);
	// }

	// set textColor(value: number) {
		// this.text.setColor(colorToString(value));
	// }
}