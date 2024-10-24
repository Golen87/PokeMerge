import ItemData from "./items/ItemData";
import { martItems } from "./items/marts";
import { ruinItems } from "./items/ruins";
import { constructionItems } from "./items/constructions";
import { pokeballItems } from "./items/pokeballs";
import { techItems } from "./items/techs";
import { metalItems } from "./items/metals";
import { driveItems } from "./items/drives";
import { stoneItems } from "./items/stones";
import { fossilItems } from "./items/fossils";
import { potionItems } from "./items/potions";
import { nintendoItems } from "./items/nintendo";
import { experienceItems } from "./items/experience";
import { pearlItems } from "./items/pearls";
import { drinkItems } from "./items/drinks";
import { boatItems } from "./items/boats";
import { shellItems } from "./items/shells";
import { centerItems } from "./items/centers";
import { treeItems } from "./items/trees";
import { berryItems } from "./items/berries";
import { edibleItems } from "./items/edibles";
import { herbItems } from "./items/herbs";



const itemData: { [category: string]: ItemData[] } = {

	mart: martItems,
	pokeball: pokeballItems,
	potion: potionItems,

	ruin: ruinItems,
	fossil: fossilItems,
	stone: stoneItems,

	construction: constructionItems,
	drive: driveItems,
	tech: techItems,
	metal: metalItems,

	// vending: vendingItems,

	center: centerItems,

	tree: treeItems,
	berry: berryItems,
	edible: edibleItems,
	herb: herbItems,

	nintendo: nintendoItems,

	boat: boatItems,
	shell: shellItems,
	drink: drinkItems,
	pearl: pearlItems,


	/* Chest */

	/*
	levelUpRewardChest: [
		{ key: "chest_1",	scale: 0.96,	name: "Reward chest",
			charges: 7,
			generates: [
				{ category: "potion",	tier: 1 },
				{ category: "mart",		tier: 1 },
				{ category: "pokeball",	tier: 1 },
				{ category: "mart",		tier: 2 },
				{ category: "pokeball",	tier: 1 },
				{ category: "pokeball",	tier: 2 },
				{ category: "potion",	tier: 2 },
			]
		},
	],
	martChest: [
		{ key: "chest_1",	scale: 0.96,	name: "Mart chest",
			charges: 7,
			generates: [
				{ category: "pokeball",	tier: 1 },
				{ category: "pokeball",	tier: 1 },
				{ category: "mart",		tier: 1 },
				{ category: "potion",	tier: 1 },
				{ category: "pokeball",	tier: 2 },
				{ category: "mart",		tier: 2 },
				{ category: "potion",	tier: 2 },
			]
		},
	],
	ruinChest: [
		{ key: "chest_2",	scale: 0.96,	name: "Ruin chest",
			charges: 7,
			generates: [
				{ category: "stone",	tier: 1 },
				{ category: "ruin",		tier: 1 },
				{ category: "fossil",	tier: 1 },
				{ category: "ruin",		tier: 2 },
				{ category: "fossil",	tier: 1 },
				{ category: "fossil",	tier: 2 },
				{ category: "stone",	tier: 2 },
			]
		},
	],
	constructionChest: [
		{ key: "chest_3",	scale: 0.96,	name: "Construction chest",
			charges: 7,
			generates: [
				{ category: "drink",		tier: 1 },
				{ category: "construction",	tier: 1 },
				{ category: "vending",		tier: 1 },
				{ category: "construction",	tier: 2 },
				{ category: "vending",		tier: 1 },
				{ category: "vending",		tier: 2 },
				{ category: "drink",		tier: 2 },
			]
		},
	],
	*/
	// rewardChest2: [
		// { key: "chest_2",	scale: 0.99,	name: "Reward chest" },
	// ],
	// rewardChest3: [
		// { key: "chest_3",	scale: 1.02,	name: "Reward chest" },
	// ],

	experience: experienceItems,
};


// Check
// for (let type in itemData) {
// 	// console.log(type, itemData[type].length);
// 	for (let obj of itemData[type]) {
// 		if (obj.generates) {
// 			let sum = 0;
// 			for (let drop of obj.generates) {
// 				sum += drop.odds;
// 			}
// 			if (Math.abs(sum - 1) > 0.001) {
// 				console.error(type, obj.name, sum);
// 			}
// 		}
// 	}
// }


export { itemData };
