import { GameScene } from "../scenes/GameScene";
import { randInt, weightedPick } from "../utils";

export type TaskId =
	| "0a"
	| "0b"
	| "0c"
	| "0d"
	| "0e"
	| "0f"
	| "0g"
	| "0h"
	| "0i"
	| "0j"
	| "0k";

export interface TaskItem {
	category: string;
	tier: number;
	amount?: number;
}

export interface Task {
	id: TaskId;
	unlocks?: TaskId[];
	name: string;
	location: string;
	items: TaskItem[];
	reward: TaskItem[];
}

const taskList: { [key in TaskId]: Task } = {
	"0a": {
		id: "0a",
		name: "Collect rope",
		location: "Steep slope",
		items: [{ category: "potion", tier: 3 }],
		reward: [{ category: "experience", tier: 3 }], // 5 XP (tier 3)
		unlocks: ["0b"],
	},
	"0b": {
		id: "0b",
		name: "Get through the thicket",
		location: "Obstruction in the woods",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", tier: 3 }], // 5 XP (tier 3)
		unlocks: ["0c"],
	},
	"0c": {
		id: "0c",
		name: "Make a path through the swamps",
		location: "Swamp",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", tier: 3 }], // 5 XP (tier 3)
		unlocks: ["0d"],
	},
	"0d": {
		id: "0d",
		name: "Build the bridge's foundation",
		location: "Broken bridge",
		items: [{ category: "potion", tier: 3 }],
		reward: [{ category: "experience", tier: 3 }], // 5 XP (tier 3)
		unlocks: ["0e"],
	},
	"0e": {
		id: "0e",
		name: "Finish the bridge",
		location: "Broken bridge",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", tier: 3 }], // 5 XP (tier 3)
		unlocks: ["0f"],
	},
	"0f": {
		id: "0f",
		name: "Chop firewood",
		location: "Camp",
		items: [{ category: "pokeball", tier: 4 }],
		reward: [{ category: "experience", tier: 3 }], // 5 XP (tier 3)
		unlocks: ["0g"],
	},
	"0g": {
		id: "0g",
		name: "Repair the drawbridge",
		location: "Fortress gates",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [
			{ category: "simple_chest", tier: 1 }, // 1 Simple Chest (a)
			{ category: "experience", tier: 4 }, // 10 XP (tier 4)
		],
		unlocks: ["0h"],
	},
	"0h": {
		id: "0h",
		name: "Clean the walls",
		location: "Castle",
		items: [{ category: "pokeball", tier: 4 }],
		reward: [{ category: "experience", tier: 4 }], // 10 XP (tier 4)
		unlocks: ["0i"],
		// This task should trigger a LEVEL UP
	},
	"0i": {
		id: "0i",
		name: "Repair the walls",
		location: "Castle",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [{ category: "experience", tier: 4 }], // 10 XP (tier 4)
		unlocks: ["0j"],
	},
	"0j": {
		id: "0j",
		name: "Fortify the castle",
		location: "Castle",
		items: [{ category: "potion", tier: 3 }],
		reward: [{ category: "experience", tier: 4 }], // 10 XP (tier 4)
		unlocks: ["0k"],
	},
	"0k": {
		id: "0k",
		name: "Repair the castle",
		location: "Castle",
		items: [{ category: "pokeball", tier: 7 }],
		reward: [{ category: "experience", tier: 4 }], // 10 XP (tier 4)
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

		this.currentTasks = ["0a"];
	}

	getCurrentTasks(): Task[] {
		return this.currentTasks.map((taskName) => taskList[taskName]);
	}

	completeTask(taskId: TaskId): void {
		const task = taskList[taskId];

		this.currentTasks = this.currentTasks.filter(
			(taskName) => taskName !== taskId
		);
		this.currentTasks.push(...(task.unlocks || []));

		this.emit("newTask");
	}
}
