import { BaseScene } from "./BaseScene";
import { Grid } from "../components/Grid";
import { TaskId, TaskManager } from "../components/TaskManager";
import { Map } from "../components/Map";

import { StatusPanel } from "../components/StatusPanel";
import { ItemInfoPanel } from "../components/ItemInfoPanel";
import { NavigationPanel } from "../components/NavigationPanel";

import { SettingsModal } from "../components/SettingsModal";
import { TaskListModal } from "../components/TaskListModal";
import { ItemDetailsModal } from "../components/ItemDetailsModal";

import { LayoutManager } from "../components/LayoutManager";
import { COLOR, DEPTH } from "../constants";
import { BlurPostFilter } from "../pipelines/BlurPostFilter";
import { itemData } from "../items";

export class GameScene extends BaseScene {
	private state: "grid" | "map";

	private grid: Grid;
	private map: Map;

	public task: TaskManager;
	public layout: LayoutManager;

	public statusPanel: StatusPanel;
	public itemInfoPanel: ItemInfoPanel;
	public navigationPanel: NavigationPanel;

	public settingsModal: SettingsModal;
	public taskListModal: TaskListModal;
	public itemDetailsModal: ItemDetailsModal;

	private hintTimer: number;
	private experience: number;
	private level: number;
	private itemQueue: { category: string; tier: number }[];

	public GRID_SIZE;
	public CELL_SIZE;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.cameras.main.setBackgroundColor(COLOR.BACKGROUND);
		this.fade(false, 200, 0x000000);

		this.hintTimer = 0;
		this.experience = 0;
		this.level = 1;
		this.itemQueue = [];

		this.GRID_SIZE = 148;
		this.CELL_SIZE = 138;

		this.input.on("pointerdown", () => {
			this.hintTimer = 0;
		});
		this.input.on("pointerup", () => {
			this.hintTimer = 0;
		});

		/* Layout tester */

		this.layout = new LayoutManager(this);
		this.layout.setDepth(DEPTH.MODAL);

		/* Grid */

		this.grid = new Grid(this, this.CX, this.CY);
		if (this.input.keyboard) {
			this.input.keyboard.on("keyup-M", () => {
				this.grid.findMove();
			});
		}
		this.grid.setDepth(DEPTH.GRID);
		this.grid.on("checkTasks", this.visualizeTasks, this);
		this.grid.on("experience", this.gainExperience, this);

		/* Status panel */

		this.statusPanel = new StatusPanel(this);
		this.statusPanel.setDepth(DEPTH.GRID);

		this.statusPanel.on("settings", () => {
			this.settingsModal.open();
		});

		/* Item info panel */

		this.itemInfoPanel = new ItemInfoPanel(this);
		this.itemInfoPanel.setDepth(DEPTH.GRID);
		// this.itemInfoPanel.setVisible(false);

		this.itemInfoPanel.on("sell", () => {
			this.grid.sellSelected();
		});
		this.itemInfoPanel.on("recharge", () => {
			this.grid.rechargeSelected();
		});

		this.grid.on("selection", (item) => {
			this.itemInfoPanel.setSelected(item);
		});
		this.grid.on("updateItem", (item) => {
			this.itemInfoPanel.updateItem(item);
		});

		/* Navigation panel */
		this.navigationPanel = new NavigationPanel(this);
		this.navigationPanel.setDepth(DEPTH.GRID);

		this.navigationPanel.on("tasks", () => {
			this.taskListModal.open();
		});

		this.navigationPanel.on("queue", () => {
			const slot = this.grid.getRandomFreeSlot();
			const item = this.itemQueue[0];
			if (slot && item) {
				const newItem = this.grid.createItem(
					slot.x,
					slot.y,
					item.category,
					item.tier
				);
				if (newItem) {
					this.itemQueue.shift();

					const pos = this.navigationPanel.getQueueItemPosition();
					newItem.x = pos.x;
					newItem.y = pos.y;

					const category = Phaser.Math.RND.pick(Object.keys(itemData));
					const tier = Phaser.Math.RND.integerInRange(
						1,
						itemData[category].length - 1
					);
					this.itemQueue.push({ category, tier });
					this.navigationPanel.setQueueItem(this.itemQueue[0]);
				}
			}
		});

		/* Modals */

		this.settingsModal = new SettingsModal(this);
		this.settingsModal.on("quality", this.onScreenResize, this);
		this.settingsModal.on("reset", () => {
			if (confirm("This will erase your current progress. Are you sure?")) {
				this.grid.clearData();
				this.settingsModal.close();
				this.onScreenResize();
			}
		});

		this.taskListModal = new TaskListModal(this);
		this.taskListModal.on("completeTask", (taskId: TaskId, index: number) => {
			this.grid.completeTask(index);
			this.task.completeTask(taskId);

			const task = this.task.getTask(taskId);
			task.reward.forEach(({ category, tier, amount }) => {
				if (tier) {
					this.itemQueue.push({ category, tier });
					this.navigationPanel.setQueueItem(this.itemQueue[0]);
				} else {
					console.warn("Non-item reward:", category, amount);
				}
			});
		});

