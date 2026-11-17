import { GameScene } from "../scenes/GameScene";
import { gameState } from "../GameState";
import { Modal } from "./Modal";
import { InfoItemPreview } from "./InfoItemPreview";
import { itemData } from "../items";
import type { ItemCategory } from "../items";
import { itemCategoryDetails } from "../items/categoryDetails";
import { COLOR } from "../constants";

const COLUMNS = 4;

interface DetailsSection {
	container: Phaser.GameObjects.Container;
	title: Phaser.GameObjects.Text;
	boxes: InfoItemPreview[];
}

export class ItemDetailsModal extends Modal {
	private content: Phaser.GameObjects.Container;
	private chainBoxes: InfoItemPreview[] = [];
	private chainLength = 0;
	private sections: DetailsSection[] = [];
	private layoutBounds?: Phaser.Geom.Rectangle;
	private layoutUnit = 1;

	constructor(scene: GameScene) {
		super(scene);

		this.content = this.scene.add.container(0, 0);
		this.add(this.content);
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number) {
		this.layoutBounds = bounds;
		this.layoutUnit = unit;

		const width = bounds.width - 4 * unit;
		const padding = 8 * unit;
		const innerWidth = width - 2 * padding;
		const gap = 6 * unit;
		const size = (innerWidth - gap * (COLUMNS - 1)) / COLUMNS;
		const gridHeight = (count: number) => {
			const rows = Math.ceil(count / COLUMNS);
			return rows * size + Math.max(0, rows - 1) * gap;
		};

		this.resizeGrid(this.chainBoxes, padding, size, gap, unit);
		let top = padding + gridHeight(this.chainLength);

		for (const section of this.sections) {
			section.container.setPosition(0, top);
			section.title.setPosition(0, 6 * unit);
			section.title.setFontSize(4 * unit);
			section.title.setWordWrapWidth(innerWidth);

			const gridTop = section.title.y + section.title.height + 3 * unit;
			this.resizeGrid(section.boxes, gridTop, size, gap, unit, true);
			top += gridTop + gridHeight(section.boxes.length);
		}

		const height = top + padding;
		// Keep longer chains and multiple sections inside the available bounds,
		// reserving space above the background for the modal title.
		const scale = Math.min(1, (bounds.height - 12 * unit) / height);
		this.width = width * scale;
		this.height = height * scale;
		this.content.setScale(scale);
		this.content.setPosition(bounds.centerX, bounds.centerY - this.height / 2);

		super.onScreenResize(bounds, unit * scale);
	}

	setCategory(category: ItemCategory) {
		this.chainBoxes.forEach((box) => {
			box.setVisible(false);
		});

		this.chainLength = itemData[category].length;
		itemData[category].forEach((item, index) => {
			if (!this.chainBoxes[index]) {
				const box = this.createPreview(true);
				this.chainBoxes.push(box);
				this.content.add(box);
			}
			const box = this.chainBoxes[index];
			box.setImage(item);
			box.setTier(index + 1);
			box.setExplored(gameState.isDiscovered(category, index + 1));
		});

		this.sections.forEach((section) => section.container.destroy());
		this.sections = [];

		for (const details of itemCategoryDetails[category] ?? []) {
			if (details.categories.length === 0) {
				continue;
			}

			const container = this.scene.add.container(0, 0);
			this.content.add(container);
			const title = this.scene.createText(
				0,
				0,
				40,
				this.scene.weights.bold,
				"#000",
				details.title,
			);
			title.setOrigin(0.5, 0);
			container.add(title);

			const boxes = details.categories.map((relatedCategory) => {
				const items = itemData[relatedCategory];
				let tier = items.length;
				while (tier > 1 && !gameState.isDiscovered(relatedCategory, tier)) {
					tier--;
				}

				const box = this.createPreview();
				box.setImage(items[tier - 1]);
				box.setTier(tier);
				box.setExplored(gameState.isDiscovered(relatedCategory, tier));
				box.on("click", () => {
					if (this.isOpen) {
						this.setCategory(relatedCategory);
					}
				});
				container.add(box);
				return box;
			});
			this.sections.push({ container, title, boxes });
		}

		this.title.setText(category.charAt(0).toUpperCase() + category.slice(1));
		if (this.layoutBounds) {
			this.onScreenResize(this.layoutBounds, this.layoutUnit);
		}
	}

	private createPreview(showTier = false): InfoItemPreview {
		return new InfoItemPreview(
			this.scene,
			0,
			0,
			100,
			6,
			COLOR.BUTTON,
			showTier,
		);
	}

	private resizeGrid(
		boxes: InfoItemPreview[],
		top: number,
		size: number,
		gap: number,
		unit: number,
		centerRows = false,
	) {
		boxes.forEach((box, i) => {
			const col = i % COLUMNS;
			const row = Math.floor(i / COLUMNS);
			const columns = centerRows
				? Math.min(COLUMNS, boxes.length - row * COLUMNS)
				: COLUMNS;
			const rowWidth = columns * size + (columns - 1) * gap;
			box.x = -rowWidth / 2 + (col + 0.5) * size + col * gap;
			box.y = top + (row + 0.5) * size + row * gap;
			box.resize(size, unit);
		});
	}
}
