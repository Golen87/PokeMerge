import { BaseScene } from "../scenes/BaseScene";
import { Slider } from "./Slider";
import { COLOR } from "../constants";

export class ToggleSlider extends Slider {
	public scene: BaseScene;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number, thinHeight: number) {
		super(scene, x, y, width, height, thinHeight, 2);

		// Step notches
		this.notches.forEach(notch => {
			notch.setVisible(false);
		});

		this.on("onChange", (value: boolean) => {
			this.background.setColor(value ? COLOR.SUCCESS : COLOR.BORDER);
		});
	}

	onDown() {
		this.targetX = (this.value ? this.minX : this.maxX);
		this._value = 1 - this.value;

		if (this._value != this._prev) {
			this.emit('onChange', this._value);
			this._prev = this._value;
		}
	}

	onDrag() {}

	/*
	onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		let x = localX - this.background.width/2;
		this.background.input.dragStartX = x;
		this.onDrag(pointer, x, 0);
	}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		// Clamp x-coord
		dragX = Phaser.Math.Clamp(dragX, this.minX, this.maxX);

		// If slider is segmented, find value, round it to step, and convert back to position
		if (this.steps > 0) {
			let value = (dragX - this.minX) / (this.maxX - this.minX);
			value = Math.round(value * (this.steps-1)) / (this.steps-1);
			dragX = this.minX + value * (this.maxX - this.minX);
		}

		this.targetX = dragX;

		// Update value based on button's x-coord
		let baseValue = (dragX - this.minX) / (this.maxX - this.minX);
		let scaledValue = this.minV + baseValue * (this.maxV - this.minV);
		this._value = scaledValue;

		if (this._value != this._prev) {
			this.emit('onChange', this._value);
			this._prev = this._value;
		}
	}
	*/
}