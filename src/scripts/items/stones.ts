import Asset from "../assets/Asset";

import fireStone from "../../assets/items/stones/Dream_Fire_Stone_Sprite.png";
import waterStone from "../../assets/items/stones/Dream_Water_Stone_Sprite.png";
import thunderStone from "../../assets/items/stones/Dream_Thunder_Stone_Sprite.png";
import leafStone from "../../assets/items/stones/Dream_Leaf_Stone_Sprite.png";
import moonStone from "../../assets/items/stones/Dream_Moon_Stone_Sprite.png";
import sunStone from "../../assets/items/stones/Dream_Sun_Stone_Sprite.png";
import shinyStone from "../../assets/items/stones/Dream_Shiny_Stone_Sprite.png";
import duskStone from "../../assets/items/stones/Dream_Dusk_Stone_Sprite.png";
import dawnStone from "../../assets/items/stones/Dream_Dawn_Stone_Sprite.png";
import iceStone from "../../assets/items/stones/Dream_Ice_Stone_Sprite.png";

export const stoneAssets: Asset[] = [
	{ key: "fireStone", path: fireStone },
	{ key: "waterStone", path: waterStone },
	{ key: "thunderStone", path: thunderStone },
	{ key: "leafStone", path: leafStone },
	{ key: "moonStone", path: moonStone },
	{ key: "sunStone", path: sunStone },
	{ key: "shinyStone", path: shinyStone },
	{ key: "duskStone", path: duskStone },
	{ key: "dawnStone", path: dawnStone },
	{ key: "iceStone", path: iceStone },
];

import ItemData from "./ItemData";

export const stoneItems: ItemData[] = [
	{
		// Tier 1
		key: "moonStone",
		name: "Moon Stone",
		scale: 1.0,
	},

	{
		// Tier 2
		key: "leafStone",
		name: "Leaf Stone",
		scale: 1.0,
	},

	{
		// Tier 3
		key: "thunderStone",
		name: "Thunder Stone",
		scale: 1.0,
	},

	{
		// Tier 4
		key: "shinyStone",
		name: "Shiny Stone",
		scale: 1.0,
	},

	{
		// Tier 5
		key: "fireStone",
		name: "Fire Stone",
		scale: 1.0,
	},

	{
		// Tier 6
		key: "dawnStone",
		name: "Dawn Stone",
		scale: 1.07,
	},

	{
		// Tier 7
		key: "iceStone",
		name: "Ice Stone",
		scale: 0.75,
	},

	{
		// Tier 8
		key: "waterStone",
		name: "Water Stone",
		scale: 1.0,
	},

	{
		// Tier 9
		key: "duskStone",
		name: "Dusk Stone",
		scale: 1.07,
	},

	{
		// Tier 10
		key: "sunStone",
		name: "Sun Stone",
		scale: 1.14,
	},
];
