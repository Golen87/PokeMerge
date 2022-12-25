import { BaseScene } from "../scenes/BaseScene";
import { randInt, weightedPick } from "../utils";


interface TaskItem {
	type: string;
	tier: number;
	count: number;
}

interface Task {
	title: string;
	items: TaskItem[];
	reward: TaskItem[];
}


const taskOdds = [
	{ odds: 900,	tier: [2,8],	type: "pokeball" },
	{ odds: 900,	tier: [2,6],	type: "potion" },
	{ odds: 700,	tier: [2,4],	type: "bulbasaur" },
	{ odds: 700,	tier: [2,5],	type: "charmander" },
	{ odds: 700,	tier: [2,4],	type: "squirtle" },
	{ odds: 600,	tier: [2,7],	type: "eevee" },
	{ odds: 500,	tier: [2,9],	type: "fossil" },
	{ odds: 500,	tier: [2,8],	type: "stone" },
	{ odds: 400,	tier: [2,5],	type: "drink" },
	{ odds: 300,	tier: [2,8],	type: "electric" },
	{ odds: 300,	tier: [2,5],	type: "rotom" },
	{ odds: 100,	tier: [2,10],	type: "legendary" },
	// { odds: 100,	tier: [2,-],	type: "unown" },
	// { odds: 100,	tier: [2,-],	type: "berry" },
	// { odds: 100,	tier: [2,-],	type: "weatherRock" },
];

const rewardOdds = [
	{ odds: 100,	tier: [1,1],	type: "gift" },
	// { odds: 100,	tier: [1,2],	type: "mart" },
	// { odds: 100,	tier: [1,2],	type: "ruin" },
	// { odds: 100,	tier: [1,2],	type: "construction" },
];


export class TaskManager extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	public tasks: Task[];
	private history: string[];
	private taskCount: number;

	constructor(scene: BaseScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.tasks = []
		this.history = ["drink", "fossil", "stone"];
		this.taskCount = 1;

		for (let i = 0; i < this.MAX_TASKS; i++) {
			this.newTask();
		}
	}


	newItem(): TaskItem {
		let task = weightedPick(taskOdds);
		let tries = 0;
		while (this.history.includes(task.type) && tries-- < 100) {
			task = weightedPick(taskOdds);
		}
		if (this.history.length >= 4) {
			this.history.shift();
		}
		this.history.push(task.type);

		// let rand = Math.pow(Math.random(), 2);
		// let low = task.tier[0];
		// let high = task.tier[1];
		// let tier = Math.floor(low + rand * (high - low + 1));
		let low = task.tier[0];
		let len = task.tier[1] - low;
		let cand: any[] = [];
		for (let i = 0; i < len; i++) {
			cand.push({
				odds: Phaser.Math.Easing.Cubic.Out(1 - i / (len)),
				tier: low + i
			});
		}
		let tier = weightedPick(cand).tier;

		return {
			type: task.type,
			tier,
			count: Math.random() < 0.8 ? 1 : 2,
		};
	}

	newReward(): TaskItem {
		let reward = weightedPick(rewardOdds);
		let tries = 0;

		let rand = Math.pow(Math.random(), 2);
		let low = reward.tier[0];
		let high = reward.tier[1];
		let tier = Math.floor(low + rand * (high - low + 1));

		return {
			type: reward.type,
			tier,
			// count: Math.random() < 0.5 ? 1 : 2,
			count: 1,
		};
	}

	newTask() {
		let task: Task = {
			title: `Task ${this.taskCount++}`,
			items: [],
			reward: [],
		};

		for (let i = 0; i < randInt(1,3); i++) {
			task.items.push(this.newItem());
		}

		for (let i = 0; i < randInt(1,1); i++) {
			task.reward.push(this.newReward());
		}

		this.tasks.push(task);
		return task;
	}

	completeTask(i: number) {
		this.tasks.splice(i, 1);
		this.newTask();
		this.emit("newTask");
	}


	public get MAX_TASKS(): number {
		return 3;
	}

	// public static get TYPES(): string[] {}
}