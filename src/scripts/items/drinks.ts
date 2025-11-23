import Asset from "../assets/Asset";

import freshWater from "../../assets/items/drinks/Dream_Fresh_Water_Sprite.png";
import sodaPop from "../../assets/items/drinks/Dream_Soda_Pop_Sprite.png";
import lemonade from "../../assets/items/drinks/Dream_Lemonade_Sprite.png";
import moomooMilk from "../../assets/items/drinks/Dream_Moomoo_Milk_Sprite.png";
import berryJuice from "../../assets/items/drinks/Dream_Berry_Juice_Sprite.png";
import criticalHerbTea from "../../assets/items/drinks/critical_herb_tea.png";
import boostJuice from "../../assets/items/drinks/boost_juice.png";

export const drinkAssets: Asset[] = [
	{ key: "freshWater", path: freshWater },
	{ key: "sodaPop", path: sodaPop },
	{ key: "lemonade", path: lemonade },
	{ key: "moomooMilk", path: moomooMilk },
	{ key: "berryJuice", path: berryJuice },
	{ key: "criticalHerbTea", path: criticalHerbTea },
	{ key: "boostJuice", path: boostJuice },
];

import ItemData from "./ItemData";

export const drinkItems: ItemData[] = [
	{ key: "freshWater", name: "Fresh Water", scale: 1.04 },
	{ key: "sodaPop", name: "Soda Pop", scale: 1.18 },
	{ key: "lemonade", name: "Lemonade", scale: 1.1 },
	{ key: "moomooMilk", name: "Moomoo Milk", scale: 1.11 },
	{ key: "berryJuice", name: "Berry Juice", scale: 1.12 },
	{ key: "boostJuice", name: "Boost Juice", scale: 0.81 },
	{ key: "criticalHerbTea", name: "Critical Herb Tea", scale: 1.66 },
];
