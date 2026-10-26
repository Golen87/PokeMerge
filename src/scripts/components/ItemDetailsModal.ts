import { GameScene } from "../scenes/GameScene";
import { Modal } from "./Modal";
import { RoundRectangle } from "./RoundRectangle";
import { InfoItemPreview } from "./InfoItemPreview";
import { itemData } from "../items";
import { COLOR } from "../constants";

export class ItemDetailsModal extends Modal {
	private chainBoxes: InfoItemPreview[];
	private selectedCategory: string | null;
	private discovered: Set<string>;

	constructor(scene: GameScene) {
		super(scene);

		this.chainBoxes = [];
		this.selectedCategory = null;
		this.discovered = new Set();

		// Create 4x4 grid of item boxes (max 16 items)
		for (let i = 0; i < 16; i++) {
			let chainBox = new InfoItemPreview(
				this.scene,
				0,
				0,
				100,
				6,
				COLOR.BUTTON,
			);
			chainBox.setVisible(false);
			this.chainBoxes.push(chainBox);
			this.add(chainBox);
		}
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number) {
		this.width = bounds.width - 4 * unit;
		this.height = this.width;

		const inner = new Phaser.Geom.Rectangle(
			bounds.centerX - this.width / 2 + 8 * unit,
			bounds.centerY - this.height / 2 + 8 * unit,
			this.width - 16 * unit,
			this.height - 16 * unit,
		);

		const gap = 6 * unit;
		const size = (inner.width - gap * 3) / 4;

		this.chainBoxes.forEach((box, i) => {
			const col = i % 4;
			const row = Math.floor(i / 4);
			const x = inner.left + (col + 0.5) * size + col * gap;
			const y = inner.top + (row + 0.5) * size + row * gap;
			box.x = x;
			box.y = y;
			box.resize(size, unit);
		});

		super.onScreenResize(bounds, unit);
	}

	update(time: number, delta: number): void {
		super.update(time, delta);

		this.chainBoxes.forEach((chainBox: InfoItemPreview) => {
			chainBox.update(time, delta);
		});
	}

	open() {
		super.open();
	}

	close() {
		super.close();
	}

	setCategory(category: string) {
		this.selectedCategory = category;

		// Hide all boxes first
		this.chainBoxes.forEach((box) => {
			box.setVisible(false);
		});

		// Show and populate visible boxes
		if (itemData[category]) {
			itemData[category].forEach((item, index) => {
				if (index < this.chainBoxes.length) {
					const box = this.chainBoxes[index];
					box.setVisible(true);
					box.setImage(item);
					box.setTier(index + 1);
					box.setExplored(this.discovered.has(item.key));
					box.setExplored(true);
				}
			});
		}

		this.title.setText(category.charAt(0).toUpperCase() + category.slice(1));
	}

	addDiscovered(itemKey: string) {
		this.discovered.add(itemKey);
		// Update visual for this item if currently displayed
		this.chainBoxes.forEach((box) => {
			if (box.visible) {
				// Re-check explored status for visible boxes
				const category = this.selectedCategory;
				if (category && itemData[category]) {
					itemData[category].forEach((item, index) => {
						if (item.key === itemKey) {
							box.setExplored(true);
						}
					});
				}
			}
		});
	}
}
