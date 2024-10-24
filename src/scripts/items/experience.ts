import Asset from "../assets/Asset";

import soothingCrystal from "../../assets/items/crystals/soothingcrystal.png";
import greatSoothingCrystal from "../../assets/items/crystals/greatsoothingcrystal.png";
import ultraSoothingCrystal from "../../assets/items/crystals/ultrasoothingcrystal.png";
import soothingStone from "../../assets/items/crystals/soothingstone.png";
import soothingExtract from "../../assets/items/crystals/soothingextract.png";

export const experienceAssets: Asset[] = [
	{ key: "soothingCrystal", path: soothingCrystal },
	{ key: "greatSoothingCrystal", path: greatSoothingCrystal },
	{ key: "ultraSoothingCrystal", path: ultraSoothingCrystal },
	{ key: "soothingStone", path: soothingStone },
	{ key: "soothingExtract", path: soothingExtract },
];

import ItemData from "./ItemData";

export const experienceItems: ItemData[] = [
	{ key: "soothingCrystal",		scale: 1.45,	name: "Experience" },
		{ key: "greatSoothingCrystal",	scale: 1.45,	name: "Experience" },
		{ key: "ultraSoothingCrystal",	scale: 1.40,	name: "Experience" },
		{ key: "soothingStone",			scale: 1.40,	name: "Experience" },
		{ key: "soothingExtract",		scale: 1.65,	name: "Experience" },
];
