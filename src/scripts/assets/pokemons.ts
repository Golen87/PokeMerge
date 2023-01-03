import Asset from "./Asset";

import bulbasaur_1 from "../../assets/resources/pokemon/1.png"; // Bulbasaur
import bulbasaur_2 from "../../assets/resources/pokemon/2.png"; // Ivysaur
import bulbasaur_3 from "../../assets/resources/pokemon/3.png"; // Venusaur
import bulbasaur_4 from "../../assets/resources/pokemon/857.png"; // Mega Venusaur

import charmander_1 from "../../assets/resources/pokemon/4.png"; // Charmander
import charmander_2 from "../../assets/resources/pokemon/5.png"; // Charmeleon
import charmander_3 from "../../assets/resources/pokemon/6.png"; // Charizard
import charmander_4 from "../../assets/resources/pokemon/859.png"; // Mega Charizard Y
import charmander_5 from "../../assets/resources/pokemon/858.png"; // Mega Charizard X

import squirtle_1 from "../../assets/resources/pokemon/7.png"; // Squirtle
import squirtle_2 from "../../assets/resources/pokemon/8.png"; // Wartortle
import squirtle_3 from "../../assets/resources/pokemon/9.png"; // Blastoise
import squirtle_4 from "../../assets/resources/pokemon/860.png"; // Mega Blastoise

import eevee_1 from "../../assets/resources/pokemon/133.png"; // Eevee
import eevee_2 from "../../assets/resources/pokemon/134.png"; // Vaporeon
import eevee_3 from "../../assets/resources/pokemon/135.png"; // Jolteon
import eevee_4 from "../../assets/resources/pokemon/136.png"; // Flareon
import eevee_5 from "../../assets/resources/pokemon/196.png"; // Espeon
import eevee_6 from "../../assets/resources/pokemon/197.png"; // Umbreon
import eevee_7 from "../../assets/resources/pokemon/512.png"; // Leafeon
import eevee_8 from "../../assets/resources/pokemon/513.png"; // Glaceon
import eevee_9 from "../../assets/resources/pokemon/829.png"; // Sylveon

import electric_1 from "../../assets/resources/pokemon/672.png"; // Joltik
import electric_2 from "../../assets/resources/pokemon/673.png"; // Galvantula
import electric_3 from "../../assets/resources/pokemon/172.png"; // Pichu
import electric_4 from "../../assets/resources/pokemon/25.png"; // Pikachu
import electric_5 from "../../assets/resources/pokemon/26.png"; // Raichu
import electric_6 from "../../assets/resources/pokemon/181.png"; // Ampharos
import electric_7 from "../../assets/resources/pokemon/125.png"; // Electabuzz
import electric_8 from "../../assets/resources/pokemon/508.png"; // Electivire
import electric_9 from "../../assets/resources/pokemon/145.png"; // Zapdos

import rotom_1 from "../../assets/resources/pokemon/521.png"; // Rotom
import rotom_2 from "../../assets/resources/pokemon/522.png"; // Heat Rotom
import rotom_3 from "../../assets/resources/pokemon/523.png"; // Wash Rotom
import rotom_4 from "../../assets/resources/pokemon/524.png"; // Frost Rotom
import rotom_5 from "../../assets/resources/pokemon/525.png"; // Fan Rotom
import rotom_6 from "../../assets/resources/pokemon/526.png"; // Mow Rotom

import legendary_1 from "../../assets/resources/pokemon/151.png"; // Mew
import legendary_2 from "../../assets/resources/pokemon/150.png"; // Mewtwo
import legendary_3 from "../../assets/resources/pokemon/276.png"; // Lugia
import legendary_4 from "../../assets/resources/pokemon/277.png"; // Ho-oh
import legendary_5 from "../../assets/resources/pokemon/412.png"; // Kyogre
import legendary_6 from "../../assets/resources/pokemon/414.png"; // Groudon
import legendary_7 from "../../assets/resources/pokemon/416.png"; // Rayquaza
import legendary_8 from "../../assets/resources/pokemon/530.png"; // Dialga
import legendary_9 from "../../assets/resources/pokemon/531.png"; // Palkia
import legendary_10 from "../../assets/resources/pokemon/534.png"; // Giratina
// import legendary_9 from "../../assets/resources/pokemon/722.png"; // Reshiram
// import legendary_10 from "../../assets/resources/pokemon/723.png"; // Zekrom
import legendary_11 from "../../assets/resources/pokemon/851.png"; // Yveltal
import legendary_12 from "../../assets/resources/pokemon/852.png"; // Xerneas
import legendary_13 from "../../assets/resources/pokemon/853.png"; // Zygarde
import legendary_14 from "../../assets/resources/pokemon/542.png"; // Arceus

