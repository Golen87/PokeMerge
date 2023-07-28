import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { WideButton } from "./WideButton";
import { TaskBoxImage } from "./TaskBoxImage";
import { itemData } from "../items";
import { colorToString } from "../utils";
import { COLOR } from "../constants";

export class TaskBox extends Button {
	public scene: GameScene;

	private background: RoundRectangle;
	private title: Phaser.GameObjects.Text;

	private taskBoxImages: TaskBoxImage[];

	private taskChapter: string;
	private taskItemCount: number;

	constructor(scene: GameScene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);
		this.scene = scene;

		this.background = new RoundRectangle(scene, 0, 0, width, height, 25, COLOR.PANEL);
		this.add(this.background);

		this.taskItemCount = 0;
		this.taskBoxImages = [];
		for (let i = 0; i < 5; i++) {
			let image = new TaskBoxImage(scene, 0, 0.1*height, 100);
			image.setVisible(false);
			this.add(image);
			this.taskBoxImages.push(image);
		}

		this.title = scene.createText(0, 0, 26, scene.weights.bold, "#000", "Title");
		this.title.setOrigin(0, 0.5);
		this.add(this.title);

		this.makeInteractive(this.background);
		this.on("click", () => {
			this.emit("completeTask", this.taskChapter);
		});
	}

	update(time, delta) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}


	resize(bounds: Phaser.Geom.Rectangle, unit: number) {
		this.width = bounds.width;
		this.height = bounds.height;

		this.background.setRadius(2*unit);
		this.background.setWidth(this.width);
		this.background.setHeight(this.height);
		this.background.input?.hitArea.setTo(0, 0, this.width, this.height);

		const inner = new Phaser.Geom.Rectangle(
			bounds.left + 3*unit,
			bounds.top + 3*unit,
			bounds.width - 6*unit,
			bounds.height - 6*unit
		);

		// const size = 0.6 * height;

		const boxSize = inner.height;
		const boxSep = 3*unit;
		this.taskBoxImages.forEach((boxImage, index) => {
			boxImage.x = inner.centerX + (index-2)*boxSize/2 + (index-2)*boxSep;
			boxImage.y = inner.centerY;
			boxImage.resize(boxSize, unit);
		});

		this.title.x = inner.left;
		this.title.y = bounds.top;
		this.title.setFontSize(4*unit);
		this.title.setStroke(colorToString(this.background.getColor()), 2*unit);
	}

	getWhichBoxes(itemCount) {
		switch (itemCount) {
			case 1:
				return [2];
			case 2:
				return [1, 3];
			case 3:
				return [0, 2, 4];
			default:
				console.error("Unintended");
				return [2];
		}
	}

	setTask(task) {
		this.title.setText(task.title || "Mission");
		this.taskChapter = task.chapter;
		this.taskItemCount = task.items.length;

		this.taskBoxImages.forEach(image => {
			image.setVisible(false);
		});

		const boxesToUse = this.getWhichBoxes(this.taskItemCount);
		boxesToUse.forEach((boxIndex, itemIndex) => {
			const box = this.taskBoxImages[boxIndex];
			const item = task.items[itemIndex];
			const data = itemData[item.category][item.tier-1];

			box.setVisible(true);
			box.setItem(data, item.tier, item.amount);
		});
	}

	updateTask(success: boolean, count: number[]) {
		console.assert(this.taskBoxImages.length >= count.length);

		const boxesToUse = this.getWhichBoxes(this.taskItemCount);
		boxesToUse.forEach((boxIndex, itemIndex) => {
			const box = this.taskBoxImages[boxIndex];
			box.setCount(count[itemIndex]);
		});

		if(this.background.input)
			this.background.input.enabled = success;
		this.background.setColor(success ? COLOR.PANEL_SUCCESS : COLOR.PANEL);
		this.title.setStroke(colorToString(this.background.getColor()), 2*this.scene.layoutManager.unit);
	}
}