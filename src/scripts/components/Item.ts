import { GameScene } from "../scenes/GameScene";
import { itemData } from "../items";
import { COLOR, DEPTH } from "../constants";
import ItemData from "../items/ItemData";

export class Item extends Phaser.GameObjects.Container {
	public scene: GameScene;
	private image: Phaser.GameObjects.Image;
	private grass: Phaser.GameObjects.Image;
	private bolt: Phaser.GameObjects.Image;
	private checkmark: Phaser.GameObjects.Image;
	private timer: Phaser.GameObjects.Image;
	private timer2: Phaser.GameObjects.Image;
	private graphics: Phaser.GameObjects.Graphics;
	private graphics2: Phaser.GameObjects.Graphics;
	private debugText: Phaser.GameObjects.Text;

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
	public dispenserCharges: number;
	public justSpawned: boolean;
	public blocked: boolean;
	public sightBlocked: boolean;

	private rechargeTimestamp: number;
	private dispenserTimestamp: number;
	private prevRechargeTime: number;
	private prevRechargeProgress: number;

	constructor(scene: GameScene, category: string, tier: number, blocked: boolean) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

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
		this.charges = 0;
		this.dispenserCharges = 0;
		this.justSpawned = true;

		if (this.itemData.generator) {
			if (!this.itemData.generator.depletable) {
				this.charges = this.itemData.generator.maxCharges;
				this.rechargeTimestamp = 0;
			}
			else {
				this.rechargeTimestamp = Date.now() + (this.itemData.generator.rechargeTime);
			}
		}

		this.dispenserTimestamp = Date.now() + (this.itemData.dispenser?.rechargeTime || 0);
		this.prevRechargeTime = -1;
		this.prevRechargeProgress = -1;


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
		this.bolt.setTint(COLOR.ITEM_BOLT);
		this.bolt.setVisible(false);
		this.bolt.setBlendMode(Phaser.BlendModes.ADD);
		this.add(this.bolt);

		// Checkmark
		this.checkmark = scene.add.image(0, 0, "checkmark");
		this.checkmark.setDepth(DEPTH.CHECKMARK);
		this.checkmark.setVisible(false);
		this.add(this.checkmark);

		// Timer
		const radius = 0.18*this.scene.GRID_SIZE;
		const border = 0.045*this.scene.GRID_SIZE;
		const x = 0.5*this.scene.GRID_SIZE - radius;
		const y = -0.5*this.scene.GRID_SIZE + radius;

		this.timer = scene.add.image(0, 0, "timer");
		this.timer.setVisible(false);
		this.add(this.timer);

		this.timer2 = scene.add.image(0, 0, "timer");
		this.timer2.setVisible(false);
		this.add(this.timer2);

		this.graphics = scene.add.graphics();
		this.graphics.setVisible(false);
		this.add(this.graphics);

		this.graphics2 = scene.add.graphics();
		this.graphics2.setVisible(false);
		this.add(this.graphics2);

		// Debug
		this.debugText = scene.createText(0, 0, 10, scene.weights.bold, "white");
		this.debugText.setOrigin(0, 1);
		this.debugText.setAlpha(0);
		this.add(this.debugText);

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