		this.itemDetailsModal = new ItemDetailsModal(this);

		/* Task manager */

		this.task = new TaskManager(this);
		this.task.on("newTask", this.updateTasks, this);
		this.updateTasks();

		this.map = new Map(this);
		this.map.drawMap();
		this.map.setDepth(DEPTH.MAP);

		this.gainExperience(0);

		addEventListener("resize", (event) => {
			this.onScreenResize();
		});
		this.onScreenResize();

		if (this.input.keyboard) {
			this.input.keyboard.on("keydown-SPACE", () => {
				if (this.state == "map") {
					this.setState("grid");
				} else {
					this.setState("map");
				}
			});
		}

		this.setState("grid");
	}

	onScreenResize() {
		// Scales the screen resolution by this variable. x2 means high quality anti aliasing
		const scale = this.settingsModal.qualityScale;
		const dpr = window.devicePixelRatio;
		const gameWidth = Math.floor(scale * window.innerWidth * dpr);
		const gameHeight = Math.floor(scale * window.innerHeight * dpr);
		// const gameWidth = scale * window.innerWidth;
		// const gameHeight = scale * window.innerHeight;
		// if (gameWidth != a.width || gameHeight != a.height) {
		this.scale.setGameSize(gameWidth, gameHeight);

		this.scale.refresh();
		setTimeout(() => {
			this.scale.refresh();
		}, 500);

		const bounds = this.layout.onScreenResize(gameWidth, gameHeight);

		this.GRID_SIZE = bounds.cellSize;
		this.CELL_SIZE = (140 / 148) * this.GRID_SIZE;

		this.grid.onScreenResize(bounds.grid, bounds.unit);
		this.map.onScreenResize(this.W, this.H, bounds.unit);

		this.statusPanel.onScreenResize(bounds.status, bounds.unit);
		const infoIsVertical = this.layout.isSquare || this.layout.isPortrait;
		const navIsVertical = this.layout.isPortrait;
		this.itemInfoPanel.onScreenResize(bounds.info, bounds.unit, infoIsVertical);
		this.navigationPanel.onScreenResize(bounds.nav, bounds.unit, navIsVertical);

		this.settingsModal.onScreenResize(bounds.modal, bounds.unit);
		this.taskListModal.onScreenResize(bounds.modal, bounds.unit);
		this.itemDetailsModal.onScreenResize(bounds.modal, bounds.unit);
	}

	setState(state: "grid" | "map") {
		this.state = state;

		if (state == "grid") {
			this.grid.setVisible(true);

			this.map.setAlpha(0.6);
			this.map.setDepth(DEPTH.MAP);
			this.map.setPostPipeline(BlurPostFilter);
		} else {
			this.grid.setVisible(false);

			this.map.drawMap();
			this.map.setAlpha(1);
			this.map.setDepth(20000);
			this.map.resetPostPipeline();
		}
	}

	update(time: number, delta: number): void {
		this.grid.update(time, delta);

		if (this.state == "map") {
			this.map.update(time, delta);
		}

		this.statusPanel.update(time, delta);
		this.itemInfoPanel.update(time, delta);
		this.navigationPanel.update(time, delta);

		this.settingsModal.update(time, delta);
		this.taskListModal.update(time, delta);
		this.itemDetailsModal.update(time, delta);

		if (!this.anyModalOpen) {
			this.hintTimer += delta / 1000;
		} else {
			this.hintTimer = 0;
		}

		if (this.hintTimer > 3.0) {
			this.hintTimer = 0;

			if (this.settingsModal.hintsEnabled) {
				this.grid.showHint();
			}
			if (this.navigationPanel.hasTaskCompleted) {
				this.navigationPanel.showHint();
			}
		}
		// this.grid.forceMerge();
	}

	updateTasks() {
		const tasks = this.task.getCurrentTasks();
		this.navigationPanel.updateTasks(tasks);
		this.taskListModal.updateTasks(tasks);
		this.grid.updateTasks(tasks);

		const bounds = this.layout.onScreenResize(this.W, this.H);
		this.taskListModal.onScreenResize(bounds.modal, bounds.unit);
	}

	visualizeTasks(result: any[]) {
		this.navigationPanel.visualizeTasks(result);
		this.taskListModal.visualizeTasks(result);
	}

	gainExperience(amount: number) {
		const requirement = 8 * this.level;

		this.experience += amount;
		if (this.experience >= requirement) {
			this.level += 1;
			this.experience -= requirement;

			this.grid.spawnLevelUpReward(this.level - 1);
			return this.gainExperience(0); // Hack to handle multi-level-up
		}

		this.statusPanel.updateExperience(this.level, this.experience, requirement);
	}

	get anyModalOpen() {
		return (
			this.settingsModal.isOpen ||
			this.taskListModal.isOpen ||
			this.itemDetailsModal.isOpen
		);
	}
}
