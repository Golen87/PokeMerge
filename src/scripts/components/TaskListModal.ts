import { GameScene } from "../scenes/GameScene";
import { Modal } from "./Modal";
import { RoundRectangle } from "./RoundRectangle";
import { TaskBox } from "./TaskBox";

export class TaskListModal extends Modal {

	private taskBoxes: TaskBox[];
	private taskCount: number;


	constructor(scene: GameScene) {
		super(scene);

		this.title.setText("Missions");


		this.taskBoxes = [];
		for (let i = 0; i < 5; i++) {
			let taskBox = new TaskBox(this.scene, 0, 0, 100, 100);

			taskBox.on("completeTask", (taskChapter) => {
				this.emit("completeTask", taskChapter, i);
			}, this);

			this.taskBoxes.push(taskBox);
			this.add(taskBox);
		}

		this.taskCount = 0;
	}


	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number) {
		this.width = bounds.width - 4*unit;
		this.height = (12 + 22*this.taskCount) * unit;

		const inner = new Phaser.Geom.Rectangle(
			bounds.centerX - this.width/2 + 4*unit,
			bounds.centerY - this.height/2 + 9*unit,
			this.width - 8*unit,
			this.height - 13*unit
		);

		const separation = 4*unit;
		const taskWidth = inner.width;
		const taskHeight = (inner.height - (this.taskCount-1) * separation) / this.taskCount;

		this.taskBoxes.forEach((box, i) => {
			box.x = inner.centerX;
			box.y = inner.top + i*taskHeight + i*separation + taskHeight/2;
			const boxBounds = new Phaser.Geom.Rectangle(-taskWidth/2, -taskHeight/2, taskWidth, taskHeight);
			box.resize(boxBounds, unit);
		});

		super.onScreenResize(bounds, unit);
	}


	update(time: number, delta: number): void {
		super.update(time, delta);

		this.taskBoxes.forEach((taskBox: TaskBox) => {
			taskBox.update(time, delta);
		});
	}


	open() {
		super.open();
	}

	close() {
		super.close();
	}


	updateTasks(tasks: any[]) {
		this.taskCount = tasks.length;

		this.taskBoxes.forEach((box, index) => {
			box.setVisible(false);

			if (index < tasks.length) {
				box.setVisible(true);
				box.setTask(tasks[index]);
			}
		});
	}

	visualizeTasks(result: any[]) {
		for (let i = 0; i < result.length; i++) {
			this.taskBoxes[i].updateTask(result[i].success, result[i].count);
		}
	}
}
