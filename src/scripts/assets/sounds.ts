import Audio from "./Audio";

import Place_Down_01 from "../../assets/sounds/Place_Down_01.ogg";
import Place_Down_02 from "../../assets/sounds/Place_Down_02.ogg";
import Merge_01 from "../../assets/sounds/Merge_01.ogg";
import Merge_02 from "../../assets/sounds/Merge_02.ogg";
import Drop from "../../assets/sounds/Drop.ogg";

const sounds: Audio[] = [
	{ key: "Place_Down_01", path: Place_Down_01, volume: 0.0 },
	{ key: "Place_Down_02", path: Place_Down_02, volume: 0.0 },
    { key: "Merge_01", path: Merge_01, volume: 0.0 },
	{ key: "Merge_02", path: Merge_02, volume: 0.0 },
	{ key: "Drop", path: Drop, volume: 0.0 },
];

export default sounds;