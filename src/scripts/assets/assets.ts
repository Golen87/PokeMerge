import Asset from "./Asset";
import Spritesheet from "./Spritesheet";
import Audio from "./Audio";

import misc from "./misc";
import { pokemonAssets } from "../items/pokemons";

import { martAssets } from "../items/marts";
import { pokeballAssets } from "../items/pokeballs";
import { potionAssets } from "../items/potions";

import { ruinAssets } from "../items/ruins";
import { fossilAssets } from "../items/fossils";
import { stoneAssets } from "../items/stones";

import { constructionAssets } from "../items/constructions";
// import { vendingAssets } from "../items/vendings";
import { drinkAssets } from "../items/drinks";

import { centerAssets } from "../items/centers";

import { treeAssets } from "../items/trees";
import { berryAssets } from "../items/berries";
import { edibleAssets } from "../items/edibles";
import { herbAssets } from "../items/herbs";

import { driveAssets } from "../items/drives";
import { techAssets } from "../items/techs";
import { metalAssets } from "../items/metals";
import { boatAssets } from "../items/boats";
import { shellAssets } from "../items/shells";
import { pearlAssets } from "../items/pearls";

import { nintendoAssets } from "../items/nintendo";

import { chestAssets } from "../items/chests";
import { experienceAssets } from "../items/experience";

const images: Asset[] = misc.concat(
	pokemonAssets,

	martAssets,
	pokeballAssets,
	potionAssets,

	ruinAssets,
	fossilAssets,
	stoneAssets,

	constructionAssets,
	// vendingAssets,
	drinkAssets,

	centerAssets,

	treeAssets,
	berryAssets,
	edibleAssets,
	herbAssets,

	driveAssets,
	techAssets,
	metalAssets,
	boatAssets,
	shellAssets,
	pearlAssets,

	nintendoAssets,

	chestAssets,
	experienceAssets
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
