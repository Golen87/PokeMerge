import Asset from "./Asset";

import antidote from "../../assets/resources/potions/Dream_Antidote_Sprite.png";
import potion from "../../assets/resources/potions/Dream_Potion_Sprite.png";
import fullHeal from "../../assets/resources/potions/Dream_Full_Heal_Sprite.png";
import superPotion from "../../assets/resources/potions/Dream_Super_Potion_Sprite.png";
import revive from "../../assets/resources/potions/Dream_Revive_Sprite.png";
import hyperPotion from "../../assets/resources/potions/Dream_Hyper_Potion_Sprite.png";
import maxPotion from "../../assets/resources/potions/Dream_Max_Potion_Sprite.png";
import fullRestore from "../../assets/resources/potions/Dream_Full_Restore_Sprite.png";
import maxRevive from "../../assets/resources/potions/Dream_Max_Revive_Sprite.png";
import ether from "../../assets/resources/potions/Dream_Ether_Sprite.png";
import maxEther from "../../assets/resources/potions/Dream_Max_Ether_Sprite.png";

const potions: Asset[] = [
	{ key: "antidote",		path: antidote },
	{ key: "potion",		path: potion },
	{ key: "fullHeal",		path: fullHeal },
	{ key: "superPotion",	path: superPotion },
	{ key: "revive",		path: revive },
	{ key: "hyperPotion",	path: hyperPotion },
	{ key: "maxPotion",		path: maxPotion },
	{ key: "fullRestore",	path: fullRestore },
	{ key: "maxRevive",		path: maxRevive },
	{ key: "ether",			path: ether },
	{ key: "maxEther",		path: maxEther },
];

export default potions;