export const SAVE_KEY = "pokemerge-save";
export const SAVE_VERSION = 1;
export const SAVE_DELAY = 2000;
export const MAX_PENDING_ACTIONS = 10;

export { SaveManager } from "./SaveManager";
export { migrateSave } from "./migration";
export { validateGameState, validateGameContent } from "./validation";
export type {
	ItemReferenceState,
	ItemState,
	GridState,
	TaskManagerState,
	OptionsState,
	PlayerState,
	GameSnapshot,
	GameState,
} from "./state";
