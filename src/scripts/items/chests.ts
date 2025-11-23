import Asset from "../assets/Asset";

import whiteGift from "../../assets/items/chests/18496 - Mystery Gift.png";
import yellowGift from "../../assets/items/chests/32682 - Mystery Gift.png";
import chest_1 from "../../assets/items/chests/1starrarecache.png";
import chest_2 from "../../assets/items/chests/2starrarecache.png";
import chest_3 from "../../assets/items/chests/3starrarecache.png";

export const chestAssets: Asset[] = [
	{ key: "whiteGift", path: whiteGift },
	{ key: "yellowGift", path: yellowGift },
	{ key: "chest_1", path: chest_1 },
	{ key: "chest_2", path: chest_2 },
	{ key: "chest_3", path: chest_3 },
];

import ItemData from "./ItemData";

export const chestItems: ItemData[] = [
	{
		// Tier 0
		key: "",
		name: "",
		scale: 1.0,
		generator: {
			maxCharges: 0,
			rechargeCount: 0,
			rechargeTime: 0,
			items: [],
			// ...
		},
	},

	// ...
];
