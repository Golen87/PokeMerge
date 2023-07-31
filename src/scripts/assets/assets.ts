import Asset from "./Asset";
import Spritesheet from "./Spritesheet";

import misc from "./misc";
import pokemons from "./pokemons";

import marts from "./marts";
import pokeballs from "./pokeballs";
import potions from "./potions";

import ruins from "./ruins";
import fossils from "./fossils";
import stones from "./stones";

import constructions from "./constructions";
import vendings from "./vendings";
import drinks from "./drinks";

import centers from "./centers";
import berries from "./berries";
import weatherRocks from "./weatherRocks";
import edibles from "./edibles";

import nintendo from "./nintendo";

import chests from "./chests";
import experience from "./experience";

const images: Asset[] = misc.concat(
	pokemons,

	marts,
	pokeballs,
	potions,

	ruins,
	fossils,
	stones,

	constructions,
	vendings,
	drinks,

	centers,
	berries,
	weatherRocks,
	edibles,

	nintendo,

	chests,
	experience,
);


import tileset from "../../assets/misc/tileset64.png";

const spritesheets: Spritesheet[] = [
	{ key: "tileset", path: tileset, width: 64, height: 64 },
];

export {
	images,
	spritesheets
};
