import { GameScene } from "../scenes/GameScene";
import { GRID_COLUMNS, GRID_ROWS } from "../constants";

export class LayoutManager extends Phaser.GameObjects.Graphics {
	public scene: GameScene;

	private statusSize: Phaser.Structs.Size;
	private navSize: Phaser.Structs.Size;
	private infoSize: Phaser.Structs.Size;
	private gridSize: Phaser.Structs.Size;
	private modalSize: Phaser.Structs.Size;
	private sideNavSize: Phaser.Structs.Size;
	private sideInfoSize: Phaser.Structs.Size;
	private innerSideNavSize: Phaser.Structs.Size;
	private innerSideInfoSize: Phaser.Structs.Size;
	private portraitSize: Phaser.Structs.Size;
	private landscapeSize: Phaser.Structs.Size;
	private landscapeTotalSize: Phaser.Structs.Size;
	private gameSize: Phaser.Structs.Size;

	public unit: number;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		scene.add.existing(this);

		// Set fixed ratios for each component
		this.statusSize = this.newSize(12, 1);
		this.navSize = this.newSize(6, 1);
		this.infoSize = this.newSize(5, 1);
		this.gridSize = this.newSize(GRID_COLUMNS, GRID_ROWS);
		this.modalSize = this.newSize(2, 3);
		this.sideNavSize = this.newSize(2, 5, false);
		this.sideInfoSize = this.sideNavSize;
		this.innerSideNavSize = this.newSize(1, 8, false);
		this.innerSideInfoSize = this.newSize(16, 9, false);

		// Calculate game size ratio in portrait mode
		this.statusSize.width = this.navSize.width = this.infoSize.width = this.gridSize.width = 1;
		this.sideNavSize.height = this.sideInfoSize.height = (this.statusSize.height + this.gridSize.height);

		const portraitTotalHeight = this.statusSize.height + this.navSize.height + this.infoSize.height + this.gridSize.height;
		const landscapeTotalHeight = this.statusSize.height + this.gridSize.height;
		const landscapeTotalWidth = this.sideNavSize.width + this.sideInfoSize.width + this.gridSize.width;
		this.portraitSize = this.newSize(1, portraitTotalHeight);
		this.landscapeSize = this.newSize(1, landscapeTotalHeight);
		this.landscapeTotalSize = this.newSize(landscapeTotalWidth, landscapeTotalHeight);
		this.gameSize = this.portraitSize;