		this.onScreenResize();
	}

	onScreenResize() {
		this.checkmark.x = 0.33*this.scene.GRID_SIZE;
		this.checkmark.y = 0.3*this.scene.GRID_SIZE;
		this.checkmark.setScale(0.7*this.scene.GRID_SIZE / this.checkmark.width);

		this.debugText.x = -this.scene.GRID_SIZE/2;
		this.debugText.y = this.scene.GRID_SIZE/2;
		this.debugText.setFontSize(this.scene.GRID_SIZE/4);
		this.debugText.setStroke("black", this.scene.GRID_SIZE/20);

		this.redrawTimer();
		this.updateImage();
	}


	update(time, delta) {
		this.x += (this.goalPos.x - this.x) / (this.justSpawned ? 6.0 : this.hold ? 1.25 : 3.0);
		this.y += (this.goalPos.y - this.y) / (this.justSpawned ? 6.0 : this.hold ? 1.25 : 3.0);

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

			const minDragDist = 0.15 * this.scene.GRID_SIZE;
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

		// Checkmark
		// this.checkmark.x = this.x + 0.33*this.scene.GRID_SIZE;
		// this.checkmark.y = this.y + 0.3*this.scene.GRID_SIZE;

		// Recharging generators
		const generator = this.itemData.generator;
		if (generator) {
			let now = Date.now();
			while (this.charges < generator.maxCharges && now > this.rechargeTimestamp) {
				const wasEmpty = (this.charges == 0);
				this.charges += (generator.rechargeCount || 1);
				this.rechargeTimestamp += generator.rechargeTime;

				if (this.charges >= generator.maxCharges) {
					this.charges = generator.maxCharges;
					this.rechargeTimestamp = 0;
				}

				if (wasEmpty) {
					this.emit("recharged");
				}

				this.updateText();
			}

			this.image.setTint(this.chargeBlock ? 0x777777 : 0xFFFFFF);
			this.timer.setVisible(this.chargeBlock);
			this.graphics.setVisible(this.chargeBlock);
		}

		// Automatic dispensers
		const dispenser = this.itemData.dispenser;
		if (dispenser) {
			let now = Date.now();
			while (this.dispenserCharges < dispenser.maxCharges && now > this.dispenserTimestamp) {
				const wasEmpty = (this.dispenserCharges == 0);

				this.dispenserCharges += (dispenser.rechargeCount || 1);
				this.dispenserTimestamp += dispenser.rechargeTime;

				if (this.dispenserCharges >= dispenser.maxCharges) {
					this.dispenserCharges = dispenser.maxCharges;
					this.dispenserTimestamp = 0;
				}

				if (wasEmpty) {
					this.emit("recharged");
				}

				this.updateText();
			}

			this.timer2.setVisible(this.dispenserCharges == 0);
			this.graphics2.setVisible(this.dispenserCharges == 0);
		}

		// All generators
		if (this.drops && !this.blocked) {
			this.bolt.setVisible(!this.chargeBlock);
			if (this.bolt.visible) {
				this.bolt.setScale(0.75 * this.scene.GRID_SIZE / this.bolt.width * (0.9 + 0.1 * Math.sin(1*time/1000)));
				this.bolt.setAlpha(2.0 + 2.0*Math.sin(1*time/1000));
			}
		}

		// Timer
		this.redrawTimer();

		// 	if (this.drops && (!this.chargeBlock || this.isFinal || this.itemData.recharge)) {
		// 		this.emit('click');
		// 		this.emit('click');
		// 	}
		// }

		if (this.itemData.dispenser && this.dispenserCharges > 0) {
			this.emit('dispense');
		}
	}

	redrawTimer() {
		const now = Date.now();

		if (this.itemData.generator && this.timer.visible) {
			// if (this.charges >= this.itemData.generator.maxCharges) { return; }

			const end = this.rechargeTimestamp;
			const start = end - this.itemData.generator.rechargeTime;
			const progress = (now - start) / (end - start);
			console.assert(progress >= 0 && progress <= 1, `Unintended timer progress: ${progress}`);

			if (progress < this.prevRechargeProgress + 0.005 && now < this.prevRechargeTime + 1000) {
				return;
			}
			this.prevRechargeTime = now;
			this.prevRechargeProgress = progress;
	
			const radius = 0.18*this.scene.GRID_SIZE;
			const border = 0.045*this.scene.GRID_SIZE;
			const x = 0.5*this.scene.GRID_SIZE - radius;
			const y = -0.5*this.scene.GRID_SIZE + radius;
	
			this.timer.setPosition(x, y);
			this.timer.setScale((4*radius) / this.timer.width);
	
			this.graphics.clear();
			this.graphics.fillStyle(0xFA9425); // Pink 0xED51A4
			this.graphics.beginPath();
			this.graphics.moveTo(x, y);
			this.graphics.arc(x, y, radius - border, -Math.PI/2, -Math.PI/2 + progress * 2*Math.PI);
			this.graphics.closePath();
			this.graphics.fillPath();
		}

		if (this.itemData.dispenser && this.timer2.visible) {
			// if (this.charges >= this.itemData.generator.maxCharges) { return; }

			const end = this.dispenserTimestamp;
			const start = end - this.itemData.dispenser.rechargeTime;
			const progress = (now - start) / (end - start);
			// const progress = Phaser.Math.Clamp(, 0, 1);
	
			const radius = 0.12*this.scene.GRID_SIZE;
			const border = 0.03*this.scene.GRID_SIZE;
			const x = 0.5*this.scene.GRID_SIZE - radius;
			const y = 0.5*this.scene.GRID_SIZE - radius;
	
			this.timer2.setPosition(x, y);
			this.timer2.setScale((4*radius) / this.timer2.width);
	
			this.graphics2.clear();
			this.graphics2.fillStyle(0xED51A4);
			this.graphics2.beginPath();
			this.graphics2.moveTo(x, y);
			this.graphics2.arc(x, y, radius - border, -Math.PI/2, -Math.PI/2 + progress * 2*Math.PI);
			this.graphics2.closePath();
			this.graphics2.fillPath();
		}
	}

	upgrade(other: Item) {
		this.tier += 1;

		this.bolt.setVisible(false);
		this.image.setTint(0xFFFFFF);
		this.timer.setVisible(false);
		this.graphics.setVisible(false);
		this.timer2.setVisible(false);
		this.graphics2.setVisible(false);

		if (this.itemData.generator) {
			// this.charges + other.charges
			this.charges = this.itemData.generator.maxCharges;
			this.rechargeTimestamp = 0;
		}

		if (this.itemData.dispenser) {
			this.dispenserCharges = Math.min(
				this.dispenserCharges + other.dispenserCharges + 1,
				this.itemData.dispenser.maxCharges
			);
			this.dispenserTimestamp = Date.now() + this.itemData.dispenser.rechargeTime;
		}

		this.cycle = 0;
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
			this.grass.setScale(1.9 * this.scene.CELL_SIZE / this.grass.width);
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
				this.grass.setScale(1.4 * this.scene.CELL_SIZE / this.grass.width);
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
		}
	}

	updateText() {
		this.debugText.setVisible(this.hasCharges ? true : false);
		this.debugText.setText(`${this.charges} / ${this.dispenserCharges}`);
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
			const grassKey = ["tall_grass_1", "tall_grass_2", "tall_grass_3"][grassIndex];
			this.grass.setTexture(grassKey);
			this.grass.scaleX *= ((slot.x + 2*slot.y) % 2 == 0) ? 1 : -1;
		}
	}

	openSight() {
		this.sightBlocked = false;
		this.updateImage();
	}

	use() {
		if (this.itemData.generator) {
			this.cycle = (this.cycle + 1) % this.itemData.generator.items.length;
			this.charges -= 1;
			this.updateText();

			if (this.rechargeTimestamp == 0) {
				this.rechargeTimestamp = Date.now() + this.itemData.generator.rechargeTime;
			}
	
			if (this.charges <= 0) {
				this.emit("depleted", !this.itemData.generator.depletable);
			}
		}
	}

	dispense() {
		if (this.itemData.dispenser) {
			this.dispenserCharges -= 1;
			this.updateText();
	
			if (this.dispenserTimestamp == 0) {
				this.dispenserTimestamp = Date.now() + this.itemData.dispenser.rechargeTime;
			}
		}
	}

	forceRecharge() {
		if (this.itemData.generator) {
			this.charges = this.itemData.generator.maxCharges;
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
			this.wobbleAnimation = 1;
		}
		if (this.hintTween) {
			this.hintTween.stop();
			this.hintAnimation = 1;
		}
	}

	showCheckmark(visible: boolean) {
		this.checkmark.setVisible(visible);
	}

	setVisible(visible: boolean): this {
		super.setVisible(visible);
		// if (!visible) { this.showCheckmark(false); }
		return this;
	}


	canMerge(other: Item) {
		return this.category == other.category
			&& this.tier == other.tier
			&& !this.isFinal
			&& !this.sightBlocked
			&& !other.sightBlocked;
	}

	get chargeBlock(): boolean {
		return (this.charges == 0);
	}

	get hasCharges(): boolean {
		return !!this.itemData.generator || !!this.itemData.dispenser;
	}

	get isGeneratorCategory(): boolean | undefined {
		const finalItem = itemData[this.category][itemData[this.category].length-1];
		return (finalItem.generator && !finalItem.generator.depletable);
	}

	get isFinal() {
		return this.tier == itemData[this.category].length;
	}

	get itemData(): ItemData {
		let d = itemData[this.category][this.tier-1];
		if (d === undefined) {
			console.warn(`Item: Cannot find itemData for (${this.category}:${this.tier})`);
		}
		return d;
	}

	get imageKey(): string {
		return this.itemData.key;
	}

	get drops() {
		return this.itemData.generator?.items;
	}

	get depleteDrop() {
		return this.itemData.generator?.depleteDrop;
	}

	get nextTier(): ItemData | null {
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
		this.hold = false;
	}

	onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		this.hold = true;
	}

	onUp(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		if (this.hold) {
			this.hold = false;

			if (!this.clickBlock) {
				this.emit("click");
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

			this.emit("move", this.goalPos);
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
		console.log("todo");
	}
}