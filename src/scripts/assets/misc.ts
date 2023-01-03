import Asset from "./Asset";
import Sprite from "./Asset";

import cell from "../../assets/misc/cell.png";
import checkmark from "../../assets/misc/checkmark.png";
import grass_1 from "../../assets/misc/tall_grass_1b.png";
import grass_2 from "../../assets/misc/tall_grass_2b.png";
import grass_3 from "../../assets/misc/tall_grass_3b.png";
import boxes from "../../assets/misc/boxes.png";
import bolt from "../../assets/misc/bolt.png";
// import chest from "../../assets/misc/chest.png";
import selection from "../../assets/misc/selection.png";
import arrow from "../../assets/misc/arrow.png";

const misc: Asset[] = [
	{ key: "cell",		path: cell },
	{ key: "checkmark",	path: checkmark },
	{ key: "grass_1",	path: grass_1 },
	{ key: "grass_2",	path: grass_2 },
	{ key: "grass_3",	path: grass_3 },
	{ key: "boxes",		path: boxes },
	{ key: "bolt",		path: bolt },
	{ key: "selection",	path: selection },
	{ key: "arrow",		path: arrow },
];

export default misc;