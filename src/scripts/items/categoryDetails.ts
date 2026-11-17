import type { ItemCategory } from "../items";

interface CategoryDetailsSection {
	title: string;
	categories: ItemCategory[];
}

export const itemCategoryDetails: Partial<Record<ItemCategory, CategoryDetailsSection[]>> = {
	mart: [
		{ title: "Produces:", categories: ["pokeball", "potion"] },
	],
	pokeball: [
		{ title: "Comes from:", categories: ["mart"] },
	],
	potion: [
		{ title: "Comes from:", categories: ["mart"] },
	],

	ruin: [
		{ title: "Produces:", categories: ["fossil", "stone"] },
	],
	fossil: [
		{ title: "Comes from:", categories: ["ruin"] },
	],
	stone: [
		{ title: "Comes from:", categories: ["ruin"] },
	],

	construction: [
		{ title: "Produces:", categories: ["drive"] },
	],
	drive: [
		{ title: "Produces:", categories: ["tech", "metal"] },
		{ title: "Comes from:", categories: ["construction"] },
	],
	tech: [
		{ title: "Comes from:", categories: ["drive"] },
	],
	metal: [
		{ title: "Comes from:", categories: ["drive"] },
	],

	center: [
		{ title: "Produces:", categories: ["weapon", "armor"] },
	],
	weapon: [
		{ title: "Comes from:", categories: ["center"] },
	],
	armor: [
		{ title: "Comes from:", categories: ["center"] },
	],

	tree: [
		{ title: "Produces:", categories: ["berry", "herb"] },
	],
	berry: [
		{ title: "Produces:", categories: ["edible"] },
		{ title: "Comes from:", categories: ["tree"] },
	],
	edible: [
		{ title: "Comes from:", categories: ["berry"] },
	],
	herb: [
		{ title: "Comes from:", categories: ["tree"] },
	],

	nintendo: [
		{ title: "Produces:", categories: ["mart", "center", "ruin", "construction", "boat", "tree"] },
	],

	boat: [
		{ title: "Produces:", categories: ["shell"] },
	],
	shell: [
		{ title: "Produces:", categories: ["drink", "pearl"] },
		{ title: "Comes from:", categories: ["boat"] },
	],
	drink: [
		{ title: "Comes from:", categories: ["shell"] },
	],
	pearl: [
		{ title: "Comes from:", categories: ["shell"] },
	],

	pidgey: [],

	experience: [],
	coin: [
		{ title: "Comes from:", categories: ["coinChest"] },
	],

	coinChest: [
		{ title: "Produces:", categories: ["coin"] },
	],
};
