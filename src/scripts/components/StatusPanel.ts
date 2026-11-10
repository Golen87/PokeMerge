import { GameScene } from "../scenes/GameScene";
import { gameState, getExperienceRequirement } from "../GameState";
import type { CollectionResource } from "../GameState";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { ExperienceBar } from "./ExperienceBar";
import { COLOR } from "../constants";
import { pulseText } from "../utils";

export class StatusPanel extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: RoundRectangle;

	private experienceBar: ExperienceBar;
	private goldIcon: Phaser.GameObjects.Image;
	private goldText: Phaser.GameObjects.Text;
	private goldTextMaxWidth = Infinity;
	private settingsButton: Button;
	private settingsButtonIcon: Phaser.GameObjects.Image;

	private targetGold = 0;
	private softGold = 0;
	private targetLevel = 1;
	private targetExperience = 0;
	private softLevel = 1;
	private softExperience = 0;
	private pendingCollections: Record<CollectionResource, number> = { gold: 0, experience: 0 };


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
			this.scene.tweens.killTweensOf(this.goldText);
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
		this.scene.tweens.killTweensOf(this.goldText);
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

	// Reserve the visual increment before GameScene commits the real reward.
	deferCollection(resource: CollectionResource, amount: number) {
		this.pendingCollections[resource] += amount;
	}

	collectParticle(resource: CollectionResource) {
		if (this.pendingCollections[resource] <= 0) { return; }
		this.pendingCollections[resource]--;
		if (resource == "gold") {
			this.updateGold();
			pulseText(this.goldText, this.goldText.scaleX);
		} else {
			this.updateExperience();
			this.experienceBar.animateIncrement();
		}
	}

	getCollectionTarget(resource: CollectionResource): Phaser.Types.Math.Vector2Like {
		const target = resource == "gold" ? this.goldIcon : this.experienceBar;
		return target.getWorldTransformMatrix().transformPoint(0, 0);
	}

	clearCollections() {
		this.pendingCollections.gold = 0;
		this.pendingCollections.experience = 0;
		this.scene.tweens.killTweensOf(this.goldText);
		this.updateGold();
		this.updateExperience();
	}

	private updateExperience() {
		this.targetLevel = gameState.level;
		this.targetExperience = gameState.experience;
		this.softLevel = this.targetLevel;
		this.softExperience = this.targetExperience - this.pendingCollections.experience;
		// Undo level-ups covered by XP that is still in flight.
		while (this.softExperience < 0 && this.softLevel > 1) {
			this.softLevel--;
			this.softExperience += getExperienceRequirement(this.softLevel);
		}
		this.experienceBar.setText(
			this.softLevel,
			this.softExperience,
			getExperienceRequirement(this.softLevel)
		);
	}

	private updateGold() {
		this.targetGold = gameState.gold;
		this.softGold = this.targetGold - this.pendingCollections.gold;
		this.goldText.setText(`${this.softGold}`);
		this.goldText.setScale(Math.min(1, this.goldTextMaxWidth / this.goldText.width));
	}
}
