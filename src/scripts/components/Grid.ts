import { GameScene } from "../scenes/GameScene";
import { Item } from "./Item";
import { RoundRectangle } from "./RoundRectangle";
import { randInt, isLocalStorageAvailable } from "../utils";
import { itemData } from "../items";
import { GRID_COLUMNS, GRID_ROWS, GRID_BORDER, GRID_COLOR, CELL_COLOR, SUCCESS_COLOR, GENERATOR_COLOR } from "../constants";


interface TaskItem {
	category: string;
	tier: number;
	amount: number;
}

interface Task {
	title?: string;
	items: TaskItem[];
	reward: TaskItem[];
	unlock?: string[];
	chapter?: string;
}


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
	private effectsQueue: any[];

	private tasks: Task[];

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
		this.selection.setTint(0xFF4400);
		this.selection.setAlpha(0.8);
		this.selection.setDepth(10000);
		// this.add(this.selection);

		this.effects = scene.add.graphics();
		// this.effects.setDepth(100000);
		this.effectsQueue = [];

		this.tasks = [];


		// Check if save exists, otherwise create new board
		const success = this.loadData();
		if (!success) {
			this.generateNewBoard();
		}
	}

	initGridBackground() {
		this.gridBorder = new RoundRectangle(this.scene, 0, 0, 1000, 1000, 10, GRID_BORDER);
		this.add(this.gridBorder);

		this.gridBackground = new RoundRectangle(this.scene, 0, 0, 1000, 1000, 10, GRID_COLOR);
		this.add(this.gridBackground);

		// this.grid = this.scene.add.grid(0, 0, this.width, this.height, this.scene.GRID_SIZE, this.scene.GRID_SIZE, GRID_COLOR)
			// .setAltFillStyle(GRID_COLOR)
			// .setOutlineStyle(GRID_COLOR);
		// this.add(this.grid);

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
				cell.setTint(CELL_COLOR);
				this.cells.set(this.toKey(slot), cell);
			}
		}
	}


	/* Resizing */

	onScreenResize(screenWidth: number, screenHeight: number) {
		this.x = this.scene.CX;
		this.y = this.scene.CY;
		this.width = GRID_COLUMNS * this.scene.GRID_SIZE;
		this.height = GRID_ROWS * this.scene.GRID_SIZE;

		// Resize border
		const borderWidth = 4;
		const borderRadius = 0.02 * this.width;
		this.gridBorder.setRadius(borderRadius);
		this.gridBorder.setWidth(this.width + 4 * borderWidth);
		this.gridBorder.setHeight(this.height + 4 * borderWidth);

		// Resize background
		this.gridBackground.setRadius(Math.max(borderRadius - 1.5*borderWidth, 0));
		this.gridBackground.setWidth(this.width + borderWidth);
		this.gridBackground.setHeight(this.height + borderWidth);

		// Resize grid cells
		this.cells.forEach((cell, slot: string) => {
			let pos = this.toCoords(this.toVec(slot));
			cell.setPosition(pos.x, pos.y);
			cell.setScale(this.scene.CELL_SIZE / cell.width);
		});

		// Resize items
		this.items.forEach((item: Item, slot: string) => {
			item.place(item.slot, this.toCoords(item.slot), true);
			item.onScreenResize(screenWidth, screenHeight);
		});
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
			item.setDepth(1000 + item.y - item.x/2 + this.scene.GRID_SIZE * (item.holdSmooth + (item.justSpawned ? 1 : 0)));
			if (this.selected == item) {
				let pos = this.toCoords(item.slot);
				this.selection.setPosition(pos.x, pos.y);
				this.selection.setVisible(!item.drag);
				this.selection.setScale(this.scene.GRID_SIZE / this.selection.width * (1.15 + 0.05 * Math.sin(4*time/1000)));
			}

		});

		this.updateEffects(time);
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
			["?1", "q4", "?1", "?1", "?1", "?1", "?1"],
			["N2", "A4", "g4", "G2", "N1", "r2", "?1"],
			["a5", "D2", "A1", "D3", "d2", "e2", "N3"],
			["h1", "D2", "a3", "a4", "a2", "A1", "A3"],
			["A2", "b1", "A2", "A1", "A1", "D1", "a3"],
			["G1", "d1", "a1", "D1", "A3", "b2", "A2"],
			["A3", "D2", "d2", "e1", "d4", "G2", "k4"],
			["?1", "h2", "Q3", "D3", "D1", "A3", "r3"],
			["?1", "?1", "?1", "o1", "k3", "a7", "?1"],
		];
		for (let y = 0; y < itemMap.length; y++) {
			for (let x = 0; x < itemMap[0].length; x++) {
				let category = itemMap[y][x][0];
				let tier = parseInt(itemMap[y][x][1]);
				let locked = !(y == 4 && x > 1 && x < 5);

				switch (category) {
					case "A":
						category = "mart";
						break;
					case "a":
						category = "pokeball";
						break;
					case "b":
						category = "potion";
						break;
					case "D":
						category = "ruin";
						break;
					case "d":
						category = "fossil";
						break;
					case "e":
						category = "stone";
						break;
					case "N":
						category = "construction";
						break;
					case "k":
						category = "drink";
						break;
					case "o":
						category = "vending";
						break;
					default:
						category = "unown";
						tier = 1;
						locked = true;
				}

				let newItem = this.createItem(x, y, category, tier, locked);
			}
		}

		this.openAllSight();

		// this.createItem(4, 3, "mart", 1, false);
		// this.createItem(3, 2, "mart", 1, true);
		// this.createItem(6, 3, "mart", 2, true);
		// this.createItem(4, 4, "mart", 3, true);
		// this.createItem(4, 2, "pokeball", 1, true);
		// this.createItem(3, 4, "pokeball", 1, true);
		// this.createItem(2, 3, "pokeball", 2, true);
		// this.createItem(5, 2, "potion", 1, true);
		// this.createItem(5, 4, "potion", 2, true);

		// for (let item of toSpawn) {
			// let slot = this.getClosestFreeSlot({ x:4, y:3 });
			// this.createItem(slot.x, slot.y, item.category, item.tier, true);
		// }

		for (let i = 0; i < 9; i++) {
			// this.createItem(i, 0, "pokeball", i+1);
			// this.createItem(i, 1, "pokeball", i+1+9);
			// this.createItem(i, 1, "center", i+1);
			// this.createItem(i, 2, "mart", i+1);
			// this.createItem(i, 3, "construction", i+1);
			// this.createItem(i, 4, "ruin", i+1);
			// this.createItem(i, 5, "vending", i+1);
			// this.createItem(i, 7, "berry", i+1);
			// this.createItem(i, 6, "crystal", i+1);

			// this.createItem(i, 0, "bulbasaur", i+1);
			// this.createItem(i, 0, "charmander", i+1);
			// this.createItem(i, 0, "squirtle", i+1);
			// this.createItem(i, 0, "electric", i+1);
			// this.createItem(i, 1, "rotom", i+1);
			// this.createItem(i, 0, "eevee", i+1);
			// this.createItem(i, 0, "legendary", i+1);
		}

		// let cats = ["bulbasaur", "charmander", "squirtle"];
		// for (let i = 0; i < cats.length; i++) {
		// 	for (let j = 0; j < 10; j++) {
		// 		let slot = this.getRandomFreeSlot();
		// 		this.createItem(slot.x, slot.y, cats[i], 1, (Math.random()<0.8));
		// 	}
		// }

		// cats = ["electric", "rotom"];
		// for (let i = 0; i < cats.length; i++) {
		// 	for (let j = 0; j < 5; j++) {
		// 		let slot = this.getRandomFreeSlot();
		// 		this.createItem(slot.x, slot.y, cats[i], 1, (Math.random()<0.8));
		// 	}
		// }
	}

	createItem(cx: number, cy: number, category: string, tier: number=1, blocked: boolean=false): Item | null {
		const slot = new Phaser.Math.Vector2(cx, cy);

		if (this.items.size >= GRID_COLUMNS*GRID_ROWS) {
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
		if (itemData[category] === undefined || itemData[category][tier-1] === undefined) {
			console.error(`Cannot create item: No data available for (${category}:${tier-1})`);
			return null;
		}

		let item = new Item(this.scene, category, tier, blocked);
		item.place(slot, this.toCoords(slot), true);
		this.items.set(this.toKey(slot), item);
		this.dirty();

		item.on("drop", (pos: Phaser.Math.Vector2) => {

			let oldSlot = item.slot;
			let newSlot = this.toGrid(pos);
			let occupant = this.items.get(this.toKey(newSlot));

			// Occupied
			if (occupant && item != occupant) {
				// Merge
				if (item.canMerge(occupant)) {
					item.charges = Math.max(item.charges, occupant.charges);

					this.items.delete(this.toKey(newSlot));
					occupant.destroy();

					this.items.delete(this.toKey(oldSlot));
					this.items.set(this.toKey(newSlot), item);
					item.place(newSlot, this.toCoords(newSlot), true);
					item.upgrade(1);
					item.startMergeAnimation();

					this.openSight(newSlot);
					this.dirty();

					this.selected = item;

					this.createEffect(item.x, item.y);

					// Create experience if item level is high enough
					if (item.tier >= 5) {
						let slot = this.getClosestFreeSlot(item.slot);
						let newItem = this.createItem(slot.x, slot.y, "experience", 1);

						if (newItem) {
							let oldPos = this.toCoords(item.slot);
							newItem.x = oldPos.x;
							newItem.y = oldPos.y;
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
				this.dirty();
			}

			// Nothing
			else {
				item.place(oldSlot, this.toCoords(oldSlot));
				this.updateCellColors();
			}

		}, this);

		item.on("click", (pos: Phaser.Math.Vector2) => {

			// Use
			if (this.selected == item && !item.blocked) {

				// Generate
				if (!item.chargeBlock && !this.isBoardFull()) {
					let drops = item.drops;
					if (drops && item.charges > 0) {

						let data = drops[item.cycle % drops.length];
						// let data = weightedPick(drops);
						// if (Array.isArray(data.tier)) {
							// data.tier = Phaser.Math.RND.pick(data.tier);
						// }


						let slot = this.getClosestFreeSlot(item.slot);
						let newItem = this.createItem(slot.x, slot.y, data.category, data.tier);

						if (newItem) {
							let oldPos = this.toCoords(item.slot);
							newItem.x = oldPos.x;
							newItem.y = oldPos.y;
						}

						item.use();
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
			}

		});

		item.on("grab", () => {

			// Select
			this.selected = item;

			let cell = this.cells.get(this.toKey(item.slot));
			if (cell) {
				cell.setTint(CELL_COLOR);
			}

		});

		item.on("depleted", (canRecharge) => {

			if (!canRecharge) {
				this.items.delete(this.toKey(item.slot));
				item.destroy();
				this.selected = undefined;
			}
			this.emit("updateItem", item);
			this.dirty();

		});

		item.on("recharged", () => {

			// Will update background and info
			this.emit("updateItem", item);
			this.dirty();

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
			this.selected.recharge();
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

	findMove() {
		let free = {};
		let blocked = {};

		this.items.forEach((item: Item, slot: string) => {
			let key = `${item.category},${item.tier}`;
			if (!item.sightBlocked && !item.justSpawned && !item.isFinal) {
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
				if (item.canMerge(occupant) && (this.isBoardFull() || (!(item.drops && item.charges > 1) && !(occupant.drops && occupant.charges > 1)))) {
					this.items.delete(this.toKey(newSlot));
					occupant.destroy();

					this.items.delete(this.toKey(oldSlot));
					this.items.set(this.toKey(newSlot), item);
					item.place(newSlot, this.toCoords(newSlot));
					item.upgrade(1);

					this.openSight(newSlot);
					this.dirty();
				}
			}
		}
		else if (this.isBoardFull()) {
			let item = this.items.get(this.toKey({x:0, y:0}));
			if (item) {
				this.items.delete(this.toKey({x:0, y:0}));
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
		pos.subtract(new Phaser.Math.Vector2(this.x - this.width/2, this.y - this.height/2));
		// pos.subtract(this.grid.getTopLeft(undefined, true));
		return new Phaser.Math.Vector2(
			Phaser.Math.Clamp(Math.floor(pos.x / this.scene.GRID_SIZE), 0, GRID_COLUMNS-1),
			Phaser.Math.Clamp(Math.floor(pos.y / this.scene.GRID_SIZE), 0, GRID_ROWS-1)
		);
	}

	getRandomFreeSlot() {
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

	getTaskItems(task) {
		return task.items.map(item => this.findItems(item.category, item.tier));
	}

	checkTask(task) {
		let success = true;
		let count: number[] = [];
		let found = this.getTaskItems(task);

		for (let i = 0; i < task.items.length; i++) {
			count[i] = found[i].length;
			if (found[i].length < task.items[i].amount) {
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
							cell.setTint(SUCCESS_COLOR);
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
			cell.setTint(CELL_COLOR);
		});
		this.items.forEach(item => {
			item.showCheckmark(false);
			let cell = this.cells.get(this.toKey(item.slot));
			if (cell && item.drops && !item.blocked && !item.chargeBlock) {
				cell.setTint(GENERATOR_COLOR);
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

		let items: Item[] = this.getTaskItems(task);

		for (let i = 0; i < task.items.length; i++) {
			for (let j = 0; j < task.items[i].amount; j++) {
				let item = items[i][j];

				this.createEffect(item.x, item.y);
				this.items.delete(this.toKey(item.slot));
				item.destroy();
				if (this.selected == item) {
					this.selected = undefined;
				}
			}
		}

		for (let i = 0; i < task.reward.length; i++) {
			for (let j = 0; j < task.reward[i].amount; j++) {
				let item = task.reward[i];
				let slot = this.getRandomFreeSlot();

				if (!this.isBoardFull()) {
					let newItem = this.createItem(slot.x, slot.y, item.category, item.tier);
					if (newItem) {
						newItem.x = this.scene.CX;
						newItem.y = this.scene.H;
					}
				}
				else {
					console.error("Unintended");
				}
			}
		}

		this.dirty();
	}

	updateTasks(tasks) {
		this.tasks = tasks;
		this.checkTasks();
	}

	updateCellColors() {
		this.checkTasks();
	}

	spawnLevelUpReward() {
		let slot = this.getRandomFreeSlot();

		if (!this.isBoardFull()) {
			let newItem = this.createItem(slot.x, slot.y, "levelUpRewardChest", 1);
			if (newItem) {
				newItem.x = this.scene.CX;
				newItem.y = this.scene.H;
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