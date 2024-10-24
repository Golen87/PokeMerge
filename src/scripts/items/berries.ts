import Asset from "../assets/Asset";

import leppaBerry from "../../assets/items/berries/Dream_Leppa_Berry_Sprite.png";
import cheriBerry from "../../assets/items/berries/Dream_Cheri_Berry_Sprite.png";
import grepaBerry from "../../assets/items/berries/Dream_Grepa_Berry_Sprite.png";
import tangaBerry from "../../assets/items/berries/Dream_Tanga_Berry_Sprite.png";
import rawstBerry from "../../assets/items/berries/Dream_Rawst_Berry_Sprite.png";
import oranBerry from "../../assets/items/berries/Dream_Oran_Berry_Sprite.png";
import blukBerry from "../../assets/items/berries/Dream_Bluk_Berry_Sprite.png";
import persimBerry from "../../assets/items/berries/Dream_Persim_Berry_Sprite.png";
import pechaBerry from "../../assets/items/berries/Dream_Pecha_Berry_Sprite.png";
import enigmaBerry from "../../assets/items/berries/Dream_Enigma_Berry_Sprite.png";

export const berryAssets: Asset[] = [
	{ key: "leppaBerry", path: leppaBerry },
	{ key: "cheriBerry", path: cheriBerry },
	{ key: "grepaBerry", path: grepaBerry },
	{ key: "tangaBerry", path: tangaBerry },
	{ key: "rawstBerry", path: rawstBerry },
	{ key: "oranBerry", path: oranBerry },
	{ key: "blukBerry", path: blukBerry },
	{ key: "persimBerry", path: persimBerry },
	{ key: "pechaBerry", path: pechaBerry },
	{ key: "enigmaBerry", path: enigmaBerry },
];

import ItemData from "./ItemData";

export const berryItems: ItemData[] = [
	{
		// Tier 1
		key: "leppaBerry",
		name: "Leppa Berry",
		scale: 1.08,
		generator: {
			depletable: true,
			maxCharges: 1,
			rechargeTime: 10 * 1000,
			items: [{ category: "edible", tier: 1 }],
		},
	},

	{
		// Tier 2
		key: "cheriBerry",
		name: "Cheri Berry",
		scale: 1.1,
	},

	{
		// Tier 3
		key: "grepaBerry",
		name: "Grepa Berry",
		scale: 1.1,
	},

	{
		// Tier 4
		key: "tangaBerry",
		name: "Tanga Berry",
		scale: 1.1,
	},

	{
		// Tier 5
		key: "rawstBerry",
		name: "Rawst Berry",
		scale: 1.1,
	},

	{
		// Tier 6
		key: "oranBerry",
		name: "Oran Berry",
		scale: 1.1,
	},

	{
		// Tier 7
		key: "blukBerry",
		name: "Bluk Berry",
		scale: 1.1,
	},

	{
		// Tier 8
		key: "persimBerry",
		name: "Persim Berry",
		scale: 1.1,
	},

	{
		// Tier 9
		key: "pechaBerry",
		name: "Pecha Berry",
		scale: 1.12,
	},

	{
		// Tier 10
		key: "enigmaBerry",
		name: "Enigma Berry",
		scale: 1.13,
	},
];
