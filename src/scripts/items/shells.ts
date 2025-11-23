import Asset from "../assets/Asset";

import shellBell from "../../assets/items/shells/1_Dream_Shell_Bell_Sprite.png";
import shoalShell from "../../assets/items/shells/2_Dream_Shoal_Shell_Sprite.png";
import heartScale from "../../assets/items/shells/3_Dream_Heart_Scale_Sprite.png";
import dragonScale from "../../assets/items/shells/4_Dream_Dragon_Scale_Sprite.png";
import prismScale from "../../assets/items/shells/5_Dream_Prism_Scale_Sprite.png";
import deepSeaScale from "../../assets/items/shells/6_Dream_Deep_Sea_Scale_Sprite.png";
import deepSeaTooth from "../../assets/items/shells/7_Dream_Deep_Sea_Tooth_Sprite.png";
import miracleSeed from "../../assets/items/shells/8_Dream_Miracle_Seed_Sprite.png";
import kingsRock from "../../assets/items/shells/9_Dream_Kings_Rock_Sprite.png";

export const shellAssets: Asset[] = [
	{ key: "shellBell", path: shellBell },
	{ key: "shoalShell", path: shoalShell },
	{ key: "heartScale", path: heartScale },
	{ key: "dragonScale", path: dragonScale },
	{ key: "prismScale", path: prismScale },
	{ key: "deepSeaScale", path: deepSeaScale },
	{ key: "deepSeaTooth", path: deepSeaTooth },
	{ key: "miracleSeed", path: miracleSeed },
	{ key: "kingsRock", path: kingsRock },
];

import ItemData from "./ItemData";

export const shellItems: ItemData[] = [
	{
		// Tier 1
		key: "shellBell",
		name: "Shell Bell",
		scale: 1.07,
		generator: {
			depletable: true,
			maxCharges: 1,
			rechargeTime: 10 * 1000,
			items: [
				{ category: "drink", tier: 1 },
				{ category: "drink", tier: 1 },
				{ category: "drink", tier: 1 },
				{ category: "drink", tier: 1 },
				{ category: "drink", tier: 1 },
				{ category: "drink", tier: 1 },
				{ category: "drink", tier: 1 },
				{ category: "pearl", tier: 1 },
			],
			shuffleItems: true,
		},
	},

	{
		// Tier 2
		key: "shoalShell",
		name: "Shoal Shell",
		scale: 1.02,
	},

	{
		// Tier 3
		key: "heartScale",
		name: "Heart Scale",
		scale: 1.14,
	},

	{
		// Tier 4
		key: "dragonScale",
		name: "Dragon Scale",
		scale: 1.28,
	},

	{
		// Tier 5
		key: "prismScale",
		name: "Prism Scale",
		scale: 1.07,
	},

	{
		// Tier 6
		key: "deepSeaScale",
		name: "Deep Sea Scale",
		scale: 1.21,
	},

	{
		// Tier 7
		key: "deepSeaTooth",
		name: "Deep Sea Tooth",
		scale: 1.21,
	},

	{
		// Tier 8
		key: "miracleSeed",
		name: "Miracle Seed",
		scale: 1.18,
	},

	{
		// Tier 9
		key: "kingsRock",
		name: "King's Rock",
		scale: 1.42,
	},
];
