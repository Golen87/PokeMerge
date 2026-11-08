import Asset from "../assets/Asset";

import coins_1 from "../../assets/items/chests/coins-1.png";
import coins_2 from "../../assets/items/chests/coins-2.png";
import coins_3 from "../../assets/items/chests/coins-3.png";
import coins_4 from "../../assets/items/chests/coins-4.png";

export const coinChestAssets: Asset[] = [
	{ key: "coins_1", path: coins_1 },
	{ key: "coins_2", path: coins_2 },
	{ key: "coins_3", path: coins_3 },
	{ key: "coins_4", path: coins_4 },
];

import ItemData from "./ItemData";

export const coinChestItems: ItemData[] = [
	{
		key: "coins_1",
		name: "Coin Chest",
		scale: 0.8,
		generator: {
			depletable: true,
			maxCharges: 10,
			rechargeCount: 10,
			rechargeTime: 1,
			items: [
				{ category: "coin", tier: 1 },
			],
		},
	},
	{
		key: "coins_2",
		name: "Coin Chest",
		scale: 0.85,
		generator: {
			depletable: true,
			maxCharges: 10,
			rechargeCount: 10,
			rechargeTime: 1,
			items: [
				{ category: "coin", tier: 2 },
			],
		},
	},
	{
		key: "coins_3",
		name: "Coin Chest",
		scale: 0.95,
		generator: {
			depletable: true,
			maxCharges: 10,
			rechargeCount: 10,
			rechargeTime: 1,
			items: [
				{ category: "coin", tier: 3 },
			],
		},
	},
	{
		key: "coins_4",
		name: "Coin Chest",
		scale: 1.1,
		generator: {
			depletable: true,
			maxCharges: 10,
			rechargeCount: 10,
			rechargeTime: 1,
			items: [
				{ category: "coin", tier: 4 },
			],
		},
	},
];
