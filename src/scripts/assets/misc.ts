import Asset from "./Asset";
import Sprite from "./Asset";

import grass_1 from "../../assets/misc/grass_1.png";
import grass_2 from "../../assets/misc/grass_2.png";
import boxes from "../../assets/misc/boxes.png";
import bolt from "../../assets/misc/bolt.png";
// import chest from "../../assets/misc/chest.png";
import selection from "../../assets/misc/selection.png";
import arrow from "../../assets/misc/arrow.png";

const misc: Asset[] = [
	{ key: "grass_1",	path: grass_1 },
	{ key: "grass_2",	path: grass_2 },
	{ key: "boxes",		path: boxes },
	{ key: "bolt",		path: bolt },
	// { key: "chest",		path: chest },
	{ key: "selection",	path: selection },
	{ key: "arrow",		path: arrow },
];

export default misc;