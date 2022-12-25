import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { Item } from "./Item";
import { RoundRectangle } from "./RoundRectangle";
import { InfoItemPreview } from "./InfoItemPreview";
import { WideButton } from "./WideButton";
import { TaskBox } from "./TaskBox";
import { capitalize } from "../utils";

export class Info extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public selected?: Item;
	public prevTier?: number;

	private itemName: Phaser.GameObjects.Text;
	private itemDesc: Phaser.GameObjects.Text;
	private emptyText: Phaser.GameObjects.Text;

	private preview_left: InfoItemPreview;
	private preview_center: InfoItemPreview;
	private preview_right: InfoItemPreview;
	private arrow: Phaser.GameObjects.Image;

	private sellButton: WideButton;

	private taskBoxes: TaskBox[];

	private discovered: Set<string>;

	constructor(scene: BaseScene, x: number, y: number, width: number, height: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		let mar = 30;
		let pad = 25;
		this.width = width - 2*mar;
		this.height = height - 2*mar;

		let bg = new RoundRectangle(scene, 0, 0, this.width, this.height, 25, 0xEECC99);
		this.add(bg);


		let size = 120;
		let dx = 0.9 * size;
		let h2 = size + 2*pad;
		// let y2 = this.height/2 + mar + h2/2;

		let nx = -this.width/2 + pad;
		let ny = -this.height/2 + pad;

		this.itemName = scene.createText(nx, ny, 40, scene.weights.bold, "#000", "Name");
		// this.itemName.setStroke("#FFF", 4);
		// this.itemName.setOrigin(0.5);
		// this.itemName.setWordWrapWidth(this.width-2*pad, true);
		this.add(this.itemName);


		ny += size / 2 + pad + 40;

		this.preview_left = new InfoItemPreview(scene, -dx, ny, size, 25, 0xC9AC7F);
		this.preview_center = new InfoItemPreview(scene, 0, ny, size, 25, 0xC9AC7F);
		this.preview_right = new InfoItemPreview(scene, dx, ny, size, 25, 0xC9AC7F);
		this.preview_left.setVisible(false);
		this.preview_center.setVisible(false);
		this.preview_right.setVisible(false);
		this.add(this.preview_left);
		this.add(this.preview_center);
		this.add(this.preview_right);

		this.arrow = scene.add.image(0, ny, "arrow");
		this.arrow.setScale(0.7 * size / this.arrow.width);
		this.arrow.setTint(0xC9AC7F);
		this.add(this.arrow);


		ny += size / 2 + pad;

		this.itemDesc = scene.createText(nx, ny, 30, scene.weights.regular, "#000", "Desc");
		// this.itemDesc.setOrigin(0.5);
		this.itemDesc.setWordWrapWidth(this.width-1*pad, true);
		this.add(this.itemDesc);

		this.emptyText = scene.createText(nx, 0, 30, scene.weights.regular, "#000", `Select an item to see more information!`);
		this.emptyText.setOrigin(0, 0.75);
		this.emptyText.setWordWrapWidth(this.width-1*pad, true);
		this.add(this.emptyText);


		ny = this.height/2 - pad - 50/2;

		this.sellButton = new WideButton(scene, 0, ny, 0.5*this.width, 50, "Sell");
		this.add(this.sellButton);
		this.sellButton.on("click", () => {
			this.emit("sell");
		}, this);


		ny = height/2 + 3.27*pad;

		this.taskBoxes = [];
		for (let i = 0; i < 3; i++) {

			let y = ny + 200 * i;
			let taskBox = new TaskBox(this.scene, 0, y, this.width, 180);

			taskBox.on("completeTask", () => {
				this.emit("completeTask", i);
			}, this);

			this.taskBoxes.push(taskBox);
			this.add(taskBox);
		}


		this.discovered = new Set();

		this.updateInfo();
	}

	update(time, delta) {
		this.sellButton.update(time, delta);
		this.taskBoxes.forEach((taskBox: TaskBox) => {
			taskBox.update(time, delta);
		});
	}


	setSelected(item: Item | undefined) {
		if (this.selected != item || (this.selected && this.selected.tier != this.prevTier)) {
			this.selected = item;
			if (item && item.imageKey) {
				this.discovered.add(item.imageKey);
			}
			this.updateInfo();
		}
	}

	updateInfo() {
		// Reset
		this.itemName.setText("No selection");
		this.emptyText.setVisible(true);
		this.itemDesc.setText("");
		this.preview_left.setVisible(false);
		this.preview_center.setVisible(false);
		this.preview_right.setVisible(false);
		this.arrow.setVisible(false);
		this.sellButton.enabled = false;

		// Fill in selected data
		if (this.selected) {

			this.itemName.setText(this.selected.itemData.name);
			this.emptyText.setVisible(false);
			this.sellButton.enabled = !this.selected.blocked;

			let next = this.selected.nextTier;
			if (next) {
				this.itemDesc.setText(`Merge to create ${next.name}!`);

				this.preview_left.setVisible(true);
				this.preview_left.setImage(this.selected.itemData);
				this.preview_left.setTier(this.selected.tier);
				this.preview_right.setVisible(true);
				this.preview_right.setImage(next);
				this.preview_right.setTier(this.selected.tier + 1);
				this.preview_right.setExplored(this.discovered.has(next.key));
				this.arrow.setVisible(true);
			}
			else {
				this.itemDesc.setText("This item is at max level and can no longer be merged.");

				this.preview_center.setVisible(true);
				this.preview_center.setImage(this.selected.itemData);
				this.preview_center.setTier(this.selected.tier);
			}

			this.prevTier = this.selected.tier;
		}
	}


	updateTasks(tasks) {
		console.assert(this.taskBoxes.length == tasks.length);

		let text = "";
		for (let i = 0; i < tasks.length; i++) {
			this.taskBoxes[i].setTask(tasks[i]);
		}
	}

	visualizeTasks(result: any[]) {
		console.assert(this.taskBoxes.length == result.length);

		for (let i = 0; i < result.length; i++) {
			this.taskBoxes[i].updateTask(result[i].success, result[i].count);
		}
	}
}