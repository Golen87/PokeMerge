import { SaveManager } from "./save";
import type {
	GameComponentSnapshot,
	GameSnapshot,
	ItemReferenceState,
	OptionsState,
	SavedGameState,
	TaskManagerState,
} from "./save";
import type { ItemCategory } from "./items";
import { hasChanges } from "./utils";

export const QUALITY_SCALES = [0.5, 0.75, 1, 1.5, 2] as const;
export const DEFAULT_OPTIONS: Readonly<OptionsState> = {
	qualityIndex: 2,
	hintToggle: 1,
	mapBlurToggle: 1,
};

export class GameState extends Phaser.Events.EventEmitter {
	private saveManager?: SaveManager;
	private loadVersion = 0;
	private closing: Promise<boolean> = Promise.resolve(true);
	private resetting?: Promise<boolean>;

	private _level = 1;
	private _experience = 0;
	private resources: Record<string, number> = Object.create(null);
	private itemQueue: ItemReferenceState[] = [];
	private _completedTasks: TaskManagerState = [];
	private _options: OptionsState = { ...DEFAULT_OPTIONS };
	private discovered: Partial<Record<ItemCategory, string>> = Object.create(null);

	// Loads shared state and returns the saved grids for GameScene to restore.
	async load(): Promise<SavedGameState | null> {
		const loadVersion = ++this.loadVersion;
		// Scene cleanup may still be finishing a native storage write.
		await this.closing;
		if (loadVersion !== this.loadVersion) { return null; }
		this.loadState(null);

		this.saveManager = new SaveManager();

		try {
			const save = await this.saveManager.load();
			if (loadVersion !== this.loadVersion) { return null; }
			this.loadState(save);
			return save;
		} finally {
			if (loadVersion === this.loadVersion) {
				this.notifyStateChanged();
			}
		}
	}

	// Register the scene's grids after restoration, before starting autosaving.
	setCaptureCallback(capture: () => GameComponentSnapshot) {
		if (!this.saveManager) {
			throw new Error("Load game state before setting the capture callback.");
		}
		this.saveManager.setCaptureCallback(() => this.serialize(capture));
	}

	private loadState(save: SavedGameState | null) {
		this._level = save?.player.level ?? 1;
		this._experience = save?.player.experience ?? 0;
		this.resources = Object.assign(Object.create(null), save?.player.resources);
		this.itemQueue = save?.itemQueue.map((item) => ({ ...item })) ?? [];
		this._completedTasks = [...(save?.completedTasks ?? [])];
		this._options = { ...(save?.options ?? DEFAULT_OPTIONS) };
		this.discovered = Object.assign(Object.create(null), save?.discovered);
	}

	private notifyStateChanged() {
		this.emit("completedTasksChanged");
		this.emit("optionsChanged", this.options);
		this.emit("experienceChanged");
		this.emit("queueChanged");
		this.emit("resourcesChanged");
	}

	// Called once component creation and restoration have finished.
	start() {
		this.saveManager?.start();
	}

	dirty() {
		this.saveManager?.markDirty();
	}

	async save(): Promise<boolean> {
		// Normal saves must start synchronously for pagehide/localStorage.
		if (this.resetting) {
			return this.resetting.then(() => this.save());
		}
		return this.saveManager?.save() ?? Promise.resolve(true);
	}

	reset(regenerate: () => void): Promise<boolean> {
		if (this.resetting) {
			return this.resetting;
		}
		if (!this.saveManager) {
			return Promise.resolve(false);
		}
		this.resetting = this.saveManager
			.reset(() => {
				this.loadState(null);
				regenerate();

				this.notifyStateChanged();
			})
			.finally(() => {
				this.resetting = undefined;
			});
		return this.resetting;
	}

	// Clean up state on scene disposal
	dispose(): Promise<boolean> {
		// A load may still be waiting for storage when the scene shuts down.
		this.loadVersion++;
		const saveManager = this.saveManager;
		this.saveManager = undefined;
		this.removeAllListeners();
		if (saveManager) {
			const saving = this.resetting
				? this.resetting.then(() => saveManager.save())
				: saveManager.save();
			this.closing = saving.finally(() => saveManager.dispose());
		}
		return this.closing;
	}

