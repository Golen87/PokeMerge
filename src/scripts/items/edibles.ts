import Asset from "../assets/Asset";

import bigMalasada from "../../assets/items/edibles/Dream_Big_Malasada_Sprite.png";
import bigMushroom from "../../assets/items/edibles/Dream_Big_Mushroom_Sprite.png";
import bigRoot from "../../assets/items/edibles/Dream_Big_Root_Sprite.png";
import energyRoot from "../../assets/items/edibles/Dream_Energy_Root_Sprite.png";
import lavaCookie from "../../assets/items/edibles/Dream_Lava_Cookie_Sprite.png";
import leftovers from "../../assets/items/edibles/Dream_Leftovers_Sprite.png";
import rareCandy from "../../assets/items/edibles/Dream_Rare_Candy_Sprite.png";
import tinyMushroom from "../../assets/items/edibles/Dream_Tiny_Mushroom_Sprite.png";
import absorbBulb from "../../assets/items/edibles/Dream_Absorb_Bulb_Sprite.png";

export const edibleAssets: Asset[] = [
	{ key: "bigMalasada", path: bigMalasada },
	{ key: "bigMushroom", path: bigMushroom },
	{ key: "bigRoot", path: bigRoot },
	{ key: "energyRoot", path: energyRoot },
	{ key: "lavaCookie", path: lavaCookie },
	{ key: "leftovers", path: leftovers },
	{ key: "rareCandy", path: rareCandy },
	{ key: "tinyMushroom", path: tinyMushroom },
	{ key: "absorbBulb", path: absorbBulb },
];

import ItemData from "./ItemData";

export const edibleItems: ItemData[] = [
	{ key: "leftovers", name: "Leftovers", scale: 0.92 },
	{ key: "tinyMushroom", name: "Tiny Mushroom", scale: 0.78 },
	{ key: "bigMushroom", name: "Big Mushroom", scale: 1.0 },
	{ key: "energyRoot", name: "Energy Root", scale: 1.18 },
	{ key: "bigRoot", name: "Big Root", scale: 1.17 },
	{ key: "absorbBulb", name: "Absorb Bulb", scale: 1.6 },
	{ key: "bigMalasada", name: "Big Malasada", scale: 1.6 },
	{ key: "lavaCookie", name: "Lava Cookie", scale: 1.08 },
	{ key: "rareCandy", name: "Rare Candy", scale: 1.14 },
];
