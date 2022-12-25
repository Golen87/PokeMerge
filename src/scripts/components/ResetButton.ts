import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";

export class ResetButton extends Button {
	public scene: BaseScene;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		let bg = new RoundRectangle(scene, 0, 0, 100, 100, 25, 0XEECC99);
		this.add(bg);
		this.makeInteractive(bg);

		let text = scene.createText(0, 0, 25, scene.weights.bold, "#000", "Reset");
		text.setOrigin(0.5);
		this.add(text);

		this.makeInteractive(bg);
	}

	update(time, delta) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}
}