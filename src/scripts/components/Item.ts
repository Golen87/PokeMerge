import { GameScene } from "../scenes/GameScene";
import { itemData } from "../items";
import { GrayScalePostFilter } from "../pipelines/GrayScalePostFilter";

export class Item extends Phaser.GameObjects.Container {
	public scene: GameScene;
	private image: Phaser.GameObjects.Image;
	private grass: Phaser.GameObjects.Image;
	private bolt: Phaser.GameObjects.Image;
	private checkmark: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private hover: boolean;
	private _hold: boolean;
	public liftSmooth: number;
	public holdSmooth: number;
	private holdTween: Phaser.Tweens.Tween;
	private liftTween: Phaser.Tweens.Tween;
	private mergeTween: Phaser.Tweens.Tween;
	private hintTween: Phaser.Tweens.Tween;

	private offset: Phaser.Math.Vector2;
	public goalPos: Phaser.Math.Vector2;
	private stickPos: Phaser.Math.Vector2;
	private isSticky: boolean;
	private clickBlock: boolean;
	private imageScale: number;
	private hintAnimation: number;
	private mergeAnimation: number;
	private wobbleAnimation: number;

	public slot: Phaser.Math.Vector2;
	public category: string;
	public tier: number;
	public cycle: number;
	public charges: number;
	public chargeBlock: boolean;
	public justSpawned: boolean;
	public blocked: boolean;
	public sightBlocked: boolean;

	public rechargeTimer: number;
	private clickTimer: number;

	constructor(scene: GameScene, category: string, tier: number, blocked: boolean) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.hover = false;
		this._hold = false;

		this.liftSmooth = 0;
		this.holdSmooth = 0;

		this.offset = new Phaser.Math.Vector2();
		this.goalPos = new Phaser.Math.Vector2();
		this.stickPos = new Phaser.Math.Vector2();
		this.isSticky = true;
		this.clickBlock = false;

		this.slot = new Phaser.Math.Vector2();
		this.category = category;
		this.tier = tier;
		this.blocked = blocked;
		this.sightBlocked = blocked;
		this.cycle = 0;
		this.charges = 1.45 * 1.6 ** (tier-1);
		this.chargeBlock = false;
		this.justSpawned = true;

		if (this.itemData.charges) {
			this.charges = this.itemData.charges;
		}

		this.rechargeTimer = 0;
		if (this.itemData.recharge) {
			this.rechargeTimer = this.itemData.recharge;
		}

		this.clickTimer = 0;


		// Image
		this.image = scene.add.image(0, 0, "");
		this.add(this.image);

		this.imageScale = 1;
		this.hintAnimation = 1;
		this.mergeAnimation = 1;
		this.wobbleAnimation = 1;

		// Grass
		this.grass = scene.add.image(0, this.scene.CELL_SIZE/2, "grass_1");
		this.grass.setVisible(false);
		// this.grass.setOrigin(0.5, 0.54);
		this.grass.setOrigin(0.5, 1.0);
		this.add(this.grass);

		// Bolt
		this.bolt = scene.add.image(0, 0, "bolt");
		this.bolt.setScale(this.scene.GRID_SIZE / this.bolt.width);
		this.bolt.setTint(0xDDAA00);
		this.bolt.setVisible(false);
		this.bolt.setBlendMode(Phaser.BlendModes.ADD);
		this.add(this.bolt);

		// Checkmark
		this.checkmark = scene.add.image(0.33*this.scene.GRID_SIZE, 0.3*this.scene.GRID_SIZE, "checkmark");
		this.checkmark.setScale(0.7*this.scene.GRID_SIZE / this.checkmark.width);
		this.checkmark.setVisible(true);
		this.add(this.checkmark);

		// Debug
		this.text = scene.createText(-this.scene.GRID_SIZE/2, this.scene.GRID_SIZE/2, this.scene.GRID_SIZE/6, scene.weights.bold, "#000");
		this.text.setOrigin(0, 1);
		this.text.setAlpha(0.3 * 0);
		this.add(this.text);

		this.updateText();
		// this.text.setVisible(false);


		// Interaction delay
		scene.addEvent(230, () => {
			if (this.scene) { // Due to auto-merging doing it too early
				this.makeInteractive();
				this.justSpawned = false;

				if (this.x != this.goalPos.x || this.y != this.goalPos.y) {
					this.startWobbleAnimation();
				}
			}
		}, this);


