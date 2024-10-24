import Asset from "./Asset";

// import pokedex from "../../assets/items/centers/17421 Pokédex (4th Generation).png";
import pokedex from "../../assets/items/centers/Rotom Pokedex.png";
import pc from "../../assets/items/centers/13867 PC.png";
import tent from "../../assets/items/centers/15062 Tent.png";
import johtoGym from "../../assets/items/centers/11956 Johto Pokémon Gyms.png";
import pokemonLeague from "../../assets/items/centers/12072 Pokémon League.png";
import centerHGSS from "../../assets/items/centers/10762 Pokémon Center HGSS.png";
import centerDP from "../../assets/items/centers/11106 Pokémon Center DP.png";
import centerBW from "../../assets/items/centers/12016 Pokémon Center BW.png";
import vermilionPort from "../../assets/items/centers/11977 Vermilion Port Entrance.png";

const centers: Asset[] = [
	{ key: "pokedex",		path: pokedex },
	{ key: "pc",			path: pc },
	{ key: "tent",			path: tent },
	{ key: "centerDP",		path: centerDP },
	{ key: "centerHGSS",	path: centerHGSS },
	{ key: "johtoGym",		path: johtoGym },
	{ key: "centerBW",		path: centerBW },
	{ key: "vermilionPort",	path: vermilionPort },
	{ key: "pokemonLeague",	path: pokemonLeague },
];

export default centers;