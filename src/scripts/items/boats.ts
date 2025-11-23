import Asset from "../assets/Asset";

import tetrapod from "../../assets/items/boats/11931 Tetrapod.png";
import umbrellaTable from "../../assets/items/boats/11957 Umbrella Table.png";
import violetCityBridge from "../../assets/items/boats/11088 Violet City Bridge.png";
import boat from "../../assets/items/boats/19576 Boat.png";
import yacht from "../../assets/items/boats/11953 Yacht.png";
import kukuisBoat from "../../assets/items/boats/19354 Kukuis Boat.png";
import aetherFoundationBoat from "../../assets/items/boats/19979 Aether Foundation Boat.png";
import laprasBoat from "../../assets/items/boats/20046 Lapras Boat.png";
import ssAqua from "../../assets/items/boats/11968 S.S. Aqua.png";
import ssAnne from "../../assets/items/boats/27579 S.S. Anne.png";

export const boatAssets: Asset[] = [
	{ key: "tetrapod", path: tetrapod },
	{ key: "umbrellaTable", path: umbrellaTable },
	{ key: "violetCityBridge", path: violetCityBridge },
	{ key: "boat", path: boat },
	{ key: "yacht", path: yacht },
	{ key: "kukuisBoat", path: kukuisBoat },
	{ key: "aetherFoundationBoat", path: aetherFoundationBoat },
	{ key: "laprasBoat", path: laprasBoat },
	{ key: "ssAqua", path: ssAqua },
	{ key: "ssAnne", path: ssAnne },
];

import ItemData from "./ItemData";

export const boatItems: ItemData[] = [
	{
		// Tier 1
		key: "tetrapod",
		name: "Tetrapod",
		scale: 0.9,
	},

	{
		// Tier 2
		key: "umbrellaTable",
		name: "umbrellaTable",
		scale: 1.1,
	},

	{
		// Tier 3
		key: "violetCityBridge",
		name: "Violet City Bridge",
		scale: 0.95,
	},

	{
		// Tier 4
		key: "boat",
		name: "Boat",
		scale: 1.0,
	},

	{
		// Tier 5
		key: "yacht",
		scale: 1.2,
		name: "Yacht",
		generator: {
			maxCharges: 10,
			rechargeCount: 4,
			rechargeTime: 120 * 60 * 1000,
			items: [{ category: "shell", tier: 1 }],
		},
	},

	{
		// Tier 6
		key: "kukuisBoat",
		scale: 1.2,
		name: "Kukui's Boat",
		generator: {
			maxCharges: 12,
			rechargeCount: 6,
			rechargeTime: 82 * 60 * 1000,
			items: [{ category: "shell", tier: 1 }],
		},
	},

	{
		// Tier 7
		key: "aetherFoundationBoat",
		scale: 1.2,
		name: "Aether Foundation Boat",
		generator: {
			maxCharges: 18,
			rechargeCount: 8,
			rechargeTime: 52 * 60 * 1000,
			items: [{ category: "shell", tier: 1 }],
		},
	},

	{
		// Tier 8
		key: "laprasBoat",
		scale: 1.05,
		name: "Lapras Boat",
		generator: {
			maxCharges: 26,
			rechargeCount: 10,
			rechargeTime: 35 * 60 * 1000,
			items: [{ category: "shell", tier: 1 }],
		},
	},

	{
		// Tier 9
		key: "ssAqua",
		scale: 1.15,
		name: "S.S. Aqua",
		generator: {
			maxCharges: 40,
			rechargeCount: 16,
			rechargeTime: 24 * 60 * 1000,
			items: [{ category: "shell", tier: 1 }],
		},
	},

	{
		// Tier 10
		key: "ssAnne",
		scale: 1.35,
		name: "S.S. Anne",
		generator: {
			maxCharges: 60,
			rechargeCount: 20,
			rechargeTime: 15 * 60 * 1000,
			items: [{ category: "shell", tier: 1 }],
		},
	},
];
