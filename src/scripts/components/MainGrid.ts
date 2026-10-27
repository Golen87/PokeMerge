import { Grid } from "./Grid";

export class MainGrid extends Grid {
	generateNewBoard() {
		super.generateNewBoard();
		/*
		const itemMap = [
			["R3", "M1", "W1", "M2", "R3", "M1", "M1"],
			["F4", "W1", "W1", "B2", "W1", "F2", "M3"],
			["M2", "B1", "M1", "W1", "M1", "F1", "B1"],
			["W3", "B1", "S2", "r1", "S1", "M1", "B1"],
			// ["W2", "R1", "W2", "W1", "W1", "R1", "W3"],
			["W2", "R1", "", "B7", "", "R1", "W3"],
			// ["W1", "W2", "r2", "t3", "W3", "R1", "W2"],
			["W1", "W2", "W1", "t3", "W3", "R1", "W2"],
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

				// this.createItem(x, y, category, tier, locked);
			}
		}
		*/

		// const categories = ["mart", "center", "ruin", "construction", "boat", "tree", "nintendo"];
		const categories = ["mart", "ruin"];
		// const categories = ["pokeball", "potion", "fossil", "stone", "drive", "tech", "metal", "berry", "edible", "herb", "shell", "drink", "pearl"];
		for (let c = 0; c < categories.length; c++) {
			for (let t = 0; t < 10; t++) {
				let x = t;
				let y = c;
				// this.createItem(x, y, categories[c], t + 4);
			}
		}

		this.createItem(0, 0, "tree", 8);
		this.createItem(1, 0, "mart", 4);
		// this.createItem(1, 0, "mart", 10);
		this.createItem(2, 0, "ruin", 10);
		this.createItem(0, 1, "construction", 10);
		this.createItem(1, 1, "boat", 10);
		this.createItem(2, 1, "center", 9);
		
		this.createItem(0, 2, "coin", 1);
		this.createItem(1, 2, "coin", 2);
		this.createItem(2, 2, "coin", 3);
		this.createItem(3, 2, "coin", 4);
		this.createItem(4, 2, "coin", 5);

		this.createItem(0, 3, "boat", 1);
		this.createItem(1, 3, "boat", 2);
		this.createItem(2, 3, "boat", 3);
		this.createItem(3, 3, "boat", 4);
		this.createItem(4, 3, "boat", 5);
		this.createItem(0, 4, "boat", 6);
		this.createItem(1, 4, "boat", 7);
		this.createItem(2, 4, "boat", 8);
		this.createItem(3, 4, "boat", 9);
		this.createItem(4, 4, "boat", 10);

		this.openAllSight();
	}
}
