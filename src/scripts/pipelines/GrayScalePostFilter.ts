export class GrayScalePostFilter extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
	constructor (game) {
		super({
			game,
			name: 'GrayScalePostFilter'
		});
	}

	onPreRender () {
		this.colorMatrix.grayscale(0.5);
		// this.colorMatrix.blackWhite();
	}

	onDraw (renderTarget) {
		this.drawFrame(renderTarget, this.fullFrame1);
		this.bindAndDraw(this.fullFrame1);
	}
}