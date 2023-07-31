import Asset from "./Asset";

import bricks from "../../assets/items/constructions/12184 Bricks.png";
import girders from "../../assets/items/constructions/12110 Girders.png";
import drums from "../../assets/items/constructions/15135 Drums.png";
import miningVehicles from "../../assets/items/constructions/12025 Mining Vehicles.png";
import greatMarshTrain from "../../assets/items/constructions/12113 Great Marsh Train.png";
import snowpointCrane from "../../assets/items/constructions/12059 Snowpoint City Crane.png";
import driftveilCrane from "../../assets/items/constructions/13761 Driftveil City Crane.png";
import fuegoIronworks from "../../assets/items/constructions/12036 Fuego Ironworks.png";
import kantoPowerPlant from "../../assets/items/constructions/12008 Kanto Power Plant.png";

const constructions: Asset[] = [
	{ key: "bricks",			path: bricks },
	{ key: "girders",			path: girders },
	{ key: "drums",				path: drums },
	{ key: "miningVehicles",	path: miningVehicles },
	{ key: "greatMarshTrain",	path: greatMarshTrain },
	{ key: "snowpointCrane",	path: snowpointCrane },
	{ key: "driftveilCrane",	path: driftveilCrane },
	{ key: "fuegoIronworks",	path: fuegoIronworks },
	{ key: "kantoPowerPlant",	path: kantoPowerPlant },
];

export default constructions;