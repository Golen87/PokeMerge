import Asset from "../assets/Asset";

import casterFern from "../../assets/items/herbs/Bag_Caster_Fern_LA_Sprite.png";
import basil from "../../assets/items/herbs/Bag_Basil_SV_Sprite.png";
import mintSpeed from "../../assets/items/herbs/Bag_Mint_Speed_SV_Sprite.png";
import revivalHerb from "../../assets/items/herbs/Bag_Revival_Herb_SV_Sprite.png";
import watercress from "../../assets/items/herbs/Bag_Watercress_SV_Sprite.png";
import herbaMystica from "../../assets/items/herbs/Bag_Bitter_Herba_Mystica_SV_Sprite.png";
import mirrorHerb from "../../assets/items/herbs/Bag_Mirror_Herb_SV_Sprite.png";
import pungentRoot from "../../assets/items/herbs/Curry_Ingredient_Pungent_Root_Sprite.png";
import laxIncense from "../../assets/items/herbs/Dream_Lax_Incense_Sprite.png";

export const herbAssets: Asset[] = [
	{ key: "casterFern", path: casterFern },
	{ key: "basil", path: basil },
	{ key: "mintSpeed", path: mintSpeed },
	{ key: "revivalHerb", path: revivalHerb },
	{ key: "watercress", path: watercress },
	{ key: "herbaMystica", path: herbaMystica },
	{ key: "mirrorHerb", path: mirrorHerb },
	{ key: "pungentRoot", path: pungentRoot },
	{ key: "laxIncense", path: laxIncense },
];

import ItemData from "./ItemData";

export const herbItems: ItemData[] = [
	{ key: "casterFern", name: "Caster Fern", scale: 1.0 },
	{ key: "basil", name: "Basil", scale: 1.5 },
	{ key: "mintSpeed", name: "Mint Speed", scale: 1.5 },
	{ key: "revivalHerb", name: "Revival Herb", scale: 1.5 },
	{ key: "watercress", name: "Watercress", scale: 1.6 },
	{ key: "herbaMystica", name: "Herba Mystica", scale: 1.5 },
	{ key: "mirrorHerb", name: "Mirror Herb", scale: 1.5 },
	{ key: "pungentRoot", name: "Pungent Root", scale: 1.3 },
	{ key: "laxIncense", name: "Lax Incense", scale: 1.1 },
];
