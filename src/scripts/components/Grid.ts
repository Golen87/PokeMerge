import { GameScene } from "../scenes/GameScene";
import { Item } from "./Item";
import { randInt, weightedPick } from "../utils";
import { GRID_SIZE } from "../constants";

export class Grid extends Phaser.GameObjects.Container {
	public scene: GameScene;
	private grid: Phaser.GameObjects.Grid;
	private gridWidth: number;
	private gridHeight: number;

	private items: Map<string, Item>;
	private reservedSpots: Array<Phaser.Math.Vector2>;
	private hintCache: any;

	private _selected?: Item;
	private selection: Phaser.GameObjects.Image;

	private effects: Phaser.GameObjects.Graphics;
	private effectsQueue: any[];

	private tasks: any[];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		this.gridWidth = 9;
		this.gridHeight = 7;
		this.width = this.gridWidth*GRID_SIZE;
		this.height = this.gridHeight*GRID_SIZE;

		let s = 6;
		let bg = scene.add.rectangle(0, 0, this.width+2*s, this.height+2*s, 0x382215);
		this.add(bg);

		this.grid = scene.add.grid(0, 0, this.width, this.height, GRID_SIZE, GRID_SIZE, 0xEECC99)
			.setAltFillStyle(0xC9AC7F)
			.setOutlineStyle(0x382215);
		this.add(this.grid);

		this.grid.setInteractive()
			.on("pointerdown", () => {
				this.selected = undefined;
			});

		this.items = new Map();
		this.reservedSpots = [];

		this.hintCache = null;

		// Selection
		this.selection = scene.add.image(0, 0, "selection");
		this.selection.setScale(GRID_SIZE / this.selection.width);
		this.selection.setVisible(false);
		this.selection.setTint(0xFF4400);
		this.selection.setAlpha(0.8);
		// this.add(this.selection);

		this.effects = scene.add.graphics();
		this.effectsQueue = [];

		this.tasks = [];


