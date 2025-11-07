const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 resolution;
uniform vec2 uOffset;

varying vec2 outTexCoord;

void main (void) {
	vec2 offset = vec2(1.333) / resolution;

	vec4 c = texture2D( uMainSampler, outTexCoord );
	vec4 l = texture2D( uMainSampler, outTexCoord + uOffset );
	vec4 r = texture2D( uMainSampler, outTexCoord - uOffset );

	gl_FragColor = (1.0*c + 1.0*l + 1.0*r) / 3.0;
}`;

export class BlurPostFilter extends Phaser.Renderer.WebGL.Pipelines
	.PostFXPipeline {
	public steps: number;

	constructor(game) {
		super({
			game,
			name: "BlurPostFilter",
			fragShader,
			renderTarget: [
				{ autoResize: true },
				{ autoResize: true },
				{ autoResize: true },
			],
		});

		this.steps = 4;
	}

	onBoot(): void {
		this.resize(this.game.scale.width, this.game.scale.height);
	}

	onResize(width: number, height: number): void {
		this.renderTargets[0].resize(width, height);

		// Resize the blur render targets to 1/8 the size in this example
		this.renderTargets[1].resize(width / 8, height / 8);
		this.renderTargets[2].resize(width / 8, height / 8);
	}

	onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget): void {
		// Use the two smaller render targets to ping-pong the blur effect
		const target1 = this.renderTargets[1];
		const target2 = this.renderTargets[2];

		this.copyFrame(renderTarget, target1);

		const x = (1 / target1.width);
		const y = (1 / target1.height);

		for (let i = 0; i < this.steps; i++) {
			this.set2f("uOffset", x, 0);
			this.bindAndDraw(target1, target2);

			this.set2f("uOffset", 0, y);
			this.bindAndDraw(target2, target1);
		}

		this.bindAndDraw(target1);
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
