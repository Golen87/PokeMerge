import { BaseScene } from "../scenes/BaseScene";
import { Button } from "./Button";
import { Item } from "./Item";
import { RoundRectangle } from "./RoundRectangle";
import { InfoItemPreview } from "./InfoItemPreview";
import { ExperienceBar } from "./ExperienceBar";
import { WideButton } from "./WideButton";
import { TaskBox } from "./TaskBox";
import { capitalize } from "../utils";
import { SUCCESS_COLOR, DANGER_COLOR } from "../constants";

export class Info extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public selected?: Item;
	public prevTier?: number;

	private background: RoundRectangle;
	private itemName: Phaser.GameObjects.Text;
	private itemDesc: Phaser.GameObjects.Text;
	private emptyText: Phaser.GameObjects.Text;

	private preview_left: InfoItemPreview;
	private preview_center: InfoItemPreview;
	private preview_right: InfoItemPreview;
	private arrow: Phaser.GameObjects.Image;

	private experienceBar: ExperienceBar;
	private sellButton: WideButton;
	private rechargeButton: WideButton;

	private taskBoxes: TaskBox[];

	private tasks: any[];
	private discovered: Set<string>;

	constructor(scene: BaseScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.width = this.scene.W;
		this.height = 0.15 * this.scene.H;

		this.background = new RoundRectangle(this.scene, 0, 0, 100, 100, 25, 0xEECC99);
		this.add(this.background);


		this.itemName = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000", "Name");
		this.add(this.itemName);

		this.itemDesc = this.scene.createText(0, 0, 30, this.scene.weights.regular, "#000", "Desc");
		this.add(this.itemDesc);

		this.emptyText = this.scene.createText(0, 0, 30, this.scene.weights.regular, "#000", `Select an item to see more information!`);
		this.add(this.emptyText);


		// Preview for item -> item

		this.preview_left = new InfoItemPreview(this.scene, 0, 0, 100, 25, 0xC9AC7F);
		this.preview_center = new InfoItemPreview(this.scene, 0, 0, 100, 25, 0xC9AC7F);
		this.preview_right = new InfoItemPreview(this.scene, 0, 0, 100, 25, 0xC9AC7F);
		this.preview_left.setVisible(false);
		this.preview_center.setVisible(false);
		this.preview_right.setVisible(false);
		this.add(this.preview_left);
		this.add(this.preview_center);
		this.add(this.preview_right);

		this.arrow = this.scene.add.image(0, 0, "arrow");
		this.arrow.setTint(0xC9AC7F);
		this.add(this.arrow);


		this.experienceBar = new ExperienceBar(this.scene, 0, 0, 100, 100);
		this.add(this.experienceBar);


		this.sellButton = new WideButton(this.scene, 0, 0, 100, 100, "Trash", DANGER_COLOR);
		this.add(this.sellButton);
		this.sellButton.on("click", () => {
			this.emit("sell");
		}, this);


		this.rechargeButton = new WideButton(this.scene, 0, 0, 100, 100, "Recharge", SUCCESS_COLOR);
		this.add(this.rechargeButton);
		this.rechargeButton.on("click", () => {
			this.emit("recharge");
		}, this);


		this.taskBoxes = [];
		for (let i = 0; i < 3; i++) {
			let taskBox = new TaskBox(this.scene, 0, 0, 100, 100);

			taskBox.on("completeTask", (taskChapter) => {
				this.emit("completeTask", taskChapter, i);
			}, this);

			this.taskBoxes.push(taskBox);
			this.add(taskBox);
		}


		this.tasks = [];
		this.discovered = new Set();

		this.updateInfo();
	}

	onScreenResize(gridWidth: number, gridHeight: number) {
		const margin = 0.015 * gridWidth;
		const padding = 0.02 * gridWidth;
		this.width = gridWidth + 8;
		this.height = Math.min(((this.scene.H - gridHeight) / 2 - 2*margin), 200);
		this.height = this.width/5 - margin;
		this.x = this.scene.CX;
		this.y = this.scene.CY - gridHeight/2 - this.height/2 - margin;

		const previewSize = 0.09 * this.width;
		const previewOffsetX = 0.9 * previewSize;
		let infoX = -this.width/2 + padding;
		let infoY = -this.height/2 + padding;


		// Resize background
		this.background.setRadius(0.02 * this.width);
		this.background.setWidth(this.width);
		this.background.setHeight(this.height)


		this.itemName.x = infoX;
		this.itemName.y = infoY;
		this.itemName.setFontSize(0.035 * this.width);
		// this.itemName.setWordWrapWidth(this.width-2*padding, true);


		infoY += this.itemName.height * 1.35;

		this.itemDesc.x = infoX;
		this.itemDesc.y = infoY;
		this.itemDesc.setFontSize(0.025 * this.width);
		this.itemDesc.setWordWrapWidth(0.65*this.width, true);

		this.emptyText.x = infoX;
		this.emptyText.y = infoY;
		this.emptyText.setFontSize(0.025 * this.width);
		this.emptyText.setWordWrapWidth(0.65*this.width, true);


		// Preview for item -> item

		infoX = this.width/2 - previewSize/2 - padding;
		infoY = -this.height/2 + previewSize/2 + padding;

		this.preview_left.x = infoX - 2*previewOffsetX;
		this.preview_left.y = infoY;
		this.preview_left.resize(previewSize);

		this.preview_center.x = infoX;
		this.preview_center.y = infoY;
		this.preview_center.resize(previewSize);

		this.preview_right.x = infoX + 0*previewOffsetX;
		this.preview_right.y = infoY;
		this.preview_right.resize(previewSize);

		this.arrow.x = infoX - previewOffsetX;
		this.arrow.y = infoY;
		this.arrow.setScale(0.7 * previewSize / this.arrow.width);


		const experienceWidth = 0.4 * this.width;
		const experienceHeight = 0.02 * this.width;
		infoX = -this.width/2 + experienceWidth/2 + padding;
		infoY = this.height/2 - experienceHeight/2 - padding;

		this.experienceBar.x = infoX;
		this.experienceBar.y = infoY;
		this.experienceBar.resize(experienceWidth, experienceHeight);


		const sellWidth = 0.093 * this.width;
		const sellHeight = sellWidth/2.5;
		infoX = this.width/2 - sellWidth/2 - padding;
		infoY = this.height/2 - sellHeight/2 - padding;

		this.sellButton.x = infoX;
		this.sellButton.y = infoY;
		this.sellButton.resize(sellWidth, sellHeight);


		const rechargeWidth = 0.149 * this.width;
		const rechargeHeight = sellHeight;
		infoX = this.width/2 - sellWidth - 2*padding - rechargeWidth/2;
		infoY = this.height/2 - rechargeHeight/2 - padding;

		this.rechargeButton.x = infoX;
		this.rechargeButton.y = infoY;
		this.rechargeButton.resize(rechargeWidth, rechargeHeight);


		for (let i = 0; i < 3; i++) {
			const taskWidth = this.width/3 - margin;
			const taskHeight = this.width/6 + margin;
			this.taskBoxes[i].y = this.scene.CY - this.y + gridHeight/2 + taskHeight/2 + margin;
			this.taskBoxes[i].resize(taskWidth, taskHeight, padding);
		}
		this.taskBoxes.forEach((box, index) => {
			box.setVisible(index < this.tasks.length);
			box.x = index * this.width/3 - (this.tasks.length-1)/2 * (this.width/3);
		});
	}


	update(time, delta) {
		this.experienceBar.update(time, delta);
		this.sellButton.update(time, delta);
		this.rechargeButton.update(time, delta);
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
		this.rechargeButton.enabled = false;

		// Fill in selected data
		if (this.selected) {

			this.itemName.setText(this.selected.itemData.name);
			this.emptyText.setVisible(false);
			this.rechargeButton.enabled = this.selected.chargeBlock;

			if (!this.selected.isGenerator) {
				this.sellButton.enabled = !this.selected.blocked;
			}

			let next = this.selected.nextTier;
			if (next) {
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
				this.preview_center.setVisible(true);
				this.preview_center.setImage(this.selected.itemData);
				this.preview_center.setTier(this.selected.tier);
			}

			if (this.selected.category == "experience") {
				let points = [1, 3, 8, 20, 50][this.selected.tier-1];
				if (next) {
					this.itemDesc.setText(`Merge this item to the next rank or tap to collect ${points} Experience.`);
				}
				else {
					this.itemDesc.setText(`Tap to collect ${points} Experience. This item is at max rank.`);
				}
			}
			else if (next) {
				this.itemDesc.setText(`Merge to create ${next.name}!`);
			}
			else {
				this.itemDesc.setText("This item is at max level and can no longer be merged.");
			}

			this.prevTier = this.selected.tier;
		}
	}

	updateItem(item: Item) {
		if (item == this.selected) {
			this.rechargeButton.enabled = this.selected.chargeBlock;
		}
	}


	updateTasks(tasks) {
		this.tasks = tasks;

		// console.assert(this.taskBoxes.length == tasks.length);
		this.taskBoxes.forEach((box, index) => {
			box.setVisible(index < tasks.length);
			box.x = index * this.width/3 - (tasks.length-1)/2 * (this.width/3);
		});

		let text = "";
		for (let i = 0; i < tasks.length; i++) {
			this.taskBoxes[i].setTask(tasks[i]);
		}
	}

	visualizeTasks(result: any[]) {
		// console.assert(this.taskBoxes.length == result.length);

		for (let i = 0; i < result.length; i++) {
			this.taskBoxes[i].updateTask(result[i].success, result[i].count);
		}
	}

	updateExperience(level: number, experience: number, requirement: number) {
		this.experienceBar.setText(level, experience, requirement);
	}
}