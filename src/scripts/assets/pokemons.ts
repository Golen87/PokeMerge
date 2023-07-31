import Asset from "./Asset";

import grass_1 from "../../assets/items/pokemon/1.png"; // Bulbasaur
import grass_2 from "../../assets/items/pokemon/2.png"; // Ivysaur
import grass_3 from "../../assets/items/pokemon/3.png"; // Venusaur
// import grass_ from "../../assets/items/pokemon/857.png"; // MegaVenusaur
import grass_4 from "../../assets/items/pokemon/152.png"; // Chikorita
import grass_5 from "../../assets/items/pokemon/153.png"; // Bayleef
import grass_6 from "../../assets/items/pokemon/154.png"; // Meganium
import grass_7 from "../../assets/items/pokemon/279.png"; // Treecko
import grass_8 from "../../assets/items/pokemon/280.png"; // Grovyle
import grass_9 from "../../assets/items/pokemon/281.png"; // Sceptile
// import grass_ from "../../assets/items/pokemon/878.png"; // MegaSceptile
import grass_10 from "../../assets/items/pokemon/422.png"; // Turtwig
import grass_11 from "../../assets/items/pokemon/423.png"; // Grotle
import grass_12 from "../../assets/items/pokemon/424.png"; // Torterra
import grass_13 from "../../assets/items/pokemon/561.png"; // Snivy
import grass_14 from "../../assets/items/pokemon/562.png"; // Servine
import grass_15 from "../../assets/items/pokemon/563.png"; // Serperior

import fire_1 from "../../assets/items/pokemon/4.png"; // Charmander
import fire_2 from "../../assets/items/pokemon/5.png"; // Charmeleon
import fire_3 from "../../assets/items/pokemon/6.png"; // Charizard
// import fire_ from "../../assets/items/pokemon/858.png"; // MegaCharizard
import fire_4 from "../../assets/items/pokemon/155.png"; // Cyndaquil
import fire_5 from "../../assets/items/pokemon/156.png"; // Quilava
import fire_6 from "../../assets/items/pokemon/157.png"; // Typhlosion
import fire_7 from "../../assets/items/pokemon/282.png"; // Torchic
import fire_8 from "../../assets/items/pokemon/283.png"; // Combusken
import fire_9 from "../../assets/items/pokemon/284.png"; // Blaziken
// import fire_ from "../../assets/items/pokemon/879.png"; // MegaBlaziken
import fire_10 from "../../assets/items/pokemon/425.png"; // Chimchar
import fire_11 from "../../assets/items/pokemon/426.png"; // Monferno
import fire_12 from "../../assets/items/pokemon/427.png"; // Infernape
import fire_13 from "../../assets/items/pokemon/564.png"; // Tepig
import fire_14 from "../../assets/items/pokemon/565.png"; // Pignite
import fire_15 from "../../assets/items/pokemon/566.png"; // Emboar

import water_1 from "../../assets/items/pokemon/7.png"; // Squirtle
import water_2 from "../../assets/items/pokemon/8.png"; // Wartortle
import water_3 from "../../assets/items/pokemon/9.png"; // Blastoise
// import water_ from "../../assets/items/pokemon/860.png"; // MegaBlastoise
import water_4 from "../../assets/items/pokemon/158.png"; // Totodile
import water_5 from "../../assets/items/pokemon/159.png"; // Croconaw
import water_6 from "../../assets/items/pokemon/160.png"; // Feraligatr
import water_7 from "../../assets/items/pokemon/285.png"; // Mudkip
import water_8 from "../../assets/items/pokemon/286.png"; // Marshtomp
import water_9 from "../../assets/items/pokemon/287.png"; // Swampert
// import water_ from "../../assets/items/pokemon/880.png"; // MegaSwampert
import water_10 from "../../assets/items/pokemon/428.png"; // Piplup
import water_11 from "../../assets/items/pokemon/429.png"; // Prinplup
import water_12 from "../../assets/items/pokemon/430.png"; // Empoleon
import water_13 from "../../assets/items/pokemon/567.png"; // Oshawott
import water_14 from "../../assets/items/pokemon/568.png"; // Dewott
import water_15 from "../../assets/items/pokemon/569.png"; // Samurott


import bulbasaur_1 from "../../assets/items/pokemon/1.png"; // Bulbasaur
import bulbasaur_2 from "../../assets/items/pokemon/2.png"; // Ivysaur
import bulbasaur_3 from "../../assets/items/pokemon/3.png"; // Venusaur
import bulbasaur_4 from "../../assets/items/pokemon/857.png"; // Mega Venusaur

