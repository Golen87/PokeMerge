import { GameScene } from "../scenes/GameScene";
import { GRID_COLUMNS, GRID_ROWS } from "../constants";

export enum LayoutMode {
	PORTRAIT,
	SQUARE,
	LANDSCAPE,
}

export class LayoutManager extends Phaser.GameObjects.Graphics {
	public scene: GameScene;
	public mode: LayoutMode;

	private statusSize: Phaser.Structs.Size;
	private navSize: Phaser.Structs.Size;
	private infoSize: Phaser.Structs.Size;
	private gridSize: Phaser.Structs.Size;
	private modalSize: Phaser.Structs.Size;
	private sideMarginSize: Phaser.Structs.Size;
	private sideNavSize: Phaser.Structs.Size;
	private sideInfoSize: Phaser.Structs.Size;

	private portraitSize: Phaser.Structs.Size; // The center game area in portrait mode
	private squareSize: Phaser.Structs.Size; // The center game area in landscape mode
	private landscapeSize: Phaser.Structs.Size; // The center game area in landscape mode
	private gameSize: Phaser.Structs.Size; // The center game area, which is one of the three above

	private totalLandscapeSize: Phaser.Structs.Size; // Used for determining if the game is in landscape mode
	private totalSquareSize: Phaser.Structs.Size; // Used for determining if the game is in square mode

	public unit: number;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.mode = LayoutMode.PORTRAIT;
		scene.add.existing(this);

		// Set fixed ratios for each component
		this.statusSize = this.newSize(12, 1);
		this.navSize = this.newSize(6, 1);
		this.infoSize = this.newSize(5, 1);
		this.gridSize = this.newSize(GRID_COLUMNS, GRID_ROWS);
		this.modalSize = this.newSize(2, 3);
		this.sideMarginSize = this.newSize(2, 5, false);
		this.sideNavSize = this.newSize(1, 8, false);
		this.sideInfoSize = this.newSize(16, 9, false);

		// Calculate game size ratio in portrait mode
		this.statusSize.width = 1;
		this.navSize.width = 1;
		this.infoSize.width = 1;
		this.gridSize.width = 1;
		this.sideMarginSize.height = this.statusSize.height + this.gridSize.height;

		const portraitHeight =
			this.statusSize.height +
			this.navSize.height +
			this.infoSize.height +
			this.gridSize.height;
		this.portraitSize = this.newSize(1, portraitHeight);

		const inbetweenHeight =
			this.statusSize.height + this.infoSize.height + this.gridSize.height;
		this.squareSize = this.newSize(1, inbetweenHeight);

		const landscapeWidth = 2 * this.sideMarginSize.width + this.gridSize.width;
		const landscapeHeight = this.statusSize.height + this.gridSize.height;
		this.landscapeSize = this.newSize(1, landscapeHeight);
		this.totalLandscapeSize = this.newSize(landscapeWidth, landscapeHeight);

		this.sideNavSize.height =
			this.gridSize.height + this.infoSize.height + this.statusSize.height;
		const squareWidth = 2 * this.sideNavSize.width + this.gridSize.width;
		const squareHeight =
			this.statusSize.height + this.infoSize.height + this.gridSize.height;
		this.squareSize = this.newSize(1, squareHeight);
		this.totalSquareSize = this.newSize(squareWidth, squareHeight);

