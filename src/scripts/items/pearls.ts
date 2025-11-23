import Asset from "../assets/Asset";

import pearl from "../../assets/items/pearls/Dream_Pearl_Sprite.png";
import bigPearl from "../../assets/items/pearls/Dream_Big_Pearl_Sprite.png";
import nugget from "../../assets/items/pearls/Dream_Nugget_Sprite.png";
import bigNugget from "../../assets/items/pearls/Dream_Big_Nugget_Sprite.png";
import pearlString from "../../assets/items/pearls/Dream_Pearl_String_Sprite.png";
import starPiece from "../../assets/items/pearls/Dream_Star_Piece_Sprite.png";

export const pearlAssets: Asset[] = [
	{ key: "pearl", path: pearl },
	{ key: "bigPearl", path: bigPearl },
	{ key: "pearlString", path: pearlString },
	{ key: "nugget", path: nugget },
	{ key: "bigNugget", path: bigNugget },
	{ key: "starPiece", path: starPiece },
];

import ItemData from "./ItemData";

export const pearlItems: ItemData[] = [
	{ key: "pearl", name: "Pearl", scale: 0.78 },
	{ key: "bigPearl", name: "Big Pearl", scale: 1.14 },
	{ key: "pearlString", name: "Pearl String", scale: 0.9 },
	{ key: "nugget", name: "Nugget", scale: 0.88 },
	{ key: "bigNugget", name: "Big Nugget", scale: 1.0 },
	{ key: "starPiece", name: "Comet Shard", scale: 1.5 },
];
