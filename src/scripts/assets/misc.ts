import Asset from "./Asset";
import Sprite from "./Asset";

import cell from "../../assets/misc/cell.png";
import checkmark from "../../assets/misc/checkmark.png";
import checkmark_inv from "../../assets/misc/checkmark_inverse.png";
import tall_grass_1 from "../../assets/misc/tall_grass_1b.png";
import tall_grass_2 from "../../assets/misc/tall_grass_2b.png";
import tall_grass_3 from "../../assets/misc/tall_grass_3b.png";
import boxes from "../../assets/misc/boxes.png";
import bolt from "../../assets/misc/bolt.png";
// import chest from "../../assets/misc/chest.png";
import selection from "../../assets/misc/selection.png";
import arrow from "../../assets/misc/arrow.png";
import settings from "../../assets/misc/settings.png";
import gymleadernotes from "../../assets/misc/gymleadernotes.png";

const misc: Asset[] = [
	{ key: "cell",			path: cell },
	{ key: "checkmark",		path: checkmark },
	{ key: "checkmark_inv",	path: checkmark_inv },
	{ key: "tall_grass_1",	path: tall_grass_1 },
	{ key: "tall_grass_2",	path: tall_grass_2 },
	{ key: "tall_grass_3",	path: tall_grass_3 },
	{ key: "boxes",			path: boxes },
	{ key: "bolt",			path: bolt },
	{ key: "selection",		path: selection },
	{ key: "arrow",			path: arrow },
	{ key: "settings",		path: settings },
	{ key: "gymleadernotes",path: gymleadernotes },
];

export default misc;