// import unown_1 from "../../assets/resources/pokemon/201.png"; // Unown A
// import unown_2 from "../../assets/resources/pokemon/202.png"; // Unown B
// import unown_3 from "../../assets/resources/pokemon/203.png"; // Unown C
// import unown_4 from "../../assets/resources/pokemon/204.png"; // Unown D
// import unown_5 from "../../assets/resources/pokemon/205.png"; // Unown E
// import unown_6 from "../../assets/resources/pokemon/206.png"; // Unown F
// import unown_7 from "../../assets/resources/pokemon/207.png"; // Unown G
// import unown_8 from "../../assets/resources/pokemon/208.png"; // Unown H
// import unown_9 from "../../assets/resources/pokemon/209.png"; // Unown I
// import unown_10 from "../../assets/resources/pokemon/210.png"; // Unown J
// import unown_11 from "../../assets/resources/pokemon/211.png"; // Unown K
// import unown_12 from "../../assets/resources/pokemon/212.png"; // Unown L
// import unown_13 from "../../assets/resources/pokemon/213.png"; // Unown M
// import unown_14 from "../../assets/resources/pokemon/214.png"; // Unown N
// import unown_15 from "../../assets/resources/pokemon/215.png"; // Unown O
// import unown_16 from "../../assets/resources/pokemon/216.png"; // Unown P
// import unown_17 from "../../assets/resources/pokemon/217.png"; // Unown Q
// import unown_18 from "../../assets/resources/pokemon/218.png"; // Unown R
// import unown_19 from "../../assets/resources/pokemon/219.png"; // Unown S
// import unown_20 from "../../assets/resources/pokemon/220.png"; // Unown T
// import unown_21 from "../../assets/resources/pokemon/221.png"; // Unown U
// import unown_22 from "../../assets/resources/pokemon/222.png"; // Unown V
// import unown_23 from "../../assets/resources/pokemon/223.png"; // Unown W
// import unown_24 from "../../assets/resources/pokemon/224.png"; // Unown X
// import unown_25 from "../../assets/resources/pokemon/225.png"; // Unown Y
// import unown_26 from "../../assets/resources/pokemon/226.png"; // Unown Z
// import unown_27 from "../../assets/resources/pokemon/227.png"; // Unown !
import unown_28 from "../../assets/resources/pokemon/228.png"; // Unown ?

let pokemon: Asset[] = [
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

	{ key: "eevee_1",		path: eevee_1 },
	{ key: "eevee_2",		path: eevee_2 },
	{ key: "eevee_3",		path: eevee_3 },
	{ key: "eevee_4",		path: eevee_4 },
	{ key: "eevee_5",		path: eevee_5 },
	{ key: "eevee_6",		path: eevee_6 },
	{ key: "eevee_7",		path: eevee_7 },
	{ key: "eevee_8",		path: eevee_8 },
	{ key: "eevee_9",		path: eevee_9 },

	{ key: "electric_1",	path: electric_1 },
	{ key: "electric_2",	path: electric_2 },
	{ key: "electric_3",	path: electric_3 },
	{ key: "electric_4",	path: electric_4 },
	{ key: "electric_5",	path: electric_5 },
	{ key: "electric_6",	path: electric_6 },
	{ key: "electric_7",	path: electric_7 },
	{ key: "electric_8",	path: electric_8 },
	{ key: "electric_9",	path: electric_9 },

	{ key: "rotom_1",		path: rotom_1 },
	{ key: "rotom_2",		path: rotom_2 },
	{ key: "rotom_3",		path: rotom_3 },
	{ key: "rotom_4",		path: rotom_4 },
	{ key: "rotom_5",		path: rotom_5 },
	{ key: "rotom_6",		path: rotom_6 },

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