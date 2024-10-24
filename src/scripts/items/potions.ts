import Asset from "../assets/Asset";

// import awakening from "../../assets/items/potions/Dream_Awakening_Sprite.png";
// import burnHeal from "../../assets/items/potions/Dream_Burn_Heal_Sprite.png";
// import elixir from "../../assets/items/potions/Dream_Elixir_Sprite.png";
// import fullHeal from "../../assets/items/potions/Dream_Full_Heal_Sprite.png";
// import fullRestore from "../../assets/items/potions/Dream_Full_Restore_Sprite.png";
// import hyperPotion from "../../assets/items/potions/Dream_Hyper_Potion_Sprite.png";
// import iceHeal from "../../assets/items/potions/Dream_Ice_Heal_Sprite.png";
// import maxElixir from "../../assets/items/potions/Dream_Max_Elixir_Sprite.png";
// import maxEther from "../../assets/items/potions/Dream_Max_Ether_Sprite.png";
// import paralyzeHeal from "../../assets/items/potions/Dream_Paralyze_Heal_Sprite.png";
// import superPotion from "../../assets/items/potions/Dream_Super_Potion_Sprite_Alt.png";
// import direHit from "../../assets/items/potions/Dream_Dire_Hit_Sprite.png";

import antidote from "../../assets/items/potions/Dream_Antidote_Sprite.png";
import potion from "../../assets/items/potions/Dream_Potion_Sprite_Alt.png";
import ether from "../../assets/items/potions/Dream_Ether_Sprite_Alt.png";
import maxPotion from "../../assets/items/potions/Dream_Max_Potion_Sprite_Alt.png";
import honey from "../../assets/items/potions/Dream_Honey_Sprite.png";
import revive from "../../assets/items/potions/Dream_Revive_Sprite.png";
import maxRevive from "../../assets/items/potions/Dream_Max_Revive_Sprite.png";

export const potionAssets: Asset[] = [
	// { key: "awakening",		path: awakening },
	// { key: "burnHeal",		path: burnHeal },
	// { key: "elixir",		path: elixir },
	// { key: "fullHeal",		path: fullHeal },
	// { key: "fullRestore",	path: fullRestore },
	// { key: "hyperPotion",	path: hyperPotion },
	// { key: "iceHeal",		path: iceHeal },
	// { key: "maxElixir",		path: maxElixir },
	// { key: "maxEther",		path: maxEther },
	// { key: "paralyzeHeal",	path: paralyzeHeal },
	// { key: "superPotion",	path: superPotion },
	// { key: "direHit",		path: direHit },

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
