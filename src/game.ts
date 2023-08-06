import "phaser";
import { PreloadScene } from "./scripts/scenes/PreloadScene";
import { GameScene } from "./scripts/scenes/GameScene";
import { UIScene } from "./scripts/scenes/UIScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 480,
	height: 640,
	// pixelArt: true,
	// roundPixels: true,
	// antialias: true,
	// antialiasGL: true,
	mipmapFilter: 'LINEAR_MIPMAP_LINEAR',

	scale: {
		mode: Phaser.Scale.FIT,
		// zoom: 0.5,
		// min: {
			// width: 200,
			// height: 400
		// },
		resizeInterval: 1000,
		// max: {
			// width: 1600,
			// height: 1200
		// },
	},
	// width: '100%',
	// height: '100%',

	scene: [
		PreloadScene,
		GameScene,
		UIScene
	],
	plugins: {
		global: []
	}
};

const game = new Phaser.Game(config);