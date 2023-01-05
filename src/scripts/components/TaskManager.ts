import { BaseScene } from "../scenes/BaseScene";
import { randInt, weightedPick } from "../utils";


interface TaskItem {
	category: string;
	tier: number;
	amount?: number;
}

interface Task {
	title?: string;
	items: TaskItem[];
	reward: TaskItem[];
	unlock?: string[];
	chapter?: string;
}

const storyChapters: {[key: string]: Task[]} = {
	"Acre Country": [
		{ // 4a
			title: "New Route", // New Orchard
			items: [ { category: "pokeball", tier: 4 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 3a
			title: "Sweet Catch!", // Sweet Apple!
			items: [ { category: "pokeball", tier: 3 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 2b
			title: "Heal Up!", // Chop Chop! (1)
			items: [ { category: "potion", tier: 2 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 5a
			title: "Catch More!", // Deliver Peaches! (1)
			items: [ { category: "pokeball", tier: 5 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 3a + 2a
			title: "Pokeball Craze", // Fruit Craze
			items: [ { category: "pokeball", tier: 3 }, { category: "pokeball", tier: 2 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 3b
			title: "Take A Break", // Repair the Roof
			items: [ { category: "potion", tier: 3 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 4a
			title: "New Encounter", // Juicy Pears!
			items: [ { category: "pokeball", tier: 4 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 5a
			title: "Catch More!", // Deliver Peaches! (2)
			items: [ { category: "pokeball", tier: 5 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
			// xp-merging explained
			// 8/8 xp
			// level up
		},
		{ // 3b + 5a
			title: "Long Battle", // Fix the Farm!
			items: [ { category: "potion", tier: 3 }, { category: "pokeball", tier: 5 } ],
			reward: [ { category: "experience", tier: 2 }, { category: "mayor", tier: 1 } ],
			unlock: [ "Tool Factory" ],
			// 2 xp
			// 1 mayor
			// Acre Country 1/15 complete
			// "Fix The farm!" complete
			// "Chop chop!" is locked
		},
		{ // 5a
			title: "Catching Time!", // Sweet!
			items: [ { category: "pokeball", tier: 5 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 4b
			title: "Stay Healthy", // Deliver Supplies
			items: [ { category: "potion", tier: 4 } ],
			reward: [ { category: "experience", tier: 2 } ],
			// 2 xp
		},
		{ // 6a
			title: "Tricky Encounter!", // Vitamins for Citizens!
			items: [ { category: "pokeball", tier: 6 } ],
			reward: [ { category: "experience", tier: 3 } ], // Wrong xp
			// 3 xp
		},
		{ // 4b
			title: "Recover", // A New Silo
			items: [ { category: "potion", tier: 4 } ],
			reward: [ { category: "experience", tier: 3 }, { category: "martChest", tier: 1 } ], // Wrong xp
			// 3 xp
			// FARM BOX lvl 1
		},
		// Fix the farm, here
		{ // 8a
			title: "Legendary Catch!", // Healthy Energy!
			items: [ { category: "pokeball", tier: 8 } ],
			reward: [ { category: "experience", tier: 4 } ],
			// 8 xp
		},
		{ // 2b + 4b
			title: "Heal Up!", // Chop Chop! (2)
			items: [ { category: "potion", tier: 2 }, { category: "potion", tier: 4 } ],
			reward: [ { category: "experience", tier: 3 } ], // Wrong xp
			unlock: [ "Acre Country Landmark Upgrade" ],
			// 3 xp
			// 1 mayor
			// Cutscene, Acre Country Landmark Upgrade, 2/15
			// Acre Country Landmark Upgrade (lvl 1/9)
			// Blue checkmark
			// Acre Country Landmark Upgrade
		},
	],

	"Tool Factory": [
		// "Unlock new area" button
		{ // 3a + 4a
			title: "New Route", // Hungry Workers!
			items: [ { category: "pokeball", tier: 3 }, { category: "pokeball", tier: 4 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 4b
			title: "In Need of Support", // In Need of Support
			items: [ { category: "potion", tier: 4 } ],
			reward: [ { category: "ruin", tier: 1 }, { category: "experience", tier: 3 } ], // Wrong xp
			// D1
			// 3 xp
		},
		{ // 3d + 1e
			title: "Explore Cave", // Restock
			items: [ { category: "fossil", tier: 3 }, { category: "stone", tier: 1 } ],
			reward: [ { category: "ruinChest", tier: 1 }, { category: "experience", tier: 1 }, { category: "mayor", tier: 1 } ],
			// Factory box (lvl 1)
			// 1 xp
			// 1 mayor
			// City Reward 1 unlocked, daily
		},
		{ // 2e
			title: "Interesting Find!", // Safety First!
			items: [ { category: "stone", tier: 2 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 5d
			title: "Clean Up Rubble", // Stack Roof Tiles
			items: [ { category: "fossil", tier: 5 } ],
			reward: [ { category: "experience", tier: 3 } ], // Wrong xp
			// 3 xp
		},
		{ // 3e
			title: "Shocking Discovery!", // Clear Rubbles!
			items: [ { category: "stone", tier: 3 } ],
			reward: [ { category: "experience", tier: 3 } ], // Wrong xp
			// 3 xp
		},
		{ // 6d
			title: "Digging Further", // Up and Running
			items: [ { category: "fossil", tier: 6 } ],
			reward: [ { category: "experience", tier: 4 }, { category: "mayor", tier: 1 } ], // Wrong xp
			// 5 xp
			// 1 mayor
			// (first bubble item appears)
		},
		{ // 4e
			title: "Shiny Gem!", // Security Perimeter
			items: [ { category: "stone", tier: 4 } ],
			reward: [ { category: "experience", tier: 4 }, { category: "ruinChest", tier: 1 } ], // Wrong chest
			// 8 xp
			// Factory box (lvl 1)
		},
		{ // 8d
			title: "Tough Boulder!", // Tile Time
			items: [ { category: "fossil", tier: 8 } ],
			reward: [ { category: "experience", tier: 3 }, { category: "experience", tier: 4 }, { category: "mayor", tier: 1 } ],
			unlock: [ "Market", "Tool Factory Landmark Upgrade" ],
			// 12 xp
			// 1 mayor
		},
	],

	"Market": [
		{ // 2e + 4a
			title: "New Route", // Safety First
			items: [ { category: "stone", tier: 2 }, { category: "pokeball", tier: 4 } ],
			reward: [ { category: "construction", tier: 1 }, { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 3e + 3k
			title: "Drink Time!", // Clear the Planks
			items: [ { category: "stone", tier: 3 }, { category: "drink", tier: 3 } ],
			reward: [ { category: "experience", tier: 2 } ],
			// 3 xp
		},
		{ // 3e + 3a
			title: "New Catch!", // Healthy Setup!
			items: [ { category: "stone", tier: 3 }, { category: "pokeball", tier: 3 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 3e + 3kx2
			title: "Refreshener", // Old Fence
			items: [ { category: "stone", tier: 3 }, { category: "drink", tier: 3, amount: 2 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 1dx2 + 2dx2
			title: "Bedrock", // Asphalt Bed
			items: [ { category: "fossil", tier: 1, amount: 2 }, { category: "fossil", tier: 2, amount: 2 } ],
			reward: [ { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 5k + 3e
			title: "Juicy!", // Work It Out!
			items: [ { category: "drink", tier: 5 }, { category: "stone", tier: 3 } ],
			reward: [ { category: "boxFullOfTools", tier: 1 }, { category: "experience", tier: 1 } ],
			// 1 xp
		},
		{ // 3dx2 + 5k
			title: "Soak It Up", // Pothole Fix
			items: [ { category: "fossil", tier: 3, amount: 2 }, { category: "drink", tier: 4 } ],
			reward: [ { category: "vending", tier: 1 }, { category: "experience", tier: 1 }, { category: "mayor", tier: 1 } ],
			// 1 xp
		},
		{ // 7k
			title: "Exotic Break!", // First Delivery Bike
			items: [ { category: "drink", tier: 6 } ],
			reward: [ { category: "experience", tier: 2 } ],
			// 2 xp
		},
		/*
		{ // 
			title: "", // hahaha
			items: [ { category: "", tier:  }, { category: "", tier:  } ],
			reward: [ { category: "experience", tier:  } ],
			//  xp
		},
		*/
	],

	"Acre Country Landmark Upgrade": [
		{ // 4b + 6a + 15s + 30 coins - 1 mayor
			title: "Bonus Mission 1",
			items: [ { category: "potion", tier: 4 }, { category: "pokeball", tier: 6 } ],
			reward: [ { category: "mayor", tier: 1 }, { category: "experience", tier: 4 } ],
		},
		{ // 7d + 4e(x2) + 5m + 55 coins - 1 mayor
			title: "Bonus Mission 2",
			items: [ { category: "fossil", tier: 7 }, { category: "stone", tier: 4, amount: 2 } ],
			reward: [ { category: "mayor", tier: 1 }, { category: "experience", tier: 4 } ],
		},
		{ // 7k + 6e + 30m + 85 coins - 1 mayor
			title: "Bonus Mission 3",
			items: [ { category: "drink", tier: 7 }, { category: "stone", tier: 6 } ],
			reward: [ { category: "mayor", tier: 1 }, { category: "experience", tier: 4 } ],
		},
		// { // 4bx2 + 9a + 1h + 110 coins - 1 mayor
			// title: "", // LV4
			// items: [ { category: "", tier: 0 }, { category: "", tier: 0, amount: 2 } ],
			// reward: [ { category: "mayor", tier: 1 }, { category: "experience", tier: 4 } ],
		// },
		// 9dx2 + 4l(5) + 4h + 140 coins - 1 mayor
		// 8g + 5h + 8h + 165 coins - 1 mayor
		// 7tx2 + 6kx2 + 12h + 195 coins - 1 mayor
		// 10a + 8q + 16h + 220 coins - 1 mayor
		// 10q + 7r + 1d + 250 coins - 5 mayor
	],

	"Tool Factory Landmark Upgrade": [
		{ // 4b + 8d + 5m + 55 coins - 1 mayor point
			title: "Bonus Mission 1",
			items: [ { category: "potion", tier: 4 }, { category: "fossil", tier: 8 } ],
			reward: [ { category: "mayor", tier: 1 }, { category: "experience", tier: 5 } ],
		},
		{ // 7a + 7kx2 + 30m + 110 coins - 1 mayor point
			title: "Bonus Mission 2",
			items: [ { category: "pokeball", tier: 7 }, { category: "drink", tier: 5, amount: 2 } ],
			reward: [ { category: "mayor", tier: 1 }, { category: "experience", tier: 5 } ],
		},
		{ // 5ex2 + 9dx2 + 1h + 160 coins - 1 mayor point
			title: "Bonus Mission 3",
			items: [ { category: "stone", tier: 5, amount: 2 }, { category: "fossil", tier: 9, amount: 2 } ],
			reward: [ { category: "mayor", tier: 1 }, { category: "experience", tier: 5 } ],
		},
	],
};


export class TaskManager extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	// public tasks: Task[];
	// private history: string[];
	// private taskCount: number;
	private storyProgressIndex: {[key: string]: number};

	constructor(scene: BaseScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		// Stories
		this.storyProgressIndex = {};
		Object.keys(storyChapters).forEach(chapterName => {
			this.storyProgressIndex[chapterName] = -1;

			storyChapters[chapterName].forEach(task => {
				task.chapter = chapterName;
				task.items.forEach(taskItem => {
					taskItem.amount = taskItem.amount || 1;
				});
				task.reward.forEach(taskItem => {
					taskItem.amount = taskItem.amount || 1;
				});
			});
		});
		this.storyProgressIndex["Acre Country"] = 0;

		// this.tasks = []
		// this.history = ["drink", "fossil", "stone"];
		// this.taskCount = 1;

		// for (let i = 0; i < this.MAX_TASKS; i++) {
			// this.newTask();
		// }
	}


	/*
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
	*/

	getCurrentTasks() {
		let tasks: any[] = [];

		Object.keys(this.storyProgressIndex).forEach(chapterName => {
			const index = this.storyProgressIndex[chapterName];
			if (index >= 0 && index < storyChapters[chapterName].length) {
				tasks.push(storyChapters[chapterName][index]);
			}
		});

		return tasks;
	}

	completeTask(chapterName: string) {
		const taskIndex = this.storyProgressIndex[chapterName];
		const task = storyChapters[chapterName][taskIndex];

		this.storyProgressIndex[chapterName] += 1;
		// if (this.storyProgressIndex[chapterName] >= storyChapters[chapterName].length) {
		if (task.unlock) {
			task.unlock.forEach(newChapterName => {
				this.storyProgressIndex[newChapterName] = 0;
			});
		}
		// }

		this.emit("newTask");
	}
}