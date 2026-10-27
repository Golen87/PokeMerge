import { defineConfig } from "vite";

import zip from "vite-plugin-zip-pack";
import checker from "vite-plugin-checker";
import getGitVersion from "./automation/git-version";
import preImageOptimizer from "./automation/pre-image-optimizer";
import neuBuild from "./automation/neu-build";
import neuInject from "./automation/neu-inject";
import bundleWinApp from "./automation/win-bundle";
import bundleMacApp from "./automation/mac-bundle";
import bundleLinuxApp from "./automation/linux-bundle";
import buildCleanup from "./automation/build-cleanup";

import path from "path";

import {
	title,
	team,
	description,
	title_dashed,
} from "./automation/constants";
import pwaMode from "./automation/pwa-mode";
import hmrScenes from "./automation/hmr-scenes";

export default defineConfig(({ mode }) => {
	process.env.VITE_GAME_TITLE = title;
	process.env.VITE_GAME_TEAM = team;
	process.env.VITE_GAME_DESCRIPTION = description;

	return {
		base: mode === "production" ? "./" : "/",
		root: "src",
		plugins: [
			hmrScenes(),
			pwaMode(mode),
			getGitVersion(),
			checker({
				typescript: {
					tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
				},
			}),
			preImageOptimizer(),
			neuInject(),
			neuBuild(),
			bundleWinApp(),
			bundleMacApp(),
			bundleLinuxApp(),
			zip({
				inDir: "./dist/web",
				outDir: "./dist",
				outFileName: `${title_dashed}-web.zip`,
			}),
			zip({
				inDir: `./dist/win`,
				outDir: "./dist",
				outFileName: `${title_dashed}-win.zip`,
			}),
			zip({
				inDir: `./dist/linux`,
				outDir: "./dist",
				outFileName: `${title_dashed}-linux.zip`,
			}),
			buildCleanup(),
		],
		resolve: {
			tsconfigPaths: true,
		},
		build: {
			outDir: "../dist/web",
			emptyOutDir: false,
			chunkSizeWarningLimit: 4096,
			assetsInlineLimit: 0,
			target: "es2022",
			cssTarget: "esnext",
			minify: "terser",
			terserOptions: {
				format: {
					comments: false,
				},
			},
		},
		server: {
			host: "localhost",
		},
	};
});
