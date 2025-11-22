import { GameScene } from "../scenes/GameScene";

export class SunEffect extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private sun1: Phaser.GameObjects.Image;
	private sun2: Phaser.GameObjects.Image;
	private sun3: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene);
		this.scene.add.existing(this);

		this.sun1 = scene.add.image(0, 0, "sun");
		this.sun1.setAlpha(0.7);
		this.sun1.setScale(0.6);
		this.sun1.setBlendMode(Phaser.BlendModes.ADD);
		this.add(this.sun1);

		this.sun2 = scene.add.image(0, 0, "sun");
		this.sun2.setAlpha(0.7);
		this.sun2.setScale(0.8);
		this.sun2.setBlendMode(Phaser.BlendModes.ADD);
		this.add(this.sun2);

		this.sun3 = scene.add.image(0, 0, "sun");
		this.sun3.setAlpha(0.7);
		this.sun3.setScale(-1.0);
		this.sun3.setBlendMode(Phaser.BlendModes.ADD);
		this.add(this.sun3);
	}

	update(time: number, delta: number) {
		const k = 0.003;
		this.sun1.setAngle(2.134 * k * time);
		this.sun2.setAngle(-3.392 * k * time);
		this.sun3.setAngle(4.548 * k * time);
	}
}
