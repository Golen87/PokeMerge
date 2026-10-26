import Asset from "../assets/Asset";

import trainerTips from "../../assets/items/marts/11090 Trainer Tips.png";
import pokeMartSign from "../../assets/items/marts/12210 Poké Mart Sign.png";
import pokeMartShelves from "../../assets/items/marts/15131 Poké Mart Shelves.png";
import pokeMartDP from "../../assets/items/marts/11107 Poké Mart DP.png";
import pokeMartHGSS from "../../assets/items/marts/10767 Poké Mart HGSS.png";
import kantoPokemonGyms from "../../assets/items/marts/12007 Kanto Pokémon Gyms.png";
import celadonStore from "../../assets/items/marts/11992 Celadon Department Store.png";
import goldenrodStore from "../../assets/items/marts/11937 Goldenrod Department Store.png";
import silphCo from "../../assets/items/marts/11983 Silph Co..png";
import foreignBuilding from "../../assets/items/marts/12080 Foreign Building.png";

export const martAssets: Asset[] = [
	{ key: "trainerTips", path: trainerTips },
	{ key: "pokeMartSign", path: pokeMartSign },
	{ key: "pokeMartShelves", path: pokeMartShelves },
	{ key: "pokeMartDP", path: pokeMartDP },
	{ key: "pokeMartHGSS", path: pokeMartHGSS },
	{ key: "kantoPokemonGyms", path: kantoPokemonGyms },
	{ key: "celadonStore", path: celadonStore },
	{ key: "goldenrodStore", path: goldenrodStore },
	{ key: "silphCo", path: silphCo },
	{ key: "foreignBuilding", path: foreignBuilding },
];

import ItemData from "./ItemData";

export const martItems: ItemData[] = [
	{
		// Tier 1
		key: "trainerTips",
		name: "Trainer Tips",
		scale: 0.9,
	},

	{
		// Tier 2
		key: "pokeMartSign",
		name: "Poké Mart Sign",
		scale: 1.1,
	},

	{
		// Tier 3
		key: "pokeMartShelves",
		name: "Poké Mart Shelves",
		scale: 1.15,
	},

	{
		// Tier 4
		key: "pokeMartDP",
		name: "Poké Mart (DP)",
		scale: 1.1,
		generator: {
			maxCharges: 20,
			rechargeCount: 6,
			rechargeTime: 150 * 60 * 1000,
			items: [
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
			],
		},
	},

	{
		// Tier 5
		key: "pokeMartHGSS",
		name: "Poké Mart (HGSS)",
		scale: 1.4,
		generator: {
			maxCharges: 30,
			rechargeCount: 8,
			rechargeTime: 110 * 60 * 1000,
			items: [
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "potion", tier: 1 },
			],
		},
	},

	{
		// Tier 6
		key: "kantoPokemonGyms",
		name: "Kanto Pokémon Gyms",
		scale: 1.1,
		generator: {
			maxCharges: 40,
			rechargeCount: 10,
			rechargeTime: 75 * 60 * 1000,
			items: [
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "potion", tier: 1 },
			],
		},
	},

	{
		// Tier 7
		key: "celadonStore",
		name: "Celadon Department Store",
		scale: 1.15,
		generator: {
			maxCharges: 50,
			rechargeCount: 12,
			rechargeTime: 55 * 60 * 1000,
			items: [
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 2 },
			],
		},
	},

	{
		// Tier 8
		key: "goldenrodStore",
		name: "Goldenrod Department Store",
		scale: 1.1,
		generator: {
			maxCharges: 60,
			rechargeCount: 12,
			rechargeTime: 40 * 60 * 1000,
			items: [
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "potion", tier: 2 },
			],
		},
	},

	{
		// Tier 9
		key: "silphCo",
		name: "Silph Co.",
		scale: 1.15,
		generator: {
			maxCharges: 70,
			rechargeCount: 14,
			rechargeTime: 28 * 60 * 1000,
			items: [
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "potion", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "potion", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "potion", tier: 3 },
			],
		},
	},

	{
		// Tier 10
		key: "foreignBuilding",
		name: "Foreign Building",
		scale: 1.2,
		generator: {
			maxCharges: 80,
			rechargeCount: 16,
			rechargeTime: 20 * 60 * 1000,
			items: [
				{ category: "pokeball", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "potion", tier: 1 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "potion", tier: 2 },
				{ category: "pokeball", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "potion", tier: 2 },
				{ category: "pokeball", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "potion", tier: 3 },
				{ category: "pokeball", tier: 4 },
				{ category: "pokeball", tier: 5 },
				{ category: "potion", tier: 3 },
			],
		},
	},
];

/*
console.log("Mart");
martItems.forEach((item, index) => {
	if (!item.generator) return;

	const counts = { pokeball: 0, potion: 0 };

	item.generator.items.forEach(({ category, tier }) => {
		const value = 2 ** (tier - 1);
		if (counts[category] !== undefined) {
			counts[category] += value;
		}
	});

	const total = counts.pokeball + counts.potion;
	const pokeballPct = ((counts.pokeball / total) * 100).toFixed();
	const potionPct = ((counts.potion / total) * 100).toFixed();
	const l = item.generator.items.length;

	console.log(
		`${index + 1}: ${counts.pokeball} + ${counts.potion} = ${
			counts.pokeball + counts.potion
		} | ${(counts.pokeball / l).toFixed(1)} + ${(counts.potion / l).toFixed(
			1
		)} | ${pokeballPct}% ${potionPct}%`
	);
});
*/
