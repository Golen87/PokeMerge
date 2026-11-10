import { DEPTH } from "../../constants";
import type { CollectionResource } from "../../GameState";

const COLLECTION_TEXTURES: Record<CollectionResource, string> = {
	gold: "coin_spin",
	experience: "experience_spin",
};

interface CollectionParticle {
	sprite: Phaser.GameObjects.Sprite;
	tween: Phaser.Tweens.Tween;
	size: number;
}

export class ParticleManager extends Phaser.Events.EventEmitter {
	private scene: Phaser.Scene;
	private particles = new Set<CollectionParticle>();
	private particleSize;
	private burstRadius;

	constructor(scene: Phaser.Scene) {
		super();
		this.scene = scene;

		for (const texture of Object.values(COLLECTION_TEXTURES)) {
			if (!scene.anims.exists(texture)) {
				scene.anims.create({
					key: texture,
					frames: scene.anims.generateFrameNumbers(texture),
					frameRate: 24,
					repeat: -1,
				});
			}
		}
	}

	onScreenResize(cellSize: number) {
		this.particleSize = 0.4 * cellSize;
		this.burstRadius = 1.0 * cellSize;
		for (const particle of this.particles) {
			const size = this.particleSize * particle.size;
			particle.sprite.setDisplaySize(size, size);
		}
	}

	spawnCollectParticles(
		resource: CollectionResource,
		count: number,
		position: Phaser.Types.Math.Vector2Like,
		getTarget: () => Phaser.Types.Math.Vector2Like,
		onArrival: () => void,
	) {
		const texture = COLLECTION_TEXTURES[resource];
		const originX = position.x / this.scene.scale.width;
		const originY = position.y / this.scene.scale.height;

		for (let i = 0; i < count; i++) {
			const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
			const radius = this.burstRadius * Phaser.Math.FloatBetween(0.5, 1.5);
			const burstX = originX + (Math.cos(angle) * radius) / this.scene.scale.width;
			const burstY = originY + (Math.sin(angle) * radius) / this.scene.scale.height;
			const burstDuration = Phaser.Math.FloatBetween(0.3, 0.5);
			const size = Phaser.Math.FloatBetween(1, 1.25);

			const sprite = this.scene.add.sprite(position.x, position.y, texture);
			sprite.setDepth(DEPTH.EFFECTS);
			sprite.setDisplaySize(this.particleSize * size, this.particleSize * size);
			sprite.setAlpha(0);
			sprite.play({ key: texture, randomFrame: true });

			const motion = { progress: 0 };
			const particle: CollectionParticle = {
				sprite,
				size,
				tween: this.scene.tweens.add({
					targets: motion,
					progress: 1,
					duration: Phaser.Math.Between(900, 1600),
					ease: "Linear",
					onUpdate: () => {
						const progress = motion.progress;
						const width = this.scene.scale.width;
						const height = this.scene.scale.height;
						// Let the target pull build while the outward burst slows down.
						const burst = Phaser.Math.Easing.Sine.Out(
							Math.min(1, progress / burstDuration),
						);
						const flight = Phaser.Math.Easing.Expo.In(progress);
						const x = Phaser.Math.Linear(originX, burstX, burst) * width;
						const y = Phaser.Math.Linear(originY, burstY, burst) * height;
						const target = getTarget();
						sprite.setPosition(
							Phaser.Math.Linear(x, target.x, flight),
							Phaser.Math.Linear(y, target.y, flight),
						);
						sprite.setAlpha(
							Math.min(1, progress / 0.05, (1 - progress) / 0.05),
						);
					},
					onComplete: () => {
						this.particles.delete(particle);
						sprite.destroy();
						onArrival();
					},
				}),
			};
			this.particles.add(particle);
		}
	}

	clear() {
		for (const particle of this.particles) {
			particle.tween.remove();
			particle.sprite.destroy();
		}
		this.particles.clear();
	}

	destroy() {
		this.clear();
		super.destroy();
	}
}