		// Check localStorage
		let data = localStorage.getItem("grid");
		if (data) {
			this.loadData(JSON.parse(data));
		}
		else {
			this.generate();
		}
	}

	generate() {

		this.items.forEach((item: Item, slot: string) => {
			item.destroy();
		});
		this.items.clear();

		let toSpawn = [
			{ tier: 1, type: "pokeball" },
			{ tier: 1, type: "potion" },
			{ tier: 1, type: "pokeball" },
			{ tier: 1, type: "potion" },
			{ tier: 1, type: "pokeball" },
			{ tier: 1, type: "mart" },

			{ tier: 2, type: "pokeball" },
			{ tier: 2, type: "potion" },
			{ tier: 2, type: "pokeball" },
			{ tier: 2, type: "potion" },
			{ tier: 2, type: "pokeball" },
			{ tier: 1, type: "mart" },

			{ tier: 3, type: "pokeball" },
			{ tier: 3, type: "potion" },
			{ tier: 3, type: "pokeball" },
			{ tier: 2, type: "mart" },
			{ tier: 3, type: "pokeball" },

			{ tier: 4, type: "pokeball" },
			{ tier: 2, type: "mart" },
			{ tier: 4, type: "pokeball" },
			{ tier: 3, type: "mart" },
			{ tier: 3, type: "mart" },

			{ tier: 1, type: "bulbasaur" },
			{ tier: 1, type: "charmander" },
			{ tier: 1, type: "squirtle" },
			{ tier: 2, type: "bulbasaur" },
			{ tier: 2, type: "charmander" },
			{ tier: 2, type: "squirtle" },
			{ tier: 3, type: "bulbasaur" },
			{ tier: 3, type: "charmander" },
			{ tier: 3, type: "squirtle" },
			{ tier: 1, type: "eevee" },
			{ tier: 2, type: "eevee" },
			{ tier: 1, type: "electric" },
			{ tier: 2, type: "electric" },
			{ tier: 1, type: "rotom" },
			{ tier: 2, type: "rotom" },
			{ tier: 1, type: "legendary" },
			{ tier: 2, type: "legendary" },
			{ tier: 3, type: "legendary" },

			{ tier: 1, type: "ruin" },
			{ tier: 1, type: "construction" },
			{ tier: 2, type: "ruin" },
			{ tier: 2, type: "construction" },
			{ tier: 3, type: "ruin" },
			{ tier: 3, type: "construction" },

			{ tier: 1, type: "fossil" },
			{ tier: 1, type: "stone" },
			{ tier: 1, type: "drink" },
			{ tier: 2, type: "fossil" },
			{ tier: 2, type: "stone" },
			{ tier: 2, type: "drink" },
		];

		this.reservedSpots = [
			new Phaser.Math.Vector2(3, 3),
			// new Phaser.Math.Vector2(4, 3),
			new Phaser.Math.Vector2(5, 3),
		];

		this.createItem(4, 3, "mart", 1, false);
		this.createItem(3, 2, "mart", 1, true);
		this.createItem(6, 3, "mart", 2, true);
		this.createItem(4, 4, "mart", 3, true);
		this.createItem(4, 2, "pokeball", 1, true);
		this.createItem(3, 4, "pokeball", 1, true);
		this.createItem(2, 3, "pokeball", 2, true);
		this.createItem(5, 2, "potion", 1, true);
		this.createItem(5, 4, "potion", 2, true);

		for (let item of toSpawn) {
			let slot = this.getClosestFreeSlot({ x:4, y:3 });
			this.createItem(slot.x, slot.y, item.type, item.tier, true);
		}

		this.reservedSpots.push(new Phaser.Math.Vector2(4, 3));

		for (let spot of this.reservedSpots) {
			this.openSight(spot);
		}

		this.reservedSpots = [];

		for (let i = 0; i < 9; i++) {
			// this.createItem(0+i, 1, "legendary", i+1);
			// if (i < 5) this.createItem(0+i, 4, "legendary", i+10);
			// this.createItem(0+i, 4, "electric", i+1);
			// this.createItem(0+i, 0, "electric", i+1);
			// this.createItem(0+i, 1, "pokeball", i+1);
			// this.createItem(0+i, 3, "legendary", i+1);
			// this.createItem(0+i, 3, "fossil", i+1);
			// this.createItem(0+i, 5, "stone", i+1);
			// this.createItem(0+i, 4, "construction", i+1);
			// if (i<4) this.createItem(0+i, 3, "center", i+1);
			// if (i<3) this.createItem(0+i, 6, "vending", i+1);
			// if (i<5) this.createItem(4+i, 6, "drink", i+1);
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

	clearData() {
		localStorage.removeItem("grid");
		this.generate();
	}

	saveData() {
		let data = {};

		this.items.forEach((item: Item, slot: string) => {
			data[slot] = item.serialize();
		});

		localStorage.setItem("grid", JSON.stringify(data));
	}

	loadData(data: any) {
		// this.clearGrid();

		// Create items
		for (let key in data) {
			let item = data[key];
			let slot = this.toVec(key);

			this.createItem(slot.x, slot.y, item.category, item.tier, item.blocked);
		}

		for (let cx = 0; cx < this.gridWidth; cx++) {
			for (let cy = 0; cy < this.gridHeight; cy++) {
				let slot = new Phaser.Math.Vector2(cx, cy);
				let key = this.toKey(slot);
				let occupant = this.items.get(key);

				if (!occupant || !occupant.blocked) {
					this.openSight(slot);
				}
			}
		}

		this.dirty();
	}


	update(time, delta) {
		this.items.forEach((item: Item, slot: string) => {

			item.update(time, delta);
			item.setDepth(1000 + item.y - item.x/2 + GRID_SIZE * item.holdSmooth);
			if (this.selected == item) {
				let pos = this.toCoords(item.slot);
				this.selection.setPosition(pos.x, pos.y);
				this.selection.setVisible(!item.drag);
				this.selection.setScale(GRID_SIZE / this.selection.width * (1.15 + 0.05 * Math.sin(4*time/1000)));
			}

		});

		this.updateEffects(time);
	}


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
			let r = 0.9 * GRID_SIZE * Phaser.Math.Easing.Cubic.Out(t);
			let w = 0.15 * GRID_SIZE * (1 - Phaser.Math.Easing.Sine.In(t));

			if (t > 1) {
				this.effectsQueue.splice(i, 1);
				break;
			}

			this.effects.lineStyle(w, 0xFFFFFF);
			this.effects.strokeCircle(effect.x, effect.y, r+w);
		}
	}


	createItem(cx: number, cy: number, key: string, tier: number=1, blocked: boolean=false): void {
		if (this.items.size >= this.gridWidth*this.gridHeight) {
			return;
		}

		let slot = new Phaser.Math.Vector2(cx, cy);
		let item = new Item(this.scene, key, tier, blocked);

		item.place(slot, this.toCoords(slot), true);
		this.items.set(this.toKey(slot), item);
		this.dirty();

		item.on("drop", (pos: Phaser.Math.Vector2) => {

			let oldSlot = item.slot;
			let newSlot = this.toGrid(pos);
			let occupant = this.items.get(this.toKey(newSlot));

			// Sell
			// let g = this.grid.getTopLeft(undefined, true);
			// if (Math.abs(this.scene.info.x - pos.x-g.x) < 75
			//  && Math.abs(this.scene.info.y - pos.y-g.y) < 75) {
			// 	this.items.delete(this.toKey(oldSlot));
			// 	item.destroy();
			// 	this.dirty();
			// 	this.selected = undefined;
			// 	return;
			// }

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
			}

		}, this);

		item.on("click", (pos: Phaser.Math.Vector2) => {

			// Generate
			if (this.selected == item && !item.blocked && !item.chargeBlock && !this.isBoardFull()) {
				let drops = item.drops;
				if (drops && item.charges > 0) {

					let data = weightedPick(drops);
					if (Array.isArray(data.tier)) {
						data.tier = Phaser.Math.RND.pick(data.tier);
					}

					let slot = this.getClosestFreeSlot(item.slot);
					this.createItem(slot.x, slot.y, data.type, data.tier);
					let newItem = this.items.get(this.toKey(slot))!;

					let oldPos = this.toCoords(item.slot);
					newItem.x = oldPos.x;
					newItem.y = oldPos.y;

					item.use();
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

		});

		item.on("depleted", () => {

			this.items.delete(this.toKey(item.slot));
			item.destroy();
			this.dirty();
			this.selected = undefined;

		});
	}

	sellSelected() {
		if (this.selected) {
			this.items.delete(this.toKey(this.selected.slot));
			this.selected.destroy();
			this.dirty();
			this.selected = undefined;
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

	toKey(slot: Phaser.Types.Math.Vector2Like): string {
		return `${slot.x},${slot.y}`
	}

	toVec(slot: string): Phaser.Math.Vector2 {
		let [x,y] = slot.split(",");
		return new Phaser.Math.Vector2(parseInt(x), parseInt(y));
	}

	getRandomFreeSlot() {
		let slot = new Phaser.Math.Vector2();
		while (!this.isBoardFull()) {
			slot.x = randInt(0, this.gridWidth-1);
			slot.y = randInt(0, this.gridHeight-1);
			if (!this.items.get(this.toKey(slot)) && !this.isReserved(slot)) {
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
		for (let cx = 0; cx < this.gridWidth; cx++) {
			for (let cy = 0; cy < this.gridHeight; cy++) {
				temp.set(cx, cy);
				if (!this.items.get(this.toKey(temp)) && !this.isReserved(temp)) {
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


	findItems(type: string, tier: number, mustBeVisible: boolean = true): Item[] {
		let result: Item[] = [];

		this.items.forEach((item: Item, slot: string) => {
			if (item.category == type && item.tier == tier) {
				if (!mustBeVisible || !item.blocked) {
					result.push(item);
				}
			}
		});

		return result;
	}

	getTaskItems(task) {
		return task.items.map(item => this.findItems(item.type, item.tier));
	}

	checkTask(task) {
		let success = true;
		let count: number[] = [];
		let found = this.getTaskItems(task);

		for (let i = 0; i < task.items.length; i++) {
			count[i] = found[i].length;
			if (found[i].length < task.items[i].count) {
				success = false;
			}
		}

		return { success, count };
	}

	checkTasks() {
		let result: any[] = [];

		for (let task of this.tasks) {
			result.push(this.checkTask(task));
		}

		this.emit("checkTasks", result);
	}

	completeTask(index: number) {
		let task = this.tasks[index];
		console.assert(this.checkTask(task).success);

		let items: Item[] = this.getTaskItems(task);

		for (let i = 0; i < task.items.length; i++) {
			for (let j = 0; j < task.items[i].count; j++) {
				let item = items[i][j];

				this.items.delete(this.toKey(item.slot));
				item.destroy();
			}
		}

		console.log(task.reward);
		for (let i = 0; i < task.reward.length; i++) {
			for (let j = 0; j < task.reward[i].count; j++) {
				let item = task.reward[i];
				let slot = this.getRandomFreeSlot();

				if (!this.isBoardFull()) {
					this.createItem(slot.x, slot.y, item.type, item.tier);
				}
			}
		}

		this.dirty();
	}

	updateTasks(tasks) {
		this.tasks = tasks;
		this.checkTasks();
	}


	toCoords(slot: Phaser.Math.Vector2): Phaser.Math.Vector2 {
		let pos = this.grid.getTopLeft(undefined, true);
		pos.x += (slot.x + 0.5) * this.grid.cellWidth;
		pos.y += (slot.y + 0.5) * this.grid.cellHeight;
		return pos;
	}

	toGrid(pos: Phaser.Math.Vector2): Phaser.Math.Vector2 {
		pos.subtract(this.grid.getTopLeft(undefined, true));
		return new Phaser.Math.Vector2(
			Phaser.Math.Clamp(Math.floor(pos.x / this.grid.cellWidth), 0, this.gridWidth-1),
			Phaser.Math.Clamp(Math.floor(pos.y / this.grid.cellHeight), 0, this.gridHeight-1)
		);
	}

	isReserved(slot: Phaser.Math.Vector2): boolean {
		let key = this.toKey(slot);
		for (let res of this.reservedSpots) {
			if (key == this.toKey(res)) {
				return true;
			}
		}
		return false;
	}

	isBoardFull(): boolean {
		return this.items.size >= this.gridWidth*this.gridHeight - this.reservedSpots.length;
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