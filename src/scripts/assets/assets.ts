import Asset from "./Asset";
import Spritesheet from "./Spritesheet";
import Audio from "./Audio";

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

import trees from "./trees";
import berries from "./berries";
// import weatherRocks from "./weatherRocks";
import edibles from "./edibles";
import herbs from "./herbs";

import drives from "./drives";
import techs from "./techs";
import metals from "./metals";
import boats from "./boats";
import shells from "./shells";
import pearls from "./pearls";

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

	trees,
	berries,
	// weatherRocks,
	edibles,
	herbs,

	drives,
	techs,
	metals,
	boats,
	shells,
	pearls,

	nintendo,

	chests,
	experience
);

import tileset from "../../assets/misc/tileset64.png";

const spritesheets: Spritesheet[] = [
	{
		key: "tileset",
		path: tileset,
		width: 64,
		height: 64,
		margin: 1,
		spacing: 2,
	},
];

import sounds from "./sounds";

export { images, spritesheets, sounds };