import charmander_1 from "../../assets/items/pokemon/4.png"; // Charmander
import charmander_2 from "../../assets/items/pokemon/5.png"; // Charmeleon
import charmander_3 from "../../assets/items/pokemon/6.png"; // Charizard
import charmander_4 from "../../assets/items/pokemon/859.png"; // Mega Charizard Y
import charmander_5 from "../../assets/items/pokemon/858.png"; // Mega Charizard X

import squirtle_1 from "../../assets/items/pokemon/7.png"; // Squirtle
import squirtle_2 from "../../assets/items/pokemon/8.png"; // Wartortle
import squirtle_3 from "../../assets/items/pokemon/9.png"; // Blastoise
import squirtle_4 from "../../assets/items/pokemon/860.png"; // Mega Blastoise

import eevee_1 from "../../assets/items/pokemon/133.png"; // Eevee
import eevee_2 from "../../assets/items/pokemon/134.png"; // Vaporeon
import eevee_3 from "../../assets/items/pokemon/135.png"; // Jolteon
import eevee_4 from "../../assets/items/pokemon/136.png"; // Flareon
import eevee_5 from "../../assets/items/pokemon/196.png"; // Espeon
import eevee_6 from "../../assets/items/pokemon/197.png"; // Umbreon
import eevee_7 from "../../assets/items/pokemon/512.png"; // Leafeon
import eevee_8 from "../../assets/items/pokemon/513.png"; // Glaceon
import eevee_9 from "../../assets/items/pokemon/829.png"; // Sylveon

import electric_1 from "../../assets/items/pokemon/672.png"; // Joltik
import electric_2 from "../../assets/items/pokemon/673.png"; // Galvantula
import electric_3 from "../../assets/items/pokemon/172.png"; // Pichu
import electric_4 from "../../assets/items/pokemon/25.png"; // Pikachu
import electric_5 from "../../assets/items/pokemon/26.png"; // Raichu
import electric_6 from "../../assets/items/pokemon/181.png"; // Ampharos
import electric_7 from "../../assets/items/pokemon/125.png"; // Electabuzz
import electric_8 from "../../assets/items/pokemon/508.png"; // Electivire
import electric_9 from "../../assets/items/pokemon/145.png"; // Zapdos

import rotom_1 from "../../assets/items/pokemon/521.png"; // Rotom
import rotom_2 from "../../assets/items/pokemon/522.png"; // Heat Rotom
import rotom_3 from "../../assets/items/pokemon/523.png"; // Wash Rotom
import rotom_4 from "../../assets/items/pokemon/524.png"; // Frost Rotom
import rotom_5 from "../../assets/items/pokemon/525.png"; // Fan Rotom
import rotom_6 from "../../assets/items/pokemon/526.png"; // Mow Rotom

import legendary_1 from "../../assets/items/pokemon/151.png"; // Mew
import legendary_2 from "../../assets/items/pokemon/150.png"; // Mewtwo
import legendary_3 from "../../assets/items/pokemon/276.png"; // Lugia
import legendary_4 from "../../assets/items/pokemon/277.png"; // Ho-oh
import legendary_5 from "../../assets/items/pokemon/412.png"; // Kyogre
import legendary_6 from "../../assets/items/pokemon/414.png"; // Groudon
import legendary_7 from "../../assets/items/pokemon/416.png"; // Rayquaza
import legendary_8 from "../../assets/items/pokemon/530.png"; // Dialga
import legendary_9 from "../../assets/items/pokemon/531.png"; // Palkia
import legendary_10 from "../../assets/items/pokemon/534.png"; // Giratina
// import legendary_9 from "../../assets/items/pokemon/722.png"; // Reshiram
// import legendary_10 from "../../assets/items/pokemon/723.png"; // Zekrom
import legendary_11 from "../../assets/items/pokemon/851.png"; // Yveltal
import legendary_12 from "../../assets/items/pokemon/852.png"; // Xerneas
import legendary_13 from "../../assets/items/pokemon/853.png"; // Zygarde
import legendary_14 from "../../assets/items/pokemon/542.png"; // Arceus

