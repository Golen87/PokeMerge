import Asset from "../assets/Asset";

import vendingDP from "../../assets/items/vending/15141 Vending Machine DP.png";
import vendingBW from "../../assets/items/vending/12019 Vending Machine BW.png";
import vendingORAS from "../../assets/items/vending/12157 Vending Machine ORAS.png";

export const vendingAssets: Asset[] = [
	{ key: "vendingDP", path: vendingDP },
	{ key: "vendingBW", path: vendingBW },
	{ key: "vendingORAS", path: vendingORAS },
];

import ItemData from "./ItemData";

export const vendingItems: ItemData[] = [
	{
		// Tier 1
		key: "vendingBW",
		name: "Vending Machine (BW)",
		scale: 0.8,
	},

	{
		// Tier 2
		key: "vendingDP",
		name: "Vending Machine (DP)",
		scale: 0.95,
	},

	{
		// Tier 3
		key: "vendingORAS",
		name: "Vending Machine (ORAS)",
		scale: 0.9,
		// charges: 6,
		// generates: [{ category: "drink", tier: 1 }],
	},
];
