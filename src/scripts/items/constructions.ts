import Asset from "../assets/Asset";

import bricks from "../../assets/items/constructions/12184 Bricks.png";
import girders from "../../assets/items/constructions/12110 Girders.png";
import drums from "../../assets/items/constructions/15135 Drums.png";
import miningVehicles from "../../assets/items/constructions/12025 Mining Vehicles.png";
import greatMarshTrain from "../../assets/items/constructions/12113 Great Marsh Train.png";
import ssSpiral from "../../assets/items/constructions/29730 S.S. Spiral.png";
import snowpointCrane from "../../assets/items/constructions/12059 Snowpoint City Crane.png";
import driftveilCrane from "../../assets/items/constructions/13761 Driftveil City Crane.png";
import fuegoIronworks from "../../assets/items/constructions/12036 Fuego Ironworks.png";
import kantoPowerPlant from "../../assets/items/constructions/12008 Kanto Power Plant.png";

export const constructionAssets: Asset[] = [
	{ key: "bricks", path: bricks },
	{ key: "girders", path: girders },
	{ key: "drums", path: drums },
	{ key: "miningVehicles", path: miningVehicles },
	{ key: "greatMarshTrain", path: greatMarshTrain },
	{ key: "ssSpiral", path: ssSpiral },
	{ key: "snowpointCrane", path: snowpointCrane },
	{ key: "driftveilCrane", path: driftveilCrane },
	{ key: "fuegoIronworks", path: fuegoIronworks },
	{ key: "kantoPowerPlant", path: kantoPowerPlant },
];

import ItemData from "./ItemData";

export const constructionItems: ItemData[] = [
	{
		// Tier 1
		key: "bricks",
		name: "Bricks",
		scale: 0.88,
	},

	{
		// Tier 2
		key: "girders",
		name: "Girders",
		scale: 1.03,
	},

	{
		// Tier 3
		key: "drums",
		name: "Drums",
		scale: 1.05,
	},

	{
		// Tier 4
		key: "miningVehicles",
		name: "Mining Vehicles",
		scale: 1.0,
		generator: {
			maxCharges: 10,
			rechargeCount: 4,
			rechargeTime: 60 * 1000,
			items: [{ category: "drive", tier: 1 }],
		},
	},

	{
		// Tier 5
		key: "greatMarshTrain",
		name: "Great Marsh Train",
		scale: 1.0,
	},

	{
		// Tier 6
		key: "ssSpiral",
		name: "S.S. Spiral",
		scale: 1.15,
	},

	{
		// Tier 7
		key: "snowpointCrane",
		name: "Snowpoint City Crane",
		scale: 1.0,
	},

	{
		// Tier 8
		key: "driftveilCrane",
		name: "Driftveil City Crane",
		scale: 1.1,
	},

	{
		// Tier 9
		key: "fuegoIronworks",
		name: "Fuego Ironworks",
		scale: 1.07,
	},

	{
		// Tier 10
		key: "kantoPowerPlant",
		name: "Kanto Power Plant",
		scale: 1.15,
	},
];
