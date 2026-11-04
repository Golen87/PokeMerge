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

import { SettingsModal } from "../components/SettingsModal";
import { TaskListModal } from "../components/TaskListModal";
import { ItemDetailsModal } from "../components/ItemDetailsModal";

import { LayoutManager } from "../components/LayoutManager";
import { COLOR, DEPTH } from "../constants";
import { BlurPostFilter } from "../pipelines/BlurPostFilter";
import { itemData } from "../items";
import type { ItemCategory } from "../items";
import { gameState } from "../GameState";
import type { GameComponentSnapshot, OptionsState, SavedGameState } from "../save";
import { setBeforeClose } from "@/utils/neu";

export class GameScene extends BaseScene {
	private state?: "grid" | "inventory" | "map";
	private ready = false;
	private resetting = false;
	private grids: globalThis.Map<string, Grid>;

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

	private hintTimer = 0;

	public GRID_SIZE = 148;
	public CELL_SIZE = 138;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.ready = false;
		this.state = undefined;
		this.input.enabled = false;
		this.initializeGame();
		void this.loadGame();
	}

	private initializeGame() {
		this.cameras.main.setBackgroundColor(COLOR.BACKGROUND);
		this.fade(false, 200, 0x000000);
		this.input.addPointer(2);

		this.grids = new globalThis.Map();

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
		this.mainGrid.on("experience", gameState.gainExperience, gameState);
		this.inventoryGrid.on("experience", gameState.gainExperience, gameState);
		gameState.on("levelUp", (level: number) => this.mainGrid.spawnLevelUpReward(level - 1));

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
				gameState.dirty();
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
			const item = gameState.nextQueuedItem;
			if (slot && item) {
				const newItem = this.activeGrid.createItem(
					slot.x,
					slot.y,
					item.category,
					item.tier
				);
				if (newItem) {
					gameState.dequeueItem();

					const pos = this.navigationPanel.getQueueItemPosition();
					newItem.x = pos.x;
					newItem.y = pos.y;
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
		gameState.on("optionsChanged", (options: Partial<OptionsState>) => {
			if (options.qualityIndex !== undefined && this.ready && !this.resetting) {
				this.onScreenResize();
			}
		});
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
					gameState.enqueueItem({ category, tier }, amount ?? 1);
				}
			});
		});

		this.itemDetailsModal = new ItemDetailsModal(this);

		/* Task manager */

		this.task = new TaskManager(this);
		this.task.on("newTask", this.updateTasks, this);

		this.map = new Map(this);
		this.map.enableFilters();
		this.mapBlur = new BlurPostFilter(this.map.filterCamera);
		// this.map.filters!.external.add(this.mapBlur);
		this.map.setDepth(DEPTH.MAP_BACK);
		this.map.panCameraTo(74 + 6, 275 + 2, true);

		const resize = () => this.onScreenResize();
		addEventListener("resize", resize);
		setBeforeClose(async () => {
			await gameState.save();
		});
		const cleanup = () => {
			this.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup);
			this.events.off(Phaser.Scenes.Events.DESTROY, cleanup);
			void gameState.dispose();
			this.ready = false;
			removeEventListener("resize", resize);
			setBeforeClose(undefined);
		};
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
		this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
	}

	private async loadGame() {
		let save: SavedGameState | null = null;
		try {
			save = await gameState.load();
		} catch (error) {
			alert(`Failed to load your saved game: "${String(error)}"`);
		}
		if (!this.sys.isActive()) { return; }

		if (save) {
			this.deserialize(save);
		} else {
			for (const grid of this.grids.values()) {
				grid.generateNewBoard();
			}
		}
		for (const grid of this.grids.values()) {
			this.discoverGridItems(grid);
		}
		this.updateTasks();
		this.onScreenResize();

		this.setState("grid");
		this.ready = true;
		this.input.enabled = true;

		gameState.setCaptureCallback(() => this.serialize());
		gameState.start();
		void gameState.save();
	}

	private serialize(): GameComponentSnapshot {
		return {
			grids: Object.fromEntries([...this.grids].map(([id, grid]) => [id, grid.serialize()])),
		};
	}

	private deserialize(data: GameComponentSnapshot) {
		const now = Date.now();
		for (const grid of this.grids.values()) {
			const rows = data.grids[grid.id];
			if (rows === undefined) {
				grid.generateNewBoard();
			} else {
				grid.deserialize(rows, now);
			}
		}
	}

	private discoverGridItems(grid: Grid) {
		grid.forEachItem(item => {
			if (!item.sightBlocked) {
				gameState.discover(item.category, item.tier);
			}
		});
	}

	private async resetGame() {
		if (this.resetting) { return; }
		this.resetting = true;
		this.input.enabled = false;
		try {
			await gameState.reset(() => {
				this.hintTimer = 0;
				for (const grid of this.grids.values()) {
					grid.generateNewBoard();
					this.discoverGridItems(grid);
				}
				this.itemDetailsModal.close();
				this.taskListModal.close();
				this.settingsModal.close();
				this.updateTasks();
				this.setState("grid");
				this.onScreenResize();
			});
		} catch (error) {
			console.error("Could not reset the game.", error);
			alert("The game could not be reset. Please reload and try again.");
		} finally {
			this.resetting = false;
			this.input.enabled = true;
		}
	}

	onScreenResize() {
		// Scales the screen resolution by this variable. x2 means high quality anti aliasing
		const scale = gameState.qualityScale;
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
		this.itemInfoPanel.onScreenResize(bounds.info, bounds.unit, infoIsVertical);
		this.resizeNavigationPanel(bounds);

		this.settingsModal.onScreenResize(bounds.modal, bounds.unit);
		this.taskListModal.onScreenResize(bounds.modal, bounds.unit);
		this.itemDetailsModal.onScreenResize(bounds.modal, bounds.unit);
	}

	private resizeNavigationPanel(bounds = this.layout.onScreenResize(this.W, this.H)) {
		const isMap = this.state == "map";
		this.navigationPanel.onScreenResize(
			isMap ? bounds.mapNav : bounds.nav,
			bounds.unit,
			isMap || this.layout.isPortrait
		);
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
			// this.mapBlur.setActive(true);
		} else {
			this.map.drawMap();
			this.map.setAlpha(1);
			this.map.setDepth(DEPTH.MAP_FRONT);
			// this.mapBlur.setActive(false);
		}
		this.navigationPanel.setMapActive(state == "map");
		this.resizeNavigationPanel();
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

			if (gameState.hintsEnabled && this.state != "map") {
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

	get anyModalOpen() {
		return (
			this.settingsModal.isOpen ||
			this.taskListModal.isOpen ||
			this.itemDetailsModal.isOpen
		);
	}
}
