const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uOffset;
uniform vec2 uTexelSize;

varying vec2 outTexCoord;

vec4 sampleClamped(vec2 uv) {
	return texture2D(uMainSampler, clamp(uv, uTexelSize * 0.5, 1.0 - uTexelSize * 0.5));
}

void main (void) {
	vec4 c = sampleClamped(outTexCoord);
	vec4 l = sampleClamped(outTexCoord + uOffset);
	vec4 r = sampleClamped(outTexCoord - uOffset);

	gl_FragColor = (1.0*c + 1.0*l + 1.0*r) / 3.0;
}`;

export class BlurPostFilter extends Phaser.Filters.Controller {
	public steps = 4;

	constructor(camera: Phaser.Cameras.Scene2D.Camera) {
		super(camera, "BlurPostFilter");
	}
}

export class BlurPostFilterNode extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {
	private offset = [0, 0];
	private texelSize = [1, 1];

	constructor(manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager) {
		super("BlurPostFilter", manager, undefined, fragShader);
	}

	run(
		controller: BlurPostFilter,
		input: Phaser.Renderer.WebGL.DrawingContext,
		output?: Phaser.Renderer.WebGL.DrawingContext,
		padding?: Phaser.Geom.Rectangle,
	): Phaser.Renderer.WebGL.DrawingContext {
		const pool = this.manager.renderer.drawingContextPool;
		const width = Math.max(1, Math.floor(input.width / 8));
		const height = Math.max(1, Math.floor(input.height / 8));
		const noPadding = new Phaser.Geom.Rectangle();
		padding ??= controller.getPaddingCeil();
		output ??= pool.get(input.width + padding.width, input.height + padding.height);

		// Preserve the original 1/8-resolution, equal-weight three-tap blur.
		// BaseFilterShader releases each input so the pool can ping-pong contexts.
		this.offset = [0, 0];
		let current = super.run(controller, input, pool.get(width, height), noPadding);

		for (let i = 0; i < controller.steps; i++) {
			this.offset = [1 / width, 0];
			current = super.run(controller, current, undefined, noPadding);

			this.offset = [0, 1 / height];
			current = super.run(controller, current, undefined, noPadding);
		}

		// The original final draw also used the last vertical offset when upscaling.
		return super.run(controller, current, output, padding);
	}

	setupTextures(
		_controller: Phaser.Filters.Controller,
		textures: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[],
	): void {
		this.texelSize = [1 / textures[0].width, 1 / textures[0].height];
	}

	setupUniforms(): void {
		this.programManager.setUniform("uOffset", this.offset);
		this.programManager.setUniform("uTexelSize", this.texelSize);
	}
}



// const fragnew = `
// precision mediump float;

// uniform sampler2D uMainSampler;
// uniform vec2 resolution;
// uniform vec2 offset;
// uniform float strength;
// uniform vec3 color;

// varying vec2 outTexCoord;

// void main ()
// {
//     vec2 uv = outTexCoord;

//     vec4 col = vec4(0.0);

//     vec2 offset = vec2(1.333) * offset * strength;

//     col += texture2D(uMainSampler, uv) * 0.29411764705882354;
//     col += texture2D(uMainSampler, uv + (offset / resolution)) * 0.35294117647058826;
//     col += texture2D(uMainSampler, uv - (offset / resolution)) * 0.35294117647058826;

//     gl_FragColor = col * vec4(color, 1.0);
// }`;

// const fragold = `
// precision mediump float;

// uniform sampler2D uMainSampler;
// uniform vec2 uTexSize;
// uniform vec2 uOffset;

// varying vec2 outTexCoord;

// void main (void) {
// 	vec4 c = texture2D( uMainSampler, outTexCoord );
// 	vec4 l = texture2D( uMainSampler, outTexCoord + uOffset );
// 	vec4 r = texture2D( uMainSampler, outTexCoord - uOffset );

// 	gl_FragColor = (1.0*c + 1.0*l + 1.0*r) / 3.0;
// }`;

// export class BlurPostFilter extends Phaser.Renderer.WebGL.Pipelines
// 	.PostFXPipeline {
// 	public offsetX: number;
// 	public offsetY: number;
// 	public steps: number;

// 	constructor(game) {
// 		super({
// 			game,
// 			name: "BlurPostFilter",
// 			fragShader: fragold,
// 			renderTarget: [
// 				{ autoResize: true },
// 				{ autoResize: true },
// 				{ autoResize: true },
// 				// { width: 1920, height: 1080 },
// 				// { width: 128, height: 128 },
// 			],
// 		});

// 		this.offsetX = 1;
// 		this.offsetY = 1;
// 		this.steps = 0;
// 	}

// 	onPreRender() {
// 		this.set2f("uTexSize", this.game.scale.width, this.game.scale.height);
// 	}

// 	onBoot(): void {
// 		this.resize(this.game.scale.width, this.game.scale.height);
// 	}

// 	onResize(width: number, height: number): void {
// 		this.renderTargets[0].resize(width, height);
// 		this.renderTargets[1].resize(width / 4, height / 4);
// 		this.renderTargets[2].resize(width / 4, height / 4);
// 	}

// 	onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget): void {
// 		const target1 = this.renderTargets[1];
// 		const target2 = this.renderTargets[2];


// 		this.copyFrame(renderTarget, target1);

// 		const x = (1 / target1.width) * this.offsetX;
// 		const y = (1 / target1.height) * this.offsetY;

// 		for (let i = 0; i < this.steps; i++) {
// 			this.set2f("uOffset", x, 0);
// 			this.bindAndDraw(target1, target2);

// 			this.set2f("uOffset", 0, y);
// 			this.bindAndDraw(target2, target1);
// 		}

// 		this.bindAndDraw(target1);
// 	}

// 	onDraw2(target1) {
// 		let gl = this.gl;
// 		let target2 = this.fullFrame1;

// 		let currentFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
// 		console.log(currentFBO);

// 		this.bind(this.shaders[0]);

// 		gl.activeTexture(gl.TEXTURE0);
// 		gl.viewport(0, 0, target1.width, target1.height);
// 		// gl.viewport(0, 0, this.game.scale.width, this.game.scale.height);

// 		console.log(target1.width, target1.height);

// 		this.set1i("uMainSampler", 0);
// 		this.set2f("resolution", target1.width, target1.height);
// 		this.set1f("strength", 1);
// 		this.set3fv("color", [1, 1, 1]);

// 		for (let i = 0; i < this.steps; i++) {
// 			this.set2f("offset", 2, 0);
// 			this.copySprite(target1, target2);

// 			this.set2f("offset", 0, 2);
// 			this.copySprite(target2, target1);
// 		}

// 		gl.bindFramebuffer(gl.FRAMEBUFFER, currentFBO);
// 		gl.bindTexture(gl.TEXTURE_2D, null);

// 		this.copyToGame(target1);
// 	}
// }
