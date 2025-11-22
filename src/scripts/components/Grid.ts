import { GameScene } from "../scenes/GameScene";
import { Item } from "./Item";
import { RoundRectangle } from "./RoundRectangle";
import { randInt, isLocalStorageAvailable } from "../utils";
import { itemData } from "../items";
import { GRID_COLUMNS, GRID_ROWS, COLOR, DEPTH } from "../constants";
import { Task } from "./TaskManager";
import { SunEffect } from "./SunEffect";


export class Grid extends Phaser.GameObjects.Container {
	public scene: GameScene;
	private gridBorder: RoundRectangle;
	private gridBackground: RoundRectangle;

	private cells: Map<string, Phaser.GameObjects.Image>;
	private items: Map<string, Item>;
	private hintCache: any;

	private _selected?: Item;
	private selection: Phaser.GameObjects.Image;

	private effects: Phaser.GameObjects.Graphics;
	private effectsQueue: { x: number; y: number; time: number; }[];
	private sunEffect: SunEffect;

	private tasks: Task[];

	private audioRate: number;
	private audioSlot: Phaser.Math.Vector2 | null;
	private audioTimer: ReturnType<typeof setTimeout> | null;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		this.width = GRID_COLUMNS * this.scene.GRID_SIZE;
		this.height = GRID_ROWS * this.scene.GRID_SIZE;

		this.cells = new Map();
		this.items = new Map();

		this.hintCache = null;

		this.initGridBackground();

		// Selection
		this.selection = scene.add.image(0, 0, "selection");
		this.selection.setScale(this.scene.GRID_SIZE / this.selection.width);
		this.selection.setVisible(false);
		this.selection.setTint(COLOR.SELECTION);
		this.selection.setAlpha(0.8);
		this.selection.setDepth(DEPTH.SELECTION);
		// this.add(this.selection);

		this.effects = scene.add.graphics();
		this.effects.setDepth(DEPTH.EFFECTS);
		this.effectsQueue = [];

		this.tasks = [];

		this.audioRate = 1.0;
		this.audioSlot = new Phaser.Math.Vector2(-1, -1);
		this.audioTimer = null;

		// Check if save exists, otherwise create new board
		const success = this.loadData();
		if (!success) {
			this.generateNewBoard();
		}

