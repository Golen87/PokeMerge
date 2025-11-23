import Asset from "../assets/Asset";

import dirtPile from "../../assets/items/ruins/12024 Dirt Pile.png";
import coalSlabs from "../../assets/items/ruins/12225 Coal Slabs.png";
import rock from "../../assets/items/ruins/15138 Rock.png";
import tomb from "../../assets/items/ruins/12083 Tomb.png";
import relicEntrances from "../../assets/items/ruins/12726 Relic Castle Entrances.png";
import spearPillarRuins from "../../assets/items/ruins/12219 Spear Pillar Ruins.png";
import ruinsOfAlph from "../../assets/items/ruins/11105 Ruins of Alph Buildings.png";
import snowpointTemple from "../../assets/items/ruins/12060 Snowpoint Temple.png";
import amitySquareRuins from "../../assets/items/ruins/12043 Amity Square Ruins.png";
import relicCastle from "../../assets/items/ruins/12726 Relic Castle.png";

export const ruinAssets: Asset[] = [
	{ key: "dirtPile", path: dirtPile },
	{ key: "coalSlabs", path: coalSlabs },
	{ key: "rock", path: rock },
	{ key: "tomb", path: tomb },
	{ key: "relicEntrances", path: relicEntrances },
	{ key: "spearPillarRuins", path: spearPillarRuins },
	{ key: "relicCastle", path: relicCastle },
	{ key: "ruinsOfAlph", path: ruinsOfAlph },
	{ key: "snowpointTemple", path: snowpointTemple },
	{ key: "amitySquareRuins", path: amitySquareRuins },
];

import ItemData from "./ItemData";

export const ruinItems: ItemData[] = [
	{
		// Tier 1
		key: "dirtPile",
		name: "Dirt Pile",
		scale: 0.97,
	},

	{
		// Tier 2
		key: "coalSlabs",
		name: "Coal Slabs",
		scale: 1.0,
	},

	{
		// Tier 3
		key: "rock",
		name: "Rock",
		scale: 1.05,
	},

	{
		// Tier 4
		key: "tomb",
		name: "Tomb",
		scale: 1.13,
		generator: {
			maxCharges: 24,
			rechargeCount: 8,
			rechargeTime: 180 * 60 * 1000,
			items: [
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
			],
			// m1(95%) k1(5%)
		},
	},

	{
		// Tier 5
		key: "relicEntrances",
		name: "Relic Entrance",
		scale: 1.15,
		generator: {
			maxCharges: 28,
			rechargeCount: 10,
			rechargeTime: 140 * 60 * 1000,
			items: [
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
			],
			// m1(95%) k1(5%)
		},
	},

	{
		// Tier 6
		key: "spearPillarRuins",
		name: "Spear Pillar Ruins",
		scale: 1.22,
		generator: {
			maxCharges: 32,
			rechargeCount: 12,
			rechargeTime: 110 * 60 * 1000,
			items: [
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 2 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 2 },
			],
			// m1(50%) m2(45%) k1(5%)
		},
	},

	{
		// Tier 7
		key: "relicCastle",
		name: "Relic Castle",
		scale: 1.05,
		generator: {
			maxCharges: 36,
			rechargeCount: 12,
			rechargeTime: 80 * 60 * 1000,
			items: [
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 3 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 3 },
				{ category: "stone", tier: 1 },
			],
			// m1(40%) m2(30%) m3(20%) k1(10%)
		},
	},

	{
		// Tier 8
		key: "ruinsOfAlph",
		name: "Ruins of Alph",
		scale: 1.18,
		generator: {
			maxCharges: 42,
			rechargeCount: 14,
			rechargeTime: 60 * 60 * 1000,
			items: [
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 3 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 3 },
				{ category: "stone", tier: 1 },
			],
			// m1(15%) m2(25%) m3(30%) k1(10%)
		},
	},

	{
		// Tier 9
		key: "snowpointTemple",
		name: "Snowpoint Temple",
		scale: 1.15,
		generator: {
			maxCharges: 48,
			rechargeCount: 16,
			rechargeTime: 45 * 60 * 1000,
			items: [
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 3 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 4 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 4 },
				{ category: "fossil", tier: 3 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 4 },
				{ category: "stone", tier: 1 },
			],
			// m1(10%) m2(20%) m3(40%) m4(15%) k1(15%)
		},
	},

	{
		// Tier 10
		key: "amitySquareRuins",
		name: "Amity Square Ruins",
		scale: 1.2,
		generator: {
			maxCharges: 54,
			rechargeCount: 18,
			rechargeTime: 35 * 60 * 1000,
			items: [
				{ category: "fossil", tier: 1 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 4 },
				{ category: "fossil", tier: 2 },
				{ category: "fossil", tier: 3 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 4 },
				{ category: "fossil", tier: 3 },
				{ category: "fossil", tier: 4 },
				{ category: "stone", tier: 1 },
				{ category: "fossil", tier: 4 },
				{ category: "fossil", tier: 4 },
				{ category: "stone", tier: 2 },
			],
			// m1(5%) m2(20%) m3(35%) m4(25%) k1(10%) k2(5%)
		},
	},
];