		this.unit = 1;
	}

	onScreenResize(screenWidth: number, screenHeight: number) {
		this.clear();

		this.portraitSize.constrain(screenWidth, screenHeight, true);
		this.landscapeSize.constrain(screenWidth, screenHeight, true);
		this.landscapeTotalSize.constrain(screenWidth, screenHeight, true);
		const isVertical = (this.landscapeTotalSize.height < screenHeight);
		this.gameSize = isVertical ? this.portraitSize : this.landscapeSize;

		// Resize all components to fit their respective parents
		this.statusSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.navSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.infoSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.gridSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.modalSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.sideNavSize.constrain(this.landscapeTotalSize.width, this.landscapeTotalSize.height, true);
		this.sideInfoSize.constrain(this.landscapeTotalSize.width, this.landscapeTotalSize.height, true);
		this.innerSideNavSize.constrain(this.sideNavSize.width, this.sideNavSize.height, true);
		this.innerSideInfoSize.constrain(this.sideInfoSize.width, this.sideInfoSize.height, true);


		// The full game layout in game mode
		// const portrait = this.newRect(screenWidth/2-portraitSize.width/2, (screenHeight-portraitSize.height)*3/4, portraitSize.width, portraitSize.height, false);
		// this.drawRect(portrait, 0x000000);
		const landscape = this.newRect(screenWidth/2-this.landscapeTotalSize.width/2, (screenHeight-this.landscapeTotalSize.height)*3/4, this.landscapeTotalSize.width, this.landscapeSize.height, false);
		// this.drawRect(landscape, 0x000000);
		const game = this.newRect(screenWidth/2-this.gameSize.width/2, (screenHeight-this.gameSize.height)*3/4, this.gameSize.width, this.gameSize.height, false);
		// this.drawRect(game, 0x000000, 8);

		this.unit = 1/100 * game.width;

		this.modalSize.width -= 4*this.unit;
		this.modalSize.height -= 4*this.unit;


		// The top status bar
		const status = isVertical ?
			this.newRect(game.left, 0, this.statusSize.width, this.statusSize.height, false) :
			this.newRect(landscape.left+this.sideNavSize.width, 0, this.statusSize.width, this.statusSize.height, false);
		// this.drawRect(status, 0x00FF00);

		// The navigation bar
		const nav = isVertical ?
			this.newRect(game.left, game.bottom-this.navSize.height, this.navSize.width, this.navSize.height, false) :
			this.newRect(landscape.left+this.sideNavSize.width-this.innerSideNavSize.width, landscape.top, this.innerSideNavSize.width, this.innerSideNavSize.height, false);
		// this.drawRect(nav, 0xFFFF00);

		// The central grid board
		const grid = isVertical ?
			this.newRect(game.left, nav.top-this.gridSize.height, this.gridSize.width, this.gridSize.height, false) :
			this.newRect(landscape.left+this.sideNavSize.width, game.bottom-this.gridSize.height, this.gridSize.width, this.gridSize.height, false);
		// this.drawRect(grid, 0xFF0000);

		// The item information bar
		const info = isVertical ?
			this.newRect(game.left, grid.top-this.infoSize.height, this.infoSize.width, this.infoSize.height, false) :
			this.newRect(landscape.right-this.innerSideInfoSize.width, grid.top, this.innerSideInfoSize.width, this.innerSideInfoSize.height, false);
		// this.drawRect(info, 0x0000FF);

		// The modal pop-up
		const modal = this.newRect(screenWidth/2, screenHeight/2, this.modalSize.width, this.modalSize.height, true);
		// this.drawRect(modal, 0xFFFFFF);


		/*
		// All cells on the grid
		const navCellWidth = nav.width / 5;
		const navCellHeight = nav.height / 1;
		for (let x = 0; x < 5; x++) {
			const navCell = this.newRect(
				nav.x + x * navCellWidth + navCellWidth/2,
				nav.y + navCellHeight/2,
				navCellWidth - 2*this.padding,
				navCellHeight - 2*this.padding
			);
			this.drawRect(navCell, 0xFFFF00);
		}

		// All cells on the grid
		const statusCellWidth = status.width / 4;
		const statusCellHeight = status.height / 1;
		for (let x = 0; x < 4; x++) {
			const statusCell = this.newRect(
				status.x + x * statusCellWidth + statusCellWidth/2,
				status.y + statusCellHeight/2,
				statusCellWidth - 2*this.padding,
				statusCellHeight - 2*this.padding
			);
			this.drawRect(statusCell, 0x00FF00);
		}

		// All cells on the grid
		const innerGrid = this.newRect(grid.centerX, grid.centerY, grid.width-2*this.padding, grid.height-2*this.padding);
		const cellWidth = innerGrid.width / GRID_COLUMNS;
		const cellHeight = innerGrid.height / GRID_ROWS;
		for (let x = 0; x < GRID_COLUMNS; x++) {
			for (let y = 0; y < GRID_ROWS; y++) {
				const cell = this.newRect(
					innerGrid.x + (x+0.5) * cellWidth,
					innerGrid.y + (y+0.5) * cellHeight,
					cellWidth,
					cellHeight
				);
				this.drawRect(cell, 0xFF0000);
			}
		}
		*/

		const innerGrid = this.newRect(grid.centerX, grid.centerY, grid.width-4*this.unit, grid.height-3*this.unit*GRID_ROWS/GRID_COLUMNS);
		const cellSize = innerGrid.width / GRID_COLUMNS;
		// const cellWidth = innerGrid.width / GRID_COLUMNS;
		// const cellHeight = innerGrid.height / GRID_ROWS;
		// console.log(cellWidth, cellHeight);


		return {
			// game,

			status,
			nav,
			grid,
			info,
			modal,

			cellSize,
			unit: this.unit,

			isVertical,
		};
	}

	newSize(width: number, height: number, widthControl: boolean=true) {
		const mode = (widthControl ? Phaser.Structs.Size.WIDTH_CONTROLS_HEIGHT : Phaser.Structs.Size.HEIGHT_CONTROLS_WIDTH);
		return new Phaser.Structs.Size(width, height, mode);
	}

	newRect(x: number, y: number, width: number, height: number, centered: boolean=true) {
		const offsetX = (centered ? width/2 : 0);
		const offsetY = (centered ? height/2 : 0);
		return new Phaser.Geom.Rectangle(
			x - offsetX,
			y - offsetY,
			width,
			height
		);
	}

	drawRect(shape: Phaser.Geom.Rectangle, color: number, thickness: number=1) {
		this.lineStyle(thickness, color, 1.0);
		this.fillStyle(color, 0.1);
		// shape = new Phaser.Geom.Rectangle(shape.x+this.padding, shape.y+this.padding, shape.width-2*this.padding, shape.height-2*this.padding);
		this.strokeRectShape(shape);
		this.fillRectShape(shape);
	}
}
