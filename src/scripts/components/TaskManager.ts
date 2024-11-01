import { itemData } from "../items";
import { GameScene } from "../scenes/GameScene";

export type TaskId = string;

export interface TaskItem {
	category: string;
	tier: number;
	amount?: number;
}

export interface TaskReward {
	category: string;
	tier?: number;
	amount?: number;
}

export interface Task {
	id: TaskId;
	unlocks?: TaskId[];
	name: string;
	location: string;
	items: TaskItem[];
	reward: TaskReward[];
}

const taskList: { [key in TaskId]: Task } = {
	"0a": {
		id: "0a",
		name: "Collect rope",
		location: "Steep slope",
		items: [{ category: "potion", tier: 3 }],
		reward: [{ category: "experience", amount: 5 }],
		unlocks: ["0b"],
	},
	"0b": {
		id: "0b",
		name: "Get through the thicket",
		location: "Obstruction in the woods",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", amount: 5 }],
		unlocks: ["0c"],
	},
	"0c": {
		id: "0c",
		name: "Make a path through the swamps",
		location: "Swamp",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", amount: 5 }],
		unlocks: ["0d"],
	},
	"0d": {
		id: "0d",
		name: "Build the bridge's foundation",
		location: "Broken bridge",
		items: [{ category: "potion", tier: 3 }],
		reward: [{ category: "experience", amount: 5 }],
		unlocks: ["0e"],
	},
	"0e": {
		id: "0e",
		name: "Finish the bridge",
		location: "Broken bridge",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", amount: 5 }],
		unlocks: ["0f"],
	},
	"0f": {
		id: "0f",
		name: "Chop firewood",
		location: "Camp",
		items: [{ category: "pokeball", tier: 4 }],
		reward: [{ category: "experience", amount: 5 }],
		unlocks: ["0g"],
	},
	"0g": {
		id: "0g",
		name: "Repair the drawbridge",
		location: "Fortress gates",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [
			{ category: "simple_chest_a", tier: 1 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["0h"],
	},
	"0h": {
		id: "0h",
		name: "Clean the walls",
		location: "Castle",
		items: [{ category: "pokeball", tier: 4 }],
		reward: [{ category: "experience", amount: 10 }],
		unlocks: ["0i"],
		// This task should trigger a LEVEL UP
	},
	"0i": {
		id: "0i",
		name: "Repair the walls",
		location: "Castle",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", amount: 10 }],
		unlocks: ["0j"],
	},
	"0j": {
		id: "0j",
		name: "Fortify the castle",
		location: "Castle",
		items: [{ category: "potion", tier: 3 }],
		reward: [{ category: "experience", amount: 10 }],
		unlocks: ["0k"],
	},
	"0k": {
		id: "0k",
		name: "Repair the castle",
		location: "Castle",
		items: [{ category: "pokeball", tier: 7 }],
		reward: [{ category: "experience", amount: 10 }],
		unlocks: ["1a1"],
		// (Slottet byggs färdigt)
	},
};

export class TaskManager extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private currentTasks: string[];

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.verifyTaskList();

		this.currentTasks = ["1a1"];
	}

	getCurrentTasks(): Task[] {
		return this.currentTasks.map((taskName) => taskList[taskName]);
	}

	getTask(taskId: TaskId): Task {
		return taskList[taskId];
	}

	completeTask(taskId: TaskId): void {
		const task = taskList[taskId];

		this.currentTasks = this.currentTasks.filter(
			(taskName) => taskName !== taskId
		);
		this.currentTasks.push(...(task.unlocks || []));

		this.emit("newTask");
	}

	// Verify that tasks are correctly defined
	verifyTaskList(): void {
		const taskIds = Object.keys(taskList);
		for (const taskId of taskIds) {
			const task = taskList[taskId];

			// Check that task key and id match
			console.assert(task.id === taskId, `Task id mismatch: ${taskId}`);

			if (task.unlocks) {
				// Check that all unlocked tasks exist
				task.unlocks.forEach((otherId) => {
					console.assert(
						taskIds.includes(otherId),
						`Task ${taskId} unlocks non-existent task ${otherId}`
					);
				});

				// Check that no task unlocks itself
				console.assert(
					!task.unlocks.includes(taskId),
					`Task ${taskId} unlocks itself`
				);
			}

			// Check that task items are valid
			task.items.forEach((item) => {
				console.assert(
					itemData[item.category],
					`Task ${taskId} references non-existent item "${item.category}"`
				);
			});

			// Check that task rewards are valid
			task.reward.forEach((reward) => {
				console.assert(
					itemData[reward.category],
					`Task ${taskId} references non-existent reward "${reward.category}"`
				);
			});
		}
	}
}
