import "phaser";
import { PreloadScene } from "./scripts/scenes/PreloadScene";
import { GameScene } from "./scripts/scenes/GameScene";
import { UIScene } from "./scripts/scenes/UIScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 128,
	height: 128,
	mipmapFilter: 'LINEAR_MIPMAP_LINEAR',

	scale: {
		mode: Phaser.Scale.FIT,
		resizeInterval: 1000,
	},

	scene: [
		PreloadScene,
		GameScene,
		UIScene
	],
};

const game = new Phaser.Game(config);