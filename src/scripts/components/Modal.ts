import { GameScene } from "../scenes/GameScene";
import { RoundRectangle } from "./RoundRectangle";
import { COLOR, DEPTH } from "../constants";

export class Modal extends Phaser.GameObjects.Container {
	public scene: GameScene;

	protected openState: boolean;
	protected openValue: number;

	protected fade: Phaser.GameObjects.Rectangle;
	protected background: RoundRectangle;
	protected title: Phaser.GameObjects.Text;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.setDepth(DEPTH.MODAL);
		this.setVisible(false);
		this.setAlpha(0);

		this.openState = false;
		this.openValue = 0;


		this.fade = this.scene.add.rectangle(0, 0, 100, 100, 0x000000, 0.5);
		this.fade.setInteractive().on("pointerdown", this.close, this);
		this.add(this.fade);

		this.background = new RoundRectangle(this.scene, 0, 0, 100, 100, 25, COLOR.MODAL);
		this.background.setInteractive().on("pointerdown", ()=>{}, this);
		this.add(this.background);

		this.title = this.scene.createText(0, 0, 40, this.scene.weights.black, "#000", "Title");
		this.title.setOrigin(0.5);
		this.add(this.title);
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number) {
		const margin = 2*unit;
		const padding = 2*unit;

		// Resize fade
		this.fade.setPosition(bounds.centerX, bounds.centerY);
		this.fade.displayWidth = 2*this.scene.W;
		this.fade.displayHeight = 2*this.scene.H;

		// Resize background
		this.background.setRadius(3*unit);
		this.background.setPosition(bounds.centerX, bounds.centerY);
		this.background.setWidth(this.width);
		this.background.setHeight(this.height);
		this.background.input.hitArea.setTo(0, 0, this.background.width, this.background.height);

		// Resize title
		this.title.x = bounds.centerX;
		this.title.y = bounds.centerY - this.height/2 - unit;
		this.title.setStroke(COLOR.MODAL_STR, 3*unit);
		this.title.setFontSize(10*unit);
	}

	update(time, delta) {
		const duration = 300;
		const change = (this.openState ? delta/duration : -delta/duration);
		this.openValue = Phaser.Math.Clamp(this.openValue + change, 0, 1);
		const alphaEasing = Phaser.Math.Easing.Cubic.Out(this.openValue);

		this.setVisible(alphaEasing > 0);
		this.setAlpha(alphaEasing);
		this.y = 100 * (1 - alphaEasing);
	}


	open() {
		this.openState = true;
		this.fade.input.enabled = true;
		this.background.input.enabled = true;
	}

	close() {
		this.openState = false;
		this.fade.input.enabled = false;
		this.background.input.enabled = false;
	}

	get isOpen(): boolean {
		return this.openState;
	}
}