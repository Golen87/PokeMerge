export class GrayScalePostFilter extends Phaser.Filters.ColorMatrix {
	constructor(camera: Phaser.Cameras.Scene2D.Camera) {
		super(camera);
		this.colorMatrix.grayscale(0.5);
	}
}