// import unown_1 from "../../assets/items/pokemon/201.png"; // Unown A
// import unown_2 from "../../assets/items/pokemon/202.png"; // Unown B
// import unown_3 from "../../assets/items/pokemon/203.png"; // Unown C
// import unown_4 from "../../assets/items/pokemon/204.png"; // Unown D
// import unown_5 from "../../assets/items/pokemon/205.png"; // Unown E
// import unown_6 from "../../assets/items/pokemon/206.png"; // Unown F
// import unown_7 from "../../assets/items/pokemon/207.png"; // Unown G
// import unown_8 from "../../assets/items/pokemon/208.png"; // Unown H
// import unown_9 from "../../assets/items/pokemon/209.png"; // Unown I
// import unown_10 from "../../assets/items/pokemon/210.png"; // Unown J
// import unown_11 from "../../assets/items/pokemon/211.png"; // Unown K
// import unown_12 from "../../assets/items/pokemon/212.png"; // Unown L
// import unown_13 from "../../assets/items/pokemon/213.png"; // Unown M
// import unown_14 from "../../assets/items/pokemon/214.png"; // Unown N
// import unown_15 from "../../assets/items/pokemon/215.png"; // Unown O
// import unown_16 from "../../assets/items/pokemon/216.png"; // Unown P
// import unown_17 from "../../assets/items/pokemon/217.png"; // Unown Q
// import unown_18 from "../../assets/items/pokemon/218.png"; // Unown R
// import unown_19 from "../../assets/items/pokemon/219.png"; // Unown S
// import unown_20 from "../../assets/items/pokemon/220.png"; // Unown T
// import unown_21 from "../../assets/items/pokemon/221.png"; // Unown U
// import unown_22 from "../../assets/items/pokemon/222.png"; // Unown V
// import unown_23 from "../../assets/items/pokemon/223.png"; // Unown W
// import unown_24 from "../../assets/items/pokemon/224.png"; // Unown X
// import unown_25 from "../../assets/items/pokemon/225.png"; // Unown Y
// import unown_26 from "../../assets/items/pokemon/226.png"; // Unown Z
// import unown_27 from "../../assets/items/pokemon/227.png"; // Unown !
import unown_28 from "../../assets/items/pokemon/228.png"; // Unown ?