		this.sunEffect = new SunEffect(scene);
		this.sunEffect.setVisible(false);
		this.sunEffect.setDepth(DEPTH.GRID);
	}

	initGridBackground() {
		this.gridBorder = new RoundRectangle(this.scene, 0, 0, 1000, 1000, 10, COLOR.BORDER);
		this.add(this.gridBorder);

		this.gridBackground = new RoundRectangle(this.scene, 0, 0, 1000, 1000, 10, COLOR.GRID);
		this.add(this.gridBackground);

		this.gridBorder.setInteractive()
			.on("pointerdown", () => {
				this.selected = undefined;
			});

		// Create rounded cells
		for (let cx = 0; cx < GRID_COLUMNS; cx++) {
			for (let cy = 0; cy < GRID_ROWS; cy++) {
				let slot = new Phaser.Math.Vector2(cx, cy);
				let pos = this.toCoords(slot);
				let cell = this.scene.add.image(pos.x, pos.y, "cell");
				cell.setData("slot", this.toKey(slot));
				cell.setScale(this.scene.CELL_SIZE / cell.width);
				cell.setTint(COLOR.CELL);
				cell.setDepth(DEPTH.GRID);
				this.cells.set(this.toKey(slot), cell);
			}
		}
	}


	/* Resizing */

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number) {
		this.x = bounds.centerX;
		this.y = bounds.centerY;
		this.width = GRID_COLUMNS * this.scene.GRID_SIZE;
		this.height = GRID_ROWS * this.scene.GRID_SIZE;

		// Resize border
		this.gridBorder.setRadius(4*unit);
		this.gridBorder.setWidth(this.width + 3*unit);
		this.gridBorder.setHeight(this.height + 3*unit);
		this.gridBorder.input!.hitArea.setTo(0, 0, this.gridBorder.width, this.gridBorder.height);

		// Resize background
		this.gridBackground.setRadius(3*unit);
		this.gridBackground.setWidth(this.width + 1*unit);
		this.gridBackground.setHeight(this.height + 1*unit);

		// Resize grid cells
		this.cells.forEach((cell, slot: string) => {
			let pos = this.toCoords(this.toVec(slot));
			cell.setPosition(pos.x, pos.y);
			cell.setScale(this.scene.CELL_SIZE / cell.width);
		});

		// Resize items
		this.items.forEach((item: Item, slot: string) => {
			item.place(item.slot, this.toCoords(item.slot), true);
			item.onScreenResize();
		});

		// Resize effects
		this.sunEffect.setScale(2 * this.scene.GRID_SIZE / 256);
	}


	/* Data management */

	clearData(): boolean {
		if (!isLocalStorageAvailable()) { return false; }

		localStorage.removeItem("savedata");
		this.generateNewBoard();

		return true;
	}

	saveData(): boolean {
		if (this.scene == this.scene) { return false; };
		if (!isLocalStorageAvailable()) { return false; }

		let saveData = {};
		this.items.forEach((item: Item, slot: string) => {
			saveData[slot] = item.serialize();
		});

		localStorage.setItem("savedata", JSON.stringify(saveData));

		return true;
	}

	loadData(): boolean {
		if (this.scene == this.scene) { return false; }
		if (isLocalStorageAvailable()) { return false; }

		const jsonData = localStorage.getItem("savedata");
		if (!jsonData) { return false; }

		const saveData = JSON.parse(jsonData);

		// Create items
		for (let key in saveData) {
			let itemData = saveData[key];
			let slot = this.toVec(key);

			let newItem = this.createItem(slot.x, slot.y, itemData.category, itemData.tier, itemData.blocked);
			if (newItem) {
				newItem.deserialize(itemData);
			}
			else {
				console.error("Unintended");
				return false;
			}
		}

		this.openAllSight();
		this.dirty();

		return true;
	}


	/* Update loop */

	update(time, delta) {
		this.items.forEach((item: Item, slot: string) => {

			item.update(time, delta);
			item.setDepth(DEPTH.ITEMS + item.y/1000 - item.x/2000 + this.scene.GRID_SIZE/1000 * (item.holdSmooth + (item.spawnBlocked ? 1 : 0)));
			if (this.selected == item) {
				let pos = this.toCoords(item.slot);
				this.selection.setPosition(pos.x, pos.y);
				this.selection.setVisible(!item.drag);
				this.selection.setScale(this.scene.GRID_SIZE / this.selection.width * (1.15 + 0.05 * Math.sin(4*time/1000)));
			}

		});

		this.updateEffects(time);
		this.sunEffect.update(time, delta);
	}


	/* Effects */

	createEffect(x: number, y: number) {
		const time = this.scene.time.now;
		this.effectsQueue.push({ x, y, time });
	}

	updateEffects(time: number) {
		const duration = 300;

		this.effects.clear();
		for (let i = this.effectsQueue.length-1; i >= 0; i--) {

			let effect = this.effectsQueue[i];
			let t = (time - effect.time) / duration;
			let r = 0.9 * this.scene.GRID_SIZE * Phaser.Math.Easing.Cubic.Out(t);
			let w = 0.15 * this.scene.GRID_SIZE * (1 - Phaser.Math.Easing.Sine.In(t));

			if (t > 1) {
				this.effectsQueue.splice(i, 1);
				break;
			}

			this.effects.lineStyle(w, 0xFFFFFF);
			this.effects.strokeCircle(effect.x, effect.y, r+w);
		}
	}


	/* Board and items */

	generateNewBoard() {
		this.items.forEach((item: Item, slot: string) => {
			item.destroy();
		});
		this.items.clear();
		const itemMap = [
			["R3", "M1", "W1", "M2", "R3", "M1", "M1"],
			["F4", "W1", "W1", "B2", "W1", "F2", "M3"],
			["M2", "B1", "M1", "W1", "M1", "F1", "B1"],
			["W3", "B1", "S2", "r1", "S1", "M1", "B1"],
			["W2", "R1", "W2", "W1", "W1", "R1", "W3"],
			["W1", "W2", "r2", "t3", "W3", "R1", "W2"],
			["B2", "F2", "F2", "t2", "t1", "S1", "W1"],
			["W3", "R2", "M1", "S3", "t1", "F1", "F1"],
			["W1", "B1", "F1", "S4", "r1", "r2", "W4"],
		];

		for (let y = 0; y < itemMap.length; y++) {
			for (let x = 0; x < itemMap[0].length; x++) {
				let category = itemMap[y][x][0];
				let tier = parseInt(itemMap[y][x][1]);
				let locked = !(y == 4 && x > 1 && x < 5);

				switch (category) {
					case "W": // Wagon
						category = "mart";
						break;
					case "t": // Tool
						category = "pokeball";
						break;
					case "r": // Rope
						category = "potion";
						break;
					case "R": // Rails
						category = "boat";
						break;
					case "F": // Fireplace
						category = "construction";
						break;
					case "S": // Smithing
						category = "center";
						break;
					case "M": // Magic scrolls
						category = "ruin";
						break;
					case "B": // Backpack
						category = "nintendo";
						break;

					default:
						console.error("Unknown:", category);
						category = "unown";
						tier = 1;
						locked = true;
				}

				this.createItem(x, y, category, tier, locked);
			}
		}

		const categories = ["mart", "center", "ruin", "construction", "boat", "tree", "nintendo"];
		for (let c = 0; c < categories.length; c++) {
			for (let t = 0; t < 10; t++) {
				let x = t;
				let y = c;
				// this.createItem(x, y, categories[c], t + 1);
			}
		}

		this.openAllSight();
	}

	createItem(
		cx: number,
		cy: number,
		category: string,
		tier: number = 1,
		blocked: boolean = false
	): Item | null {
		const slot = new Phaser.Math.Vector2(cx, cy);

		if (this.items.size >= GRID_COLUMNS * GRID_ROWS) {
			console.error(`Cannot create item: Board is full`);
			return null;
		}
		if (cx < 0 || cx >= GRID_COLUMNS || cy < 0 || cy >= GRID_ROWS) {
			console.error(`Cannot create item: Not valid coordinates (${cx},${cy})`);
			return null;
		}
		if (this.items.get(this.toKey(slot))) {
			console.error(`Cannot create item: Slot (${cx},${cy}) is occupied`);
			return null;
		}
		if (
			itemData[category] === undefined ||
			itemData[category][tier - 1] === undefined
		) {
			console.error(`Item not found: ${category}:${tier}`);
			return null;
		}

		let item = new Item(this.scene, category, tier, blocked);
		item.place(slot, this.toCoords(slot), true);
		this.items.set(this.toKey(slot), item);
		this.dirty();

		item.on("move", (pos: Phaser.Math.Vector2) => {
			const occupant = this.findClosestMerge(item);

			if (occupant) {
				this.sunEffect.setVisible(true);
				this.sunEffect.setPosition(occupant.x, occupant.y);
			}
			else {
				this.sunEffect.setVisible(false);
			}
		}, this);

		item.on("drop", (pos: Phaser.Math.Vector2) => {
			let oldSlot = item.slot;
			let newSlot = this.toGrid(pos);
			let occupant = this.items.get(this.toKey(newSlot));

			const closeMergeItem = this.findClosestMerge(item);
			if (closeMergeItem) {
				occupant = closeMergeItem;
				newSlot = closeMergeItem.slot;
			}

			// Occupied
			if (occupant && item != occupant) {
				// Merge
				if (item.canMerge(occupant)) {
					this.items.delete(this.toKey(newSlot));
					occupant.destroy();

					this.items.delete(this.toKey(oldSlot));
					this.items.set(this.toKey(newSlot), item);
					item.place(newSlot, this.toCoords(newSlot), true);
					item.upgrade(occupant);
					item.startMergeAnimation();

					this.openSight(newSlot);
					this.dirty();

					this.selected = item;

					this.createEffect(item.x, item.y);

					// const audioRate = 1.0 + 0.1 * (item.tier - 1);
					const audioRate =
						1.0 + (item.tier - 2) / (itemData[item.category].length - 2);
					this.scene.sound.play("Merge_01", { volume: 0.2, rate: audioRate });
					this.scene.sound.play("Merge_02", { volume: 0.2 });

					// Create experience if item level is high enough
					if (item.tier >= 5 && item.category != "experience") {
						let slot = this.getClosestFreeSlot(item.slot);
						let newItem = this.createItem(slot.x, slot.y, "experience", 1);

						if (newItem) {
							let oldPos = this.toCoords(item.slot);
							newItem.setSpawn(oldPos);
						}
					}
				}
				// Swap
				else if (!occupant.blocked) {
					this.items.delete(this.toKey(oldSlot));
					let randomSlot = this.getClosestFreeSlot(newSlot);
					this.items.set(this.toKey(randomSlot), occupant);
					occupant.place(randomSlot, this.toCoords(randomSlot));

					this.items.delete(this.toKey(newSlot));
					this.items.set(this.toKey(newSlot), item);
					item.place(newSlot, this.toCoords(newSlot));
					this.dirty();
				}
				// Return
				else {
					item.place(oldSlot, this.toCoords(oldSlot));
				}
			}

			// Move
			else if (!occupant) {
				this.items.delete(this.toKey(oldSlot));
				this.items.set(this.toKey(newSlot), item);
				item.place(newSlot, this.toCoords(newSlot));
				this.scene.sound.play("Drop", { volume: 0.2 });
				this.dirty();
			}

			// Nothing
			else {
				item.place(oldSlot, this.toCoords(oldSlot));
				this.updateCellColors();
			}

			this.sunEffect.setVisible(false);
		}, this);

		item.on("click", (pos: Phaser.Math.Vector2) => {
			// Use
			if (this.selected == item && !item.blocked) {
				let drops = item.drops;
				// Generate
				if (!item.chargeBlock && drops && item.charges > 0 && (!this.isBoardFull() || item.canDepleteInSlot)) {
					let data = drops[item.cycle % drops.length];
					if (item.itemData.generator?.shuffleItems) {
						data = drops[Math.floor(Math.random() * drops.length)];
					}
					// let data = weightedPick(drops);
					// if (Array.isArray(data.tier)) {
					// data.tier = Phaser.Math.RND.pick(data.tier);
					// }

					item.use();

					let slot = this.getClosestFreeSlot(item.slot);

					let newItem = this.createItem(
						slot.x,
						slot.y,
						data.category,
						data.tier
					);

					if (newItem) {
						let oldPos = this.toCoords(item.slot);
						newItem.setSpawn(oldPos);

						// if (this.audioSlot != item.slot) {
						// 	this.audioRate = 1.0;
						// 	this.audioSlot = item.slot;
						// }

						this.scene.sound.play("Place_Down_01", { volume: 0.1 });
						this.scene.sound.play("Place_Down_02", {
							volume: 0.1,
							rate: this.audioRate,
						});
						this.audioRate += 0.1;

						if (this.audioTimer) clearTimeout(this.audioTimer);
						this.audioTimer = setTimeout(() => {
							this.audioSlot = null;
							this.audioRate = 1.0;
						}, 5000);
					}
				}

				// Collect
				if (item.category == "experience") {
					let tier = item.tier;

					this.createEffect(item.x, item.y);
					this.items.delete(this.toKey(item.slot));
					item.destroy();
					this.dirty();
					this.selected = undefined;

					let points = [1, 3, 8, 20, 50][tier-1];
					this.emit("experience", points);
				}
			}

			// Select
			if (!item.sightBlocked && item.scene) {
				this.selected = item;

				if (this.audioSlot != item.slot) {
					this.audioRate = 1.0;
					this.audioSlot = item.slot;
				}
			}
		});

		item.on("grab", () => {
			// Select
			this.selected = item;

			let cell = this.cells.get(this.toKey(item.slot));
			if (cell) {
				cell.setTint(COLOR.CELL);
			}
		});

		item.on("depleted", (canRecharge) => {
			if (!canRecharge) {
				this.items.delete(this.toKey(item.slot));
				item.destroy();
				this.selected = undefined;

				const depleteItem = item.depleteDrop;
				if (depleteItem) {
					let slot = this.getClosestFreeSlot(item.slot);
					let newItem = this.createItem(
						slot.x,
						slot.y,
						depleteItem.category,
						depleteItem.tier
					);
					if (newItem) {
						let oldPos = this.toCoords(item.slot);
						newItem.setSpawn(oldPos);
					}
				}
			}

			this.emit("updateItem", item);
			this.dirty();
		});

		item.on("recharged", () => {
			// Will update background and info
			this.emit("updateItem", item);
			this.dirty();
		});

		item.on("dispense", (pos: Phaser.Math.Vector2) => {
			// Dispense
			if (!item.blocked && !item.hold) {
				// Generate
				if (!this.isBoardFull()) {
					let data = item.itemData.dispenser?.item;
					if (data) {
						let slot = this.getClosestFreeSlot(item.slot);
						if (item.slot.distance(slot) < 2) {
							item.dispense();

							let newItem = this.createItem(
								slot.x,
								slot.y,
								data.category,
								data.tier
							);

							if (newItem) {
								let oldPos = this.toCoords(item.slot);
								newItem.setSpawn(oldPos);
							}
						}
					}
				}
			}
		});

		return item;
	}

	sellSelected() {
		if (this.selected) {
			this.items.delete(this.toKey(this.selected.slot));
			this.selected.destroy();
			this.dirty();
			this.selected = undefined;
		}
	}

	rechargeSelected() {
		if (this.selected) {
			this.selected.forceRecharge();
			this.createEffect(this.selected.x, this.selected.y);
		}
	}

	openSight(spot: Phaser.Math.Vector2) {
		let jumps: Phaser.Math.Vector2[] = [
			new Phaser.Math.Vector2(-1,  0),
			new Phaser.Math.Vector2( 1, -1),
			new Phaser.Math.Vector2( 1,  1),
			new Phaser.Math.Vector2(-1,  1),
		];
		for (let jump of jumps) {
			spot.x += jump.x;
			spot.y += jump.y;
			let item = this.items.get(this.toKey(spot));
			if (item) {
				item.openSight();
			}
		}
	}

	openAllSight() {
		for (let cx = 0; cx < GRID_COLUMNS; cx++) {
			for (let cy = 0; cy < GRID_ROWS; cy++) {
				let slot = new Phaser.Math.Vector2(cx, cy);
				let key = this.toKey(slot);
				let occupant = this.items.get(key);

				if (!occupant || !occupant.blocked) {
					this.openSight(slot);
				}
			}
		}
	}

	showHint() {
		let move = this.hintCache || this.findMove();
		if (move) {
			let item = this.items.get(move.from);
			let occupant = this.items.get(move.to);
			if (item && occupant) {
				item.startHintAnimation();
				occupant.startHintAnimation();
				this.hintCache = move;
			}
		}
	}

	findClosestMerge(item: Item): Item | null {
		const slot = this.toGrid(item.goalPos);
		let slots = [
			new Phaser.Math.Vector2(slot.x, slot.y),
			new Phaser.Math.Vector2(slot.x - 1, slot.y),
			new Phaser.Math.Vector2(slot.x + 1, slot.y),
			new Phaser.Math.Vector2(slot.x, slot.y - 1),
			new Phaser.Math.Vector2(slot.x, slot.y + 1),
			new Phaser.Math.Vector2(slot.x - 1, slot.y - 1),
			new Phaser.Math.Vector2(slot.x + 1, slot.y - 1),
			new Phaser.Math.Vector2(slot.x - 1, slot.y + 1),
			new Phaser.Math.Vector2(slot.x + 1, slot.y + 1),
		];

		// Find the closest neighbor
		let closestNeighbor: Item | null = null;
		let closestDistance = 0.75 * this.scene.GRID_SIZE;

		slots.forEach(slot => {
			const occupant = this.items.get(this.toKey(slot));
			if (!occupant || occupant == item || !item.canMerge(occupant))
				return;

			const pos = this.toCoords(slot);
			const distance = Phaser.Math.Distance.Chebyshev(
				item.goalPos.x, item.goalPos.y, pos.x, pos.y
			);
	
			if (distance < closestDistance) {
				closestDistance = distance;
				closestNeighbor = occupant;
			}
		});

		return closestNeighbor;
	}

	findMove() {
		let free = {};
		let blocked = {};

		this.items.forEach((item: Item, slot: string) => {
			let key = `${item.category},${item.tier}`;
			if (!item.sightBlocked && !item.spawnBlocked && !item.isFinal) {
				if (!item.blocked) {
					if (!free[key]) {
						free[key] = [];
					}
					free[key].push(slot);
				}
				else {
					if (!blocked[key]) {
						blocked[key] = [];
					}
					blocked[key].push(slot);
				}
			}
		});

		let blockedPairs = Object.keys(free).filter(function (key) { return blocked.hasOwnProperty(key); });
		let freePairs = Object.keys(free).filter(function (key) { return free[key].length > 1; });

		if (blockedPairs && blockedPairs.length > 0) {
			let key: string = Phaser.Math.RND.pick(blockedPairs);
			// TODO: Find closest one between all free-blocked
			let first: string = Phaser.Math.RND.pick(free[key]);
			let second: string = Phaser.Math.RND.pick(blocked[key]);
			return { from: first, to: second };
		}
		else if (freePairs && freePairs.length > 0) {
			let key: string = Phaser.Math.RND.pick(freePairs);
			Phaser.Math.RND.shuffle(free[key]);
			// TODO: Find closest one between all free-free
			let first: string = free[key][0];
			let second: string = free[key][1];
			return { from: first, to: second };
		}
		else {
			return null;
		}
	}

	forceMerge() {
		let move = this.findMove();
		if (move) {
			let item = this.items.get(move.from);
			let occupant = this.items.get(move.to);
			if (item && occupant) {
				let oldSlot = item.slot;
				let newSlot = occupant.slot;
				if (
					item.canMerge(occupant) &&
					(this.isBoardFull() ||
						(!(item.drops && item.charges > 1) &&
							!(occupant.drops && occupant.charges > 1)))
				) {
					this.items.delete(this.toKey(newSlot));
					occupant.destroy();

					this.items.delete(this.toKey(oldSlot));
					this.items.set(this.toKey(newSlot), item);
					item.place(newSlot, this.toCoords(newSlot));
					item.upgrade(occupant);

					this.openSight(newSlot);
					this.dirty();
				}
			}
		} else if (this.isBoardFull()) {
			let item = this.items.get(this.toKey({ x: 0, y: 0 }));
			if (item) {
				this.items.delete(this.toKey({ x: 0, y: 0 }));
				item.destroy();
			}
		}
	}


	/* Slots and coordinates */

	toKey(slot: Phaser.Types.Math.Vector2Like): string {
		return `${slot.x},${slot.y}`
	}

	toVec(slot: string): Phaser.Math.Vector2 {
		let [x,y] = slot.split(",");
		return new Phaser.Math.Vector2(parseInt(x), parseInt(y));
	}

	toCoords(slot: Phaser.Math.Vector2): Phaser.Math.Vector2 {
		let pos = new Phaser.Math.Vector2(this.x - this.width/2, this.y - this.height/2);
		// let pos = this.grid.getTopLeft(undefined, true);
		pos.x += (slot.x + 0.5) * this.scene.GRID_SIZE;
		pos.y += (slot.y + 0.5) * this.scene.GRID_SIZE;
		return pos;
	}

	toGrid(pos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
		const p = pos.clone();
		p.subtract(new Phaser.Math.Vector2(this.x - this.width/2, this.y - this.height/2));
		// p.subtract(this.grid.getTopLeft(undefined, true));
		return new Phaser.Math.Vector2(
			Phaser.Math.Clamp(Math.floor(p.x / this.scene.GRID_SIZE), 0, GRID_COLUMNS-1),
			Phaser.Math.Clamp(Math.floor(p.y / this.scene.GRID_SIZE), 0, GRID_ROWS-1)
		);
	}

	getRandomFreeSlot(): Phaser.Math.Vector2 | null {
		if (this.isBoardFull()) {
			return null;
		}

		let slot = new Phaser.Math.Vector2();
		while (!this.isBoardFull()) {
			slot.x = randInt(0, GRID_COLUMNS-1);
			slot.y = randInt(0, GRID_ROWS-1);
			if (!this.items.get(this.toKey(slot))) {
				break;
			}
		}
		return slot;
	}

	getClosestFreeSlot(targetSlot: Phaser.Types.Math.Vector2Like): Phaser.Math.Vector2 {
		if (this.isBoardFull()) {
			throw "Board full!";
		}

		let temp = new Phaser.Math.Vector2();

		let record = 100;
		let results: any[] = [];
		for (let cx = 0; cx < GRID_COLUMNS; cx++) {
			for (let cy = 0; cy < GRID_ROWS; cy++) {
				temp.set(cx, cy);
				if (!this.items.get(this.toKey(temp))) {
					let dist = Phaser.Math.Distance.BetweenPoints(targetSlot, temp);
					if (dist < record) {
						results = [];
						record = dist;
					}
					if (dist == record) {
						results.push({ x:cx, y:cy });
					}
				}
			}
		}

		let p = results[Math.floor(Math.random() * results.length)]
		return new Phaser.Math.Vector2(p.x, p.y);
	}

	// Returns a map of the highest tier for each available category
	getMaxTierMap(): {[key: string]: number} {
		let map: {[key: string]: number} = {};

		this.items.forEach((item: Item, slot: string) => {
			if (!item.blocked) {
				if (item.tier > map[item.category] || !map[item.category]) {
					map[item.category] = item.tier;
				}
			}
		});

		return map;
	}


	/* Tasks */

	findItems(category: string, tier: number, mustBeVisible: boolean = true): Item[] {
		let result: Item[] = [];

		this.items.forEach((item: Item, slot: string) => {
			if (item.category == category && item.tier == tier) {
				if (!mustBeVisible || !item.blocked) {
					result.push(item);
				}
			}
		});

		return result;
	}

	getTaskItems(task: Task): Item[][] {
		return task.items.map(item => this.findItems(item.category, item.tier));
	}

	checkTask(task: Task) {
		let success = true;
		let count: number[] = [];
		let found = this.getTaskItems(task);

		for (let i = 0; i < task.items.length; i++) {
			count[i] = found[i].length;
			if (found[i].length < (task.items[i].amount || 1)) {
				success = false;
			}
		}

		// Show green background for all cells with completed mission
		if (success) {
			found.forEach((taskItem, index) => {
				taskItem.forEach(item => {
					if (item.slot) {
						let cell = this.cells.get(this.toKey(item.slot));
						if (cell) {
							cell.setTint(COLOR.SUCCESS);
						}
					}
				});
			});
		}

		// Show checkmarks for all task related items found
		found.forEach((taskItem, index) => {
			taskItem.forEach(item => {
				item.showCheckmark(true);
			});
		});

		return { success, count };
	}

	checkTasks() {
		// Clear cell backgrounds
		this.cells.forEach((cell, slot: string) => {
			cell.setTint(COLOR.CELL);
		});
		this.items.forEach((item) => {
			item.showCheckmark(false);
			let cell = this.cells.get(this.toKey(item.slot));
			if (cell && !item.blocked) {
				if (item.drops && !item.chargeBlock) {
					cell.setTint(COLOR.GENERATOR);
				} else if (item.itemData.dispenser && item.dispenserCharges > 0) {
					cell.setTint(COLOR.DISPENSER);
				}
			}
		});

		// Return list of successful tasks
		let result: any[] = [];
		for (let task of this.tasks) {
			result.push(this.checkTask(task));
		}
		this.emit("checkTasks", result);
	}

	completeTask(index: number) {
		let task = this.tasks[index];
		if (!this.checkTask(task).success) {
			console.error("Attempting to complete task that's not done");
			return;
		}

		let items = this.getTaskItems(task);

		// Remove task items
		for (let i = 0; i < task.items.length; i++) {
			for (let j = 0; j < (task.items[i].amount || 1); j++) {
				let item = items[i][j];

				this.createEffect(item.x, item.y);
				this.items.delete(this.toKey(item.slot));
				item.destroy();
				if (this.selected == item) {
					this.selected = undefined;
				}
			}
		}

		this.dirty();
	}

	updateTasks(tasks: Task[]) {
		this.tasks = tasks;
		this.checkTasks();
	}

	updateCellColors() {
		this.checkTasks();
	}

	spawnLevelUpReward(level: number) {
		let slot = this.getRandomFreeSlot();

		if (slot) {
			let maxTiers = this.getMaxTierMap();
			let chestKey = "levelUpRewardChest";

			if (maxTiers.ruin > 3) {
				chestKey = ["martChest", "ruinChest"][level%2];
			}
			if (maxTiers.construction > 3) {
				chestKey = ["martChest", "ruinChest", "constructionChest"][level%3];
			}

			let newItem = this.createItem(slot.x, slot.y, chestKey, 1);

			if (newItem) {
				newItem.setSpawn(new Phaser.Math.Vector2(this.scene.CX, this.scene.H));
			}
		}
		else {
			console.error("Unintended");
		}
	}


	/* Utils */

	isBoardFull(): boolean {
		return this.items.size >= GRID_COLUMNS*GRID_ROWS;
	}

	dirty() {
		this.hintCache = null;
		this.checkTasks();
		this.saveData();
	}

	set selected(item: Item | undefined) {
		this._selected = item;
		this.selection.setVisible(!!item);
		this.emit("selection", item);
	}

	get selected(): Item | undefined {
		return this._selected;
	}
}