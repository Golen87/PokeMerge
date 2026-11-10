import Asset from "../assets/Asset";

import coin1 from "../../assets/items/coins/coin_1.png";
import coin2 from "../../assets/items/coins/coin_2.png";
import coin3 from "../../assets/items/coins/coin_4.png";
import coin4 from "../../assets/items/coins/coin_8.png";
import coin5 from "../../assets/items/coins/coin_32.png";

export const coinAssets: Asset[] = [
	{ key: "coin1", path: coin1 },
	{ key: "coin2", path: coin2 },
	{ key: "coin3", path: coin3 },
	{ key: "coin4", path: coin4 },
	{ key: "coin5", path: coin5 },
];

import ItemData from "./ItemData";

export const coinItems: ItemData[] = [
	{
		key: "coin1",
		name: "Gold Coin",
		// 1 or 3
	},
	{
		key: "coin2",
		name: "Gold Coins",
		// 3 or 8
	},
	{
		key: "coin3",
		name: "Gold Coins",
		// 8 or 20
	},
	{
		key: "coin4",
		name: "Gold Coins",
		// 20 or 50
	},
	{
		key: "coin5",
		name: "Gold Coins",
		// 50 or 120
	},
];
