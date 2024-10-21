import Asset from "./Asset";

import pearl from "../../assets/items/pearls/Dream_Pearl_Sprite.png";
import bigPearl from "../../assets/items/pearls/Dream_Big_Pearl_Sprite.png";
import nugget from "../../assets/items/pearls/Dream_Nugget_Sprite.png";
import bigNugget from "../../assets/items/pearls/Dream_Big_Nugget_Sprite.png";
import pearlString from "../../assets/items/pearls/Dream_Pearl_String_Sprite.png";
import starPiece from "../../assets/items/pearls/Dream_Star_Piece_Sprite.png";

const pearls: Asset[] = [
	{ key: "pearl",			path: pearl },
	{ key: "bigPearl",		path: bigPearl },
	{ key: "pearlString",	path: pearlString },
	{ key: "nugget",		path: nugget },
	{ key: "bigNugget",		path: bigNugget },
	{ key: "starPiece",		path: starPiece },
];

export default pearls;