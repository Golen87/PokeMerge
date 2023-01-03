import { BaseScene } from "./BaseScene";
import { Grid } from "../components/Grid";
import { Info } from "../components/Info";
import { TaskManager } from "../components/TaskManager";
import { Map } from "../components/Map";
import { FullscreenButton } from "../components/FullscreenButton";
import { HintButton } from "../components/HintButton";
import { ResetButton } from "../components/ResetButton";
import { GRID_COLUMNS, GRID_ROWS } from "../constants";

export class GameScene extends BaseScene {
	private grid: Grid;
	private map: Map;
	public info: Info;
	public task: TaskManager;
	public fullscreenButton: FullscreenButton;
	public hintButton: HintButton;
	public resetButton: ResetButton;

	private hintTimer: number;

	private experience: number;
	private level: number

	public GRID_SIZE;
	public CELL_SIZE;

	private dirtsMaskGraphics: Phaser.GameObjects.Graphics;

	constructor() {
		super({key: 'GameScene'});
	}

	create(): void {
		this.cameras.main.setBackgroundColor(0x74513E);
		this.fade(false, 200, 0x000000);


		this.experience = 0;
		this.level = 1;

		this.GRID_SIZE = 148;
		this.CELL_SIZE = 138;


		/* Grid */

		this.grid = new Grid(this, this.CX, this.CY);
		this.input.keyboard.on('keyup-M', () => {
			this.grid.findMove();
		});
		this.grid.on("checkTasks", this.visualizeTasks, this);
		this.grid.on("experience", this.gainExperience, this);


		/* Fullscreen */

		this.fullscreenButton = new FullscreenButton(this, this.W-50-30, 50+30);
		this.fullscreenButton.setVisible(false);

		this.fullscreenButton.on('click', () => {
			this.scale.toggleFullscreen();
			// this.scale.lockOrientation("landscape");
		}, this);


		/* Hints */

		this.hintButton = new HintButton(this, this.W-50-30, 3*50+2*30);
		this.hintButton.setVisible(false);
		this.hintTimer = 0;
		this.input.on('pointerdown', () => {
			this.hintTimer = 0;
		});
		this.input.on('pointerup', () => {
			this.hintTimer = 0;
		});


		/* Reset */

		this.resetButton = new ResetButton(this, this.W-50-30, 5*50+3*30);
		this.resetButton.setVisible(false);

		this.resetButton.on('click', () => {
			if (confirm("This will erase your current progress. Are you sure?")) {
				this.grid.clearData();
			}
		}, this);


		/* Info page */

		this.info = new Info(this);
		// this.info.setVisible(false);

		this.info.on("sell", () => {
			this.grid.sellSelected();
		}, this);
		this.info.on("recharge", () => {
			this.grid.rechargeSelected();
		}, this);

		this.grid.on("selection", (item) => {
			this.info.setSelected(item);
		}, this);

		this.info.on("completeTask", (taskChapter: string, index: number) => {
			this.grid.completeTask(index);
			this.task.completeTask(taskChapter);
		}, this);


		/* Task manager */

		this.task = new TaskManager(this);
		this.task.on("newTask", this.updateTasks, this);
		this.updateTasks();


		this.map = new Map(this);
		this.map.setDepth(1000000);


		this.gainExperience(0);


		// this.scale.on('resize', this.onScreenResize, this);
		// this.scale.refresh();
		addEventListener("resize", (event) => {
			this.onScreenResize();
		});
		this.onScreenResize();

		let imageComponent = this.add.image(0, 0, "electric_4");
		imageComponent.setOrigin(0);
		this.dirtsMaskGraphics = this.add.graphics();
		// let textureData = this.textures.get(imageComponent.texture.key).source[0];
		// for (let y = 0; y < textureData.height; y++) {
		// 	for (let x = 0; x < textureData.width; x++) {
		// 		const color = this.textures.getPixel(x, y, imageComponent.texture.key);
		// 		const hexString = Phaser.Display.Color.RGBToString(color.red, color.green, color.blue, color.alpha, "0x");
		// 		// console.log(color, color.color, hexString, parseInt(hexString));

		// 		// console.log(color, color.alpha);
		// 		if (color.alpha !== 0) {
		// 			this.dirtsMaskGraphics.fillStyle(parseInt(hexString), color.alpha);
		// 			this.dirtsMaskGraphics.fillPoint(x, y);
		// 		}
		// 	}
		// }

		// this.dirtsMaskGraphics.setVisible(false);
		let mask = imageComponent.createBitmapMask();
		// imageComponent.setVisible(false);
		for (let i = 0; i<100; i++) {
			let image = this.add.image(400*Math.random(), 400*Math.random(), "electric_5");
			image.setMask(mask);
		}
		this.tweens.add({
			targets: imageComponent,
			x: { from: 0.0, to: 100.0, duration: 1000 },
			y: { from: 0.0, to: 100.0, duration: 2000 },
			ease: 'Sine.InOut',
			repeat: -1,
			yoyo: true
		});
	}

	onScreenResize() {
		const newWidth = 2*window.innerWidth;
		const newHeight = 2*window.innerHeight;
		// if (newWidth != a.width || newHeight != a.height) {
		this.scale.setGameSize(newWidth, newHeight);
		this.scale.refresh();
		// this.scale.resize(window.innerWidth, window.innerHeight);
		// this.scale.setMaxZoom();
		// }
		// if (this.W != d || this.H != e) {
			// this.scale.setGameSize(c.width, c.height);
			// this.scale.setGameSize(window.innerWidth, window.innerHeight);
			// this.scale.resize(window.innerWidth*2, window.innerHeight*2);
		// }
		// console.log('onScreenResize', window.innerWidth, window.innerHeight, this.W, this.H);

		const gridWidth = 0.96;
		const gridHeight = 0.75;
		const gridSize = Math.min(
			gridWidth * this.W / GRID_COLUMNS,
			gridHeight * this.H / GRID_ROWS
		);

		this.GRID_SIZE = gridSize;
		this.CELL_SIZE = (138 / 148) * this.GRID_SIZE;
		// 1080
		// 1920

		this.grid.onScreenResize(this.W, this.H);
		this.info.onScreenResize(this.grid.width, this.grid.height);
	}


	update(time: number, delta: number): void {
		this.grid.update(time, delta);
		this.info.update(time, delta);
		this.map.update(time, delta);
		this.fullscreenButton.update(time, delta);
		this.hintButton.update(time, delta);

		this.hintTimer += delta/1000;
		if (this.hintTimer > 3.0 && this.hintButton.activated) {
			this.hintTimer = 0;
			this.grid.showHint();
		}
		// this.grid.forceMerge();
	}


	updateTasks() {
		this.info.updateTasks(this.task.getCurrentTasks());
		this.grid.updateTasks(this.task.getCurrentTasks());
	}

	visualizeTasks(result: any[]) {
		this.info.visualizeTasks(result);
	}

	gainExperience(amount: number) {
		const requirement = 8 * this.level;

		this.experience += amount;
		if (this.experience >= requirement) {

			this.level += 1;
			this.experience -= requirement;

			this.grid.spawnLevelUpReward();
			return this.gainExperience(0); // Hack to handle multi-level-up
		}

		this.info.updateExperience(this.level, this.experience, requirement);
	}
}