let pokemon: Asset[] = [
	// { key: "grass_1",	path: grass_1 },
	// { key: "grass_2",	path: grass_2 },
	// { key: "grass_3",	path: grass_3 },
	// { key: "grass_4",	path: grass_4 },
	// { key: "grass_5",	path: grass_5 },
	// { key: "grass_6",	path: grass_6 },
	// { key: "grass_7",	path: grass_7 },
	// { key: "grass_8",	path: grass_8 },
	// { key: "grass_9",	path: grass_9 },
	// { key: "grass_10",	path: grass_10 },
	// { key: "grass_11",	path: grass_11 },
	// { key: "grass_12",	path: grass_12 },
	// { key: "grass_13",	path: grass_13 },
	// { key: "grass_14",	path: grass_14 },
	// { key: "grass_15",	path: grass_15 },

	// { key: "fire_1",	path: fire_1 },
	// { key: "fire_2",	path: fire_2 },
	// { key: "fire_3",	path: fire_3 },
	// { key: "fire_4",	path: fire_4 },
	// { key: "fire_5",	path: fire_5 },
	// { key: "fire_6",	path: fire_6 },
	// { key: "fire_7",	path: fire_7 },
	// { key: "fire_8",	path: fire_8 },
	// { key: "fire_9",	path: fire_9 },
	// { key: "fire_10",	path: fire_10 },
	// { key: "fire_11",	path: fire_11 },
	// { key: "fire_12",	path: fire_12 },
	// { key: "fire_13",	path: fire_13 },
	// { key: "fire_14",	path: fire_14 },
	// { key: "fire_15",	path: fire_15 },

	// { key: "water_1",	path: water_1 },
	// { key: "water_2",	path: water_2 },
	// { key: "water_3",	path: water_3 },
	// { key: "water_4",	path: water_4 },
	// { key: "water_5",	path: water_5 },
	// { key: "water_6",	path: water_6 },
	// { key: "water_7",	path: water_7 },
	// { key: "water_8",	path: water_8 },
	// { key: "water_9",	path: water_9 },
	// { key: "water_10",	path: water_10 },
	// { key: "water_11",	path: water_11 },
	// { key: "water_12",	path: water_12 },
	// { key: "water_13",	path: water_13 },
	// { key: "water_14",	path: water_14 },
	// { key: "water_15",	path: water_15 },


	{ key: "bulbasaur_1",	path: bulbasaur_1 },
	{ key: "bulbasaur_2",	path: bulbasaur_2 },
	{ key: "bulbasaur_3",	path: bulbasaur_3 },
	{ key: "bulbasaur_4",	path: bulbasaur_4 },

	{ key: "charmander_1",	path: charmander_1 },
	{ key: "charmander_2",	path: charmander_2 },
	{ key: "charmander_3",	path: charmander_3 },
	{ key: "charmander_4",	path: charmander_4 },
	{ key: "charmander_5",	path: charmander_5 },

	{ key: "squirtle_1",	path: squirtle_1 },
	{ key: "squirtle_2",	path: squirtle_2 },
	{ key: "squirtle_3",	path: squirtle_3 },
	{ key: "squirtle_4",	path: squirtle_4 },

	// { key: "eevee_1",		path: eevee_1 },
	// { key: "eevee_2",		path: eevee_2 },
	// { key: "eevee_3",		path: eevee_3 },
	// { key: "eevee_4",		path: eevee_4 },
	// { key: "eevee_5",		path: eevee_5 },
	// { key: "eevee_6",		path: eevee_6 },
	// { key: "eevee_7",		path: eevee_7 },
	// { key: "eevee_8",		path: eevee_8 },
	// { key: "eevee_9",		path: eevee_9 },

	// { key: "electric_1",	path: electric_1 },
	// { key: "electric_2",	path: electric_2 },
	// { key: "electric_3",	path: electric_3 },
	// { key: "electric_4",	path: electric_4 },
	// { key: "electric_5",	path: electric_5 },
	// { key: "electric_6",	path: electric_6 },
	// { key: "electric_7",	path: electric_7 },
	// { key: "electric_8",	path: electric_8 },
	// { key: "electric_9",	path: electric_9 },

	// { key: "rotom_1",		path: rotom_1 },
	// { key: "rotom_2",		path: rotom_2 },
	// { key: "rotom_3",		path: rotom_3 },
	// { key: "rotom_4",		path: rotom_4 },
	// { key: "rotom_5",		path: rotom_5 },
	// { key: "rotom_6",		path: rotom_6 },

	{ key: "legendary_1",	path: legendary_1 },
	{ key: "legendary_2",	path: legendary_2 },
	{ key: "legendary_3",	path: legendary_3 },
	{ key: "legendary_4",	path: legendary_4 },
	{ key: "legendary_5",	path: legendary_5 },
	{ key: "legendary_6",	path: legendary_6 },
	{ key: "legendary_7",	path: legendary_7 },
	{ key: "legendary_8",	path: legendary_8 },
	{ key: "legendary_9",	path: legendary_9 },
	{ key: "legendary_10",	path: legendary_10 },
	{ key: "legendary_11",	path: legendary_11 },
	{ key: "legendary_12",	path: legendary_12 },
	{ key: "legendary_13",	path: legendary_13 },
	{ key: "legendary_14",	path: legendary_14 },

	// { key: "unown_1",		path: unown_1 },
	// { key: "unown_2",		path: unown_2 },
	// { key: "unown_3",		path: unown_3 },
	// { key: "unown_4",		path: unown_4 },
	// { key: "unown_5",		path: unown_5 },
	// { key: "unown_6",		path: unown_6 },
	// { key: "unown_7",		path: unown_7 },
	// { key: "unown_8",		path: unown_8 },
	// { key: "unown_9",		path: unown_9 },
	// { key: "unown_10",		path: unown_10 },
	// { key: "unown_11",		path: unown_11 },
	// { key: "unown_12",		path: unown_12 },
	// { key: "unown_13",		path: unown_13 },
	// { key: "unown_14",		path: unown_14 },
	// { key: "unown_15",		path: unown_15 },
	// { key: "unown_16",		path: unown_16 },
	// { key: "unown_17",		path: unown_17 },
	// { key: "unown_18",		path: unown_18 },
	// { key: "unown_19",		path: unown_19 },
	// { key: "unown_20",		path: unown_20 },
	// { key: "unown_21",		path: unown_21 },
	// { key: "unown_22",		path: unown_22 },
	// { key: "unown_23",		path: unown_23 },
	// { key: "unown_24",		path: unown_24 },
	// { key: "unown_25",		path: unown_25 },
	// { key: "unown_26",		path: unown_26 },
	// { key: "unown_27",		path: unown_27 },
	{ key: "unown_28",		path: unown_28 },
];

export default pokemon;