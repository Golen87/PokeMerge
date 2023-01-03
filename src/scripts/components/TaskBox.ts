import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { WideButton } from "./WideButton";
import { TaskBoxImage } from "./TaskBoxImage";
import { itemData } from "../items";

export class TaskBox extends Button {
	public scene: BaseScene;

	private bg: RoundRectangle;
	private title: Phaser.GameObjects.Text;

	private images: TaskBoxImage[];
	// private button: WideButton;

	private taskChapter: string;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);
		this.scene = scene;

		this.bg = new RoundRectangle(scene, 0, 0, width, height, 25, 0xEECC99);
		this.add(this.bg);

		this.images = [];
		for (let i = 0; i < 3; i++) {
			let image = new TaskBoxImage(scene, 0, 0.1*height, 100);
			image.setVisible(false);
			this.add(image);
			this.images.push(image);
		}

		this.title = scene.createText(0, 0, 26, scene.weights.bold, "#000", "Title");
		this.title.setOrigin(0.5, 0.0);
		this.add(this.title);

		// this.button = new WideButton(scene, 0, height/2-30, 200, 30, "Complete");
		// this.add(this.button);
		// this.button.on("click", () => {
			// this.emit("completeTask", this.taskChapter);
		// }, this);
		this.makeInteractive(this.bg);
		this.on("click", () => {
			this.emit("completeTask", this.taskChapter);
		});
	}

	update(time, delta) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
		// this.setAlpha(this.enabled ? 1.0 : 0.25);
		// this.button.update(time, delta);
	}


	resize(width: number, height: number, padding: number) {
		this.bg.setRadius(25/180*height);
		this.bg.setWidth(width);
		this.bg.setHeight(height);
		this.bg.input.hitArea.setTo(0, 0, width, height);

		const size = 0.6 * height;

		for (let i = 0; i < 3; i++) {
			this.images[i].x = 0
			this.images[i].y = height/2 - size/2 - padding;
			this.images[i].resize(size);
		}

		this.title.x = 0;
		this.title.y = -height/2+padding;
		this.title.setFontSize(26/180*height);
	}

	setTask(task) {
		this.title.setText(task.title || "Mission");
		this.taskChapter = task.chapter;

		for (let image of this.images) {
			image.setVisible(false);
		}

		for (let i = 0; i < task.items.length; i++) {
			let item = task.items[i];
			let sep = 1.2 * this.images[i].size;

			this.images[i].x = -sep * (task.items.length-1) / 2 + sep * i;
			this.images[i].setVisible(true);
			this.images[i].setItem(itemData[item.category][item.tier-1], item.tier, item.amount);
		}
	}

	updateTask(success: boolean, count: number[]) {
		console.assert(this.images.length >= count.length);

		for (let i = 0; i < count.length; i++) {
			this.images[i].setCount(count[i]);
		}

		this.bg.input.enabled = success;
		this.bg.setColor(success ? 0x39963d : 0xEECC99);
	}
}