import type { ItemCategory } from "../items";
import type { Item } from "../items/ItemData";

export type ItemReferenceState = Item;

export interface ItemState extends ItemReferenceState {
	blocked?: boolean;
	cycle?: number;
	charges?: number;
	dispenserCharges?: number;
	rechargeTimestamp?: number;
	dispenserTimestamp?: number;
}

// Row-major: grids[id][y][x]. Empty slots are explicitly null.
export type GridState = (ItemState | null)[][];

export type TaskManagerState = string[];

export interface OptionsState {
	qualityIndex: number;
	hintToggle: number;
	mapBlurToggle: number;
}

export interface PlayerState {
	level: number;
	experience: number;
	// Reserved for energy, maxEnergy, money, energyTimestamp, and future resources.
	resources: Record<string, number>;
}

export interface GameSnapshot {
	grids: Record<string, GridState>;
	itemQueue: ItemReferenceState[];
	completedTasks: TaskManagerState;
	player: PlayerState;
	options: OptionsState;
	// Hexadecimal bit masks; bit (tier - 1) represents only that tier.
	discovered: Partial<Record<ItemCategory, string>>;
}

// Grids remain responsible for serializing their Phaser items.
export type GameComponentSnapshot = Pick<GameSnapshot, "grids">;

export interface SavedGameState extends GameSnapshot {
	version: number;
	savedAt: number;
}
