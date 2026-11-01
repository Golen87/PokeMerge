export interface ItemReferenceState {
	category: string;
	tier: number;
}

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
}

export interface GameState extends GameSnapshot {
	version: number;
	savedAt: number;
	// Hexadecimal bit masks; bit (tier - 1) represents only that tier.
	discovered: Record<string, string>;
}
