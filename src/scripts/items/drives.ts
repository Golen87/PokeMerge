import Asset from "../assets/Asset";

import shockDrive from "../../assets/items/drives/1_Dream_Shock_Drive_Sprite.png";
import electirizer from "../../assets/items/drives/2_Dream_Electirizer_Sprite.png";
import upGrade from "../../assets/items/drives/3_Dream_Up-Grade_Sprite.png";

export const driveAssets: Asset[] = [
	{ key: "shockDrive", path: shockDrive },
	{ key: "electirizer", path: electirizer },
	{ key: "upGrade", path: upGrade },
];

import ItemData from "./ItemData";

export const driveItems: ItemData[] = [
	{
		// Tier 1
		key: "shockDrive",
		name: "Shock Drive",
		scale: 1.39,
	},
	{
		// Tier 2
		key: "electirizer",
		name: "Electirizer",
		scale: 1.02,
	},
	{
		// Tier 3
		key: "upGrade",
		name: "Up-Grade",
		scale: 1.15,
		generator: {
			depletable: true,
			depleteDrop: { category: "metal", tier: 1 },
			maxCharges: 6,
			rechargeTime: 10 * 1000,
			items: [{ category: "tech", tier: 1 }],
		},
	},
];
