const itemData = {

	/* Pokemon */

	bulbasaur: [
		{ key: "bulbasaur_1",	name: "Bulbasaur" },
		{ key: "bulbasaur_2",	name: "Ivysaur" },
		{ key: "bulbasaur_3",	name: "Venusaur" },
		{ key: "bulbasaur_4",	name: "Mega Venusaur", generates: [
			{ odds: 0.2,	tier: 1,	type: "squirtle" },
			{ odds: 0.2,	tier: 1,	type: "charmander" },
			{ odds: 0.5,	tier: 1,	type: "eevee" },
			{ odds: 0.1,	tier: 2,	type: "eevee" },
		]},
	],

	charmander: [
		{ key: "charmander_1",	name: "Charmander" },
		{ key: "charmander_2",	name: "Charmeleon" },
		{ key: "charmander_3",	name: "Charizard" },
		{ key: "charmander_4",	name: "Mega Charizard Y", generates: [
			{ odds: 0.20,	tier: 1,	type: "bulbasaur" },
			{ odds: 0.20,	tier: 1,	type: "squirtle" },
			{ odds: 0.50,	tier: 1,	type: "eevee" },
			{ odds: 0.1,	tier: 2,	type: "eevee" },
		]},
		{ key: "charmander_5",	name: "Mega Charizard X", generates: [
			{ odds: 0.10,	tier: 2,	type: "bulbasaur" },
			{ odds: 0.10,	tier: 2,	type: "squirtle" },
			{ odds: 0.45,	tier: 1,	type: "eevee" },
			{ odds: 0.25,	tier: 2,	type: "eevee" },
			{ odds: 0.1,	tier: 3,	type: "eevee" },
		]},
	],

	squirtle: [
		{ key: "squirtle_1",	name: "Squirtle" },
		{ key: "squirtle_2",	name: "Wartortle" },
		{ key: "squirtle_3",	name: "Blastoise" },
		{ key: "squirtle_4",	name: "Mega Blastoise", generates: [
			{ odds: 0.2,	tier: 1,	type: "charmander" },
			{ odds: 0.2,	tier: 1,	type: "bulbasaur" },
			{ odds: 0.5,	tier: 1,	type: "eevee" },
			{ odds: 0.1,	tier: 2,	type: "eevee" },
		]},
	],

	electric: [
		{ key: "electric_1",	name: "Joltik", scale: 0.8 },
		{ key: "electric_2",	name: "Galvantula" },
		{ key: "electric_3",	name: "Pichu" },
		{ key: "electric_4",	name: "Pikachu", generates: [
			{ odds: 0.25,	tier: 1,	type: "eevee" },
			{ odds: 0.6,	tier: 1,	type: "legendary" },
			{ odds: 0.15,	tier: 2,	type: "legendary" },
		]},
		{ key: "electric_5",	name: "Raichu", generates: [
			{ odds: 0.05,	tier: 1,	type: "eevee" },
			{ odds: 0.1,	tier: 2,	type: "eevee" },
			{ odds: 0.3,	tier: 1,	type: "legendary" },
			{ odds: 0.45,	tier: 2,	type: "legendary" },
			{ odds: 0.1,	tier: 3,	type: "legendary" },
		]},
		{ key: "electric_6",	name: "Ampharos", generates: [
			{ odds: 0.15,	tier: 1,	type: "legendary" },
			{ odds: 0.35,	tier: 2,	type: "legendary" },
			{ odds: 0.35,	tier: 3,	type: "legendary" },
			{ odds: 0.15,	tier: 4,	type: "legendary" },
		]},
		{ key: "electric_7",	name: "Electabuzz", generates: [
			{ odds: 0.15,	tier: 2,	type: "legendary" },
			{ odds: 0.5,	tier: 3,	type: "legendary" },
			{ odds: 0.3,	tier: 4,	type: "legendary" },
			{ odds: 0.05,	tier: 5,	type: "legendary" },
		]},
		{ key: "electric_8",	name: "Electivire", generates: [
			{ odds: 0.15,	tier: 2,	type: "legendary" },
			{ odds: 0.35,	tier: 3,	type: "legendary" },
			{ odds: 0.35,	tier: 4,	type: "legendary" },
			{ odds: 0.15,	tier: 5,	type: "legendary" },
		]},
		{ key: "electric_9",	name: "Zapdos", generates: [
			{ odds: 0.1,	tier: 3,	type: "legendary" },
			{ odds: 0.4,	tier: 4,	type: "legendary" },
			{ odds: 0.3,	tier: 5,	type: "legendary" },
			{ odds: 0.2,	tier: 6,	type: "legendary" },
		]},
	],

	rotom: [
		{ key: "rotom_1",	name: "Rotom" },
		{ key: "rotom_2",	name: "Heat Rotom" },
		{ key: "rotom_3",	name: "Wash Rotom" },
		{ key: "rotom_4",	name: "Frost Rotom" },
		{ key: "rotom_5",	name: "Fan Rotom" },
		{ key: "rotom_6",	name: "Mow Rotom", generates: [
			{ odds: 0.3,	tier: 1,	type: "mart" },
			{ odds: 0.1,	tier: 2,	type: "mart" },
			{ odds: 0.2,	tier: 1,	type: "ruin" },
			{ odds: 0.1,	tier: 2,	type: "ruin" },
			{ odds: 0.2,	tier: 1,	type: "construction" },
			{ odds: 0.1,	tier: 2,	type: "construction" },
		], charges: 10},
	],

	eevee: [
		{ key: "eevee_1",	name: "Eevee" },
		{ key: "eevee_2",	name: "Vaporeon" },
		{ key: "eevee_3",	name: "Jolteon" },
		{ key: "eevee_4",	name: "Flareon", generates: [
			{ odds: 0.55,	tier: 1,	type: "electric" },
			{ odds: 0.35,	tier: 1,	type: "rotom" },
			{ odds: 0.1,	tier: 1,	type: "eevee" },
		]},
		{ key: "eevee_5",	name: "Espeon", generates: [
			{ odds: 0.30,	tier: 1,	type: "electric" },
			{ odds: 0.25,	tier: 2,	type: "electric" },
			{ odds: 0.20,	tier: 1,	type: "rotom" },
			{ odds: 0.15,	tier: 2,	type: "rotom" },
			{ odds: 0.05,	tier: 1,	type: "eevee" },
			{ odds: 0.05,	tier: 2,	type: "eevee" },
		]},
		{ key: "eevee_6",	name: "Umbreon", generates: [
			{ odds: 0.55,	tier: 2,	type: "electric" },
			{ odds: 0.35,	tier: 2,	type: "rotom" },
			{ odds: 0.1,	tier: 2,	type: "eevee" },
		]},
		{ key: "eevee_7",	name: "Leafeon", generates: [
			{ odds: 0.30,	tier: 2,	type: "electric" },
			{ odds: 0.25,	tier: 3,	type: "electric" },
			{ odds: 0.20,	tier: 2,	type: "rotom" },
			{ odds: 0.15,	tier: 3,	type: "rotom" },
			{ odds: 0.05,	tier: 2,	type: "eevee" },
			{ odds: 0.05,	tier: 3,	type: "eevee" },
		]},
		{ key: "eevee_8",	name: "Glaceon", generates: [
			{ odds: 0.55,	tier: 3,	type: "electric" },
			{ odds: 0.35,	tier: 3,	type: "rotom" },
			{ odds: 0.1,	tier: 3,	type: "eevee" },
		]},
		{ key: "eevee_9",	name: "Sylveon", generates: [
			{ odds: 0.30,	tier: 3,	type: "electric" },
			{ odds: 0.25,	tier: 4,	type: "electric" },
			{ odds: 0.20,	tier: 3,	type: "rotom" },
			{ odds: 0.15,	tier: 4,	type: "rotom" },
			{ odds: 0.05,	tier: 3,	type: "eevee" },
			{ odds: 0.05,	tier: 4,	type: "eevee" },
		]},
	],

	legendary: [
		{ key: "legendary_1",	name: "Mew" },
		{ key: "legendary_2",	name: "Mewtwo" },
		{ key: "legendary_3",	name: "Lugia" },
		{ key: "legendary_4",	name: "Ho-oh" },
		{ key: "legendary_5",	name: "Kyogre" },
		{ key: "legendary_6",	name: "Groudon" },
		{ key: "legendary_7",	name: "Rayquaza" },
		{ key: "legendary_8",	name: "Dialga" },
		{ key: "legendary_9",	name: "Palkia" },
		{ key: "legendary_10",	name: "Giratina" },
		{ key: "legendary_11",	name: "Yveltal" },
		{ key: "legendary_12",	name: "Xerneas" },
		{ key: "legendary_13",	name: "Zygarde" },
		{ key: "legendary_14",	name: "Arceus", scale: 1.4 },
	],

	// unown: [
	// 	{ key: "unown_1",	name: "Unown A" },
	// 	{ key: "unown_2",	name: "Unown B" },
	// 	{ key: "unown_3",	name: "Unown C" },
	// 	{ key: "unown_4",	name: "Unown D" },
	// 	{ key: "unown_5",	name: "Unown E" },
	// 	{ key: "unown_6",	name: "Unown F" },
	// 	{ key: "unown_7",	name: "Unown G" },
	// 	{ key: "unown_8",	name: "Unown H" },
	// 	{ key: "unown_9",	name: "Unown I" },
	// 	{ key: "unown_10",	name: "Unown J" },
	// 	{ key: "unown_11",	name: "Unown K" },
	// 	{ key: "unown_12",	name: "Unown L" },
	// 	{ key: "unown_13",	name: "Unown M" },
	// 	{ key: "unown_14",	name: "Unown N" },
	// 	{ key: "unown_15",	name: "Unown O" },
	// 	{ key: "unown_16",	name: "Unown P" },
	// 	{ key: "unown_17",	name: "Unown Q" },
	// 	{ key: "unown_18",	name: "Unown R" },
	// 	{ key: "unown_19",	name: "Unown S" },
	// 	{ key: "unown_20",	name: "Unown T" },
	// 	{ key: "unown_21",	name: "Unown U" },
	// 	{ key: "unown_22",	name: "Unown V" },
	// 	{ key: "unown_23",	name: "Unown W" },
	// 	{ key: "unown_24",	name: "Unown X" },
	// 	{ key: "unown_25",	name: "Unown Y" },
	// 	{ key: "unown_26",	name: "Unown Z" },
	// 	{ key: "unown_27",	name: "Unown !" },
	// 	{ key: "unown_28",	name: "Unown ?" },
	// ],


	/* Mart */

	mart: [
		{ key: "trainerTips",		scale: 0.9,		name: "Trainer Tips" },
		{ key: "pokeMartSign",		scale: 1.1,		name: "Poké Mart Sign" },
		{ key: "pokeMartShelves",	scale: 1.15,	name: "Poké Mart Shelves" },
		{ key: "pokeMartDP",		scale: 1.1,		name: "Poké Mart (DP)", generates: [
			{ odds: 0.7,	tier: 1,	type: "pokeball" },
			{ odds: 0.2,	tier: 1,	type: "potion" },
			{ odds: 0.1,	tier: 1,	type: "mart" },
		], charges: 6, recharge: 16 },
		{ key: "pokeMartHGSS",		scale: 1.4,		name: "Poké Mart (HGSS)", generates: [
			{ odds: 0.66,	tier: 1,	type: "pokeball" },
			{ odds: 0.15,	tier: 1,	type: "potion" },
			{ odds: 0.05,	tier: 2,	type: "potion" },
			{ odds: 0.1,	tier: 1,	type: "mart" },
			{ odds: 0.02,	tier: 1,	type: "ruin" },
			{ odds: 0.02,	tier: 1,	type: "construction" },
		], charges: 8, recharge: 14 },
		{ key: "kantoPokemonGyms",	scale: 1.1,		name: "Kanto Pokémon Gyms", generates: [
			{ odds: 0.66,	tier: 2,	type: "pokeball" },
			{ odds: 0.1,	tier: 1,	type: "potion" },
			{ odds: 0.1,	tier: 2,	type: "potion" },
			{ odds: 0.1,	tier: 1,	type: "mart" },
			{ odds: 0.02,	tier: 1,	type: "ruin" },
			{ odds: 0.02,	tier: 1,	type: "construction" },
		], charges: 11, recharge: 12 },
		{ key: "celadonStore",	scale: 1.15,	name: "Celadon Department Store", generates: [
			{ odds: 0.66,	tier: 2,	type: "pokeball" },
			{ odds: 0.05,	tier: 1,	type: "potion" },
			{ odds: 0.15,	tier: 2,	type: "potion" },
			{ odds: 0.1,	tier: 1,	type: "mart" },
			{ odds: 0.02,	tier: 1,	type: "ruin" },
			{ odds: 0.02,	tier: 1,	type: "construction" },
		], charges: 14, recharge: 10 },
		{ key: "goldenrodStore",	scale: 1.1,		name: "Goldenrod Department Store", generates: [
			{ odds: 0.66,	tier: [2,3,3,3,3,4],	type: "pokeball" },
			{ odds: 0.2,	tier: [2,2,2,3,4],		type: "potion" },
			{ odds: 0.1,	tier: 2,				type: "mart" },
			{ odds: 0.02,	tier: 2,				type: "ruin" },
			{ odds: 0.02,	tier: 2,				type: "construction" },
		], charges: 18, recharge: 8 },
		{ key: "silphCo",			scale: 1.15,	name: "Silph Co.", generates: [
			{ odds: 0.66,	tier: 3,	type: "pokeball" },
			{ odds: 0.05,	tier: 2,	type: "potion" },
			{ odds: 0.15,	tier: 3,	type: "potion" },
			{ odds: 0.1,	tier: 2,	type: "mart" },
			{ odds: 0.02,	tier: 2,	type: "ruin" },
			{ odds: 0.02,	tier: 2,	type: "construction" },
		], charges: 23, recharge: 6 },
		{ key: "foreignBuilding",	scale: 1.2,		name: "Foreign Building", generates: [
			{ odds: 0.66,	tier: 4,	type: "pokeball" },
			{ odds: 0.1,	tier: 3,	type: "potion" },
			{ odds: 0.1,	tier: 4,	type: "potion" },
			{ odds: 0.1,	tier: 3,	type: "mart" },
			{ odds: 0.02,	tier: 3,	type: "ruin" },
			{ odds: 0.02,	tier: 3,	type: "construction" },
		], charges: 28, recharge: 4 },
	],

	pokeball: [
		// { key: "safariBall",		scale: 0.7,	name: "Safari Ball" },
		// { key: "fastBall",			scale: 0.7,	name: "Fast Ball" },
		// { key: "lureBall",			scale: 0.7,	name: "Lure Ball" },
		// { key: "premierBall",		scale: 0.7,	name: "Premier Ball" },
		// { key: "moonBall",			scale: 0.7,	name: "Moon Ball" },
		// { key: "sportBall",			scale: 0.7,	name: "Sport Ball" },
		// { key: "repeatBall",		scale: 0.7,	name: "Repeat Ball" },
		// { key: "loveBall",			scale: 0.7,	name: "Love Ball" },
		// { key: "heavyBall",			scale: 0.7,	name: "Heavy Ball" },
		// { key: "dreamBall",			scale: 0.7,	name: "Dream Ball" },
		// { key: "nestBall",			scale: 0.7,	name: "Nest Ball" },
		// { key: "luxuryBall",		scale: 0.7,	name: "Luxury Ball" },
		// { key: "duskBall",			scale: 0.7,	name: "Dusk Ball" },
		// { key: "healBall",			scale: 0.7,	name: "Heal Ball" },
		// { key: "quickBall",			scale: 0.7,	name: "Quick Ball" },
		// { key: "cherishBall",		scale: 0.7,	name: "Cherish Ball" },
		// { key: "palParkParkBall",	scale: 0.7,	name: "Park Ball (Pal Park)" },
		// { key: "customPokeBall",	scale: 0.7,	name: "Custom Poke Ball" },
		// { key: "drasilBall",		scale: 0.7,	name: "Drasil Ball" },
		// { key: "levelBall",			scale: 0.7,	name: "Level Ball" },
		// { key: "glaceBall",			scale: 0.7,	name: "Glace Ball" },
		// { key: "lunarBall",			scale: 0.7,	name: "Lunar Ball" },
		// { key: "friendBall",		scale: 0.7,	name: "Friend Ball" },
		{ key: "pokeBall",			scale: 0.7,	name: "Poke Ball" },
		{ key: "greatBall",			scale: 0.7,	name: "Great Ball" },
		{ key: "johtoParkBall",		scale: 0.7,	name: "Park Ball (Johto)" },
		{ key: "netBall",			scale: 0.7,	name: "Net Ball" },
		{ key: "timerBall",			scale: 0.7,	name: "Timer Ball", generates: [
			{ odds: 0.34,	tier: 1,	type: "bulbasaur" },
			{ odds: 0.33,	tier: 1,	type: "charmander" },
			{ odds: 0.33,	tier: 1,	type: "squirtle" },
		], charges: 6},
		{ key: "diveBall",			scale: 0.7,	name: "Dive Ball", generates: [
			{ odds: 0.27,	tier: [1,1,1,2],	type: "bulbasaur" },
			{ odds: 0.27,	tier: [1,1,1,2],	type: "charmander" },
			{ odds: 0.26,	tier: [1,1,1,2],	type: "squirtle" },
			{ odds: 0.1,	tier: [1],			type: "eevee" },
			{ odds: 0.1,	tier: [1],			type: "mart" },
		], charges: 10},
		{ key: "ultraBall",			scale: 0.7,	name: "Ultra Ball", generates: [
			{ odds: 0.15,	tier: [1,1,2,2,2,3],	type: "bulbasaur" },
			{ odds: 0.15,	tier: [1,1,2,2,2,3],	type: "charmander" },
			{ odds: 0.15,	tier: [1,1,2,2,2,3],	type: "squirtle" },
			{ odds: 0.35,	tier: [1,1,1,2,3],		type: "eevee" },
			{ odds: 0.1,	tier: [1,1,2],			type: "electric" },
			{ odds: 0.1,	tier: [1,1,2],			type: "mart" },
		], charges: 15},
		{ key: "gSBall",			scale: 0.7,	name: "GS Ball", generates: [
			{ odds: 0.05,	tier: [1,2,2,3,3],	type: "bulbasaur" },
			{ odds: 0.05,	tier: [1,2,2,3,3],	type: "charmander" },
			{ odds: 0.05,	tier: [1,2,2,3,3],	type: "squirtle" },
			{ odds: 0.45,	tier: [1,2,2,3],	type: "eevee" },
			{ odds: 0.20,	tier: [1,2,3],		type: "electric" },
			{ odds: 0.10,	tier: [1,1,2],		type: "rotom" },
			{ odds: 0.10,	tier: [1,2,2,3],	type: "mart" },
		], charges: 20},
		{ key: "masterBall",		scale: 0.7,	name: "Master Ball", generates: [
			{ odds: 0.2,	tier: [2,2,3,3,4],		type: "eevee" },
			{ odds: 0.2,	tier: [2,3,3,4],		type: "electric" },
			{ odds: 0.2,	tier: [2,2,3,3,4],		type: "rotom" },
			{ odds: 0.3,	tier: [1,1,2,2,3,4,5],	type: "legendary" },
			{ odds: 0.1,	tier: [2,3,3,4],		type: "mart" },
		], charges: 26},
	],

	potion: [
		{ key: "antidote",		scale: 0.72,	name: "Antidote" },
		{ key: "ether",			scale: 0.69,	name: "Ether" },
		// { key: "fullHeal",		scale: 0.70,	name: "Full Heal" },
		// { key: "potion",		scale: 0.70,	name: "Potion" },
		{ key: "superPotion",	scale: 0.72,	name: "Super Potion" },
		// { key: "hyperPotion",	scale: 0.70,	name: "Hyper Potion" },
		// { key: "maxPotion",		scale: 0.70,	name: "Max Potion" },
		{ key: "fullRestore",	scale: 0.77,	name: "Full Restore" },
		{ key: "revive",		scale: 0.69,	name: "Revive", generates: [
			{ odds: 0.4,	tier: [1,1,1,2],	type: "mart" },
			{ odds: 0.3,	tier: [1,1,1,2],	type: "ruin" },
			{ odds: 0.3,	tier: [1,1,1,2],	type: "construction" },
		], charges: 5},
		{ key: "maxRevive",		scale: 0.82,	name: "Max Revive", generates: [
			{ odds: 0.4,	tier: [1,2,2,3],	type: "mart" },
			{ odds: 0.3,	tier: [1,2,2,3],	type: "ruin" },
			{ odds: 0.3,	tier: [1,2,2,3],	type: "construction" },
		], charges: 8},
	],


	/* Ruins */

	ruin: [
		{ key: "dirtPile",			scale: 0.95,	name: "Dirt Pile" },
		{ key: "coalSlabs",			scale: 1.0,		name: "Coal Slabs" },
		{ key: "rock",				scale: 1.0,		name: "Rock" },
		// { key: "pokemonRock",		scale: 1.2,		name: "Pokémon Rock", generates: [
		{ key: "tomb",				scale: 1.1,		name: "Tomb", generates: [
			{ odds: 0.40,	tier: 1,	type: "stone" },
			{ odds: 0.45,	tier: 1,	type: "fossil" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
		], charges: 6, recharge: 16 },
		{ key: "relicCastle",		scale: 1.05,	name: "Relic Castle Entrances", generates: [
			{ odds: 0.40,	tier: 1,	type: "stone" },
			{ odds: 0.45,	tier: 1,	type: "fossil" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
		], charges: 8, recharge: 14 },
		{ key: "spearPillarRuins",	scale: 1.22,	name: "Spear Pillar Ruins", generates: [
			{ odds: 0.40,	tier: 1,	type: "stone" },
			{ odds: 0.45,	tier: 1,	type: "fossil" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
		], charges: 11, recharge: 12 },
		{ key: "ruinsOfAlph",		scale: 1.18,	name: "Ruins of Alph", generates: [
			{ odds: 0.40,	tier: 1,	type: "stone" },
			{ odds: 0.45,	tier: 1,	type: "fossil" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
		], charges: 15, recharge: 10 },
		{ key: "snowpointTemple",	scale: 1.15,	name: "Snowpoint Temple", generates: [
			{ odds: 0.40,	tier: 1,	type: "stone" },
			{ odds: 0.45,	tier: 1,	type: "fossil" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
		], charges: 20, recharge: 8 },
		{ key: "amitySquareRuins",	scale: 1.2,		name: "Amity Square Ruins", generates: [
			{ odds: 0.40,	tier: 1,	type: "stone" },
			{ odds: 0.45,	tier: 1,	type: "fossil" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
		], charges: 26, recharge: 6 },
	],

	fossil: [
		{ key: "rareBone",		scale: 0.7,	name: "Rare Bone" },
		{ key: "domeFossil",	scale: 0.7,	name: "Dome Fossil" },
		{ key: "helixFossil",	scale: 0.7,	name: "Helix Fossil" },
		// { key: "oldAmber",		scale: 0.7,	name: "Old Amber" },
		{ key: "rootFossil",	scale: 0.7,	name: "Root Fossil" },
		{ key: "clawFossil",	scale: 0.7,	name: "Claw Fossil" },
		{ key: "skullFossil",	scale: 0.7,	name: "Skull Fossil" },
		{ key: "armorFossil",	scale: 0.7,	name: "Armor Fossil" },
		{ key: "coverFossil",	scale: 0.9,	name: "Cover Fossil" },
		{ key: "plumeFossil",	scale: 0.9,	name: "Plume Fossil" },
		{ key: "jawFossil",		scale: 0.9,	name: "Jaw Fossil" },
		{ key: "sailFossil",	scale: 0.9,	name: "Sail Fossil" },
	],

	stone: [
		{ key: "fireStone",		scale: 0.7,	name: "Fire Stone" },
		{ key: "waterStone",	scale: 0.7,	name: "Water Stone" },
		{ key: "thunderStone",	scale: 0.7,	name: "Thunder Stone" },
		{ key: "leafStone",		scale: 0.7,	name: "Leaf Stone" },
		{ key: "moonStone",		scale: 0.7,	name: "Moon Stone" },
		{ key: "sunStone",		scale: 0.7,	name: "Sun Stone" },
		{ key: "shinyStone",	scale: 0.7,	name: "Shiny Stone" },
		{ key: "duskStone",		scale: 0.7,	name: "Dusk Stone" },
		{ key: "dawnStone",		scale: 0.7,	name: "Dawn Stone" },
		{ key: "iceStone",		scale: 0.9,	name: "Ice Stone" },
	],


	/* Construction */

	construction: [
		{ key: "bricks",			scale: 0.85,	name: "Bricks" },
		{ key: "girders",			scale: 1.0,		name: "Girders" },
		{ key: "drums",				scale: 1.05,	name: "Drums" },
		{ key: "miningVehicles",	scale: 1.0,		name: "Mining Vehicles", generates: [
			{ odds: 0.7,	tier: 1,	type: "vending" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
			{ odds: 0.15,	tier: 1,	type: "construction" },
		], charges: 2, recharge: 30 },
		{ key: "greatMarshTrain",	scale: 1.0,		name: "Great Marsh Train", generates: [
			{ odds: 0.7,	tier: 1,	type: "vending" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
			{ odds: 0.15,	tier: 1,	type: "construction" },
		], charges: 3, recharge: 26 },
		{ key: "snowpointCrane",	scale: 1.0,		name: "Snowpoint City Crane", generates: [
			{ odds: 0.7,	tier: 1,	type: "vending" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
			{ odds: 0.15,	tier: 1,	type: "construction" },
		], charges: 4, recharge: 23 },
		{ key: "driftveilCrane",	scale: 1.1,		name: "Driftveil City Crane", generates: [
			{ odds: 0.7,	tier: 1,	type: "vending" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
			{ odds: 0.15,	tier: 1,	type: "construction" },
		], charges: 6, recharge: 20 },
		{ key: "fuegoIronworks",	scale: 1.07,	name: "Fuego Ironworks", generates: [
			{ odds: 0.7,	tier: 1,	type: "vending" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
			{ odds: 0.15,	tier: 1,	type: "construction" },
		], charges: 8, recharge: 17 },
		{ key: "kantoPowerPlant",	scale: 1.1,		name: "Kanto Power Plant", generates: [
			{ odds: 0.7,	tier: 1,	type: "vending" },
			{ odds: 0.15,	tier: 1,	type: "ruin" },
			{ odds: 0.15,	tier: 1,	type: "construction" },
		], charges: 10, recharge: 15 },
	],

	vending: [
		{ key: "vendingBW",			scale: 0.85,	name: "Vending Machine (BW)" },
		{ key: "vendingDP",			scale: 0.95,	name: "Vending Machine (DP)" },
		{ key: "vendingORAS",		scale: 0.85,	name: "Vending Machine (ORAS)", generates: [
			{ odds: 0.85,	tier: 1,	type: "drink" },
			{ odds: 0.15,	tier: 1,	type: "construction" },
		], charges: 6 },
	],

	drink: [
		{ key: "freshWater",	scale: 0.75,	name: "Fresh Water" },
		{ key: "sodaPop",		scale: 0.75,	name: "Soda Pop" },
		{ key: "lemonade",		scale: 0.75,	name: "Lemonade" },
		{ key: "moomooMilk",	scale: 0.75,	name: "Moomoo Milk" },
		{ key: "berryJuice",	scale: 0.75,	name: "Berry Juice", generates: [
			{ odds: 0.1,	tier: 1,	type: "legendary" },
			{ odds: 0.2,	tier: 2,	type: "legendary" },
			{ odds: 0.2,	tier: 3,	type: "legendary" },
			{ odds: 0.2,	tier: 4,	type: "legendary" },
			{ odds: 0.2,	tier: 5,	type: "legendary" },
			{ odds: 0.1,	tier: 6,	type: "legendary" },
		], charges: 6 },
	],


	/* Center */

	center: [
		{ key: "pokedex",		scale: 0.85,	name: "Pokédex" },
		{ key: "pc",			scale: 1.0,		name: "PC" },
		{ key: "tent",			scale: 1.0,		name: "Tent" },
		{ key: "pokemonLeague",	scale: 1.05,	name: "Pokémon League" },
	],

	berry: [],

	weatherRock: [
		{ key: "dampRock",		scale: 0.8,		name: "Damp Rock" },
		{ key: "heatRock",		scale: 0.8,		name: "Heat Rock" },
		{ key: "icyRock",		scale: 0.8,		name: "Icy Rock" },
		{ key: "smoothRock",	scale: 0.8,		name: "Smooth Rock" },
	],


	/* Gifts */

	gift: [
		{ key: "whiteGift",		name: "Mystery Gift", generates: [
			{ odds: 0.3,	tier: 1,	type: "mart" },
			{ odds: 0.1,	tier: 2,	type: "mart" },
			{ odds: 0.2,	tier: 1,	type: "ruin" },
			{ odds: 0.1,	tier: 2,	type: "ruin" },
			{ odds: 0.2,	tier: 1,	type: "construction" },
			{ odds: 0.1,	tier: 2,	type: "construction" },
		], charges: 6},
		{ key: "yellowGift",	name: "Mystery Gift", generates: [
			{ odds: 0.3,	tier: 1,	type: "mart" },
			{ odds: 0.2,	tier: 2,	type: "mart" },
			{ odds: 0.2,	tier: 1,	type: "ruin" },
			{ odds: 0.2,	tier: 2,	type: "ruin" },
			{ odds: 0.2,	tier: 1,	type: "construction" },
			{ odds: 0.2,	tier: 2,	type: "construction" },
		], charges: 12},
	],
};


// Check
// for (let type in itemData) {
// 	// console.log(type, itemData[type].length);
// 	for (let obj of itemData[type]) {
// 		if (obj.generates) {
// 			let sum = 0;
// 			for (let drop of obj.generates) {
// 				sum += drop.odds;
// 			}
// 			if (Math.abs(sum - 1) > 0.001) {
// 				console.error(type, obj.name, sum);
// 			}
// 		}
// 	}
// }


export { itemData };