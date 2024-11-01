import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { COLOR } from "../constants";
import { itemData } from "../items";
import { Task } from "./TaskManager";

export class NavigationPanel extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public debug: Phaser.GameObjects.Graphics;

	private taskButton: Button;
	private taskIcon: Phaser.GameObjects.Image;
	private taskCountPill: RoundRectangle;
	private taskCount: Phaser.GameObjects.Text;
	private taskCountCheckmark: Phaser.GameObjects.Image;

	private inventoryButton: Button;
	private inventoryIcon: Phaser.GameObjects.Image;

	private mapButton: Button;
	private mapIcon: Phaser.GameObjects.Image;

	private queueButton: Button;
	private queueIcon: Phaser.GameObjects.Image;
	private queueItemScale: number;

	private hintTween: Phaser.Tweens.Tween;
	private hintAnimation: number;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);


		this.hintAnimation = 1;


		this.debug = this.scene.add.graphics();
		this.add(this.debug);


		/* Task list button */

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


		/* Inventory button */

		this.inventoryButton = new Button(this.scene, 0, 0);
		this.add(this.inventoryButton);
		this.inventoryIcon = this.scene.add.image(0, 0, "eject_pack");
		this.inventoryButton.add(this.inventoryIcon);
		this.inventoryButton.makeInteractive(this.inventoryIcon);
		this.inventoryButton.on("click", () => {
			this.emit("inventory");
		});


		/* Map button */
	
		this.mapButton = new Button(this.scene, 0, 0);
		this.add(this.mapButton);
		this.mapIcon = this.scene.add.image(0, 0, "town_map");
		this.mapButton.add(this.mapIcon);
		this.mapButton.makeInteractive(this.mapIcon);
		this.mapButton.on("click", () => {
			this.emit("map");
		});


		/* Item queue button */
	
		this.queueButton = new Button(this.scene, 0, 0);
		this.add(this.queueButton);
		this.queueIcon = this.scene.add.image(0, 0, "town_map2");
		this.queueButton.setVisible(false);
		this.queueButton.add(this.queueIcon);
		this.queueButton.makeInteractive(this.queueIcon);
		this.queueButton.on("click", () => {
			this.emit("queue");
		});
		this.queueItemScale = 1;
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number, isVertical: boolean) {
		this.width = bounds.width - 2*unit;
		this.height = bounds.height - 2*unit;

		const buttonRects = this.getButtonRects(bounds, unit, isVertical);
		
		
		// Resize task list button
		
		const task = buttonRects[0];
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


		// Resize inventory button

		const inventory = buttonRects[1];
		this.inventoryButton.x = inventory.centerX;
		this.inventoryButton.y = inventory.centerY;
		this.inventoryIcon.setScale(1.0 * inventory.width / this.inventoryIcon.width);


		// Resize map button

		const map = buttonRects[4];
		this.mapButton.x = map.centerX;
		this.mapButton.y = map.centerY;
		this.mapIcon.setScale(1.2 * map.width / this.mapIcon.width);


		// Resize queue button

		const queue = buttonRects[2];
		this.queueButton.width = queue.width;
		this.queueButton.x = queue.centerX;
		this.queueButton.y = queue.centerY;
		this.queueIcon.setScale(this.queueItemScale * queue.width / this.queueIcon.width);


		// Temporary debug icons

		this.debug.clear();
		this.debug.fillStyle(0xFFFFFF, 0.15);
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

		let inventoryScale = 1.0 - 0.1 * this.inventoryButton.holdSmooth;
		this.inventoryButton.setScale(inventoryScale);

		let mapScale = 1.0 - 0.1 * this.mapButton.holdSmooth;
		this.mapButton.setScale(mapScale);

		let queueScale = 1.0 - 0.1 * this.queueButton.holdSmooth;
		this.queueButton.setScale(queueScale);
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

	updateTasks(tasks: Task[]) {
		this.taskCount.setText(tasks.length.toString());
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

	setQueueItem(item: { category: string; tier: number; } | null) {
		if (item) {
			const { scale, key } = itemData[item.category][item.tier - 1];
			this.queueIcon.setTexture(key);
			this.queueItemScale = (scale || 1) * 1.2;
			this.queueIcon.setScale(this.queueItemScale * this.queueButton.width / this.queueIcon.width);
			this.queueButton.setVisible(true);

			let h = Math.max(this.queueIcon.width, this.queueIcon.height);
			let origY = 1 - this.queueIcon.width / h / 2;
			this.queueIcon.setOrigin(0.5, origY);
		}
		else {
			this.queueButton.setVisible(false);
		}
	}

	getQueueItemPosition(): { x: number, y: number } {
		return {
			x: this.queueButton.x,
			y: this.queueButton.y
		};
	}
}