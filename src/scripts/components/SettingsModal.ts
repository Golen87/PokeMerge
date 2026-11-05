import { GameScene } from "../scenes/GameScene";
import { gameState, QUALITY_SCALES } from "../GameState";
import { Modal } from "./Modal";
import { COLOR } from "../constants";

import { WideButton } from "./WideButton";
import { ToggleSlider } from "./ToggleSlider";

const PADDING = 2; // Multi-line text gets cut off. Padding solves this visual bug.

export class SettingsModal extends Modal {
	private hintLabel: Phaser.GameObjects.Text;
	private hintDescription: Phaser.GameObjects.Text;
	private hintToggle: ToggleSlider;

	private qualityLabel: Phaser.GameObjects.Text;
	private qualityDescription: Phaser.GameObjects.Text;
	private qualityButton: WideButton;

	private mapBlurLabel: Phaser.GameObjects.Text;
	private mapBlurDescription: Phaser.GameObjects.Text;
	private mapBlurToggle: ToggleSlider;

	private resetLabel: Phaser.GameObjects.Text;
	private resetDescription: Phaser.GameObjects.Text;
	private resetButton: WideButton;

	private updateQueue: Phaser.GameObjects.GameObject[];

	constructor(scene: GameScene) {
		super(scene);


		// Modal title

		this.title.setText("Options");


		// Hints setting

		this.hintLabel = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Show hints");
		this.hintLabel.setOrigin(0, 1);
		this.add(this.hintLabel);

		this.hintDescription = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Show a visual cue for matching items");
		this.hintDescription.setOrigin(0, 0);
		this.add(this.hintDescription);

		this.hintToggle = new ToggleSlider(this.scene, 0, 0, 20, 10, 14);
		this.hintToggle.on("onChange", (value: number) => {
			gameState.setOptions({ hintToggle: value > 0.5 ? 1 : 0 });
		});
		this.add(this.hintToggle);


		// Quality setting

		this.qualityLabel = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Resolution");
		this.qualityLabel.setOrigin(0, 1);
		this.add(this.qualityLabel);

		this.qualityDescription = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Anti-aliasing quality. A lower resolution may improve performance.");
		this.qualityDescription.setOrigin(0, 0);
		this.add(this.qualityDescription);

		this.qualityButton = new WideButton(this.scene, 0, 0, 100, 10, "Quality", COLOR.BUTTON);
		this.qualityButton.on("click", () => {
			gameState.setOptions({
				qualityIndex: (gameState.options.qualityIndex + 1) % QUALITY_SCALES.length
			});
		});
		this.add(this.qualityButton);


		// Map blur setting

		this.mapBlurLabel = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Fancy background");
		this.mapBlurLabel.setOrigin(0, 1);
		this.add(this.mapBlurLabel);

		this.mapBlurDescription = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Display blurry map behind grid. Disable to improve performance.");
		this.mapBlurDescription.setOrigin(0, 0);
		this.add(this.mapBlurDescription);

		this.mapBlurToggle = new ToggleSlider(this.scene, 0, 0, 20, 10, 14);
		this.mapBlurToggle.on("onChange", (value: number) => {
			gameState.setOptions({ mapBlurToggle: value > 0.5 ? 1 : 0 });
		});
		this.add(this.mapBlurToggle);


		// Reset button

		this.resetLabel = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Reset game");
		this.resetLabel.setOrigin(0, 1);
		this.add(this.resetLabel);

		this.resetDescription = this.scene.createText(0, 0, 40, this.scene.weights.bold, "#000",
			"Erase your current progress and restart the game from the beginning");
		this.resetDescription.setOrigin(0, 0);
		this.add(this.resetDescription);

		this.resetButton = new WideButton(this.scene, 0, 0, 100, 10, "Reset", COLOR.BUTTON);
		this.resetButton.on("click", () => { this.emit("reset"); });
		this.add(this.resetButton);


		// Components

		this.updateQueue = [
			this.hintToggle,
			this.qualityButton,
			this.mapBlurToggle,
			this.resetButton,
		];

		gameState.on("optionsChanged", this.updateOptions, this);
		this.updateOptions();
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number) {
		this.width = bounds.width - 4*unit;
		this.height = 104*unit;
		super.onScreenResize(bounds, unit);

		const inner = new Phaser.Geom.Rectangle(
			bounds.centerX - this.width/2 + 8*unit,
			bounds.centerY - this.height/2 + 16*unit,
			this.width - 16*unit,
			this.height - 32*unit
		);
		const separation = 22*unit;
		const buttonWidth = 13*unit;
		const buttonHeight = 6*unit;
		const largeFont = 5*unit;
		const smallFont = 2.75*unit;
		const textSep = 1*unit;
		const textWidth = inner.width - buttonWidth - 4*unit;

		let y = inner.centerY - 1.5*separation;


		// Resize hints setting

		this.hintLabel.x = inner.left;
		this.hintLabel.y = y - textSep;
		this.hintLabel.setFontSize(largeFont);

		this.hintDescription.x = inner.left - PADDING;
		this.hintDescription.y = y + textSep - PADDING;
		this.hintDescription.setFontSize(smallFont);
		this.hintDescription.setWordWrapWidth(textWidth);
		this.hintDescription.setLineSpacing(1.5*unit);
		this.hintDescription.setPadding(PADDING);

		this.hintToggle.resize(buttonWidth-buttonHeight, 4*unit, buttonHeight);
		this.hintToggle.x = inner.right - this.hintToggle.width/2;
		this.hintToggle.y = y;

		y += separation;


		// Resize quality setting

		this.qualityLabel.x = inner.left;
		this.qualityLabel.y = y - textSep;
		this.qualityLabel.setFontSize(largeFont);

		this.qualityDescription.x = inner.left - PADDING;
		this.qualityDescription.y = y + textSep - PADDING;
		this.qualityDescription.setFontSize(smallFont);
		this.qualityDescription.setWordWrapWidth(textWidth);
		this.qualityDescription.setLineSpacing(1.5*unit);
		this.qualityDescription.setPadding(PADDING);

		this.qualityButton.resize(buttonWidth, buttonHeight);
		this.qualityButton.x = inner.right - this.qualityButton.width/2;
		this.qualityButton.y = y;

		y += separation;


		// Resize map blur setting

		this.mapBlurLabel.x = inner.left;
		this.mapBlurLabel.y = y - textSep;
		this.mapBlurLabel.setFontSize(largeFont);

		this.mapBlurDescription.x = inner.left - PADDING;
		this.mapBlurDescription.y = y + textSep - PADDING;
		this.mapBlurDescription.setFontSize(smallFont);
		this.mapBlurDescription.setWordWrapWidth(textWidth);
		this.mapBlurDescription.setLineSpacing(1.5*unit);
		this.mapBlurDescription.setPadding(PADDING);

		this.mapBlurToggle.resize(buttonWidth-buttonHeight, 4*unit, buttonHeight);
		this.mapBlurToggle.x = inner.right - this.mapBlurToggle.width/2;
		this.mapBlurToggle.y = y;

		y += separation;


		// Resize reset button

		this.resetLabel.x = inner.left;
		this.resetLabel.y = y - textSep;
		this.resetLabel.setFontSize(largeFont);

		this.resetDescription.x = inner.left - PADDING;
		this.resetDescription.y = y + textSep - PADDING;
		this.resetDescription.setFontSize(smallFont);
		this.resetDescription.setWordWrapWidth(textWidth);
		this.resetDescription.setLineSpacing(1.5*unit);
		this.resetDescription.setPadding(PADDING);

		this.resetButton.resize(buttonWidth, buttonHeight);
		this.resetButton.x = inner.right - this.resetButton.width/2;
		this.resetButton.y = y;
	}

	update(time: number, delta: number): void {
		super.update(time, delta);

		this.updateQueue.forEach(component => {
			component.update(time, delta);
		});
	}


	open() {
		super.open();
	}

	close() {
		super.close();
	}


	private updateOptions() {
		this.qualityButton.setText(`x${gameState.qualityScale}`);
		this.hintToggle.value = gameState.options.hintToggle;
		this.mapBlurToggle.value = gameState.options.mapBlurToggle;
	}
}
