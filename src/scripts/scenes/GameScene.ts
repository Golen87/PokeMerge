import { BaseScene } from "./BaseScene";
import { Grid } from "../components/Grid";
import { Info } from "../components/Info";
import { TaskManager } from "../components/TaskManager";
import { Map } from "../components/Map";
import { FullscreenButton } from "../components/FullscreenButton";
import { HintButton } from "../components/HintButton";
import { ResetButton } from "../components/ResetButton";

export class GameScene extends BaseScene {
	private grid: Grid;
	private map: Map;
	public info: Info;
	public task: TaskManager;
	public fullscreenButton: FullscreenButton;
	public hintButton: HintButton;
	public resetButton: ResetButton;

	private hintTimer: number;

	constructor() {
		super({key: 'GameScene'});
	}

	create(): void {
		this.cameras.main.setBackgroundColor(0x74513E);
		this.fade(false, 200, 0x000000);


		/* Grid */

		this.grid = new Grid(this, this.CX+150, this.CY);
		this.input.keyboard.on('keyup-M', () => {
			this.grid.findMove();
		});
		this.grid.on("checkTasks", this.visualizeTasks, this);


		/* Fullscreen */

		this.fullscreenButton = new FullscreenButton(this, this.W-50-30, 50+30);

		this.fullscreenButton.on('click', () => {
			this.scale.toggleFullscreen();
			this.scale.lockOrientation("landscape");
		}, this);


		/* Hints */

		this.hintButton = new HintButton(this, this.W-50-30, 3*50+2*30);
		this.hintTimer = 0;
		this.input.on('pointerdown', () => {
			this.hintTimer = 0;
		});
		this.input.on('pointerup', () => {
			this.hintTimer = 0;
		});


		/* Reset */

		this.resetButton = new ResetButton(this, this.W-50-30, 5*50+3*30);

		this.resetButton.on('click', () => {
			if (confirm("This will erase your current progress. Are you sure?")) {
				this.grid.clearData();
			}
		}, this);


		/* Info page */

		let iw = this.grid.x - this.grid.width/2;
		let ih = 0.44 * this.H;
		let ix = iw/2;
		let iy = ih/2;
		this.info = new Info(this, ix, iy, iw, ih);

		this.info.on("sell", () => {
			this.grid.sellSelected();
		}, this);

		this.grid.on("selection", (item) => {
			this.info.setSelected(item);
		}, this);

		this.info.on("completeTask", (index: number) => {
			this.grid.completeTask(index);
			this.task.completeTask(index);
		}, this);


		/* Task manager */

		this.task = new TaskManager(this);
		this.task.on("newTask", this.updateTasks, this);
		this.updateTasks();


		this.map = new Map(this);
		this.map.setDepth(1000000);
	}

	update(time: number, delta: number): void {
		this.grid.update(time, delta);
		this.info.update(time, delta);
		this.map.update(time, delta);
		this.fullscreenButton.update(time, delta);
		this.hintButton.update(time, delta);

		this.hintTimer += delta/1000;
		if (this.hintTimer > 5.0 && this.hintButton.activated) {
			this.hintTimer = 0;
			this.grid.showHint();
		}
		// this.grid.forceMerge();
	}


	updateTasks() {
		this.info.updateTasks(this.task.tasks);
		this.grid.updateTasks(this.task.tasks);
	}

	visualizeTasks(result: any[]) {
		this.info.visualizeTasks(result);
	}
}