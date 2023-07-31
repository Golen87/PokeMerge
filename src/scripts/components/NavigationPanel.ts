import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { Item } from "./Item";
import { RoundRectangle } from "./RoundRectangle";
import { InfoItemPreview } from "./InfoItemPreview";
import { ExperienceBar } from "./ExperienceBar";
import { WideButton } from "./WideButton";
import { TaskBox } from "./TaskBox";
import { capitalize } from "../utils";
import { COLOR } from "../constants";

export class NavigationPanel extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public debug: Phaser.GameObjects.Graphics;

	private taskButton: Button;
	private taskIcon: Phaser.GameObjects.Image;
	private taskCountPill: RoundRectangle;
	private taskCount: Phaser.GameObjects.Text;
	private taskCountCheckmark: Phaser.GameObjects.Image;

	private hintTween: Phaser.Tweens.Tween;
	private hintAnimation: number;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);


		this.hintAnimation = 1;


		this.debug = this.scene.add.graphics();
		this.add(this.debug);

		this.taskButton = new Button(this.scene, 0, 0);
		this.add(this.taskButton);
		this.taskIcon = this.scene.add.image(0, 0, "gymleadernotes");
		this.taskButton.add(this.taskIcon);
		this.taskButton.makeInteractive(this.taskIcon);
		this.taskButton.on("click", () => {
			this.emit("tasks");
		});

		this.taskCountPill = new RoundRectangle(this.scene, 0, 0, 100, 100, 25, 0xFFFFFF);
		this.taskButton.add(this.taskCountPill);

		this.taskCount = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000", "0");
		this.taskCount.setOrigin(0.5);
		this.taskCountPill.add(this.taskCount);

		this.taskCountCheckmark = this.scene.add.image(0, 0, "checkmark_inv");
		this.taskCountPill.add(this.taskCountCheckmark);
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number, isVertical: boolean) {
		this.width = bounds.width - 2*unit;
		this.height = bounds.height - 2*unit;

		const buttonRects = this.getButtonRects(bounds, unit, isVertical);
		const task = buttonRects[0];


		// Resize task list button

		this.taskButton.x = task.centerX;
		this.taskButton.y = task.centerY;
		this.taskIcon.setScale(task.width / this.taskIcon.width);

		const w = this.taskIcon.width;
		const k = 0.1 * w;
		this.taskIcon.input!.hitArea.setTo(-k, -k, w+2*k, w+2*k);

		this.taskCountPill.x = task.width * 5/16;
		this.taskCountPill.y = task.height * 5/16;
		this.taskCountPill.setRadius(1.75*unit);
		this.taskCountPill.setWidth(5.5*unit);
		this.taskCountPill.setHeight(0); // Make radius determine height
		this.taskCount.x = (this.taskCountCheckmark.visible ? -.4*unit : 0);
		this.taskCount.setFontSize(2.5*unit);
		this.taskCountCheckmark.x = 2.3*unit;
		this.taskCountCheckmark.setScale(3.5*unit / this.taskCountCheckmark.width);


		// Temporary debug icons

		this.debug.clear();
		this.debug.fillStyle(0xFFFFFF, 0.05);
		buttonRects.forEach(rect => {
			// this.debug.fillRect(
			// 	rect.left,
			// 	rect.top,
			// 	rect.width,
			// 	rect.height
			// );
			this.debug.fillCircle(
				rect.centerX,
				rect.centerY,
				rect.width/2.5
			);
		});
	}

	update(time, delta) {
		let taskScale = 1.0;
		taskScale -= 0.1 * this.taskButton.holdSmooth;
		taskScale *= this.hintAnimation;
		this.taskButton.setScale(taskScale);
	}


	getButtonRects(bounds: Phaser.Geom.Rectangle, unit: number, isVertical: boolean): Phaser.Geom.Rectangle[] {
		const rects: Phaser.Geom.Rectangle[] = [];

		for (let i = 0; i < 5; i++) {

			if (isVertical) {
				const size = this.height;
				const sep = (this.width - 5*size) / 4;
				rects.push(new Phaser.Geom.Rectangle(
					bounds.left + i*size + i*sep + unit,
					bounds.top + 0*unit,
					size,
					size
				));
			}
			else {
				const size = this.width;
				const sep = 4*unit;
				rects.push(new Phaser.Geom.Rectangle(
					bounds.left + 0*unit,
					bounds.centerY - (i-5/2+1)*size - (i-5/2+0.5)*sep,
					size,
					size
				));
			}
		}
		return rects;
	}

	updateTasks(tasks) {
		this.taskCount.setText(tasks.length);
	}

	visualizeTasks(result: any[]) {
		const anyTasksCompleted = result.some(task => task.success);

		if (anyTasksCompleted && !this.hasTaskCompleted) {
			this.showHint();
			// Do circle animation
		}
		else if (!anyTasksCompleted && this.hasTaskCompleted) {
			this.clearTweens();
		}

		this.taskCountPill.setColor(anyTasksCompleted ? COLOR.SUCCESS : 0xFFFFFF);
		this.taskCount.setColor(anyTasksCompleted ? "#FFF" : "#000");
		this.taskCountCheckmark.setVisible(anyTasksCompleted);
	}

	get hasTaskCompleted(): boolean {
		return this.taskCountCheckmark.visible;
	}

	clearTweens() {
		if (this.hintTween) {
			this.hintTween.stop();
			this.hintAnimation = 1;
		}
	}

	showHint() {
		this.clearTweens();

		this.hintTween = this.scene.tweens.add({
			targets: this,
			hintAnimation: { from: 1, to: 1+.35/2 },
			yoyo: true,
			ease: 'Sine.Out',
			duration: 300,
			repeat: 1,
			onComplete: () => {
				if (this.scene) {
					this.hintTween = this.scene.tweens.add({
						targets: this,
						hintAnimation: { from: 1, to: 1+.15/2 },
						yoyo: true,
						ease: 'Sine.Out',
						duration: 200,
						onComplete: () => {
							if (this.scene) {
								this.hintTween = this.scene.tweens.add({
									targets: this,
									hintAnimation: { from: 1, to: 1+.03/2 },
									yoyo: true,
									ease: 'Sine.Out',
									duration: 100
								});
							}
						}
					});
				}
			}
		});
	}
}