		this.updateImage();
	}

	onScreenResize(screenWidth: number, screenHeight: number) {
		this.updateImage();
	}


	update(time, delta) {
		this.x += (this.goalPos.x - this.x) / (this.justSpawned ? 6.0 : this.hold ? 1.5 : 3.0);
		this.y += (this.goalPos.y - this.y) / (this.justSpawned ? 6.0 : this.hold ? 1.5 : 3.0);

		let scale = this.imageScale; // Image specific scale
		scale *= this.hintAnimation * this.mergeAnimation; // Animations
		scale *= 1 - 0.08 * this.holdSmooth; // Holding animation
		if (!this.blocked && this.drops && !this.chargeBlock) { // Generator animation
			scale *= 1.0 + 0.03 * Math.sin(6*time/1000) * this.bolt.alpha;
		}
		this.image.setScale(
			scale * this.wobbleAnimation,
			scale * (2-this.wobbleAnimation)
		);

		if (this.isSticky && this.hold) {
			this.x += (this.stickPos.x - this.x) / 1.5;
			this.y += (this.stickPos.y - this.y) / 1.5;

			const minDragDist = 20;
			if (Phaser.Math.Distance.BetweenPoints(this.goalPos, this.stickPos) > minDragDist) {
				this.isSticky = false;
				this.clickBlock = true;

				this.emit("grab");

				this.clearTweens();
				this.liftTween = this.scene.tweens.add({
					targets: this,
					liftSmooth: { from: this.liftSmooth, to: 1 },
					ease: 'Cubic',
					duration: 200
				});
			}
		}

		// Recharging generators
		if (this.itemData.recharge && this.itemData.charges) {
			if (this.charges < 1.5 * this.itemData.charges) { // this.itemData.capacity
				if (this.rechargeTimer < 0) {
					this.charges += 1;
					this.updateText();
					this.rechargeTimer = this.itemData.recharge;
				}
			}
			// TODO: Fix this mess
			if (this.charges > 0.75 * this.itemData.charges) {
				this.chargeBlock = false;
				this.emit("recharged", !!this.itemData.recharge);
			}

			this.image.setTint(this.chargeBlock ? 0x777777 : 0xFFFFFF);

			this.rechargeTimer -= delta/1000;
		}

		// All generators
		if (this.drops && !this.blocked) {
			this.bolt.setVisible(!this.chargeBlock);
			if (this.bolt.visible) {
				this.bolt.setScale(this.scene.GRID_SIZE / this.bolt.width * (0.9 + 0.1 * Math.sin(1*time/1000)));
				this.bolt.setAlpha(2.0 + 2.0*Math.sin(1*time/1000));
			}
		}

		// Auto
		// this.clickTimer += delta/1000;
		// if (this.clickTimer > 4.0/100) {
		// 	this.clickTimer = 0;

		// 	if (this.drops && (!this.chargeBlock || this.isFinal || this.itemData.recharge)) {
		// 		this.emit('click');
		// 		this.emit('click');
		// 	}
		// }
	}

	upgrade(tierInc: number) {
		this.tier += tierInc;
		// this.charges *= 1.75 ** tierInc;
		if (this.itemData.charges) {
			this.charges = this.itemData.charges;
			if (this.itemData.recharge) {
				this.rechargeTimer = this.itemData.recharge;
			}
		}
		this.chargeBlock = false;
		this.updateText();
		this.updateImage();
	}

	updateImage() {
		this.image.setTint(0xFFFFFF);

		this.grass.y = this.scene.CELL_SIZE/2;

		if (this.sightBlocked) {
			// let scale = 1.1;
			// this.image.setTexture("boxes");
			let scale = this.itemData.scale || 1.0;
			this.image.setTexture(this.imageKey);

			this.imageScale = scale * this.scene.GRID_SIZE / this.image.width;
			this.grass.setVisible(true);
			this.grass.setOrigin(0.5, 1.0);
			this.grass.setScale(1.35 * this.scene.CELL_SIZE / this.grass.width);
			this.grass.setAlpha(0.95);
			this.image.setTint(0xBBBBBB);
		}
		else {
			let scale = this.itemData.scale || 1.0;
			this.image.setTexture(this.imageKey);
			this.imageScale = scale * this.scene.GRID_SIZE / this.image.width;

			if (this.blocked) {
				this.grass.setVisible(true);
				this.grass.setOrigin(0.5, 1.0);
				this.grass.setScale(0.95 * this.scene.CELL_SIZE / this.grass.width);
				this.grass.setAlpha(0.45);
				// this.image.setTint(0x999999);
				this.image.setTint(0xBBBBBB);
				this.image.setAlpha(0.85);
			}
			else {
				this.grass.setVisible(false);
			}
		}

		let h = Math.max(this.image.width, this.image.height);
		let origY = 1 - this.image.width / h / 2;
		this.image.setOrigin(0.5, origY);

		if (this.input) {
			this.input.hitArea.setTo(-this.scene.GRID_SIZE/2, -this.scene.GRID_SIZE/2, this.scene.GRID_SIZE, this.scene.GRID_SIZE);
			// this.scene.input.enableDebug(this);
		}
	}

	updateText() {
		this.text.setVisible(this.drops ? true : false);
		this.text.setText(Math.ceil(this.charges).toString());
		// this.text.setText(this.tier.toString());
	}

	place(slot: Phaser.Math.Vector2, pos: Phaser.Math.Vector2, strict: boolean=false) {
		this.slot.copy(slot);
		this.stickPos.copy(pos);
		this.goalPos.copy(pos);
		if (strict) {
			this.x = pos.x;
			this.y = pos.y;
		}

		if (this.blocked) {
			const grassIndex = (2*slot.x + slot.y) % 3;
			const grassKey = ["grass_1", "grass_2", "grass_3"][grassIndex];
			this.grass.setTexture(grassKey);
			this.grass.scaleX *= ((slot.x + 2*slot.y) % 2 == 0) ? 1 : -1;
		}
	}

	openSight() {
		this.sightBlocked = false;
		this.updateImage();
	}

	use() {
		this.cycle = (this.cycle + 1) % this.drops.length;
		this.charges -= 1;
		this.updateText();

		if (this.charges <= 0) {
			this.chargeBlock = true;
			this.emit("depleted", !!this.itemData.recharge);
		}
	}

	recharge() {
		if (this.itemData.charges) {
			this.charges = this.itemData.charges;
			this.emit("recharged");
		}
	}

	startHintAnimation(repeat: number=1) {
		this.clearTweens();

		this.hintTween = this.scene.tweens.add({
			targets: this,
			hintAnimation: { from: 1, to: 1.35 },
			yoyo: true,
			ease: 'Sine.Out',
			duration: 300,
			repeat,
			onComplete: () => {
				if (this.scene) {
					this.hintTween = this.scene.tweens.add({
						targets: this,
						hintAnimation: { from: 1, to: 1.15 },
						yoyo: true,
						ease: 'Sine.Out',
						duration: 200,
						onComplete: () => {
							if (this.scene && repeat == 1) {
								this.hintTween = this.scene.tweens.add({
									targets: this,
									hintAnimation: { from: 1, to: 1.03 },
									yoyo: true,
									ease: 'Sine.Out',
									duration: 100
								});
							}
						}
					});
				}
			}
		});
	}

	startMergeAnimation() {
		this.clearTweens();

		this.mergeTween = this.scene.tweens.add({
			targets: this,
			mergeAnimation: { from: 1, to: 1.25 },
			yoyo: true,
			ease: 'Sine.Out',
			duration: 200,
			onComplete: () => {
				if (this.scene) {
					this.mergeTween = this.scene.tweens.add({
						targets: this,
						mergeAnimation: { from: 1, to: 1.05 },
						yoyo: true,
						ease: 'Sine.Out',
						duration: 120,
					});
				}
			}
		});
	}

	startWobbleAnimation() {
		this.clearTweens();

		this.mergeTween = this.scene.tweens.add({
			targets: this,
			wobbleAnimation: { from: 1, to: 0.92 },
			yoyo: true,
			ease: 'Sine.Out',
			duration: 70,
			onComplete: () => {
				if (this.scene) {
					this.mergeTween = this.scene.tweens.add({
						targets: this,
						wobbleAnimation: { from: 1, to: 1.02 },
						yoyo: true,
						ease: 'Sine.Out',
						duration: 40,
					});
				}
			}
		});
	}

	clearTweens() {
		if (this.mergeTween) {
			this.mergeTween.stop();
			this.mergeAnimation = 1;
		}
		if (this.hintTween) {
			this.hintTween.stop();
			this.hintAnimation = 1;
		}
	}

	showCheckmark(visible: boolean) {
		this.checkmark.setVisible(visible);
	}


	canMerge(other: Item) {
		return this.category == other.category
			&& this.tier == other.tier
			&& !this.isFinal
			&& !this.sightBlocked
			&& !other.sightBlocked;
	}

	get isGenerator() {
		return !!itemData[this.category][itemData[this.category].length-1].recharge;
	}

	get isFinal() {
		return this.tier == itemData[this.category].length;
	}

	get itemData() {
		let d = itemData[this.category][this.tier-1];
		if (d === undefined) {
			console.warn(`Item: Cannot find itemData for (${this.category}:${this.tier})`);
		}
		return d;
	}

	get imageKey() {
		return this.itemData.key;
	}

	get drops() {
		return this.itemData.generates;
	}

	get nextTier() {
		if (!this.isFinal) {
			return itemData[this.category][this.tier];
		}
		return null;
	}

	makeInteractive() {
		this.removeInteractive();
		this.setInteractive({
			useHandCursor: true,
			draggable: true,
			hitArea: new Phaser.Geom.Rectangle(-this.scene.GRID_SIZE/2, -this.scene.GRID_SIZE/2, this.scene.GRID_SIZE, this.scene.GRID_SIZE),
			hitAreaCallback: Phaser.Geom.Rectangle.Contains
		})
			.on('pointerout', this.onOut, this)
			.on('pointerover', this.onOver, this)
			.on('pointerdown', this.onDown, this)
			.on('pointerup', this.onUp, this)
			.on('dragstart', this.onDragStart, this)
			.on('drag', this.onDrag, this)
			.on('dragend', this.onDragEnd, this);
	}

	get hold(): boolean {
		return this._hold;
	}

	get drag(): boolean {
		return !this.isSticky && this.hold;
	}

	set hold(value: boolean) {
		if (value != this._hold) {
			if (this.holdTween) {
				this.holdTween.stop();
			}
			if (value) {
				this.holdTween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 0.0, to: 1.0 },
					ease: 'Cubic.Out',
					duration: 100
				});
			}
			else {
				this.holdTween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 1.0, to: 0.0 },
					ease: (v: number) => {
						return Phaser.Math.Easing.Elastic.Out(v, 1.5, 0.5);
					},
					duration: 500
				});
			}
		}

		this._hold = value;
	}

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		this.hover = false;
		this.hold = false;
	}

	onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		this.hover = true;
	}

	onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		this.hold = true;
	}

	onUp(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		if (this.hold) {
			this.hold = false;

			if (!this.clickBlock) {
				this.emit('click');
			}
		}
		this.clickBlock = false;
	}

	onDragStart(pointer, dragX, dragY) {
		if (!this.blocked) {
			this.offset.set(dragX, dragY);
		}
	}

	onDrag(pointer, dragX, dragY) {
		if (!this.blocked) {
			this.goalPos.set(
				dragX,
				dragY
			);
			// this.goalPos.add(this.isSticky ? this.stickPos : this.offset);
			if (!this.isSticky) {
				this.goalPos.add(this.offset);
			}
		}
	}

	onDragEnd(pointer, dragX, dragY, dropped) {
		if (!this.blocked) {
			if (this.isSticky) {
				this.goalPos.copy(this.stickPos);
			}
			else {
				this.stickPos.copy(this.goalPos);
				this.emit("drop", this.goalPos);
			}
			this.isSticky = true;

			if (this.scene) {
				this.liftTween = this.scene.tweens.add({
					targets: this,
					liftSmooth: { from: this.liftSmooth, to: 0 },
					ease: 'Cubic',
					duration: 200
				});
			}
		}
	}


	serialize() {
		return {
			category: this.category,
			tier: this.tier,
			charges: this.charges,
			blocked: this.blocked,
			sightBlocked: this.sightBlocked,
		};
	}

	deserialize(itemData: any) {
		console.log("fuck if I know");
	}
}