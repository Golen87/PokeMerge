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
		scale: 0.93,
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
			rechargeTime: 1 * 60 * 1000,
			items: [
				{ category: "fire", tier: 1 },
				{ category: "fire", tier: 1 },
				{ category: "fire", tier: 2 },
				{ category: "fire", tier: 1 },
				{ category: "fire", tier: 1 },
				{ category: "fire", tier: 2 },
				{ category: "fire", tier: 1 },
				{ category: "fire", tier: 3 },
			],
		},
	},

	{
		// Tier 5
		key: "centerHGSS",
		name: "Pokémon Center (HGSS)",
		scale: 1.0,
	},

	{
		// Tier 6
		key: "johtoGym",
		name: "Johto Gym",
		scale: 1.04,
	},

	{
		// Tier 7
		key: "vermilionPort",
		name: "Vermilion Port Entrance",
		scale: 1.09,
	},

	{
		// Tier 8
		key: "centerBW",
		name: "Pokémon Center (BW)",
		scale: 1.01,
	},

	{
		// Tier 9
		key: "pokemonLeague",
		name: "Pokémon League",
		scale: 1.08,
	},
];
