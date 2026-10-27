import { BaseScene } from "./BaseScene";
import { Grid, GridItemDrop } from "../components/Grid";
import { MainGrid } from "../components/MainGrid";
import { InventoryGrid } from "../components/InventoryGrid";
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
	private state: "grid" | "inventory" | "map";

	private mainGrid: MainGrid;
	private inventoryGrid: InventoryGrid;
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
		this.input.addPointer(2);

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

		this.mainGrid = new MainGrid(this, this.CX, this.CY);
		this.inventoryGrid = new InventoryGrid(this, this.CX, this.CY);
		this.inventoryGrid.setVisible(false);
		this.inventoryGrid.setDepth(DEPTH.GRID);
		if (this.input.keyboard) {
			this.input.keyboard.on("keyup-M", () => {
				this.activeGrid.findMove();
			});
		}
		this.mainGrid.setDepth(DEPTH.GRID);
		this.mainGrid.on("checkTasks", this.visualizeTasks, this);
		this.mainGrid.on("experience", this.gainExperience, this);
		this.inventoryGrid.on("experience", this.gainExperience, this);

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
			this.activeGrid.sellSelected();
		});
		this.itemInfoPanel.on("recharge", () => {
			this.activeGrid.rechargeSelected();
		});
		this.itemInfoPanel.on("showDetails", (category: string) => {
			this.itemDetailsModal.setCategory(category);
			this.itemDetailsModal.open();
		});

		for (const grid of [this.mainGrid, this.inventoryGrid]) {
			grid.on("selection", (item) => {
				if (grid == this.activeGrid) {
					this.itemInfoPanel.setSelected(item);
				}
			});
			grid.on("updateItem", (item) => {
				if (grid == this.activeGrid) {
					this.itemInfoPanel.updateItem(item);
				}
			});
			grid.on("itemDrop", (drop: GridItemDrop) => {
				if (grid != this.activeGrid || this.state == "map") { return; }
				if (this.anyModalOpen || this.navigationPanel.isInventoryDropTarget(drop.position)) {
					drop.handled = true;
					const target = grid == this.mainGrid ? this.inventoryGrid : this.mainGrid;
					if (this.anyModalOpen || !grid.transferItem(drop.item, target)) {
						drop.item.place(drop.item.slot, grid.toCoords(drop.item.slot));
						grid.updateCellColors();
					}
				}
			});
		}

		/* Navigation panel */
		this.navigationPanel = new NavigationPanel(this);
		this.navigationPanel.setDepth(DEPTH.NAVIGATION);

		this.navigationPanel.on("tasks", () => {
			if (this.taskListModal.isOpen) {
				this.taskListModal.close();
			} else {
				this.taskListModal.open();
			}
		});

		this.navigationPanel.on("queue", () => {
			if (this.anyModalOpen || this.state == "map") { return; }
			const slot = this.activeGrid.getRandomFreeSlot();
			const item = this.itemQueue[0];
			if (slot && item) {
				const newItem = this.activeGrid.createItem(
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

					this.navigationPanel.setQueueItem(this.itemQueue[0]);
				}
			}
		});

		this.navigationPanel.on("inventory", () => {
			if (this.anyModalOpen) { return; }
			this.setState(this.state == "inventory" ? "grid" : "inventory");
		});

		this.navigationPanel.on("map", () => {
			if (this.anyModalOpen) { return; }
			if (this.state == "map") {
				this.setState("grid");
			} else {
				this.setState("map");
			}
		});

		/* Modals */

		this.settingsModal = new SettingsModal(this);
		this.settingsModal.on("quality", this.onScreenResize, this);
		this.settingsModal.on("reset", () => {
			if (confirm("This will erase your current progress. Are you sure?")) {
				this.mainGrid.clearData();
				this.inventoryGrid.generateNewBoard();
				this.settingsModal.close();
				this.onScreenResize();
			}
		});

		this.taskListModal = new TaskListModal(this);
		this.taskListModal.on("completeTask", (taskId: TaskId, index: number) => {
			this.mainGrid.completeTask(index);
			this.task.completeTask(taskId);

			const task = this.task.getTask(taskId);
			task.reward.forEach(({ category, tier, amount }) => {
				if (!tier) {
					console.warn("Non-item reward:", category, amount);
				} else if (!itemData[category] || !itemData[category][tier - 1]) {
					console.error(`Item not found: ${category}:${tier}`);
				} else {
					this.itemQueue.push({ category, tier });
					this.navigationPanel.setQueueItem(this.itemQueue[0]);
				}
			});
		});

		this.itemDetailsModal = new ItemDetailsModal(this);

		/* Task manager */

		this.task = new TaskManager(this);
		this.task.on("newTask", this.updateTasks, this);
		this.updateTasks();

		this.map = new Map(this);
		this.map.setDepth(DEPTH.MAP_BACK);
		this.map.panCameraTo(74 + 6, 275 + 2, true);

		this.gainExperience(0);

		addEventListener("resize", (event) => {
			this.onScreenResize();
		});
		this.onScreenResize();

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

		this.mainGrid.onScreenResize(bounds.grid, bounds.unit);
		this.inventoryGrid.onScreenResize(bounds.grid, bounds.unit);
		this.map.onScreenResize(this.W, this.H);

		this.statusPanel.onScreenResize(bounds.status, bounds.unit);
		const infoIsVertical = this.layout.isSquare || this.layout.isPortrait;
		const navIsVertical = this.layout.isPortrait;
		this.itemInfoPanel.onScreenResize(bounds.info, bounds.unit, infoIsVertical);
		this.navigationPanel.onScreenResize(bounds.nav, bounds.unit, navIsVertical);

		this.settingsModal.onScreenResize(bounds.modal, bounds.unit);
		this.taskListModal.onScreenResize(bounds.modal, bounds.unit);
		this.itemDetailsModal.onScreenResize(bounds.modal, bounds.unit);
	}

	get activeGrid(): Grid {
		return this.state == "inventory" ? this.inventoryGrid : this.mainGrid;
	}

	setState(state: "grid" | "inventory" | "map") {
		const previousState = this.state;
		this.state = state;
		this.hintTimer = 0;
		this.itemInfoPanel.setSelected(undefined);
		this.mainGrid.setVisible(state == "grid");
		this.inventoryGrid.setVisible(state == "inventory");
		this.navigationPanel.setInventoryActive(state == "inventory");

		// Initialize once, then update the map only when entering or leaving its view.
		if (previousState !== undefined && (previousState == "map") == (state == "map")) {
			return;
		}

		if (state != "map") {
			this.map.setAlpha(0.5);
			this.map.setDepth(DEPTH.MAP_BACK);
			this.map.setPostPipeline(BlurPostFilter);
			this.navigationPanel.setMapActive(false);
		} else {
			this.map.drawMap();
			this.map.setAlpha(1);
			this.map.setDepth(DEPTH.MAP_FRONT);
			this.map.resetPostPipeline();
			this.navigationPanel.setMapActive(true);
		}
	}

	update(time: number, delta: number): void {
		this.mainGrid.update(time, delta);
		this.inventoryGrid.update(time, delta);

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

			if (this.settingsModal.hintsEnabled && this.state != "map") {
				this.activeGrid.showHint();
			}
			if (this.navigationPanel.hasTaskCompleted) {
				this.navigationPanel.showHint();
			}
		}
		// this.mainGrid.forceMerge();
	}

	updateTasks() {
		const tasks = this.task.getCurrentTasks();
		this.navigationPanel.updateTasks(tasks);
		this.taskListModal.updateTasks(tasks);
		this.mainGrid.updateTasks(tasks);

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

			this.mainGrid.spawnLevelUpReward(this.level - 1);
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