	private serialize(capture: () => GameComponentSnapshot): GameSnapshot {
		return {
			...capture(),
			player: {
				level: this.level,
				experience: this.experience,
				resources: { ...this.resources },
			},
			itemQueue: this.itemQueue.map((item) => ({ ...item })),
			completedTasks: [...this._completedTasks],
			options: { ...this._options },
			discovered: { ...this.discovered },
		};
	}


	/* Player resources */

	get level() {
		return this._level;
	}

	get experience() {
		return this._experience;
	}

	get experienceRequirement() {
		return 8 * this._level;
	}

	gainExperience(amount: number) {
		if (!Number.isSafeInteger(amount) || amount <= 0) {
			return;
		}
		this._experience += amount;
		const levels: number[] = [];
		while (this._experience >= this.experienceRequirement) {
			this._experience -= this.experienceRequirement;
			levels.push(++this._level);
		}
		this.dirty();
		for (const level of levels) {
			this.emit("levelUp", level);
		}
		this.emit("experienceChanged");
	}

	get money() {
		return this.getResource("money");
	}

	setMoney(amount: number) {
		this.setResource("money", amount);
	}

	getResource(name: string): number {
		return Object.hasOwn(this.resources, name) ? this.resources[name] : 0;
	}

	setResource(name: string, amount: number) {
		if (!Number.isSafeInteger(amount) || amount < 0) {
			throw new Error(`Invalid resource amount: ${name}`);
		}
		if (this.getResource(name) === amount) {
			return;
		}
		this.resources[name] = amount;
		this.dirty();
		this.emit("resourcesChanged");
	}

	/* Tasks */

	get completedTasks(): TaskManagerState {
		return [...this._completedTasks];
	}

	setCompletedTasks(ids: TaskManagerState) {
		this._completedTasks = [...ids];
		this.dirty();
		this.emit("completedTasksChanged");
	}

	/* Options */

	get options(): Readonly<OptionsState> {
		return { ...this._options };
	}

	get qualityScale() {
		return QUALITY_SCALES[this._options.qualityIndex];
	}

	get hintsEnabled() {
		return this._options.hintToggle === 1;
	}

	get mapBlurEnabled() {
		return this._options.mapBlurToggle === 1;
	}

	setOptions(changes: Partial<OptionsState>) {
		if (!hasChanges(this._options, changes)) return;

		this._options = { ...this._options, ...changes };
		this.dirty();
		this.emit("optionsChanged", changes);
	}

	/* Reward item queue */

	get nextQueuedItem(): Readonly<ItemReferenceState> | undefined {
		const item = this.itemQueue[0];
		return item ? { ...item } : undefined;
	}

	enqueueItem(item: ItemReferenceState, amount = 1) {
		for (let i = 0; i < amount; i++) {
			this.itemQueue.push({ ...item });
		}
		this.dirty();
		this.emit("queueChanged");
	}

	dequeueItem(): ItemReferenceState | undefined {
		const item = this.itemQueue.shift();
		if (item) {
			this.dirty();
			this.emit("queueChanged");
		}
		return item;
	}

	/* Discovered items */

	isDiscovered(category: ItemCategory, tier: number): boolean {
		const mask = BigInt(`0x${this.discovered[category] || "0"}`);
		return (mask & (1n << BigInt(tier - 1))) !== 0n;
	}

	discover(category: ItemCategory, tier: number): boolean {
		if (this.isDiscovered(category, tier)) {
			return false;
		}
		const mask = BigInt(`0x${this.discovered[category] || "0"}`);
		this.discovered[category] = (mask | (1n << BigInt(tier - 1))).toString(16);
		this.dirty();
		this.emit("discovered", category, tier);
		return true;
	}
}

export const gameState = new GameState();
