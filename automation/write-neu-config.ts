import {
	team,
	title,
	team_dashed,
	title_dashed,
	git_count,
	neutralino,
} from "./constants";
import neuTemplate from "./neu-template.json";
import { writeFileSync } from "fs";

export default function WriteNeuConfig(isProd = false) {
	const neuConf = structuredClone(neuTemplate);
	neuConf.applicationId = `${team_dashed}.${title_dashed}`;
	neuConf.modes.window.title = `${title} by ${team}`;
	neuConf.cli.binaryName = `${team_dashed}-${title_dashed}`;
	neuConf.version = `0.0.${git_count}`;
	if (isProd) {
		neuConf.documentRoot = "/web/";
		neuConf.cli.resourcesPath = "/";
		neuConf.modes.window.icon = "/web/icon.png";
	} else {
		neuConf.tokenSecurity = "none";
	}

	neuConf.nativeAllowList = [...new Set([...neuConf.nativeAllowList, ...neutralino.allow])];
	const windowOptions = (neutralino as {
		window?: Partial<typeof neuConf.modes.window>;
	}).window;
	neuConf.modes.window = { ...neuConf.modes.window, ...windowOptions };

	writeFileSync(
		isProd ? "dist/neutralino.config.json" : "neutralino.config.json",
		JSON.stringify(neuConf),
	);
	if (!isProd) {
		writeFileSync("./src/public/__neutralino_globals.js", "// Dummy file");
	}
}
