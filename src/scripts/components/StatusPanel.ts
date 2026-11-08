import { GameScene } from "../scenes/GameScene";
import { gameState } from "../GameState";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { ExperienceBar } from "./ExperienceBar";
import { COLOR } from "../constants";

export class StatusPanel extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: RoundRectangle;

	private experienceBar: ExperienceBar;
	private goldIcon: Phaser.GameObjects.Image;
	private goldText: Phaser.GameObjects.Text;
	private goldTextMaxWidth = Infinity;
	private settingsButton: Button;
	private settingsButtonIcon: Phaser.GameObjects.Image;


	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);


		this.background = new RoundRectangle(this.scene, 0, 0, 100, 100, 25, COLOR.PANEL);
		this.background.setVisible(false);
		this.add(this.background);

		this.experienceBar = new ExperienceBar(this.scene, 0, 0, 100, 100);
		this.add(this.experienceBar);

		this.goldIcon = this.scene.add.image(0, 0, "coin_spin", 5);
		this.add(this.goldIcon);
		this.goldText = this.scene.createText(0, 0, 20, this.scene.weights.bold, "#000");
		this.goldText.setOrigin(0, 0.5);
		this.add(this.goldText);

		this.settingsButton = new Button(this.scene, 0, 0);
		this.add(this.settingsButton);
		this.settingsButtonIcon = this.scene.add.image(0, 0, "settings");
		this.settingsButtonIcon.setTint(COLOR.CELL);
		this.settingsButton.add(this.settingsButtonIcon);
		this.settingsButton.makeInteractive(this.settingsButtonIcon);
		this.settingsButton.on("click", () => {
			this.emit("settings");
		});

		gameState.on("experienceChanged", this.updateExperience, this);
		gameState.on("goldChanged", this.updateGold, this);
		this.updateExperience();
		this.updateGold();
		this.once(Phaser.GameObjects.Events.DESTROY, () => {
			gameState.off("experienceChanged", this.updateExperience, this);
			gameState.off("goldChanged", this.updateGold, this);
		});
	}

	onScreenResize(bounds: Phaser.Geom.Rectangle, unit: number) {
		const padding = 2*unit;
		this.x = bounds.centerX;
		this.y = bounds.centerY;
		this.width = bounds.width - 2*unit;
		this.height = bounds.height - 2*unit;

		// Resize background
		this.background.setRadius(3*unit);
		this.background.setWidth(this.width);
		this.background.setHeight(this.height);

		// Resize experience
		const experienceWidth = this.width/2;
		const experienceHeight = 3*unit;
		// this.experienceBar.x = -experienceWidth/2 + unit;
		this.experienceBar.x = 0;
		this.experienceBar.y = 0;
		this.experienceBar.resize(experienceWidth, experienceHeight, unit);

		// Resize gold counter
		const goldSize = 6*unit;
		this.goldIcon.setPosition(-this.width/2 + padding + goldSize/2, 0);
		this.goldIcon.setDisplaySize(goldSize, goldSize);
		this.goldText.setPosition(this.goldIcon.x + goldSize/2 + unit, 0);
		this.goldText.setFontSize(3.4*unit);
		this.goldText.setStroke("#FFF", unit/2);
		this.goldTextMaxWidth = -experienceWidth/2 - padding - this.goldText.x;
		this.updateGold();

		// Resize settings button
		const buttonSize = 5*unit;
		this.settingsButton.x = this.width/2 - buttonSize;
		this.settingsButton.y = 0;
		this.settingsButtonIcon.setScale(buttonSize / this.settingsButtonIcon.width);

		const w = this.settingsButtonIcon.width;
		this.settingsButtonIcon.input!.hitArea.setTo(-w/2, -w/2, w*2, w*2);
	}


	update(time, delta) {
		this.experienceBar.update(time, delta);
		this.settingsButton.setScale(1.0 - 0.1 * this.settingsButton.holdSmooth);
	}

	private updateExperience() {
		this.experienceBar.setText(
			gameState.level,
			gameState.experience,
			gameState.experienceRequirement
		);
	}

	private updateGold() {
		this.goldText.setText(`${gameState.gold}`);
		this.goldText.setScale(Math.min(1, this.goldTextMaxWidth / this.goldText.width));
	}
}
