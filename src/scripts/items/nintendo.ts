import Asset from "../assets/Asset";

import nes from "../../assets/items/nintendo/1_nes.png";
import snes from "../../assets/items/nintendo/2_snes.png";
import n64 from "../../assets/items/nintendo/3_n64_controller.png";
import gameboy from "../../assets/items/nintendo/4_gameboy.png";
import threeds from "../../assets/items/nintendo/6_3ds.png";
import wii_u from "../../assets/items/nintendo/7_wii_u.png";
import nswitch from "../../assets/items/nintendo/8_switch_1.png";

export const nintendoAssets: Asset[] = [
	{ key: "nes", path: nes },
	{ key: "snes", path: snes },
	{ key: "n64", path: n64 },
	{ key: "gameboy", path: gameboy },
	{ key: "threeds", path: threeds },
	{ key: "wii_u", path: wii_u },
	{ key: "switch", path: nswitch },
];

import ItemData from "./ItemData";

export const nintendoItems: ItemData[] = [
	{
		// Tier 1
		key: "nes",
		name: "NES",
		scale: 0.85,
	},

	{
		// Tier 2
		key: "snes",
		name: "SNES",
		scale: 0.85,
	},

	{
		// Tier 3
		key: "n64",
		name: "Nintendo 64",
		scale: 0.9,
	},

	{
		// Tier 4
		key: "gameboy",
		name: "Game Boy",
		scale: 0.9,
		generator: {
			maxCharges: 2,
			rechargeCount: 2,
			rechargeTime: 24 * 60 * 1000,
			items: [
				{ category: "mart", tier: 1 },
				{ category: "center", tier: 1 },
				{ category: "ruin", tier: 1 },
				{ category: "construction", tier: 1 },
				{ category: "boat", tier: 1 },
				{ category: "tree", tier: 1 },
			],
		},
	},

	{
		// Tier 5
		key: "threeds",
		name: "3DS",
		scale: 0.95,
		generator: {
			maxCharges: 3,
			rechargeCount: 2,
			rechargeTime: 18 * 60 * 1000,
			items: [
				{ category: "mart", tier: 1 },
				{ category: "center", tier: 1 },
				{ category: "ruin", tier: 1 },
				{ category: "construction", tier: 1 },
				{ category: "boat", tier: 1 },
				{ category: "tree", tier: 1 },
			],
		},
	},

	{
		// Tier 6
		key: "wii_u",
		name: "Wii U",
		scale: 1.05,
		generator: {
			maxCharges: 4,
			rechargeCount: 2,
			rechargeTime: 12 * 60 * 1000,
			items: [
				{ category: "mart", tier: 1 },
				{ category: "center", tier: 1 },
				{ category: "ruin", tier: 1 },
				{ category: "construction", tier: 1 },
				{ category: "boat", tier: 1 },
				{ category: "tree", tier: 1 },
			],
		},
	},

	{
		// Tier 7
		key: "switch",
		name: "Switch",
		scale: 1.15,
		generator: {
			maxCharges: 60,
			rechargeCount: 2,
			rechargeTime: 8 * 60 * 1000,
			items: [
				{ category: "mart", tier: 1 },
				{ category: "center", tier: 1 },
				{ category: "ruin", tier: 1 },
				{ category: "construction", tier: 1 },
				{ category: "boat", tier: 1 },
				{ category: "tree", tier: 1 },
				{ category: "nintendo", tier: 1 },
			],
		},
	},
];
