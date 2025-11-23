import Asset from "../assets/Asset";

import rareBone from "../../assets/items/fossils/Dream_Rare_Bone_Sprite.png";
import domeFossil from "../../assets/items/fossils/Dream_Dome_Fossil_Sprite.png"; // Kabuto
import helixFossil from "../../assets/items/fossils/Dream_Helix_Fossil_Sprite.png"; // Omanyte
import rootFossil from "../../assets/items/fossils/Dream_Root_Fossil_Sprite.png"; // Lileep
import clawFossil from "../../assets/items/fossils/Dream_Claw_Fossil_Sprite.png"; // Anorith
import skullFossil from "../../assets/items/fossils/Dream_Skull_Fossil_Sprite.png"; // Cranidos
import armorFossil from "../../assets/items/fossils/Dream_Armor_Fossil_Sprite.png"; // Shieldon
import coverFossil from "../../assets/items/fossils/Dream_Cover_Fossil_Sprite.png"; // Tirtouga
import plumeFossil from "../../assets/items/fossils/Dream_Plume_Fossil_Sprite.png"; // Archen
import jawFossil from "../../assets/items/fossils/Dream_Jaw_Fossil_Sprite.png"; // Tyrunt
import sailFossil from "../../assets/items/fossils/Dream_Sail_Fossil_Sprite.png"; // Amaura
import oldAmber from "../../assets/items/fossils/Dream_Old_Amber_Sprite.png"; // Aerodactyl

export const fossilAssets: Asset[] = [
	{ key: "rareBone", path: rareBone },
	{ key: "domeFossil", path: domeFossil },
	{ key: "helixFossil", path: helixFossil },
	{ key: "rootFossil", path: rootFossil },
	{ key: "clawFossil", path: clawFossil },
	{ key: "skullFossil", path: skullFossil },
	{ key: "armorFossil", path: armorFossil },
	{ key: "coverFossil", path: coverFossil },
	{ key: "plumeFossil", path: plumeFossil },
	{ key: "jawFossil", path: jawFossil },
	{ key: "sailFossil", path: sailFossil },
	{ key: "oldAmber", path: oldAmber },
];

import ItemData from "./ItemData";

export const fossilItems: ItemData[] = [
	{
		// Tier 1
		key: "rareBone",
		name: "Rare Bone",
		scale: 1.03,
	},

	{
		// Tier 2
		key: "domeFossil",
		name: "Dome Fossil",
		scale: 1.03,
	},

	{
		// Tier 3
		key: "helixFossil",
		name: "Helix Fossil",
		scale: 1.06,
	},

	{
		// Tier 4
		key: "rootFossil",
		name: "Root Fossil",
		scale: 1.06,
	},

	{
		// Tier 5
		key: "clawFossil",
		name: "Claw Fossil",
		scale: 1.08,
	},

	{
		// Tier 6
		key: "skullFossil",
		name: "Skull Fossil",
		scale: 1.06,
	},

	{
		// Tier 7
		key: "armorFossil",
		name: "Armor Fossil",
		scale: 1.06,
	},

	{
		// Tier 8
		key: "coverFossil",
		name: "Cover Fossil",
		scale: 0.82,
	},

	{
		// Tier 9
		key: "plumeFossil",
		name: "Plume Fossil",
		scale: 0.86,
	},

	{
		// Tier 10
		key: "jawFossil",
		name: "Jaw Fossil",
		scale: 0.84,
	},

	{
		// Tier 11
		key: "sailFossil",
		name: "Sail Fossil",
		scale: 0.88,
	},

	{
		// Tier 12
		key: "oldAmber",
		name: "Old Amber",
		scale: 1.25,
	},
];
