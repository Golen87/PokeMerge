import Asset from "./Asset";

import nes from "../../assets/items/nintendo/1_nes.png";
import snes from "../../assets/items/nintendo/2_snes.png";
import n64 from "../../assets/items/nintendo/3_n64_controller.png";
import gameboy from "../../assets/items/nintendo/4_gameboy.png";
import threeds from "../../assets/items/nintendo/6_3ds.png";
import wii_u from "../../assets/items/nintendo/7_wii_u.png";
import nswitch from "../../assets/items/nintendo/8_switch_1.png";

const nintendo: Asset[] = [
	{ key: "nes",		path: nes },
	{ key: "snes",		path: snes },
	{ key: "n64",		path: n64 },
	{ key: "gameboy",	path: gameboy },
	{ key: "threeds",	path: threeds },
	{ key: "wii_u",		path: wii_u },
	{ key: "switch",	path: nswitch },
];

export default nintendo;