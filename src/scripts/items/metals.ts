import Asset from "../assets/Asset";

import twistedSpoon from "../../assets/items/metal/Dream_Twisted_Spoon_Sprite.png";
import dragonFang from "../../assets/items/metal/Dream_Dragon_Fang_Sprite.png";
import gripClaw from "../../assets/items/metal/Dream_Grip_Claw_Sprite.png";
import razorClaw from "../../assets/items/metal/Dream_Razor_Claw_Sprite.png";
import razorFang from "../../assets/items/metal/Dream_Razor_Fang_Sprite.png";
import sootheBell from "../../assets/items/metal/Dream_Soothe_Bell_Sprite.png";

export const metalAssets: Asset[] = [
	{ key: "dragonFang", path: dragonFang },
	{ key: "gripClaw", path: gripClaw },
	{ key: "razorClaw", path: razorClaw },
	{ key: "razorFang", path: razorFang },
	{ key: "sootheBell", path: sootheBell },
	{ key: "twistedSpoon", path: twistedSpoon },
];

import ItemData from "./ItemData";

export const metalItems: ItemData[] = [
	{
		// Tier 1
		key: "twistedSpoon",
		name: "Twisted Spoon",
		scale: 1.04,
	},

	{
		// Tier 2
		key: "razorClaw",
		name: "Razor Claw",
		scale: 1.04,
	},

	{
		// Tier 3
		key: "razorFang",
		name: "Razor Fang",
		scale: 1.12,
	},

	{
		// Tier 4
		key: "dragonFang",
		name: "Dragon Fang",
		scale: 1.21,
	},

	{
		// Tier 5
		key: "gripClaw",
		name: "Grip Claw",
		scale: 1.15,
	},

	{
		// Tier 6
		key: "sootheBell",
		name: "Soothe Bell",
		scale: 1.37,
	},
];
