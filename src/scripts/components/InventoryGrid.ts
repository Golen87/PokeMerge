import { Grid } from "./Grid";
import { GRID_COLUMNS, GRID_ROWS } from "../constants";

export class InventoryGrid extends Grid {
	generateNewBoard() {
		super.generateNewBoard();
		for (let y = 0; y < GRID_ROWS; y++) {
			for (let x = 0; x < GRID_COLUMNS; x++) {
				if (x < 2 && y < 2) { continue; }
				this.createItem(x, y, "pokeball", 1, true);
			}
		}
		this.openAllSight();
	}
}
