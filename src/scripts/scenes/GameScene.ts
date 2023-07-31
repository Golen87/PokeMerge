import { BaseScene } from "./BaseScene";
import { Grid } from "../components/Grid";
import { TaskManager } from "../components/TaskManager";
import { Map } from "../components/Map";

import { StatusPanel } from "../components/StatusPanel";
import { ItemInfoPanel } from "../components/ItemInfoPanel";
import { NavigationPanel } from "../components/NavigationPanel";

import { SettingsModal } from "../components/SettingsModal";
import { TaskListModal } from "../components/TaskListModal";
import { ItemDetailsModal } from "../components/ItemDetailsModal";

import { LayoutManager } from "../components/LayoutManager";
import { GRID_COLUMNS, GRID_ROWS, COLOR, DEPTH } from "../constants";


export class GameScene extends BaseScene {
	private grid: Grid;
	private map: Map;

	public task: TaskManager;
	public layoutManager: LayoutManager;

	public statusPanel: StatusPanel;
	public itemInfoPanel: ItemInfoPanel;
	public navigationPanel: NavigationPanel;

	public settingsModal: SettingsModal;
	public taskListModal: TaskListModal;
	public itemDetailsModal: ItemDetailsModal;

	private hintTimer: number;
	private experience: number;
	private level: number

	public GRID_SIZE;
	public CELL_SIZE;


	constructor() {
		super({key: 'GameScene'});
	}

	create(): void {
		this.cameras.main.setBackgroundColor(COLOR.BACKGROUND);
		this.fade(false, 200, 0x000000);


		this.hintTimer = 0;
		this.experience = 0;
		this.level = 1;

		this.GRID_SIZE = 148;
		this.CELL_SIZE = 138;


		this.input.on('pointerdown', () => {
			this.hintTimer = 0;
		});
		this.input.on('pointerup', () => {
			this.hintTimer = 0;
		});


		/* Layout tester */

		this.layoutManager = new LayoutManager(this);
		this.layoutManager.setDepth(DEPTH.MODAL);


		/* Grid */

		this.grid = new Grid(this, this.CX, this.CY);
		if (this.input.keyboard) {
			this.input.keyboard.on('keyup-M', () => {
				this.grid.findMove();
			});
		}
		this.grid.on("checkTasks", this.visualizeTasks, this);
		this.grid.on("experience", this.gainExperience, this);


		/* Status panel */

		this.statusPanel = new StatusPanel(this);

		this.statusPanel.on("settings", () => {
			this.settingsModal.open();
		});


		/* Item info panel */

		this.itemInfoPanel = new ItemInfoPanel(this);
		// this.itemInfoPanel.setVisible(false);

		this.itemInfoPanel.on("sell", () => {
			this.grid.sellSelected();
		}, this);
		this.itemInfoPanel.on("recharge", () => {
			this.grid.rechargeSelected();
		}, this);

		this.grid.on("selection", (item) => {
			this.itemInfoPanel.setSelected(item);
		}, this);
		this.grid.on("updateItem", (item) => {
			this.itemInfoPanel.updateItem(item);
		}, this);


		/* Navigation panel */
		this.navigationPanel = new NavigationPanel(this);

		this.navigationPanel.on("tasks", () => {
			this.taskListModal.open();
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
		}, this);

		this.taskListModal = new TaskListModal(this);
		this.taskListModal.on("completeTask", (taskChapter: string, index: number) => {
			this.grid.completeTask(index);
			this.task.completeTask(taskChapter);
		}, this);

		this.itemDetailsModal = new ItemDetailsModal(this);


		/* Task manager */

		this.task = new TaskManager(this);
		this.task.on("newTask", this.updateTasks, this);
		this.updateTasks();


		this.map = new Map(this);
		this.map.setDepth(DEPTH.MAP);


		this.gainExperience(0);

		addEventListener("resize", (event) => {
			this.onScreenResize();
		});
		this.onScreenResize();
	}

	onScreenResize() {
		// Scales the screen resolution by this variable. x2 means high quality anti aliasing
		const scale = this.settingsModal.qualityScale;
		const gameWidth = scale * window.innerWidth;
		const gameHeight = scale * window.innerHeight;
		// if (gameWidth != a.width || gameHeight != a.height) {
		this.scale.setGameSize(gameWidth, gameHeight);

		this.scale.refresh();
		setTimeout(() => { this.scale.refresh(); }, 500);


		const bounds = this.layoutManager.onScreenResize(gameWidth, gameHeight);

		this.GRID_SIZE = bounds.cellSize;
		this.CELL_SIZE = (140 / 148) * this.GRID_SIZE;

		this.grid.onScreenResize(bounds.grid, bounds.unit);
		this.map.onScreenResize(this.W, this.H);

		this.statusPanel.onScreenResize(bounds.status, bounds.unit);
		this.itemInfoPanel.onScreenResize(bounds.info, bounds.unit, bounds.isVertical);
		this.navigationPanel.onScreenResize(bounds.nav, bounds.unit, bounds.isVertical);

		this.settingsModal.onScreenResize(bounds.modal, bounds.unit);
		this.taskListModal.onScreenResize(bounds.modal, bounds.unit);
		this.itemDetailsModal.onScreenResize(bounds.modal, bounds.unit);
	}


	update(time: number, delta: number): void {
		this.grid.update(time, delta);
		this.map.update(time, delta);

		this.statusPanel.update(time, delta);
		this.itemInfoPanel.update(time, delta);
		this.navigationPanel.update(time, delta);

		this.settingsModal.update(time, delta);
		this.taskListModal.update(time, delta);
		this.itemDetailsModal.update(time, delta);


		if (!this.anyModalOpen) {
			this.hintTimer += delta/1000;
		}
		else {
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

		const bounds = this.layoutManager.onScreenResize(this.W, this.H);
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

			this.grid.spawnLevelUpReward(this.level-1);
			return this.gainExperience(0); // Hack to handle multi-level-up
		}

		this.statusPanel.updateExperience(this.level, this.experience, requirement);
	}


	get anyModalOpen() {
		return this.settingsModal.isOpen ||
			this.taskListModal.isOpen ||
			this.itemDetailsModal.isOpen;
	}
}