import appStorage from "@/utils/storage";
import { SAVE_KEY, SAVE_VERSION, SAVE_DELAY, MAX_PENDING_ACTIONS } from "./index";
import { migrateSave } from "./migration";
import { validateGameContent } from "./validation";
import type { GameSnapshot, GameState, GridState } from "./state";
import type { ItemCategory } from "../items";

// All managers use the same save. Keep its latest operation outside the class so
// a replacement scene waits for the previous scene's save or reset before loading.
let pendingStorageOperation: Promise<boolean> | undefined;

export class SaveManager {
	// Enabled after scene setup, and paused during reset or disposal.
	private active = false;
	private dirty = false;
	// Groups synchronous changes from one action into one snapshot and action count.
	private changeQueued = false;
	private pendingActions = 0;
	private timer?: ReturnType<typeof setTimeout>;
	// The storage write currently in progress, if any. Changes can still arrive during it.
	private writing?: Promise<boolean>;
	private discovered: Partial<Record<ItemCategory, string>> = Object.create(null);
	// Retains loaded grids whose IDs may not be registered in the current scene.
	private savedGrids: Record<string, GridState> = {};
	// Last complete action, available even after Phaser destroys the scene's objects.
	private snapshot?: GameSnapshot;

	/** Receives the scene's snapshot function; storage and validation are handled here. */
	constructor(private capture: () => GameSnapshot) {}

	/** Loads, migrates, and validates stored state, caching discoveries and grids for later saves.
	 * GameScene restores the returned state to its components. Returns null for a new game;
	 * load errors go to GameScene to show an alert. */
	async load(): Promise<GameState | null> {
		await pendingStorageOperation;
		const json = await appStorage.getItem(SAVE_KEY);
		if (json === null) { return null; }
		const state = migrateSave(JSON.parse(json));
		validateGameContent(state);
		this.discovered = Object.assign(Object.create(null), state.discovered);
		this.savedGrids = state.grids;
		return state;
	}

	/** Enables autosaving after initialization or reset, and marks the starting state for saving. */
	start() {
		this.active = true;
		this.markDirty();
	}

	/** Records this exact tier without revealing lower tiers. Returns whether it was new.
	 * Discoveries made during initialization are included when start() enables saving. */
	discover(category: ItemCategory, tier: number): boolean {
		if (this.isDiscovered(category, tier)) { return false; }
		const mask = BigInt(`0x${this.discovered[category] || "0"}`);
		this.discovered[category] = (mask | (1n << BigInt(tier - 1))).toString(16);
		this.markDirty();
		return true;
	}

	/** Reads the tier's bit in the category's discovery mask without changing save state. */
	isDiscovered(category: ItemCategory, tier: number): boolean {
		const mask = BigInt(`0x${this.discovered[category] || "0"}`);
		return (mask & (1n << BigInt(tier - 1))) !== 0n;
	}

	/** Marks a gameplay change and captures it once the current synchronous action finishes.
	 * Saves after SAVE_DELAY without changes, or once MAX_PENDING_ACTIONS is reached. */
	markDirty() {
		if (!this.active) { return; }
		this.dirty = true;
		this.snapshot = undefined;
		if (this.changeQueued) { return; }
		this.changeQueued = true;
		// A microtask runs after the current action's code, not on a separate thread.
		// Transfers and reward claims can therefore finish updating both grids/queue
		// before we capture their combined state and count them as one action.
		queueMicrotask(() => {
			this.changeQueued = false;
			if (!this.active || !this.dirty) { return; }
			// Retain a complete snapshot before Phaser destroys scene objects on shutdown.
			try {
				this.snapshot = this.capture();
			} catch (error) {
				this.saveFailed(error);
				return;
			}
			this.pendingActions++;
			this.cancelTimer();
			if (this.pendingActions >= MAX_PENDING_ACTIONS) {
				// Autosaving does not need to wait here; save() handles write failures.
				void this.save();
			} else {
				this.scheduleSave();
			}
		});
	}

	/** Saves pending changes now, bypassing the idle delay. Returns true on success
	 * (including no changes), or false if saving fails, which schedules a retry.
	 * Callers await this when closing or resetting so storage has time to finish. */
	save(): Promise<boolean> {
		this.cancelTimer();
		if (this.writing) {
			// Finish the current write before checking for newer changes. Overlapping
			// native writes could otherwise finish out of order and restore older state.
			const pendingSave = this.writing.then(success => success ? this.save() : false);
			pendingStorageOperation = pendingSave;
			return pendingSave;
		}
		if (!this.active || !this.dirty) {
			return Promise.resolve(true);
		}
		try {
			const snapshot = this.snapshot ?? this.capture();
			const state: GameState = {
				...snapshot,
				version: SAVE_VERSION,
				savedAt: Date.now(),
				discovered: { ...this.discovered },
				// Preserve grids whose IDs are not registered in the current scene.
				grids: { ...this.savedGrids, ...snapshot.grids },
			};
			const json = JSON.stringify(state);
			// Clear these before writing: changes made while storage is busy must set
			// dirty again and remain pending after this particular snapshot is saved.
			this.dirty = false;
			this.pendingActions = 0;
			// Invoke immediately: localStorage writes synchronously even on pagehide.
			this.writing = appStorage.setItem(SAVE_KEY, json)
				.then(() => true, error => this.saveFailed(error))
				// Release the write slot on either success or failure.
				.finally(() => { this.writing = undefined; });
			pendingStorageOperation = this.writing;
			return this.writing;
		} catch (error) {
			return Promise.resolve(this.saveFailed(error));
		}
	}

	/** Clears storage, regenerates the scene, and immediately saves the fresh game.
	 * Publish the whole operation so a replacement scene cannot load halfway through. */
	reset(regenerate: () => void): Promise<boolean> {
		const resetting = this.resetState(regenerate);
		// A future load only needs to wait for completion. The reset caller still
		// receives regeneration errors through the original promise returned below.
		pendingStorageOperation = resetting.catch(() => false);
		return resetting;
	}

	/** Pauses autosaving while clearing and rebuilding, so old or partial state cannot be saved. */
	private async resetState(regenerate: () => void): Promise<boolean> {
		this.active = false;
		this.cancelTimer();
		if (this.writing) { await this.writing; }
		try {
			await appStorage.removeItem(SAVE_KEY);
		} catch (error) {
			console.error("Could not clear the saved game.", error);
			this.start();
			return false;
		}
		this.discovered = Object.create(null);
		this.savedGrids = {};
		this.pendingActions = 0;
		regenerate();
		this.start();
		return this.save();
	}

	/** Stops future captures and timers after scene cleanup. An already-started write
	 * can finish; GameScene calls save() before disposing this manager. */
	dispose() {
		this.active = false;
		this.cancelTimer();
	}

	/** Removes the scheduled idle save before rescheduling, saving immediately, or stopping. */
	private cancelTimer() {
		if (this.timer !== undefined) { clearTimeout(this.timer); }
		this.timer = undefined;
	}

	/** Schedules an idle save or retry without blocking gameplay while waiting. */
	private scheduleSave() {
		if (!this.active) { return; }
		this.timer = setTimeout(() => { void this.save(); }, SAVE_DELAY);
	}

	/** Keeps changes pending, logs the failure, and schedules another attempt while active. */
	private saveFailed(error: unknown): false {
		this.dirty = true;
		console.error("Could not save game; will retry.", error);
		this.cancelTimer();
		this.scheduleSave();
		return false;
	}
}
