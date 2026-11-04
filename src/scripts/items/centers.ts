import Asset from "../assets/Asset";

// import pokedex from "../../assets/items/centers/17421 Pokédex (4th Generation).png";
import rotomPhone from "../../assets/items/centers/Bag_Rotom_Phone_Sprite.png";
import pc from "../../assets/items/centers/13867 PC.png";
import tent from "../../assets/items/centers/15062 Tent.png";
import johtoGym from "../../assets/items/centers/11956 Johto Pokémon Gyms.png";
import pokemonLeague from "../../assets/items/centers/12072 Pokémon League.png";
import centerHGSS from "../../assets/items/centers/10762 Pokémon Center HGSS.png";
import centerDP from "../../assets/items/centers/11106 Pokémon Center DP.png";
import centerBW from "../../assets/items/centers/12016 Pokémon Center BW.png";
import vermilionPort from "../../assets/items/centers/11977 Vermilion Port Entrance.png";

export const centerAssets: Asset[] = [
	{ key: "rotomPhone", path: rotomPhone },
	{ key: "pc", path: pc },
	{ key: "tent", path: tent },
	{ key: "centerDP", path: centerDP },
	{ key: "centerHGSS", path: centerHGSS },
	{ key: "johtoGym", path: johtoGym },
	{ key: "centerBW", path: centerBW },
	{ key: "vermilionPort", path: vermilionPort },
	{ key: "pokemonLeague", path: pokemonLeague },
];

import ItemData from "./ItemData";

export const centerItems: ItemData[] = [
	{
		// Tier 1
		key: "rotomPhone",
		name: "Rotom Phone",
		scale: 1.35,
	},

	{
		// Tier 2
		key: "pc",
		name: "PC",
		scale: 0.95,
	},

	{
		// Tier 3
		key: "tent",
		name: "Tent",
		scale: 0.92,
	},

	{
		// Tier 4
		key: "centerDP",
		name: "Pokémon Center (DP)",
		scale: 0.87,
		generator: {
			maxCharges: 20,
			rechargeCount: 6,
			rechargeTime: 150 * 60 * 1000,
			items: [
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
			],
		},
	},

	{
		// Tier 5
		key: "centerHGSS",
		name: "Pokémon Center (HGSS)",
		scale: 1.0,
		generator: {
			maxCharges: 30,
			rechargeCount: 8,
			rechargeTime: 110 * 60 * 1000,
			items: [
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "armor", tier: 1 },
			],
		},
	},

	{
		// Tier 6
		key: "johtoGym",
		name: "Johto Gym",
		scale: 1.04,
		generator: {
			maxCharges: 40,
			rechargeCount: 10,
			rechargeTime: 75 * 60 * 1000,
			items: [
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "armor", tier: 1 },
			],
		},
	},

	{
		// Tier 7
		key: "vermilionPort",
		name: "Vermilion Port Entrance",
		scale: 1.09,
		generator: {
			maxCharges: 50,
			rechargeCount: 12,
			rechargeTime: 55 * 60 * 1000,
			items: [
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 3 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 3 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 3 },
				{ category: "armor", tier: 2 },
			],
		},
	},

	{
		// Tier 8
		key: "centerBW",
		name: "Pokémon Center (BW)",
		scale: 1.01,
		generator: {
			maxCharges: 60,
			rechargeCount: 12,
			rechargeTime: 40 * 60 * 1000,
			items: [
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 3 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "armor", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 4 },
				{ category: "armor", tier: 2 },
			],
		},
	},

	{
		// Tier 9
		key: "pokemonLeague",
		name: "Pokémon League",
		scale: 1.08,
		generator: {
			maxCharges: 70,
			rechargeCount: 14,
			rechargeTime: 28 * 60 * 1000,
			items: [
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 1 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 3 },
				{ category: "armor", tier: 1 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 4 },
				{ category: "armor", tier: 2 },
				{ category: "weapon", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 4 },
				{ category: "armor", tier: 2 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 3 },
				{ category: "weapon", tier: 4 },
				{ category: "armor", tier: 3 },
			],
		},
	},
];
