import { BaseScene } from "./BaseScene";
import { Grid, GridItemDrop } from "../components/Grid";
import { MainGrid } from "../components/MainGrid";
import { InventoryGrid } from "../components/InventoryGrid";
import type { Item } from "../components/Item";
import { TaskId, TaskManager } from "../components/TaskManager";
import type { TaskCheckResult } from "../components/TaskManager";
import { Map } from "../components/Map";

import { StatusPanel } from "../components/StatusPanel";
import { ItemInfoPanel } from "../components/ItemInfoPanel";
import { NavigationPanel } from "../components/NavigationPanel";

import { DEFAULT_OPTIONS, SettingsModal } from "../components/SettingsModal";
import { TaskListModal } from "../components/TaskListModal";
import { ItemDetailsModal } from "../components/ItemDetailsModal";

import { LayoutManager } from "../components/LayoutManager";
import { COLOR, DEPTH } from "../constants";
import { BlurPostFilter } from "../pipelines/BlurPostFilter";
import { itemData } from "../items";
import type { ItemCategory } from "../items";
import { SaveManager } from "../save";
import type { GameSnapshot, GameState, ItemReferenceState } from "../save";
import { setBeforeClose } from "@/utils/neu";

export class GameScene extends BaseScene {
	private state?: "grid" | "inventory" | "map";
	private ready = false;
	private resetting = false;
	private resetPromise?: Promise<boolean>;
	private grids: globalThis.Map<string, Grid>;
	private resources: Record<string, number>;
	public saveManager: SaveManager;

	private mainGrid: MainGrid;
	private inventoryGrid: InventoryGrid;
	private map: Map;
	private mapBlur: BlurPostFilter;

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
	private itemQueue: ItemReferenceState[];