		this.gameSize = this.portraitSize;
		this.unit = 1;
	}

	onScreenResize(screenWidth: number, screenHeight: number) {
		this.totalSquareSize.constrain(screenWidth, screenHeight, true);
		this.totalLandscapeSize.constrain(screenWidth, screenHeight, true);
		if (this.totalSquareSize.height < screenHeight) {
			this.mode = LayoutMode.PORTRAIT;
		} else if (this.totalLandscapeSize.height < screenHeight) {
			this.mode = LayoutMode.SQUARE;
		} else {
			this.mode = LayoutMode.LANDSCAPE;
		}
		this.gameSize = {
			[LayoutMode.PORTRAIT]: this.portraitSize,
			[LayoutMode.SQUARE]: this.squareSize,
			[LayoutMode.LANDSCAPE]: this.landscapeSize,
		}[this.mode];
		this.gameSize.constrain(screenWidth, screenHeight, true);
		this.portraitSize.constrain(screenWidth, screenHeight, true);
		this.squareSize.constrain(screenWidth, screenHeight, true);
		this.landscapeSize.constrain(screenWidth, screenHeight, true);

		// Resize all components to fit their respective parents
		this.statusSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.navSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.infoSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.gridSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.modalSize.constrain(this.gameSize.width, this.gameSize.height, true);
		this.sideMarginSize.constrain(screenWidth, screenHeight, true);
		this.sideNavSize.constrain(this.gridSize.width, this.gridSize.height, true);
		this.sideInfoSize.constrain(
			this.sideMarginSize.width,
			this.sideMarginSize.height,
			true
		);

		// The full game layout in game mode
		const game = this.newRect(
			screenWidth / 2 - this.gameSize.width / 2,
			((screenHeight - this.gameSize.height) * 3) / 4,
			this.gameSize.width,
			this.gameSize.height,
			false
		);

		this.unit = (1 / 100) * game.width;

		this.modalSize.width -= 4 * this.unit;
		this.modalSize.height -= 4 * this.unit;

		// The top status bar
		const status = this.newRect(
			game.left,
			0,
			this.statusSize.width,
			this.statusSize.height,
			false
		);

		// The navigation bar
		const nav = this.isPortrait
			? this.newRect(
					game.left,
					game.bottom - this.navSize.height,
					this.navSize.width,
					this.navSize.height,
					false
			  )
			: this.newRect(
					game.left - this.sideNavSize.width,
					game.bottom - this.sideNavSize.height,
					this.sideNavSize.width,
					this.sideNavSize.height,
					false
			  );

		// The central grid board
		const grid = this.newRect(
			game.left,
			game.bottom -
				this.gridSize.height -
				(this.isPortrait ? this.navSize.height : 0),
			this.gridSize.width,
			this.gridSize.height,
			false
		);

		// The item information bar
		const info = this.isLandscape
			? this.newRect(
					game.right,
					grid.top,
					this.sideInfoSize.width,
					this.sideInfoSize.height,
					false
			  )
			: this.newRect(
					game.left,
					game.top + this.statusSize.height,
					this.infoSize.width,
					this.infoSize.height,
					false
			  );

		// The modal pop-up
		const modal = this.newRect(
			screenWidth / 2,
			screenHeight / 2,
			this.modalSize.width,
			this.modalSize.height,
			true
		);

		// Draw the layout components
		// this.clear();
		// this.drawRect(game, 0x000000, 16, 8);
		// this.drawRect(status, 0x00ff00, 2, 0);
		// this.drawRect(nav, 0xffff00, 2, 0);
		// this.drawRect(grid, 0xff0000, 2, 0);
		// this.drawRect(info, 0x0000ff, 2, 0);
		// this.drawRect(modal, 0xFFFFFF, 2, 0);

		return {
			status,
			nav,
			grid,
			info,
			modal,

			cellSize: (grid.width - 4 * this.unit) / GRID_COLUMNS,
			unit: this.unit,
		};
	}

	newSize(width: number, height: number, widthControl: boolean = true) {
		const mode = widthControl
			? Phaser.Structs.Size.WIDTH_CONTROLS_HEIGHT
			: Phaser.Structs.Size.HEIGHT_CONTROLS_WIDTH;
		return new Phaser.Structs.Size(width, height, mode);
	}

	newRect(
		x: number,
		y: number,
		width: number,
		height: number,
		centered: boolean = true
	) {
		const offsetX = centered ? width / 2 : 0;
		const offsetY = centered ? height / 2 : 0;
		return new Phaser.Geom.Rectangle(x - offsetX, y - offsetY, width, height);
	}

	drawRect(
		shape: Phaser.Geom.Rectangle,
		color: number,
		thickness: number,
		padding: number
	) {
		this.lineStyle(thickness, color, 1.0);
		this.fillStyle(color, 0.2);
		shape = new Phaser.Geom.Rectangle(
			shape.x + padding,
			shape.y + padding,
			shape.width - 2 * padding,
			shape.height - 2 * padding
		);
		this.strokeRectShape(shape);
		this.fillRectShape(shape);
	}

	get isPortrait() {
		return this.mode == LayoutMode.PORTRAIT;
	}

	get isSquare() {
		return this.mode == LayoutMode.SQUARE;
	}

	get isLandscape() {
		return this.mode == LayoutMode.LANDSCAPE;
	}
}
