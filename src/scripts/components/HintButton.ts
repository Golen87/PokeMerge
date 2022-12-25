import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";

export class HintButton extends Button {
	public scene: BaseScene;
	public activated: boolean;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		let bg = new RoundRectangle(scene, 0, 0, 100, 100, 25, 0XEECC99);
		this.add(bg);
		this.makeInteractive(bg);

		let text = scene.createText(0, -14, 25, scene.weights.bold, "#000", "Hints:");
		text.setOrigin(0.5);
		this.add(text);

		let text2 = scene.createText(0, 14, 25, scene.weights.bold, "#000", "ON");
		text2.setOrigin(0.5);
		this.add(text2);

		this.activated = true;
		this.makeInteractive(bg);
		this.on("click", () => {
			this.activated = !this.activated;
			text2.setText(this.activated ? "ON" : "OFF");
		}, this);
	}

	update(time, delta) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}
}