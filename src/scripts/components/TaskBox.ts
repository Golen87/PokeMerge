import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { WideButton } from "./WideButton";
import { TaskBoxImage } from "./TaskBoxImage";
import { itemData } from "../items";

export class TaskBox extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private bg: RoundRectangle;
	private title: Phaser.GameObjects.Text;

	private images: TaskBoxImage[];
	private button: WideButton;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);
		this.scene = scene;

		this.bg = new RoundRectangle(scene, 0, 0, width, height, 25, 0xEECC99);
		this.add(this.bg);

		const size = 100;

		this.images = [];
		for (let i = 0; i < 3; i++) {
			let image = new TaskBoxImage(scene, 0, -7, 80);
			image.setVisible(false);
			this.add(image);
			this.images.push(image);
		}

		this.title = scene.createText(0, -height/2+10, 25, scene.weights.bold, "#000", "Title");
		this.title.setOrigin(0.5, 0.0);
		this.add(this.title);

		this.button = new WideButton(scene, 0, height/2-30, 200, 30, "Complete");
		this.add(this.button);
		this.button.on("click", () => {
			this.emit("completeTask");
		}, this);
	}

	update(time, delta) {
		this.button.update(time, delta);
	}


	setTask(task) {
		this.title.setText(task.title);

		for (let image of this.images) {
			image.setVisible(false);
		}

		for (let i = 0; i < task.items.length; i++) {
			let item = task.items[i];

			this.images[i].x = -100 * (task.items.length-1) / 2 + 100 * i;
			this.images[i].setVisible(true);
			this.images[i].setItem(itemData[item.type][item.tier-1], item.tier, item.count);
		}
	}

	updateTask(success: boolean, count: number[]) {
		console.assert(this.images.length >= count.length);

		for (let i = 0; i < count.length; i++) {
			this.images[i].setCount(count[i]);
		}

		this.button.enabled = success;
		this.button.color = success ? 0x4CAF50 : 0xC9AC7F;
		this.button.textColor = success ? 0xFFFFFF : 0x000000;
	}
}