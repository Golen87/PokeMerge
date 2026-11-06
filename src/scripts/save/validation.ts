import { GRID_COLUMNS, GRID_ROWS } from "../constants";
import { itemData } from "../items";
import { SAVE_VERSION } from "./index";
import type { SavedGameState, ItemReferenceState, ItemState } from "./state";

export const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value == "object" && value !== null && !Array.isArray(value);
export const isCount = (value: unknown): value is number =>
	typeof value == "number" && Number.isSafeInteger(value) && value >= 0;

export function assertValid(condition: unknown, field: string): asserts condition {
	if (!condition) { throw new Error(`Invalid save field: ${field}`); }
}

function validateItemState(value: unknown): asserts value is ItemState {
	assertValid(isRecord(value), "item");
	assertValid(typeof value.category == "string" && value.category.length > 0, "item.category");
	assertValid(isCount(value.tier) && value.tier > 0, "item.tier");
	assertValid(value.blocked === undefined || typeof value.blocked == "boolean", "item.blocked");
	for (const key of ["cycle", "charges", "dispenserCharges", "rechargeTimestamp", "dispenserTimestamp"]) {
		assertValid(value[key] === undefined || isCount(value[key]), `item.${key}`);
	}
}

export function validateGameState(value: unknown): asserts value is SavedGameState {
	assertValid(isRecord(value), "save");
	assertValid(value.version === SAVE_VERSION, "version");
	assertValid(isCount(value.savedAt), "savedAt");
	assertValid(isRecord(value.grids), "grids");
	for (const grid of Object.values(value.grids)) {
		assertValid(Array.isArray(grid), "grid");
		for (const row of grid) {
			assertValid(Array.isArray(row), "grid.row");
			for (const item of row) {
				if (item !== null) { validateItemState(item); }
			}
		}
	}
	assertValid(Array.isArray(value.itemQueue), "itemQueue");
	value.itemQueue.forEach(validateItemState);
	assertValid(Array.isArray(value.completedTasks) && value.completedTasks.every(id => typeof id == "string"), "completedTasks");
	assertValid(isRecord(value.discovered), "discovered");
	assertValid(Object.values(value.discovered).every(mask => typeof mask == "string" && /^[0-9a-f]+$/i.test(mask)), "discovered.mask");
	assertValid(isRecord(value.player), "player");
	assertValid(isCount(value.player.level) && value.player.level > 0, "player.level");
	assertValid(isCount(value.player.experience), "player.experience");
	assertValid(isRecord(value.player.resources) && Object.values(value.player.resources).every(isCount), "player.resources");
	assertValid(isRecord(value.options), "options");
	assertValid(isCount(value.options.qualityIndex), "options.qualityIndex");
	assertValid(value.options.hintToggle === 0 || value.options.hintToggle === 1, "options.hintToggle");
}

export function validateGameContent(state: SavedGameState) {
	const validateItem = (item: ItemReferenceState) => {
		if (!Object.hasOwn(itemData, item.category) || !itemData[item.category][item.tier - 1]) {
			throw new Error(`Saved item is not registered: ${item.category}:${item.tier}`);
		}
	};
	for (const [id, rows] of Object.entries(state.grids)) {
		if (["main", "inventory"].includes(id) && (rows.length > GRID_ROWS || rows.some(row => row.length > GRID_COLUMNS))) {
			throw new Error(`Saved grid exceeds board dimensions: ${id}`);
		}
		rows.forEach(row => row.forEach(item => { if (item) { validateItem(item); } }));
	}
	state.itemQueue.forEach(validateItem);
}
