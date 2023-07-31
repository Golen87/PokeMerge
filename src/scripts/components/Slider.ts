import { BaseScene } from "../scenes/BaseScene";
import { RoundRectangle } from "./RoundRectangle";
import { COLOR } from "../constants";

export class Slider extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	protected _value: number;
	protected _prev: number;
	protected background: RoundRectangle;
	protected button: Phaser.GameObjects.Ellipse;
	protected notches: Phaser.GameObjects.Ellipse[];
	protected maxV: number;
	protected maxX: number;
	protected minV: number;
	protected minX: number;
	protected targetX: number;
	protected steps: number;
	protected thinHeight: number;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number, thinHeight: number, steps: number=0) {
		super(scene, x, y);
		this.scene = scene;
		this.width = width;
		this.height = height;
		this.thinHeight = thinHeight;
		this.steps = steps;


		// Slider background
		this.background = new RoundRectangle(this.scene, 0, 0, width + thinHeight, thinHeight, thinHeight/2, COLOR.SLIDER_BACKGROUND);
		this.add(this.background);

		const padding = thinHeight + height;
		this.background.setInteractive({ hitArea: this.background, useHandCursor: true, draggable: true })
			.on('pointerdown', this.onDown, this)
			.on('drag', this.onDrag, this);
		this.background.input!.hitArea.setTo(-padding, -padding, this.background.width+2*padding, this.background.height+2*padding);
		// this.scene.input.enableDebug(this.background);


		// Step notches
		this.notches = [];
		if (steps > 2) {
			for (let i = 0; i < steps; i++) {
				let x = -width/2 + i / (steps - 1) * width;
				let y = 0;
				let size = 0.75 * thinHeight;

				let notch = scene.add.ellipse(x, y, size, size, COLOR.SLIDER_NOTCH);
				notch.setAlpha(0.25);
				this.add(notch);
				this.notches.push(notch);
			}
		}


		// Slider button
		this.button = scene.add.ellipse(0, 0, height, height, COLOR.SLIDER_BUTTON);
		this.targetX = this.button.x;
		this.add(this.button);

		this.minX = -width/2;
		this.maxX = width/2;
		this.minV = 0;
		this.maxV = 1;
		this._value = 0.5;
		this._prev = 0.5;
	}

	resize(width: number, height: number, thinHeight: number) {
		this.width = width+thinHeight;
		this.height = height;
		this.thinHeight = thinHeight;

		// Slider background
		this.background.setRadius(thinHeight/2);
		this.background.setWidth(width + thinHeight);
		this.background.setHeight(thinHeight);

		const padding = (thinHeight + height) / 2;
		this.background.input!.hitArea.setTo(-padding, -padding, this.background.width+2*padding, this.background.height+2*padding);

		// Step notches
		this.notches.forEach((notch, i) => {
			let x = -width/2 + i / (this.steps - 1) * width;
			let size = 0.75 * thinHeight;

			notch.x = x;
			notch.displayWidth = notch.displayHeight = size;
		});

		// Slider button
		this.button.displayWidth = this.button.displayHeight = height;

		this.minX = -width/2;
		this.maxX = width/2;

		this.value = this.value;
	}


	setRange(min: number, max: number) {
		this.minV = min;
		this.maxV = max;
		this.value = this._value; // Will clamp
	}

	set value(value: number) {
		value = Phaser.Math.Clamp(value, this.minV, this.maxV);
		this._value = value;
		if (this._value != this._prev) {
			this.emit('onChange', this._value);
			this._prev = this._value;
		}

		let fac = (value - this.minV) / (this.maxV - this.minV);
		let x = this.minX + fac * (this.maxX - this.minX);
		this.button.x = this.targetX = x;
	}

	get value(): number {
		return this._value;
	}


	onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		let x = localX - this.background.width/2;
		this.background.input!.dragStartX = x;
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

	lock() {
		this.button.removeInteractive();
		this.button.fillColor = 0x555555;
		this.background.setColor(0x555555);
	}

	update(time: number, delta: number) {
		// Approach target position gradually
		this.button.x += 0.5 * (this.targetX - this.button.x);
	}
}