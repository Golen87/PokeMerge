import * as Neutralino from "@neutralinojs/lib";

export const isNeutralino = !!window.NL_TOKEN;
let beforeClose: (() => Promise<void>) | undefined;

export function setBeforeClose(handler: (() => Promise<void>) | undefined) {
	beforeClose = handler;
}

if (isNeutralino) {
	Neutralino.init();
	Neutralino.events.on("windowClose", async () => {
		try {
			await beforeClose?.();
		} finally {
			Neutralino.app.exit();
		}
	});
	Neutralino.window.center();
}
