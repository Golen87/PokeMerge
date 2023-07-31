import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { Item } from "./Item";
import { RoundRectangle } from "./RoundRectangle";
import { InfoItemPreview } from "./InfoItemPreview";
import { WideButton } from "./WideButton";
import { capitalize } from "../utils";
import { COLOR } from "../constants";

export class ItemInfoPanel extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public selected?: Item;
	public prevTier?: number;

	private background: RoundRectangle;
	private itemName: Phaser.GameObjects.Text;
	private itemDesc: Phaser.GameObjects.Text;
	private emptyText: Phaser.GameObjects.Text;

	private preview_left: InfoItemPreview;
	private preview_center: InfoItemPreview;
	private preview_right: InfoItemPreview;
	private arrow: Phaser.GameObjects.Image;

	private sellButton: WideButton;
	private rechargeButton: WideButton;

	private discovered: Set<string>;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.width = this.scene.W;
		this.height = 0.15 * this.scene.H;

		this.background = new RoundRectangle(this.scene, 0, 0, 100, 100, 25, COLOR.PANEL);
		this.add(this.background);


		this.itemName = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000", "Name");
		this.add(this.itemName);

		this.itemDesc = this.scene.createText(0, 0, 30, this.scene.weights.regular, "#000", "Desc");
		this.add(this.itemDesc);

		this.emptyText = this.scene.createText(0, 0, 30, this.scene.weights.regular, "#000", `Select an item to see more information!`);
		this.add(this.emptyText);


		// Preview for item -> item

		this.preview_left = new InfoItemPreview(this.scene, 0, 0, 100, 25, COLOR.BUTTON);
		this.preview_center = new InfoItemPreview(this.scene, 0, 0, 100, 25, COLOR.BUTTON);
		this.preview_right = new InfoItemPreview(this.scene, 0, 0, 100, 25, COLOR.BUTTON);
		this.preview_left.setVisible(false);
		this.preview_center.setVisible(false);
		this.preview_right.setVisible(false);
		this.add(this.preview_left);
		this.add(this.preview_center);
		this.add(this.preview_right);

		this.arrow = this.scene.add.image(0, 0, "arrow");
		this.arrow.setTint(COLOR.BUTTON);
		this.add(this.arrow);


		this.sellButton = new WideButton(this.scene, 0, 0, 100, 100, "Trash", COLOR.DANGER);
		this.add(this.sellButton);
		this.sellButton.on("click", () => {
			this.emit("sell");
		}, this);


		this.rechargeButton = new WideButton(this.scene, 0, 0, 100, 100, "Recharge", COLOR.SUCCESS);
		this.add(this.rechargeButton);
		this.rechargeButton.on("click", () => {
			this.emit("recharge");
		}, this);


		this.discovered = new Set();

		this.updateInfo();
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number, isVertical: boolean) {
		this.x = bounds.centerX;
		this.y = bounds.centerY;
		this.width = bounds.width - 2*unit;
		this.height = bounds.height - 2*unit;

		const inner = new Phaser.Geom.Rectangle(
			-this.width/2 + 2*unit,
			-this.height/2 + 2*unit,
			this.width - 4*unit,
			this.height - 4*unit
		);


		// Resize background
		this.background.setRadius(3*unit);
		this.background.setWidth(this.width);
		this.background.setHeight(this.height);


		this.itemName.x = inner.left;
		this.itemName.y = inner.top;
		this.itemName.setFontSize(3.4*unit);

		this.itemDesc.x = inner.left;
		this.itemDesc.y = this.itemName.y + 5.5*unit;
		this.itemDesc.setFontSize(2.45*unit);
		this.itemDesc.setWordWrapWidth(isVertical ? 0.65*inner.width : inner.width, true);
		this.itemDesc.setLineSpacing(1.5*unit);

		this.emptyText.x = inner.left;
		this.emptyText.y = this.itemName.y + 5.5*unit;
		this.emptyText.setFontSize(2.45*unit);
		this.emptyText.setWordWrapWidth(isVertical ? 0.65*inner.width : inner.width, true);
		this.emptyText.setLineSpacing(1.5*unit);
		// this.emptyText.setFixedSize(20*unit, 2*unit);


		// Sell and recharge buttons

		const sellWidth = 9*unit;
		const sellHeight = 3.5*unit;

		this.sellButton.x = inner.right - sellWidth/2;
		this.sellButton.y = inner.bottom - sellHeight/2;
		this.sellButton.resize(sellWidth, sellHeight);


		const rechargeWidth = 12*unit;
		const rechargeHeight = 3.5*unit;

		this.rechargeButton.x = inner.right - sellWidth - 2*unit - rechargeWidth/2;
		this.rechargeButton.y = inner.bottom - rechargeHeight/2;
		this.rechargeButton.resize(rechargeWidth, rechargeHeight);


		// Preview for item -> item

		const previewSize = isVertical ?
			new Phaser.Structs.Size(
				23*unit,
				inner.height - sellHeight-2*unit) :
			new Phaser.Structs.Size(
				24*unit,
				9*unit);

		const preview = isVertical ?
			new Phaser.Geom.Rectangle(
				inner.width/2 - previewSize.width,
				-inner.height/2,
				previewSize.width,
				previewSize.height
			) :
			new Phaser.Geom.Rectangle(
				-inner.width/2,
				inner.height/2 - previewSize.height,
				previewSize.width,
				previewSize.height
			);

		this.preview_left.x = preview.left + preview.height/2;
		this.preview_left.y = preview.centerY;
		this.preview_left.resize(preview.height, unit);

		this.preview_center.x = preview.centerX;
		this.preview_center.y = preview.centerY;
		this.preview_center.resize(preview.height, unit);

		this.preview_right.x = preview.right - preview.height/2;
		this.preview_right.y = preview.centerY;
		this.preview_right.resize(preview.height, unit);

		this.arrow.x = preview.centerX;
		this.arrow.y = preview.centerY;
		this.arrow.setScale(0.7 * preview.height / this.arrow.width);
	}


	update(time, delta) {
		this.sellButton.update(time, delta);
		this.rechargeButton.update(time, delta);
	}


	setSelected(item: Item | undefined) {
		if (this.selected != item || (this.selected && this.selected.tier != this.prevTier)) {
			this.selected = item;
			if (item && item.imageKey) {
				this.discovered.add(item.imageKey);
			}
			this.updateInfo();
		}
	}

	updateInfo() {
		// Reset
		this.itemName.setText("No selection");
		this.emptyText.setVisible(true);
		this.itemDesc.setText("");
		this.preview_left.setVisible(false);
		this.preview_center.setVisible(false);
		this.preview_right.setVisible(false);
		this.arrow.setVisible(false);
		this.sellButton.enabled = false;
		this.rechargeButton.enabled = false;

		// Fill in selected data
		if (this.selected) {

			this.itemName.setText(this.selected.itemData.name);
			this.emptyText.setVisible(false);
			this.rechargeButton.enabled = this.selected.chargeBlock;

			if (!this.selected.isGenerator) {
				this.sellButton.enabled = !this.selected.blocked;
			}

			let next = this.selected.nextTier;
			if (next) {
				this.preview_left.setVisible(true);
				this.preview_left.setImage(this.selected.itemData);
				this.preview_left.setTier(this.selected.tier);
				this.preview_right.setVisible(true);
				this.preview_right.setImage(next);
				this.preview_right.setTier(this.selected.tier + 1);
				this.preview_right.setExplored(this.discovered.has(next.key));
				this.arrow.setVisible(true);
			}
			else {
				this.preview_center.setVisible(true);
				this.preview_center.setImage(this.selected.itemData);
				this.preview_center.setTier(this.selected.tier);
			}

			if (this.selected.category == "experience") {
				let points = [1, 3, 8, 20, 50][this.selected.tier-1];
				if (next) {
					this.itemDesc.setText(`Merge this item to the next rank or tap to collect ${points} Experience.`);
				}
				else {
					this.itemDesc.setText(`Tap to collect ${points} Experience. This item is at max rank.`);
				}
			}
			else if (next) {
				this.itemDesc.setText(`Merge to create ${next.name}!`);
			}
			else {
				this.itemDesc.setText("This item is at max level and can no longer be merged.");
			}

			this.prevTier = this.selected.tier;
		}
	}

	updateItem(item: Item) {
		if (item == this.selected) {
			this.rechargeButton.enabled = this.selected.chargeBlock;
		}
	}
}