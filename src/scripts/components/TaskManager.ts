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

	// CHAPTER 1 - Here there be dragons
	//   Title screen
	//   Shop is introduced with tutorial
	//   Lets you buy 50 gems for free

	"1a1": {
		id: "1a1",
		name: "Remove obstruction",
		location: "Village",
		items: [{ category: "pokeball", tier: 3 }],
		reward: [
			{ category: "simple_chest_b", tier: 1 },
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 20 },
		],
		unlocks: ["1a2"],
	},
	"1a2": {
		id: "1a2",
		name: "Repair the houses",
		location: "Village",
		items: [
			{ category: "pokeball", tier: 3 },
			{ category: "pokeball", tier: 4 },
		],
		reward: [
			{ category: "simple_chest_c", tier: 1 },
			{ category: "pouch_of_coins", amount: 4 },
			{ category: "experience", amount: 20 },
		],
		unlocks: ["1b1", "1c"],
	},

	"1b1": {
		id: "1b1",
		name: "Get into the tower",
		location: "Mage Tower",
		items: [{ category: "pokeball", tier: 5 }],
		reward: [
			{ category: "durable_chest_a", tier: 1 },
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 30 },
		],
		unlocks: ["1b2"],
		// LEVEL UP
	},
	"1b2": {
		id: "1b2",
		name: "Help the mage with renovations",
		location: "Mage Tower",
		items: [
			{ category: "pokeball", tier: 3 },
			{ category: "pokeball", tier: 4 },
			{ category: "weapon", tier: 1 },
		],
		reward: [
			{ category: "durable_chest_b", tier: 1 },
			{ category: "ruin", tier: 4 },
			{ category: "experience", amount: 30 },
		],
		unlocks: ["1d1", "1e1"],
	},

	"1c": {
		id: "1c",
		name: "Get rid of ghosts",
		location: "Graveyard",
		items: [{ category: "fossil", tier: 7 }],
		reward: [
			{ category: "pouch_of_coins", amount: 8 }, // m1 m1 m1 m2 m3 m3 m3 m4
			{ category: "crystals", amount: 10 },
			{ category: "experience", amount: 70 },
		],
	},

	"1d1": {
		id: "1d1",
		name: "Get through the forest",
		location: "Great Tree",
		items: [
			{ category: "potion", tier: 3 },
			{ category: "pokeball", tier: 4 },
		],
		reward: [
			{ category: "durable_chest_c", tier: 1 },
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 40 },
		],
		unlocks: ["1d2"],
	},
	"1d2": {
		id: "1d2",
		name: "Beat off carnivorous plants",
		location: "Great Tree",
		items: [{ category: "weapon", tier: 4 }],
		reward: [
			{ category: "durable_chest_d", tier: 1 },
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 50 },
		],
		unlocks: ["1d3"],
	},
	"1d3": {
		id: "1d3",
		name: "Mend the tree",
		location: "Great Tree",
		items: [
			{ category: "fossil", tier: 3 },
			{ category: "fossil", tier: 5 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (5m) R1 W1 W1 F1 M1 M1 B1
			{ category: "bag_of_coins", amount: 6 },
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1g1", "1h1", "1i1"],
	},

	"1e1": {
		id: "1e1",
		name: "Meet with the alchemist",
		location: "Alchemist's house",
		items: [{ category: "tech", tier: 5 }],
		reward: [
			{ category: "durable_chest_e", tier: 1 },
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 15 },
		],
		unlocks: ["1e2"],
	},
	"1e2": {
		id: "1e2",
		name: "Help the alchemist",
		location: "Alchemist's house",
		items: [{ category: "fossil", tier: 4 }],
		reward: [
			{ category: "durable_chest_f", tier: 1 },
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 15 },
		],
		unlocks: ["1f1"],
	},

	"1f1": {
		id: "1f1",
		name: "Help the alchemist escape",
		location: "Alchemist's house",
		// r3 t5 (rope, crowbar)
		items: [
			{ category: "weapon", tier: 4 },
			{ category: "pokeball", tier: 3 },
		],
		reward: [
			{ category: "durable_chest_e", tier: 1 },
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 15 },
		],
		unlocks: ["1f2"],
	},
	"1f2": {
		id: "1f2",
		name: "Repair the alchemist's house",
		location: "Alchemist's house",
		// s4 t7 m6 (brick, trowel, summoning)
		items: [{ category: "food", tier: 6 }],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (5m) F1 S1 F1 W1 R1 R1 W1
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 15 },
		],
	},

	"1g1": {
		id: "1g1",
		name: "Battle the Monster",
		location: "Nessie",
		items: [
			{ category: "weapon", tier: 4 },
			{ category: "potion", tier: 3 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) W1 F1 R1 F1 S1 F1 F1 W1
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1g2"],
	},
	"1g2": {
		id: "1g2",
		name: "Feed Nessie",
		location: "Nessie",
		items: [{ category: "tech", tier: 6 }],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) S1 W1 T1 R1 T1 R1
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1k1", "1l1", "1m1"],
	},

	"1h1": {
		id: "1h1",
		name: "Chase off the crows",
		location: "Farm",
		items: [
			{ category: "weapon", tier: 2 },
			{ category: "weapon", tier: 3 },
			{ category: "shell", tier: 2 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1h2"],
		// UNLOCKS DAILY MISSIONS (because level up?)
		// or rather the quests that refresh every 6 hours?
	},
	"1h2": {
		id: "1h2",
		name: "Clear the fields",
		location: "Farm",
		items: [{ category: "fossil", tier: 5 }],
		reward: [
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1h3"],
	},
	"1h3": {
		id: "1h3",
		name: "Fix the scarecrow",
		location: "Farm",
		items: [
			{ category: "pokeball", tier: 3 },
			{ category: "pokeball", tier: 4 },
			{ category: "potion", tier: 3 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["1h4"],
	},
	"1h4": {
		id: "1h4",
		name: "Help the farmers",
		location: "Farm",
		items: [
			{ category: "tech", tier: 6 },
			{ category: "armor", tier: 1 },
			{ category: "pokemon", tier: 7 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) R1 T1 S1 T1 W1
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["1n1", "1o1"],
	},

	"1i1": {
		id: "1i1",
		name: "Battle the trees",
		location: "Revived trees",
		items: [
			{ category: "weapon", tier: 2 },
			{ category: "potion", tier: 3 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["1i2"],
	},
	"1i2": {
		id: "1i2",
		name: "Take a break",
		location: "Revived trees",
		items: [
			{ category: "tech", tier: 3 },
			{ category: "tech", tier: 4 },
		],
		reward: [
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["1i3"],
	},
	"1i3": {
		id: "1i3",
		name: "Chop down the trees",
		location: "Revived trees",
		items: [
			{ category: "fossil", tier: 4, amount: 2 },
			{ category: "pokeball", tier: 4 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) B1 T1 R1 S1
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["1j1"],
		// (Upon completion, the new task appears the same place with new monsters)
	},

	"1j1": {
		id: "1j1",
		name: "Examine plants",
		location: "Giant Flytraps",
		items: [
			{ category: "explosives", tier: 4 },
			{ category: "fossil", tier: 4 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["1j2"],
	},
	"1j2": {
		id: "1j2",
		name: "Plant daisies",
		location: "Giant Flytraps",
		items: [{ category: "pokeball", tier: 8 }],
		reward: [
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 10 },
		],
		unlocks: ["1j3"],
	},
	"1j3": {
		id: "1j3",
		name: "Water plants",
		location: "Giant Flytraps",
		items: [
			{ category: "metal", tier: 3 },
			{ category: "fossil", tier: 3, amount: 2 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) R1 M1 B1 F1
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 10 },
		],
	},

	"1k1": {
		id: "1k1",
		name: "Stifle the hurricane",
		location: "Awful hurricane",
		items: [
			{ category: "fossil", tier: 5, amount: 3 },
			{ category: "explosives", tier: 5 },
		],
		reward: [
			{ category: "simple_chest", tier: 1 }, // (30m) F1 F1 F1 F1 S1 M1 F1 S1
			{ category: "pouch_of_coins", amount: 8 },
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1k2"],
	},
	"1k2": {
		id: "1k2",
		name: "Repair the houses",
		location: "Awful hurricane",
		items: [
			{ category: "shell", tier: 6, amount: 2 },
			{ category: "pokeball", tier: 7 },
			{ category: "pokeball", tier: 8 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) T1 F1 F1 F1 M1 R1 S1 B1
			{ category: "pouch_of_coins", amount: 8 }, // m1 m1 m1 m2 m4 m4 m4 m4
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1r1", "1s1"],
	},

	"1l1": {
		id: "1l1",
		name: "Study the letters",
		location: "Mystical stones",
		items: [
			{ category: "fossil", tier: 7 },
			{ category: "metal", tier: 4 },
			{ category: "stone", tier: 3 },
		],
		reward: [
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1l2"],
	},
	"1l2": {
		id: "1l2",
		name: "Prepare for the worst",
		location: "Mystical stones",
		items: [
			{ category: "armor", tier: 3 },
			{ category: "weapon", tier: 6 },
			{ category: "herb", tier: 3 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 8 }, // m1 m1 m1 m2 m2 m3 m3 m4
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1l3"],
	},
	"1l3": {
		id: "1l3",
		name: "Read the letters",
		location: "Mystical stones",
		items: [
			{ category: "fossil", tier: 6, amount: 2 },
			{ category: "stone", tier: 4 },
			{ category: "metal", tier: 5 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) B1 F1 M1 R1 S1 T1 W1
			{ category: "pouch_of_coins", amount: 8 },
			{ category: "experience", amount: 70 },
		],
	},

	"1m1": {
		id: "1m1",
		name: "Study the letters",
		location: "Watermill",
		items: [
			{ category: "shell", tier: 6 },
			{ category: "pokeball", tier: 7 },
			{ category: "fossil", tier: 6 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) R1 F1 S1 R1 S1 M1 F1
			{ category: "pouch_of_coins", amount: 8 },
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1m2"],
	},
	"1m2": {
		id: "1m2",
		name: "Win over water spirits",
		location: "Watermill",
		items: [
			{ category: "edible", tier: 2 },
			{ category: "metal", tier: 5 },
			{ category: "edible", tier: 4 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) S1 F1 M1 R1 F1 M1 F1
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1m3"],
	},
	"1m3": {
		id: "1m3",
		name: "Fix waterwheel",
		location: "Watermill",
		items: [
			{ category: "berry", tier: 4 },
			{ category: "pokeball", tier: 4, amount: 2 },
			{ category: "fossil", tier: 6 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) W1 W1 S1 T1 M1 R1 B1 F1
			{ category: "pouch_of_coins", amount: 9 },
			{ category: "experience", amount: 70 },
		],
	},

	"1n1": {
		id: "1n1",
		name: "Remove obstruction",
		location: "Mysterious mechanism",
		items: [
			{ category: "pokeball", tier: 6 },
			{ category: "explosives", tier: 4 },
			{ category: "potion", tier: 3 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 8 },
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1n2"],
	},
	"1n2": {
		id: "1n2",
		name: "Dig out the mechanism",
		location: "Mysterious mechanism",
		items: [
			{ category: "pokeball", tier: 8 },
			{ category: "pokeball", tier: 5 },
			{ category: "fossil", tier: 6 },
		],
		reward: [
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1n3"],
	},
	"1n3": {
		id: "1n3",
		name: "Start up the mechanism",
		location: "Mysterious mechanism",
		items: [
			{ category: "fossil", tier: 10 },
			{ category: "amulet", tier: 6 },
			{ category: "potion", tier: 10 },
		],
		reward: [
			{ category: "star_sphere", tier: 1 },
			{ category: "gold", amount: 500 },
			{ category: "crystals", amount: 250 },
		],
	},

	"1o1": {
		id: "1o1",
		name: "Try to pass through",
		location: "Fool",
		items: [
			{ category: "potion", tier: 3 },
			{ category: "fossil", tier: 5 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 20 },
		],
		unlocks: ["1o2"],
	},
	"1o2": {
		id: "1o2",
		name: "Scare the statue",
		location: "Fool",
		items: [
			{ category: "weapon", tier: 4 },
			{ category: "pokeball", tier: 6 },
			{ category: "explosives", tier: 3 },
		],
		reward: [
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 40 },
		],
		unlocks: ["1o3"],
	},
	"1o3": {
		id: "1o3",
		name: "Agree on the easy way",
		location: "Fool",
		items: [
			{ category: "tech", tier: 6 },
			{ category: "shell", tier: 3, amount: 2 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) S1 R1 W1 T1 W1
			{ category: "pouch_of_coins", amount: 7 },
			{ category: "experience", amount: 50 },
		],
		unlocks: ["1p1"],
	},

	"1p1": {
		id: "1p1",
		name: "Make a path",
		location: "Mountaintop",
		items: [
			{ category: "pokeball", tier: 6 },
			{ category: "fossil", tier: 5, amount: 2 },
			{ category: "tech", tier: 6 },
		],
		reward: [
			{ category: "pouch_of_coins", amount: 8 }, // m1 m1 m1 m2 m3 m3 m3 m3
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1p2"],
	},
	"1p2": {
		id: "1p2",
		name: "Climb the summit",
		location: "Mountaintop",
		items: [
			{ category: "potion", tier: 3 },
			{ category: "armor", tier: 4 },
			{ category: "stone", tier: 4 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (10m) R1 S1 S1 W1 T1 T1
			{ category: "pouch_of_coins", amount: 8 }, // m2 m2 m2 m3 m3 m4 m4 m4
			{ category: "experience", amount: 60 },
		],
		unlocks: ["1q1"],
	},

	"1q1": {
		id: "1q1",
		name: "Prepare the platform",
		location: "Mountaintop",
		items: [
			{ category: "shell", tier: 6 },
			{ category: "pokeball", tier: 7 },
			{ category: "potion", tier: 5 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) S1 S1 F1 R1 S1 M1 F1 F1
			{ category: "pouch_of_coins", amount: 8 }, // m1 m1 m2 m2 m2 m3 m3 m4
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1q2"],
	},
	"1q2": {
		id: "1q2",
		name: "Build a telescope",
		location: "Mountaintop",
		items: [
			{ category: "shell", tier: 7 },
			{ category: "fossil", tier: 7 },
			{ category: "pearl", tier: 4 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // B1 F1 M1 S1 F1 T1 R1 S1 S1 F1
			{ category: "pouch_of_coins", amount: 8 },
			{ category: "experience", amount: 70 },
		],
	},

	"1r1": {
		id: "1r1",
		name: "Win over the dragon",
		location: "Dragon's Lair",
		items: [
			{ category: "tech", tier: 6 },
			{ category: "tech", tier: 5 },
			{ category: "tech", tier: 4 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // R1 S1 S1 M1 S1 F1 F1 F1 F1 F1
			{ category: "pouch_of_coins", amount: 9 }, // m1 m1 m2 m2 m2 m2 m3 m3 m4
			{ category: "experience", amount: 120 },
		],
		unlocks: ["1r2"],
	},
	"1r2": {
		id: "1r2",
		name: "Prepare for battle",
		location: "Dragon's Lair",
		items: [
			{ category: "armor", tier: 4 },
			{ category: "herb", tier: 4 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) F1 F1 F1 F1 M1 F1 S1 S1 R1 S1
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 140 },
		],
		unlocks: ["1r3"],
	},
	"1r3": {
		id: "1r3",
		name: "Slay the dragon",
		location: "Dragon's Lair",
		items: [
			{ category: "weapon", tier: 8 },
			{ category: "fossil", tier: 8 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) R1 R1 R1 B1 F1 T1 F1 M1 M1 S1 R1 SF1!!!! (Ship Frame!!!)
			{ category: "pouch_of_coins", amount: 9 }, // m1 m1 m2 m3 m3 m4 m4 m4 m4
			{ category: "experience", amount: 140 },
		],
		unlocks: ["2a", "2b", "2c", "2d"],
		// CHAPTER 1 COMPLETE!!!
	},

	"1s1": {
		id: "1s1",
		name: "Explore the village",
		location: "Fisherman's Village",
		items: [
			{ category: "weapon", tier: 6 },
			{ category: "fossil", tier: 7 },
			{ category: "armor", tier: 3 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) S1 R1 F1 F1 S1 F1 F1 S1 M1
			{ category: "pouch_of_coins", amount: 9 }, // m1 m1 m1 m1 m1 m3 m3 m3 m5
			{ category: "experience", amount: 70 },
		],
		unlocks: ["1s2"],
	},
	"1s2": {
		id: "1s2",
		name: "Restore house",
		location: "Fisherman's Village",
		items: [
			{ category: "pokeball", tier: 7 },
			{ category: "berry", tier: 5 },
			{ category: "potion", tier: 4 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) F1 F1 F1 R1 S1 F1 F1 S1 M1 S1
			{ category: "coffee_grinder", tier: 1 },
			{ category: "experience", amount: 80 },
		],
		unlocks: ["1s3"],
	},
	"1s3": {
		id: "1s3",
		name: "Help villagers",
		location: "Fisherman's Village",
		items: [
			{ category: "shell", tier: 6 },
			{ category: "pokeball", tier: 7 },
			{ category: "herb", tier: 5 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) M1 F1 S1 S1 R1 F1 S1 F1 F1 F1
			{ category: "pouch_of_coins", amount: 9 }, // m1 m1 m1 m2 m3 m3 m3 m4 m4
			{ category: "experience", amount: 90 },
		],
		unlocks: ["1s4"],
	},
	"1s4": {
		id: "1s4",
		name: "Celebration time",
		location: "Fisherman's Village",
		items: [
			{ category: "metal", tier: 5 },
			{ category: "edible", tier: 5 },
			{ category: "tech", tier: 6 },
		],
		reward: [
			{ category: "splendid_chest", tier: 1 }, // (30m) F1 F1 T1 S1 R1 M1 B1 S1 F1 S1
			{ category: "pouch_of_coins", amount: 9 },
			{ category: "experience", amount: 100 },
		],
		unlocks: ["3a"],
	},

	// 2a - "Ancient Evil?"
	// 	1/3: k5 et5 (map, inkwell) - "Find the Ancient Evil"
	// 		1 Splendid Chest (30m)
	// 			W1 S1 M1 R1 M1 W1 B1 S1 W1 B1 R1 M1
	// 		1 Pouch of coins (9)
	// 		160 XP
	// 	2/3: m6(x3) m8 (3 summoning, dark) - "Wake the Ancient Evil"
	// 		1 Splendid Chest (30m)
	// 			W1 W1 M1 M1 F1 W1 F1 S1 W1 R1 S1 F1 M1 S1
	// 		1 Coffee-grinder
	// 		180 XP
	// 	3/3: f6(x3) sw6 d6 (3 foodvase, cupcake, mineralwater) - "Befriend the Ancient Evil"
	// 		1 Splendid Chest (30m)
	// 			W1 W1 M1 M1 F1 R1 W1 S1 S1 R1 S1 F1 R1 M1
	// 		1 Pouch of coins (9)
	// 		200 XP

	// 2b - "Dwarf Fortress"
	// 	1/3: t9 t5 t6 (saw, crowbar, pick) - "Try to open the gates"
	// 		1 Splendid Chest (30m)
	// 			F1 M1 M1 F1 F1 R1 R1 S1 R1 F1 R1 F1
	// 		1 Pouch of coins
	// 		140 XP
	// 	2/3: w3 m4(x2) x6(x2) (warhammer, 2 fire, 2 explosives) - "Try to break the gates"
	// 		1 Splendid Chest
	// 			F1 F1 F1 S1 S1 M1 R1 R1 F1 S1 M1 F1
	// 		1 Coffee-grinder
	// 		140 XP
	// 	3/3: f6(x2) d3(x2) g5 (2 foodvase, beer, gold) - "Offer dwarves the easy way"
	// 		1 Splendid Chest (30m)
	// 			F1 T1 F1 F1 R1 T1 R1 M1 M1 B1 M1 R1
	// 		1 Pouch of coins (9)
	// 		160 XP

	// 2c -> 2g - "Top of the statue"
	// 	1/4: 500 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	2/4: 500 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	3/4: 500 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	4/4: 1000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		25 Crystals

	// 2d -> 2e, 2f - "Old Port"
	// 	1/3: w7 a4 (flamberge, leatherarmour) - "Chase away robbers"
	// 		1 Splendid Chest (60m)
	// 			W1 W1 W1 W1 S1 S1 S1 M1 W1 S1 B1 M1 S1 S1
	// 		1 Bag of coins (10)
	// 			m2 m2 m3 m3 m3 m4 m5 m5 m5 m5
	// 		220 XP
	// 	2/3: p5 et4 t7 (planks, bell, trowel) - "Repair the ship"
	// 		1 Splendid Chest (60m)
	// 			B1 S1 F1 W1 M1 S1 S1 S1 W1 M1 M1 S1 S1 W1
	// 		1 Coffee-grinder
	// 		240 XP
	// 	3/3: i4 f6(x2) d4(x2) (bongos, 2 foodvase, 2 wine) - "Gather your party"
	// 		1 Splendid Chest (60m)
	// 			W1 W1 S1 S1 B1 S1 W1 S1 W1 S1 M1 W1 S1 F1
	// 		1 Bag of coins (10)<
	// 			m4 m4 m3 m2 m4 m4 m4 m4 m5 m4
	// 		260 XP

	// 2e -> 2h, 2i, 2j, 2k - "Ghost Ship"
	// 	1/3: k5 et7 (map, compass) - "Catch up with the ghost ship"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 S1 S1 F1 W1 F1 S1 W1 W1 S1 S1 F1 S1 F1 W1
	// 		1 Bag of coins (10)
	// 		260 XP
	// 	2/3: w5(x3) r3(x2) a3 (3 saber, 2 rope, 1 quilted) - "Board the ship"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 S1 S1 F1 F1 W1 S1 B1 S1 S1 F1 F1 W1 W1 S1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: m7(x2) i5 (2 light, drums) - "Revoke the curse"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 F1 W1 S1 F1 M1 F1 S1 W1 B1 W1 R1 F1 M1 W1
	// 		1 Bag of coins (10)
	// 		260 XP

	// 2f - "Lighthouse"
	// 	1/3: s6(x3) t9 p4(x2) (3 brick, saw, 2 bar) - "Fix the lighthouse"
	// 		1 Splendid Chest (60m)
	// 			F1 S1 S1 W1 S1 F1 F1 F1 W1 S1 S1 S1 W1 F1
	// 		1 Bag of coins (8)
	// 		260 XP
	// 	2/3: p2(x3) r3(x2) cl2 (3 branches, 2 rope, cloth) - "Gather firewood"
	// 		1 Splendid Chest
	// 			S1 W1 S1 F1 F1 S1 F1 S1 S1 F1 S1 W1 W1 F1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: m7(x2) et6 (2 light, magnifying glass) - "Light the lighthouse"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 S1 S1 S1 F1 F1 M1 S1 W1 W1 S1 S1 W1 F1 B1
	// 		1 Bag of coins (10)
	// 			m4 m4 m5 m5 m1 m3 m4 m3 m1 m4
	// 		260 XP

	// 2g -> 2q - "Body of the statue"
	// 	1/4: 700 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	2/4: 700 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	3/4: 700 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	4/4: 1400 gold - "Pay for work done"
	// 		1 Orb shard
	// 		25 Crystals

	// 2h - "Pirate Trader" (same location as 2e)
	// 	1/1: p5(x2) r3(x2) et4 (2 planks, 2 rope, bell) - "Build a ship"
	// 		50 XP
	// 		OPENS MERCHANTS
	// 			Pirate Chest for 2 dynamites + 1 gold bar

	// 2i -> 2l, 2m, 2n - "Village"
	// 	1/3: w6(x2) a4 l6 (2 swords, leather, potion) - "Join the fight"
	// 		1 Splendid Chest (60m)
	// 			M1 R1 S1 M1 S1 M1 F1 S1 M1 S1 W1 W1 W1 M1 M1 S1 F1 W1 S1 T1
	// 		1 Bag of coins (10)
	// 		260 XP
	// 	2/3: f6(x3) d5 cl7 (3 foodvase, applejuice, trousers) - "Help the villagers"
	// 		1 Splendid Chest (60m)
	// 			M1 M1 R1 S1 S1 M1 M1 M1 T1 S1 S1 W1 W1 W1 W1 T1 F1 R1 S1 W1
	// 		1 Cofee-grinder
	// 		260 XP
	// 	3/3: s6(x2) t9 p4(x2) (2 brick, saw, 2 bar) - "Restore the village"
	// 		1 Splendid Chest (60m)
	// 			S1 S1 T1 T1 F1 T1 W1 W1 W1 S1 F1 W1 S1 R1 W1
	// 		1 Bag of coins (10)
	// 		260 XP

	// 2j -> 2o - "Naval battle"
	// 	1/3: k5 et2 f6(x2) (map, helm, 2 foodvase) - "Get to the battlefield"
	// 		1 Splendid Chest (60m)
	// 			M1 W1 S1 W1 S1 M1 R1 R1 S1 S1 S1 W1 W1 W1 W1 M1 F1 S1 F1 F1 S1 S1 R1 F1 F1 F1 W1 F1 S1 W1 R1 R1 F1 T1 W1 S1 M1 T1 S1 F1 F1 S1 M1 S1
	// 		1 Bag of coins (10)
	// 		260 XP
	// 	2/3: et8 (spyglass) - "Watch the fight"
	// 		1 Splendid Chest (60m)
	// 			R1 R1 R1 R1 R1 F1 F1 F1 T1 S1 R1 R1 R1 R1 R1 R1 F1 T1 M1 T1 F1 W1 W1 S1 S1 T1 W1 F1 F1 M1 S1 S1 F1 F1 W1 W1 R1 R1 S1 F1 F1 R1 W1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: et2 cl8 (helm, chaperone) - "Follow the ship"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 S1 S1 S1 R1 W1 R1 R1 T1 M1 W1 F1 F1 R1 M1 R1 W1 R1 R1 R1 M1 S1 F1 W1 S1 S1 W1 W1 S1 W1 F1 M1 F1 W1 M1 F1 F1 R1 S1 S1 S1 F1 W1
	// 		1 Bag of coins (10)
	// 		260 XP

	// 2k - "Mermaid Lagoon"
	// 	1/3: d6 m7 cl5 (mineral, light, hat) - "Defend from mermaids"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 F1 W1 W1 M1 B1 R1 R1 F1 W1 F1 F1 R1 M1 W1
	// 		1 Bag of coins (10)
	// 		260 XP
	// 	2/3: w7 a2 i6 (flamberge, helmet, bagpipes) - "Battle the mermaids"
	// 		1 Splendid Chest (60m)
	// 			R1 M1 F1 F1 F1 W1 W1 F1 R1 W1 W1 W1 F1 F1 M1 W1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: g5 f6(x3) cl6 - "Make peace with the mermaids"
	// 		1 Splendid Chest (60m)
	// 			W1 B1 F1 F1 M1 W1 F1 F1 F1 F1 M1 W1 F1 W1 R1
	// 		1 Bag of coins (10)
	// 		260 XP

	// 2l -> 2s - "Stonehenge"
	// 	1/3: et5 k5 d6 (inkwell, map, mineralwater) - "Learn ancient magic"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 F1 F1 F1 R1 R1 R1 W1 W1 W1 W1 S1 M1 R1 R1 R1 S1 S1 S1 W1 W1 M1 F1 W1 W1 F1 R1 S1 S1 S1 S1 S1 W1 F1 W1 W1 W1 R1 R1 R1 R1 R1 S1
	// 		1 Bag of coins ()
	// 		260 XP
	// 	2/3: x6(x2) w8 (2 explosives, axe) - "Remove the spell"
	// 		1 Splendid Chest (60m)
	// 			R1 R1 S1 S1 W1 W1 W1 F1 F1 F1 W1 W1 F1 S1 S1 F1 F1 T1 R1 S1 M1 R1 W1 R1 S1 F1 W1 W1 W1 R1 F1 W1 S1 T1 W1 R1 S1 W1 W1 T1 W1 S1 W1 S1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: po3(x2) m10 (2 health potion, meta) - "Free the cute slimes"
	// 		1 Splendid Chest (60m)
	// 			R1 R1 W1 R1 S1 F1 W1 W1 S1 M1 S1 F1 S1 R1 R1 W1 F1 F1 R1 T1 R1 R1 R1 F1 F1 R1 M1 F1 T1 T1 R1 W1 R1 F1 F1 W1 R1 S1 S1 S1 F1 W1 W1 W1
	// 		1 Bag of coins (12)
	// 		260 XP

	// 2m -> 2p - "Hot-air balloon"
	// 	1/2: x6(x2) t8 (2 explosives, shovel) - "Break down stones"
	// 		1 Splendid Chest (60m)
	// 			R1 S1 W1 S1 R1 W1 F1 F1 W1 S1 F1 S1 R1 S1 R1 S1 T1 S1 W1 S1 M1 S1 R1 S1 F1 M1 W1 S1 W1 R1 F1 T1 T1 R1 F1 S1 S1 W1 S1 W1 F1 R1 R1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	2/2: f6(x2) sw4 sw5 (foodvase, honey, caramelapple) - "There's someone inside!"
	// 		1 Splendid Chest (60m)
	// 			R1 W1 R1 W1 S1 S1 W1 W1 S1 S1 W1 S1 R1 W1 F1 S1 F1 S1 T1 W1 S1 F1 R1 R1 R1 F1 R1 F1 W1 S1 W1 M1 R1 S1 W1 R1 T1 W1 R1 W1 R1 W1 S1 T1
	// 		1 Bag of coins ()
	// 		260 XP

	// 2n - "Troll Trader"
	// 	1/1: cl2(x2) s6(x2) t7 (2 cloth, 2 brick, trowel) - "Build a tent"
	// 		50 XP
	// 		UNLOCKS POTION MERCHANT

	// 			f6, f5, d4 -> 1 small potion pot
	// 			3 times level up

	// 2o -> 2t - "Pirates' Lair"
	// 	1/3: po5 m8 (invisibility potion, dark magic) - "Explore the bay"
	// 		1 Splendid Chest
	// 			F1 F1 F1 R1 R1 R1 R1 R1 R1 T1 T1 W1 F1 F1 W1 W1 M1 M1 M1 S1 W1 S1 S1 M1 F1 W1 R1 R1 R1 R1 S1 F1 F1 F1 W1 R1 F1 F1 W1 R1 S1 W1 R1 ??
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/3: et5 k4 d4 (inkwell, map, wine) - "Develop a plan"
	// 		1 Splendid Chest
	// 			S1 S1 R1 F1 F1 W1 F1 F1 R1 M1 M1 F1 R1 M1 S1 R1 F1 S1 S1 R1 S1 W1 W1 F1 R1 F1 F1 R1 R1 S1 W1 R1 R1 F1 F1 R1 R1 S1 F1 F1 W1 S1 R1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: w8 a5 x6(x2) - "Attack a Pirate Lair"
	// 		1 Splendid Chest
	// 			M1 F1 M1 R1 F1 S1 W1 R1 S1 R1 R1 S1 F1 F1 S1 M1 R1 F1 S1 T1 R1 S1 W1 W1 S1 W1 W1 W1 S1 S1 R1 S1 R1 F1 R1 S1 W1 R1 F1 R1 R1 W1 S1 W1
	// 		1 Bag of coins (12)
	// 		260 XP

	// 2p -> 2r - "Hot-air balloon"
	// 	1/3: r3(x3) m9 cl2(x2)
	// 		1 Splendid Chest (60m)
	// 			W1 W1 M1 S1 R1 W1 M1 R1 S1 F1 F1 M1 F1 M1 M1 M1 R1 S1 M1 S1 R1 R1 W1 M1 F1 T1 M1 R1 R1 S1 S1 S1 R1 W1 W1 R1 M1 R1 S1 S1 S1 R1 S1 R1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/3: et7 cl7 (compass, trousers) - "Prepare for the journey"
	// 		1 Splendid Chest (60m)
	// 			F1 S1 W1 W1 R1 M1 R1 W1 T1 F1 F1 W1 M1 R1 M1 T1 F1 R1 F1 T1 W1 F1 R1 M1 W1 S1 R1 F1 T1 F1 S1 W1 W1 F1 S1 S1 R1 F1 F1 S1 S1 R1 R1 M1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: f6(x3) d5 l5 (3 foodvase, applejuice, potion) - "Immobilise Ungrim"
	// 		1 Splendid Chest
	// 			F1 F1 F1 R1 R1 R1 S1 S1 R1 S1 W1 F1 R1 F1 F1 W1 M1 R1 M1 R1 S1 W1 F1 S1 T1 R1 R1 R1 S1 W1 R1 R1 S1 W1 F1 W1 S1 M1 R1 R1 R1 R1 M1 R1
	// 		1 Bag of coins (12)
	// 		260 XP

	// 2q -> 2v - "Foundation of the statue"
	// 	1/4: 1000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	2/4: 1000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	3/4: 1000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	4/4: 2000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		25 Crystals

	// 2r -> 2u - "\"Terror\""
	// 	1/3: t10 x6(x2) (doublesaw, 2 explosives) - "Free the ship from ice"
	// 		1 Splendid Chest (60m)
	// 			M1 F1 F1 R1 W1 F1 F1 F1 R1 S1 F1 F1 W1 R1 F1 F1 R1 T1 W1 W1 R1 S1 R1 R1 T1 W1 F1 R1 W1 W1 W1 R1 S1 W1 W1 S1 R1 S1 R1 S1 S1 T1 M1 F1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/3: p5 t9 r3(x3) (planks, saw, 3 rope) - "Patch the holes"
	// 		1 Splendid Chest (60m)
	// 			T1 W1 R1 W1 F1 R1 F1 W1 W1 F1 W1 R1 W1 R1 R1 S1 F1 S1 F1 M1 S1 F1 R1 R1 S1 F1 S1 F1 R1 M1 T1 R1 T1 M1 M1 S1 W1 F1 R1 S1 F1 W1 W1 S1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: f6(x3) cl8 sw5 (3 foodvase, chaperone, caramel apple) - "Stock up on provisions"
	// 		1 Splendid Chest (60m)
	// 			S1 R1 F1 F1 R1 R1 T1 S1 S1 S1 W1 R1 S1 W1 W1 F1 W1 W1 S1 W1 S1 S1 R1 R1 W1 T1 R1 F1 S1 T1 W1 W1 W1 S1 F1 M1 W1 R1 R1 R1 F1 W1 R1 R1
	// 		1 Bag of coins (12)
	// 		260 XP

	// 2s -> 2w, 2x - "Viking Camp"
	// 	1/4: d5(x2) f6(x2) i7 (2 apple juice, 2 foodvase, lute) - "Befriend Erik"
	// 		1 Splendid Chest (60m)
	// 			R1 M1 W1 W1 S1 R1 W1 W1 S1 F1 S1 S1 M1 R1 S1 M1 W1 S1 F1 W1 F1 R1 F1 S1 W1 S1 S1 R1 W1 W1 W1 W1 S1 T1 T1 S1 S1 S1 R1 T1 W1 S1 W1 F1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/4: w9 a5 d5 (battleaxe, brigantine, applejuice) - "Befriend Olaf"
	// 		1 Splendid Chest (60m)
	// 			F1 W1 R1 M1 R1 F1 S1 W1 M1 S1 F1 S1 W1 F1 F1 R1 W1 R1 F1 M1 S1 W1 W1 W1 R1 R1 R1 R1 R1 R1 W1 W1 W1 S1 S1 S1 F1 T1 S1 S1 S1 S1 S1 M1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/4: w7 w6 w5 (flamberge, sword, saber) - "Befriend Baleog"
	// 		1 Splendid Chest (60m)
	// 			Ẃ1 W1 F1 F1 W1 W1 F1 S1 F1 W1 S1 R1 S1 W1 S1 W1 R1 W1 W1 M1 W1 W1 R1 F1 W1 F1 W1 R1 W1 S1 S1 S1 R1 F1 W1 T1 W1 M1 F1 W1 S1 W1 R1 R1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	4/4: s6(x2) m9 p5(x2) (2 brick, dwarf, 2 planks) - "Build the city"
	// 		1 Splendid Chest (60m)
	// 			S1 S1 S1 R1 W1 W1 W1 M1 F1 S1 R1 W1 R1 S1 F1 F1 W1 R1 S1 R1 W1 R1 F1 M1 W1 S1 M1 W1 W1 F1 M1 W1 S1 S1 T1 S1 S1 F1 S1 R1 M1 S1 F1 R1
	// 		1 Bag of coins (12)
	// 		260 XP

	// 2t - "Cave in the mountains"
	// 	1/3: k7 amulet2 (map, amulet) - "Investigate the treasure map"
	// 		1 Splendid Chest (60m)
	// 			F1 W1 R1 S1 F1 S1 W1 M1 S1 S1 R1 S1 F1 R1 S1 F1 M1 T1 W1 R1 W1 S1 R1 F1 R1 F1 M1 F1 W1 F1 S1 W1 R1 W1 W1 S1 R1 S1 W1 R1 W1 F1 S1 F1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/3: cl6 f6(x3) d5 (boots, 3 foodvase, apple juice) - "Go for the treasure"
	// 		1 Splendid Chest (60m)
	// 			R1 S1 W1 F1 F1 S1 F1 R1 R1 S1 S1 R1 S1 F1 T1 W1 R1 R1 W1 R1 R1 M1 W1 R1 W1 S1 F1 W1 W1 T1 S1 F1 W1 F1 F1 R1 R1 W1 R1 S1 T1 R1 R1 S1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	3/3: m7(x2) ri5 (2 light, magic ring) - "Use magic"
	// 		1 Bag of coins
	// 			m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m4
	// 		1 Bag of coins
	// 			m4 m4 m5 m5 m5 m5 m5 m5 m4 m5 m5 m5 m5 m5

	// 2u - "Strange mountain"
	// 	1/3: cl10 l8 k6 (coat, medicinal, map) - "Travel to the volcano"
	// 		1 Splendid Chest (60m)
	// 			S1 S1 W1 W1 R1 F1 F1 M1 T1 S1 R1 S1 W1 F1 F1 W1 W1 S1 W1 S1 S1 S1 S1 R1 F1 W1 R1 R1 M1 F1 R1 W1 W1 F1 R1 W1 W1 F1 S1 M1 W1 F1 S1 R1
	// 		1 Bag of coins (14)
	// 			Nearly all m5
	// 		260 XP
	// 	2/3: x6(x2) po9 (explosives, explosive potion)
	// 		1 Splendid Chest (60m)
	// 			W1 R1 S1 R1 S1 F1 R1 S1 W1 T1 R1 W1 S1 F1 S1 R1 S1 S1 R1 M1 R1 R1 F1 R1 S1 M1 M1 F1 W1 S1 F1 S1 F1 F1 T1 W1 R1 F1 M1 R1 S1 M1 R1 F1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: ri7 (the one ring) - "My precious!"
	// 		1 Splendid Chest (60m)
	// 			F1 S1 R1 S1 F1 F1 F1 S1 F1 M1 R1 S1 F1 W1 S1 S1 F1 F1 W1 F1 F1 R1 W1 W1 W1 F1 W1 W1 R1 S1 F1 W1 W1 S1 W1 W1 R1 F1 S1 W1 S1 S1 F1 W1
	// 		1 Bag of coins (15)
	// 		260 XP

	// 2v - "Base of the statue"
	// 	1/4: 3000 gold - "Pay for work done"
	// 		1 Orb piece
	// 		20 Crystals
	// 	2/4: 3000 gold - "Pay for work done"
	// 		1 Orb piece
	// 		20 Crystals
	// 	3/4: 3000 gold - "Pay for work done"
	// 		1 Orb piece
	// 		20 Crystals
	// 	4/4: 5000 gold - "Pay for work done"
	// 		1 Orb piece
	// 		50 Crystals

	// 2w -> 2z, 2å, 2ä - "Underground City"
	// 	1/4: s6(x3) x6(x2) t11 - "Restore the mines"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 R1 S1 F1 S1 F1 F1 W1 S1 R1 R1 S1 R1 F1 M1 M1 S1 S1 F1 F1 R1 W1 R1 M1 F1 R1 W1 W1 R1 R1 R1 R1 W1 W1 F1 F1 M1 S1 T1 S1 S1 S1 F1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/4: cl9 cl6(x2) t6(x3) (shirt, 2 boots, 3 pick) - "Equip the workers"
	// 		1 Splendid Chest (60m)
	// 			W1 F1 M1 F1 R1 R1 F1 W1 S1 S1 F1 M1 R1 S1 W1 S1 R1 T1 R1 F1 F1 R1 R1 S1 W1 W1 W1 W1 F1 S1 R1 F1 F1 F1 W1 R1 R1 R1 F1 W1 S1 S1 M1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/4: i8 d6 sw9 (violin, mineral water, eclair) - "Grand opening"
	// 		1 Splendid Chest (60m)
	// 			M1 M1 S1 W1 S1 S1 R1 R1 W1 R1 R1 M1 F1 M1 R1 R1 R1 F1 W1 F1 R1 S1 W1 W1 M1 S1 R1 W1 F1 F1 M1 S1 W1 W1 W1 R1 S1 R1 W1 R1 F1 W1 F1 R1
	// 		1 Bag of coins ()
	// 		260 XP
	// 	4/4: g6 ri5 450gold (gold, magic ring) - "Settle the debt"
	// 		1 Splendid Chest
	// 			M1 R1 S1 R1 R1 M1 W1 F1 S1 W1 W1 F1 S1 M1 W1 W1 M1 R1 F1 T1 F1 F1 R1 F1 M1 R1 S1 R1 R1 R1 R1 F1 W1 M1 M1 R1 S1 R1 F1 R1 F1 F1 S1 R1
	// 		260 XP

	// 2x -> 2y - "Ship Graveyard"
	// 	1/3: po8 m7 (underwater, light) - "Sift through debris"
	// 		1 Splendid Chest (60m)
	// 			R1 R1 S1 S1 R1 R1 S1 F1 R1 R1 S1 M1 W1 W1 R1 F1 R1 W1 F1 R1 W1 W1 W1 R1 W1 R1 F1 F1 R1 W1 W1 F1 S1 S1 S1 R1 R1 R1 T1 S1 R1 M1 F1 S1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/3: p5(x2) t9 (2 planks, saw) - "Repair ship"
	// 		1 Splendid Chest (60m)
	// 			F1 F1 W1 R1 R1 R1 S1 W1 T1 F1 W1 S1 S1 S1 R1 S1 S1 W1 M1 S1 F1 T1 S1 S1 S1 F1 S1 T1 R1 S1 W1 W1 S1 F1 W1 W1 W1 W1 R1 R1 W1 T1 ?? ??
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: et2 et8 et3 (helm, spyglass, lifeline)
	// 		1 Splendid Chest (m)
	// 			S1 T1 F1 W1 R1 R1 W1 W1 S1 S1 S1 M1 F1 F1 F1 R1 R1 S1 T1 W1 R1 S1 M1 W1 R1 T1 R1 S1 F1 F1 S1 S1 W1 S1 M1 W1 R1 S1 S1 W1 F1 R1 S1 W1
	// 		1 Bag of coins (12)
	// 		260 XP

	// 2y - "Kraken"
	// 	1/3: w10 x6(x3) po8 (halberd, 3 explosives, underwater) - "Ward off the tentacles"
	// 		1 Splendid Chest (60m)
	// 			W1 W1 W1 W1 R1 R1 R1 R1 F1 F1 T1 W1 R1 S1 W1 W1 S1 R1 R1 R1 W1 W1 F1 F1 F1 S1 W1 W1 S1 M1 M1 F1 F1 R1 S1 W1 W1 R1 R1 F1 F1 W1 R1 S1
	// 		1 Bag of coins (14)
	// 		260 XP
	// 	2/3: e12 w7 am3 (diving helmet, flamberge, amulet of protection) - "Battle with the Kraken"
	// 		1 Splendid Chest
	// 			F1 R1 F1 F1 R1 F1 M1 M1 F1 T1 T1 R1 S1 F1 M1 F1 R1 R1 R1 S1 S1 M1 F1 T1 R1 R1 T1 F1 T1 S1 R1 R1 R1 S1 F1 W1 W1 F1 R1 W1 M1 S1 F1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: f6(x3) sw10 l8 (3 foodvase, pie, medicinal) - "Feed the Kraken"
	// 		1 Splendid Chest
	// 			W1 W1 W1 S1 S1 R1 F1 T1 W1 T1 W1 M1 M1 R1 R1 R1 R1 W1 F1 W1 S1 M1 F1 R1 W1 R1 R1 R1 F1 T1 F1 F1 F1 M1 R1 W1 W1 R1 R1 R1 W1 R1 R1 R1
	// 		1 Bag of coins (14)
	// 			m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m5 m4
	// 		260 XP

	// 2z -> 3b, 3c - "Sea Serpent"
	// 	1/4: a6 am6 l8 (breastplate, amulet of protection, medicinal potion) - "Prepare for battle"
	// 		1 Splendid Chest
	// 			R1 F1 W1 W1 R1 W1 W1 W1 R1 W1 W1 R1 S1 W1 M1 R1 F1 M1 F1 F1 R1 W1 F1 F1 W1 W1 W1 R1 R1 R1 W1 M1 F1 R1 R1 S1 R1 W1 R1 R1 R1 S1 W1 W1
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: po9 m10(x2) x6(x3) (explosive potion, 2 meta, 3 explosives) - "Battle with the Serpent"
	// 		1 Splendid Chest (60m)
	// 			W1 M1 M1 R1 S1 F1 W1 W1 W1 R1 F1 F1 R1 R1 S1 W1 W1 R1 F1 W1 R1 S1 S1 M1 F1 F1 W1 R1 W1 R1 M1 M1 F1 F1 M1 S1 S1 R1 W1 R1 F1 S1 R1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/4: po8 ri6 w5 (underwater, attack ring, saber) - "Go after the Serpent"
	// 		1 Splendid Chest (60m)
	// 			S1 S1 S1 S1 S1 S1 S1 S1 S1 S1 S1 S1 M1 M1 M1 T1 T1 T1 T1 R1 R1 R1 R1 R1 R1 R1 R1 R1 F1 F1 F1 F1 F1 F1 W1 W1 W1 W1 W1 W1 W1 W1 W1 W1
	// 		1 Bag of coins (14)
	// 		260 XP
	// 	4/4: w12 et9 (pistol, binoculars) - "Final blow!"
	// 		1 Splendid Chest (60m)
	// 			F1 S1 W1 R1 R1 R1 W1 W1 F1 W1 W1 W1 M1 M1 S1 F1 R1 R1 F1 R1 S1 W1 W1 W1 R1 R1 F1 S1 S1 S1 W1 F1 R1 F1 W1 R1 W1 S1 R1 R1 W1 W1 W1 S1
	// 		1 Bag of coins (14)
	// 		260 XP
	// 		CHAPTER 2 COMPLETE!!!
	// 2å - "Black blob"
	// 	1/3: k5 et9 (frayed map, binoculars) - "Get to the spill"
	// 		1 Splendid Chest (60m)
	// 			W1 R1 S1 R1 R1 F1 S1 M1 W1 R1 W1 W1 S1 T1 T1 F1 F1 F1 S1 S1 S1 W1 M1 R1 F1 W1 M1 R1 S1 W1 R1 R1 R1 R1 W1 R1 R1 R1 W1 S1 W1 R1 F1 S1
	// 		1 Bag of coins (12)
	// 		260 XP
	// 	2/3: p5(x2) t11 s6(x3) (2 planks, sledgehammer, 3 brick) - "Build oil platform"
	// 		1 Splendid Chest (60m)
	// 			S1 S1 F1 W1 R1 S1 T1 M1 M1 M1 R1 F1 M1 T1 R1 F1 F1 R1 W1 F1 S1 F1 R1 R1 R1 F1 T1 F1 W1 F1 R1 W1 F1 S1 F1 W1 F1 W1 W1 S1 R1 S1 W1 T1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: i9 d6(x2) (gusli, mineral water) - "Celebrate grand opening"
	// 		1 Splendid Chest (m)
	// 			F1 S1 S1 R1 F1 R1 R1 W1 R1 F1 S1 M1 S1 S1 S1 S1 S1 R1 R1 R1 F1 F1 F1 R1 R1 R1 S1 S1 W1 F1 M1 R1 R1 R1 R1 F1 F1 F1 R1 W1 M1 R1 S1 W1
	// 		1 Bag of coins ()
	// 		260 XP
	// 2ä - "Polar Station"
	// 	1/3: cl3 cl6 po3(x3) (scarf, boots, health) - "Get to the polar explorers"
	// 		1 Splendid Chest
	// 			W1 W1 W1 W1 W1 W1 R1 R1 R1 R1 S1 S1 W1 W1 W1 R1 T1 F1 M1 F1 F1 F1 R1 R1 R1 F1 F1 S1 M1 R1 W1 M1 R1 M1 T1 R1 R1 S1 R1 R1 R1 W1 F1 M1
	// 		1 Bag of coins
	// 		260 XP
	// 	2/3: sw7 i8 (jelly, violin) - "Make friends with the polar explorers"
	// 		1 Splendid Chest
	// 			S1 S1 F1 F1 R1 R1 R1 F1 W1 R1 R1 F1 M1 S1 W1 W1 W1 W1 R1 S1 F1 S1 W1 W1 W1 W1 W1 R1 R1 W1 F1 S1 R1 R1 R1 W1 R1 S1 R1 R1 S1 W1 S1 S1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: p5(x4) s6(x4) t10 (4 planks, 4 bricks, doublesaw) - "Build a station"
	// 		1 Splendid Chest
	// 			S1 W1 R1 W1 M1 S1 S1 R1 F1 F1 S1 W1 F1 R1 F1 R1 R1 W1 S1 R1 R1 W1 M1 M1 M1 M1 R1 W1 F1 S1 S1 R1 M1 W1 S1 W1 F1 F1 F1 R1 W1 W1 R1 S1
	// 		1 Bag of coins (14)
	// 		260 XP

	// 3 - About life, universe, and everything

	// 3a -> 3e, 3f - "Crossing"
	// 	1/4: et7 k5 cl8 (compass, map, chaperone) - "Explore the terrain"
	// 		1 Bag of coins
	// 		1 Empty bed
	// 		260 XP
	// 	2/4: fr5 fr4 sw6 (peach, cherry, cupcake) - "Take a break"
	// 		1 Bag of coins (14)
	// 			m5 m5 m5 m5 m5 m5 m5 m4 m4 m4 m4 m4 m5 m5
	// 		260 XP
	// 	3/4: t10 p5(x4) r3(x3) (doublesaw, 4 planks, 3 rope) - "Build a ferry"
	// 		1 Bag of coins (14)
	// 		260 XP
	// 	4/4: et1 po8 m5(x2) (anchor, underwater, 2 air) - "Force the river"

	// 3b -> 3h - "Jungle"
	// 	1/3: k6 et6 et2 (map, magnifying, helm) - "Discover a new island"
	// 		1 Splendid Chest
	// 			R1 W1 T1 M1 W1 R1 R1 S1 W1 S1 W1 F1 M1 F1 W1 R1 F1 R1 R1 R1 F1 R1 R1 R1 W1 T1 S1 S1 W1 W1 M1 R1 R1 R1 T1 S1 R1 S1 W1 F1 F1 F1 W1 W1
	// 		1 Bag of coins ()
	// 		260 XP
	// 	2/3: w10 l9 (halberd, medicinal) - "Explore the thickets"
	// 		1 Splendid Chest
	// 			W1 W1 W1 R1 R1 R1 R1 S1 R1 R1 R1 R1 S1 M1 W1 M1 M1 T1 T1 S1 R1 T1 F1 S1 S1 S1 R1 R1 F1 F1 F1 M1 F1 S1 W1 M1 R1 M1 M1 M1 S1 W1 F1 F1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: po6(x2) f5(x2) sw8 (2 love, 2 chicken, cookies) - "Tame the dinosaur"
	// 		1 Splendid Chest
	// 			R1 R1 F1 W1 F1 F1 R1 T1 W1 W1 S1 R1 R1 R1 M1 S1 S1 F1 W1 R1 R1 W1 S1 W1 W1 S1 F1 S1 S1 F1 W1 S1 S1 R1 F1 M1 R1 R1 W1 R1 R1 M1 F1 T1
	// 		1 Bag of coins
	// 		260 XP

	// 3c -> 3d - "Funnel"
	// 	1/4: 750 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	2/4: 750 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	3/4: 750 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	4/4: 1500 gold - "Pay for work done"
	// 		1 Orb shard
	// 		25 Crystals

	// 3d -> 3d2 - "Funnel"
	// 	1/4: 1000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	2/4: 1000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	3/4: 1000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	4/4: 2000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		25 Crystals

	// 3d2 -> 3d3 - "Mysterious statue"
	// 	1/4: 1500 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	2/4: 1500 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	3/4: 1500 gold - "Pay for work done"
	// 		1 Orb shard
	// 		10 Crystals
	// 	4/4: 3000 gold - "Pay for work done"
	// 		1 Orb shard
	// 		25 Crystals
	// 3d3 - "Mysterious statue"
	// 	1/4: 4500 gold - "Pay for work done"
	// 		1 Orb piece
	// 		20 Crystals
	// 	2/4: 4500 gold - "Pay for work done"
	// 		1 Orb piece
	// 		20 Crystals
	// 	3/4: 4500 gold - "Pay for work done"
	// 		1 Orb piece
	// 		20 Crystals
	// 	4/4: 9000 gold - "Pay for work done"
	// 		1 Orb piece
	// 		?? Crystals

	// 3e -> 3g - "Market"
	// 	1/1: s6(x2) t7 m9 (2 brick, trowel, dwarf) - "Open a mall"
	// 		1 Bag of coins
	// 		260 XP
	// 	UNLOCKS MERCHANT - Sarcophagus & Sandstone

	// 3f -> 3i - "Fields"
	// 	1/4: et7 hi3 cl6 - "Getting to the floodplain"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: d6(x2) et5 hi2 (mineral, inkwell, scroll) - "Develop a plan"
	// 		1 Bag of coins (14)
	// 		260 XP
	// 	3/4: fr7 fl2 sw7 (orange, poppy, jelly) - "Win over the gods"
	// 		1 Bag of coins (14)
	// 		260 XP
	// 	4/4: fr5(x2) t8 (2 peach, shovel) - "Restore fields"
	// 		1 Bag of coins
	// 		260 XP

	// 3g - "Ship in the Sands"
	// 	1/3: a6 w7 l6 (breastplate, flamberge, medicinal) - "Chase away the looters"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/3: p5(x2) t10 r3(x2) (2 planks, doublesaw, 2 rope) - "Repair the ship"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/3: et2 et7 k5 (helm, compass, frayed map) - "Outfit the ship"
	// 		1 Bag of coins
	// 		260 XP

	// 3h - "Park"
	// 	1/3: et7 f6(x3) m6(x2) (compass, 3 foodvase, 2 mineral) - "Go inland"
	// 		1 Splendid Chest
	// 			F1 W1 W1 M1 W1 S1 M1 R1 W1 R1 F1 W1 T1 R1 R1 R1 F1 R1 R1 S1 S1 R1 M1 F1 S1 W1 R1 R1 F1 W1 S1 W1 F1 W1 S1 F1 F1 S1 W1 W1 S1 R1 R1 S1
	// 		1 Bag of coins ()
	// 		260 XP
	// 	2/3: t10 w8 x6(x3) (doublesaw, axe, 3 explosives) - "Clear the site"
	// 		1 Splendid Chest
	// 			F1 R1 S1 R1 M1 S1 W1 S1 R1 S1 S1 R1 F1 R1 F1 R1 R1 R1 S1 W1 W1 R1 R1 T1 F1 F1 W1 S1 S1 S1 W1 F1 F1 F1 R1 W1 T1 R1 R1 R1 W1 W1 M1 R1
	// 		1 Coffee-grinder
	// 		260 XP
	// 	3/3: t12 t8 r3(x4)
	// 		1 Splendid Chest
	// 			W1 S1 S1 S1 F1 F1 R1 S1 S1 F1 R1 S1 S1 S1 F1 F1 W1 F1 F1 R1 S1 R1 R1 W1 S1 M1 F1 W1 F1 F1 W1 S1 R1 S1 R1 F1 R1 R1 F1 W1 S1 R1 M1 M1
	// 		1 Bag of coins
	// 		260 XP

	// 3i -> 3j, 3k - "Great Worm"
	// 	1/4: w11 a5 l8 (musket, brigantine, medicinal) - "Fight the worm"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: fl4 sw8 (lily, cookies) - "Win over the worm"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4: po6 hi3 ri5 (love, tablet, magic) - "Talk with the worm"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/4: f6(x2) fr7 i8 (2 foodvase, orange, violin) - "Party with the worm"
	// 		1 Bag of coins
	// 		260 XP

	// 3j -> 3l - "Entrance to the Valley"
	// 	1/5: et9 po5(x2) (binoculars, 2 invisibility) - "Examine the camp"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/5: d6 g6 ri4 (mineral, gold, signet) - "Talk to the raiders"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/5: am2 et5 hi2 (tranquility, inkwell, scroll) - "Come up with a plan"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/5: w10 m4 x6(x3) (halberd, fire, 3 explosives) - "Chase away the raiders"
	// 		1 Bag of coins
	// 		260 XP
	// 	5/5: sb1 t7(x2) m9 (building block, 2 trowel, dwaft) - "Restore the entrance"
	// 		1 Bag of coins
	// 		260 XP

	// 3k -> 3m - "Burning Village"
	// 	1/4: m3(x3) a4 ri5 (3 water, leather, magic ring) - "Put out the fire"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: hi6(x2) et4 t3 (2 scarab, ship's bell, hammer) - "Revoke the curse"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4: t10 p5(x2) s6(x3) (doublesaw, 2 planks, 3 brick) - "Restore the village"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/4: sw6(x2) fr6(x2) i8 (2 cupcake, 2 pear, violin) - "Have a party"
	// 		1 Bag of coins
	// 		260 XP

	// 3l -> 3n - "Abandoned Valley"
	// 	1/4: fr6 cl2(x2) r3(x2) - "Set up camp"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: t11 t4(x2) r3(x3) (sledgehammer, 2 hatchet, 3 rope) - "Gather materials"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4: sb2 t5 a1(x2) (building block, crowbar, 2 gauntlets) - "Restore the area"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/4: fl4 hi8 hi7 (lily, dog statue, cat statue) - "Decorate the square"
	// 		1 Bag of coins
	// 		260 XP

	// 3m -> 3o, 3p - "Temple of Anubis"
	// 	1/4: cl9 cl6 d6(x2) (shirt, boots, 2 mineral) - "Hit the road"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: et10 et7 m6 (astrolabe, compass, map) - "Find a Temple"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4: fr8 sw7 f5(x2) (banana, jely, 2 chicken) - "Win over the dogs"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/4: hi5(x3) i5 w9 (3 bust of the queen, drums, battleaxe) - "Pass the test"
	// 		1 Bag of coins

	// 3n -> 3r, 3s - "Destroyed Necropolis"
	// 	1/1: po9 x6(x3) (explosive potion, 3 explosives) - "Open the entrance"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/2: m7(x2) cl10 (2 light, coat) - "Explore Necropolis"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/3: et6 hi3 am2 (magnifying, tablet, tranquility) - "Read the letters"
	// 		1 Bag of coins
	// 		260 XP

	// 3o -> 3u - "Oasis"
	// 	1/4: cl6 cl11 m5 (boots, robe, frayed) - "Continue on your way"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: fr6(x2) sw6(x2) f6(x2) (2 pear, 2 cupcake, 2 foodvase) - "Take a break"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4: t13 hi4(x2) t8(x2) (hand drill, 2 vase, 2 shovel) - "Get water"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/4: sb2 et12 p4(x2) (building block, diving helmet, 2 bar) - "Build a water park"
	// 		1 Bag of coins
	// 		260 XP

	// 3p -> 3q - "Oil-rig"
	// 	1/3: fr6 d6(x2) fl6 (pear, 2 mineral, lotus) - "Greet the dwarves"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/3: w10 p4(x2) sb1 (doublesaw, 2 bar, building block) - "Build a mine"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/3: i8 d3(x2) f6(x2) (violin, 2 sarsaparilla, 2 foodvase) - "Open the shaft"
	// 		1 Bag of coins
	// 		260 XP

	// 3q -> 3t - "Dwarf Village"
	// 	1/4: w10 a7 p8 (halberd, plate armor, medicinal potion) - "Chase the outlaws away"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: m9 t8 sb1 (dwarf magic, shovel, building block) - "Equip the place"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4: sb2 t3(x2) r3(x2) (building block, 2 hammer, 2 rope) - "Build a village"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/4: hi5(x2) g6 cl2(x2) (2 bust of the queen, gold, cloth) - "Decorate the village"
	// 		1 Bag of coins
	// 		260 XP

	// 3r -> 3v - "Wind Turbines"
	// 	1/3: r3(x2) cl7 t6 (2 rope, trousers, pick) - "Climb the cliffs"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/3: sb2 t10 (building block, double-saw) - "Restore wind turbines"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/3: sb3 t11 m3 (broken column, sledgehammer, water) - "Fix the aqueduct"
	// 		1 Bag of coins
	// 		260 XP

	// 3s - "Necropolis"
	// 	1/3: sb2 t11 (building block, sledgehammer) - "Restore the Necropolis"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/3: anhk + violin
	// 	3/3: po11 m5 a2 - "Run!"

	// 3t - "Dwarf Temple"
	// 	1/3: m5 et11 (frayed map, sextant) - "Find a place"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/3:
	// 	3/3:

	// 3u - "Temple of Bastet"
	// 	1/4: i8 fr8 sw8 (violin, banana, cookies) - "Open a new temple"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: d6(x2) hi3 m10(x2) (2 mineralwater, hieroglyph tablet, meta) - "Study the letters"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4:
	// 	4/4:

	// 3v - "City on a Rock"
	// 	1/4: r3(x2) cl7 t6 (2 rope, trousers, pick) - "Explore the city"
	// 		1 Bag of coins
	// 		260 XP
	// 	2/4: ri5 hi2 i9 (magic ring, scroll, gusli) - "Banish evil spirits"
	// 		1 Bag of coins
	// 		260 XP
	// 	3/4: sb2(x2) t7 s6(x2) (2 building block, trowel, 2 brick) - "Restore the city"
	// 		1 Bag of coins
	// 		260 XP
	// 	4/4: i10 f6(x2) (harp, 2 foodvase) - "Have a party"
	// 		1 Bag of coins
	// 		260 XP
};

export class TaskManager extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private currentTasks: string[];

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.verifyTaskList();

		this.currentTasks = ["0a"];
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
