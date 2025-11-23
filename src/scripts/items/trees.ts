import Asset from "../assets/Asset";

import richMulch from "../../assets/items/tree/1_Dream_Rich_Mulch_Sprite.png";
import sprout from "../../assets/items/tree/2_sprout.png";
import sapling from "../../assets/items/tree/3_sapling.png";
import berryTree from "../../assets/items/tree/4_berry_tree.png";
import bigPlant from "../../assets/items/tree/5_big_plant.png";
import simsTree from "../../assets/items/tree/6_sims_tree.png";
import fruitTree from "../../assets/items/tree/7_fruit_tree.png";
import grandTree from "../../assets/items/tree/8_grand_tree.png";

export const treeAssets: Asset[] = [
	{ key: "richMulch", path: richMulch },
	{ key: "sprout", path: sprout },
	{ key: "sapling", path: sapling },
	{ key: "berryTree", path: berryTree },
	{ key: "bigPlant", path: bigPlant },
	{ key: "simsTree", path: simsTree },
	{ key: "fruitTree", path: fruitTree },
	{ key: "grandTree", path: grandTree },
];

import ItemData from "./ItemData";

export const treeItems: ItemData[] = [
	{
		// Tier 1
		key: "richMulch",
		name: "Rich Mulch",
		scale: 0.72,
	},
	{
		// Tier 2
		key: "sprout",
		name: "Sprout",
		scale: 0.87,
	},
	{
		// Tier 3
		key: "sapling",
		name: "Sapling",
		scale: 0.92,
	},
	{
		// Tier 4
		key: "berryTree",
		name: "Berry Bush",
		scale: 1.0,
		generator: {
			maxCharges: 8,
			rechargeCount: 4,
			rechargeTime: 120 * 1000,
			items: [{ category: "berry", tier: 1 }],
		},
		dispenser: {
			maxCharges: 8,
			rechargeTime: 190 * 1000,
			item: { category: "herb", tier: 1 },
		},
	},
	{
		// Tier 5
		key: "bigPlant",
		name: "Berry Shrub",
		scale: 1.1,
		generator: {
			maxCharges: 10,
			rechargeCount: 6,
			rechargeTime: 60 * 1000,
			items: [{ category: "berry", tier: 1 }],
		},
		dispenser: {
			maxCharges: 8,
			rechargeTime: 110 * 1000,
			item: { category: "herb", tier: 1 },
		},
	},
	{
		// Tier 6
		key: "simsTree",
		name: "Berry Tree",
		scale: 1.1,
		generator: {
			maxCharges: 12,
			rechargeCount: 6,
			rechargeTime: 60 * 1000,
			items: [{ category: "berry", tier: 1 }],
		},
		dispenser: {
			maxCharges: 8,
			rechargeTime: 60 * 1000,
			item: { category: "herb", tier: 1 },
		},
	},
	{
		// Tier 7
		key: "fruitTree",
		name: "Fruit Tree",
		scale: 1.2,
		generator: {
			maxCharges: 16,
			rechargeCount: 6,
			rechargeTime: 60 * 1000,
			items: [{ category: "berry", tier: 1 }],
		},
		dispenser: {
			maxCharges: 8,
			rechargeTime: 35 * 1000,
			item: { category: "herb", tier: 1 },
		},
	},
	{
		// Tier 8
		key: "grandTree",
		name: "Grand Tree",
		scale: 1.25,
		generator: {
			maxCharges: 20,
			rechargeCount: 6,
			rechargeTime: 60 * 1000,
			items: [{ category: "berry", tier: 1 }],
		},
		dispenser: {
			maxCharges: 8,
			rechargeTime: 20 * 1000,
			item: { category: "herb", tier: 1 },
		},
	},
];
