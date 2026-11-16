import Asset from "../assets/Asset";

import antidote from "../../assets/items/potions/Dream_Antidote_Sprite.png";
import potion from "../../assets/items/potions/Dream_Potion_Sprite.png";
import ether from "../../assets/items/potions/Dream_Ether_Sprite.png";
import maxPotion from "../../assets/items/potions/Dream_Max_Potion_Sprite.png";
import honey from "../../assets/items/potions/Dream_Honey_Sprite.png";
import revive from "../../assets/items/potions/Dream_Revive_Sprite.png";
import maxRevive from "../../assets/items/potions/Dream_Max_Revive_Sprite.png";

export const potionAssets: Asset[] = [
	{ key: "antidote", path: antidote },
	{ key: "potion", path: potion },
	{ key: "ether", path: ether },
	{ key: "maxPotion", path: maxPotion },
	{ key: "honey", path: honey },
	{ key: "revive", path: revive },
	{ key: "maxRevive", path: maxRevive },
];

import ItemData from "./ItemData";

export const potionItems: ItemData[] = [
	{ key: "antidote", name: "Antidote", scale: 1.0 },
	{ key: "potion", name: "Potion", scale: 1.0 },
	{ key: "ether", name: "Ether", scale: 1.0 },
	{ key: "maxPotion", name: "Max Potion", scale: 1.1 },
	{ key: "honey", name: "Honey", scale: 1.0 },
	{ key: "revive", name: "Revive", scale: 1.0 },
	{ key: "maxRevive", name: "Max Revive", scale: 1.35 },
];
