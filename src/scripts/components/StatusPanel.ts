import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";
import { RoundRectangle } from "./RoundRectangle";
import { ExperienceBar } from "./ExperienceBar";
import { WideButton } from "./WideButton";
import { capitalize } from "../utils";
import { COLOR } from "../constants";

export class StatusPanel extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: RoundRectangle;

	private experienceBar: ExperienceBar;
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

		this.settingsButton = new Button(this.scene, 0, 0);
		this.add(this.settingsButton);
		this.settingsButtonIcon = this.scene.add.image(0, 0, "settings");
		this.settingsButtonIcon.setTint(COLOR.BORDER);
		this.settingsButton.add(this.settingsButtonIcon);
		this.settingsButton.makeInteractive(this.settingsButtonIcon);
		this.settingsButton.on("click", () => {
			this.emit("settings");
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

		// Resize settings button
		const buttonSize = 5*unit;
		this.settingsButton.x = this.width/2 - buttonSize;
		this.settingsButton.y = 0;
		this.settingsButtonIcon.setScale(buttonSize / this.settingsButtonIcon.width);

		const w = this.settingsButtonIcon.width;
		this.settingsButtonIcon.input?.hitArea.setTo(-w/2, -w/2, w*2, w*2);
	}


	update(time, delta) {
		this.experienceBar.update(time, delta);
		this.settingsButton.setScale(1.0 - 0.1 * this.settingsButton.holdSmooth);
	}

	updateExperience(level: number, experience: number, requirement: number) {
		this.experienceBar.setText(level, experience, requirement);
	}
}