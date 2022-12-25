import "phaser";
import { PreloadScene } from "./scripts/scenes/PreloadScene";
import { GameScene } from "./scripts/scenes/GameScene";
import { UIScene } from "./scripts/scenes/UIScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1920,
	height: 1080,
	// pixelArt: true,
	scale: {
		mode: Phaser.Scale.FIT
	},
	scene: [
		PreloadScene,
		GameScene,
		UIScene
	],
	plugins: {
		global: [
		]
	}
};

const game = new Phaser.Game(config);