	public GRID_SIZE;
	public CELL_SIZE;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.ready = false;
		this.state = undefined;
		this.input.enabled = false;
		this.saveManager = new SaveManager(() => this.serialize());
		void this.initializeGame();
	}

	private async initializeGame() {
		let save: GameState | null = null;
		try {
			save = await this.saveManager.load();
		} catch (error) {
			alert(`Failed to load your saved game: "${String(error)}"`);
		}
		if (!this.sys.isActive()) { return; }

		this.cameras.main.setBackgroundColor(COLOR.BACKGROUND);
		this.fade(false, 200, 0x000000);
		this.input.addPointer(2);

		this.hintTimer = 0;
		this.experience = save?.player.experience ?? 0;
		this.level = save?.player.level ?? 1;
		this.resources = { ...save?.player.resources };
		this.itemQueue = save?.itemQueue.map(item => ({ ...item })) ?? [];
		this.grids = new globalThis.Map();

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
		this.grids.set(this.mainGrid.id, this.mainGrid);
		this.grids.set(this.inventoryGrid.id, this.inventoryGrid);
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
		this.itemInfoPanel.on("showDetails", (category: ItemCategory) => {
			this.itemDetailsModal.setCategory(category);
			this.itemDetailsModal.open();
		});

		for (const grid of this.grids.values()) {
			grid.on("changed", () => {
				if (!this.ready || this.resetting) { return; }
				this.discoverGridItems(grid);
				this.saveManager.markDirty();
			});
			grid.on("selection", (item: Item | undefined) => {
				if (grid == this.activeGrid) {
					this.itemInfoPanel.setSelected(item);
				}
			});
			grid.on("updateItem", (item: Item) => {
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
					this.saveManager.markDirty();
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
		this.settingsModal.deserialize(save?.options ?? DEFAULT_OPTIONS);
		this.settingsModal.on("quality", this.onScreenResize, this);
		this.settingsModal.on("change", () => this.saveManager.markDirty());
		this.settingsModal.on("reset", () => { void this.resetGame(); });

		this.taskListModal = new TaskListModal(this);
		this.taskListModal.on("completeTask", (taskId: TaskId, index: number) => {
			if (this.resetting || this.task.getCurrentTasks()[index]?.id !== taskId) { return; }
			if (!this.mainGrid.completeTask(index) || !this.task.completeTask(taskId)) { return; }

			const task = this.task.getTask(taskId);
			task.reward.forEach(({ category, tier, amount }) => {
				if (!tier) {
					console.warn("Non-item reward:", category, amount);
				} else if (!itemData[category] || !itemData[category][tier - 1]) {
					console.error(`Item not found: ${category}:${tier}`);
				} else {
					for (let i = 0; i < (amount ?? 1); i++) {
						this.itemQueue.push({ category, tier });
					}
					this.navigationPanel.setQueueItem(this.itemQueue[0]);
				}
			});
			this.saveManager.markDirty();
		});

		this.itemDetailsModal = new ItemDetailsModal(this);

		/* Task manager */

		this.task = new TaskManager(this);
		this.task.deserialize(save?.completedTasks ?? []);
		this.task.on("newTask", this.updateTasks, this);

		this.map = new Map(this);
		this.map.enableFilters();
		this.mapBlur = new BlurPostFilter(this.map.filterCamera);
		this.map.filters!.external.add(this.mapBlur);
		this.map.setDepth(DEPTH.MAP_BACK);
		this.map.panCameraTo(74 + 6, 275 + 2, true);

		const now = Date.now();
		for (const grid of this.grids.values()) {
			const rows = save?.grids[grid.id];
			if (rows === undefined) {
				grid.generateNewBoard();
			} else {
				grid.deserialize(rows, now);
			}
			this.discoverGridItems(grid);
		}
		this.navigationPanel.setQueueItem(this.itemQueue[0]);
		this.updateTasks();
		this.statusPanel.updateExperience(this.level, this.experience, 8 * this.level);

		const resize = () => this.onScreenResize();
		const saveGame = () => { void this.saveManager.save(); };
		const visibility = () => { if (document.visibilityState == "hidden") { saveGame(); } };
		addEventListener("resize", resize);
		addEventListener("pagehide", saveGame);
		addEventListener("beforeunload", saveGame);
		document.addEventListener("visibilitychange", visibility);
		setBeforeClose(async () => {
			await this.resetPromise;
			await this.saveManager.save();
		});
		const cleanup = () => {
			this.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup);
			this.events.off(Phaser.Scenes.Events.DESTROY, cleanup);
			const saveManager = this.saveManager;
			void saveManager.save().finally(() => saveManager.dispose());
			this.ready = false;
			removeEventListener("resize", resize);
			removeEventListener("pagehide", saveGame);
			removeEventListener("beforeunload", saveGame);
			document.removeEventListener("visibilitychange", visibility);
			setBeforeClose(undefined);
		};
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
		this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
		this.onScreenResize();

		this.setState("grid");
		this.ready = true;
		this.input.enabled = true;
		this.saveManager.start();
		void this.saveManager.save();
	}

	private serialize(): GameSnapshot {
		return {
			grids: Object.fromEntries([...this.grids].map(([id, grid]) => [id, grid.serialize()])),
			itemQueue: this.itemQueue.map(item => ({ ...item })),
			completedTasks: this.task.serialize(),
			player: { level: this.level, experience: this.experience, resources: { ...this.resources } },
			options: this.settingsModal.serialize(),
		};
	}

	private discoverGridItems(grid: Grid) {
		let changed = false;
		grid.forEachItem(item => {
			if (!item.sightBlocked) {
				changed = this.saveManager.discover(item.category, item.tier) || changed;
			}
		});
		if (changed) {
			this.itemInfoPanel.updateInfo();
		}
	}

	private async resetGame() {
		// if (this.resetting || !confirm("This will erase your current progress. Are you sure?")) { return; }
		this.resetting = true;
		this.input.enabled = false;
		try {
			this.resetPromise = this.saveManager.reset(() => {
				this.level = 1;
				this.experience = 0;
				this.resources = {};
				this.itemQueue = [];
				this.hintTimer = 0;
				this.task.deserialize([]);
				this.settingsModal.deserialize(DEFAULT_OPTIONS);
				for (const grid of this.grids.values()) {
					grid.generateNewBoard();
					this.discoverGridItems(grid);
				}
				this.itemDetailsModal.close();
				this.taskListModal.close();
				this.settingsModal.close();
				this.navigationPanel.setQueueItem(null);
				this.updateTasks();
				this.statusPanel.updateExperience(this.level, this.experience, 8 * this.level);
				this.setState("grid");
				this.onScreenResize();
			});
			if (!await this.resetPromise) { alert("The reset could not be saved. Please check that game storage is available."); }
		} catch (error) {
			console.error("Could not reset the game.", error);
			alert("The game could not be reset. Please reload and try again.");
		} finally {
			this.resetPromise = undefined;
			this.resetting = false;
			this.input.enabled = true;
		}
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
			this.mapBlur.setActive(true);
			this.navigationPanel.setMapActive(false);
		} else {
			this.map.drawMap();
			this.map.setAlpha(1);
			this.map.setDepth(DEPTH.MAP_FRONT);
			this.mapBlur.setActive(false);
			this.navigationPanel.setMapActive(true);
		}
	}

	update(time: number, delta: number): void {
		if (!this.ready || this.resetting) { return; }
		for (const grid of this.grids.values()) { grid.update(time, delta); }

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

	visualizeTasks(result: TaskCheckResult[]) {
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
		if (amount > 0) { this.saveManager.markDirty(); }
	}

	get anyModalOpen() {
		return (
			this.settingsModal.isOpen ||
			this.taskListModal.isOpen ||
			this.itemDetailsModal.isOpen
		);
	}
}
