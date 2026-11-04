import { SAVE_VERSION } from "./index";
import type { SavedGameState } from "./state";
import { assertValid, isCount, isRecord, validateGameState } from "./validation";

// Add a migration under its SOURCE version whenever SAVE_VERSION increases.
// Each migration must return a new object with version incremented by one.
const migrations: Record<number, (data: Record<string, unknown>) => Record<string, unknown>> = {};

export function migrateSave(input: unknown): SavedGameState {
	assertValid(isRecord(input), "save");
	let value = input;
	assertValid(isCount(value.version) && value.version > 0, "version");
	if (value.version > SAVE_VERSION) {
		throw new Error("This save was created by a newer version of the game.");
	}
	while (value.version !== SAVE_VERSION) {
		const version = value.version as number;
		const migrate = migrations[version];
		if (!migrate) { throw new Error(`No migration for save version ${version}.`); }
		value = migrate(value);
		assertValid(value.version === version + 1, "migration.version");
	}
	validateGameState(value);
	return value;
}
