import { createApp, reactive, type App } from "vue";
import MapEditorPanelComponent from "./MapEditorPanel.vue";

export interface MapEditorPanelState {
	visible: boolean;
	dirty: boolean;
	saving: boolean;
	error: string;
}

// Bridge the Phaser editor's lifecycle and state to the Vue panel.
export class MapEditorPanel {
	private readonly element: HTMLDivElement;
	private readonly app: App;
	private readonly state = reactive<MapEditorPanelState>({
		visible: false,
		dirty: false,
		saving: false,
		error: "",
	});
	private destroyed = false;

	constructor(private readonly onSave: () => Promise<void>) {
		this.element = document.createElement("div");
		document.body.appendChild(this.element);
		this.app = createApp(MapEditorPanelComponent, {
			state: this.state,
			save: () => this.save(),
		});
		this.app.mount(this.element);
	}

	setVisible(visible: boolean) {
		this.state.visible = visible;
	}

	setDirty(dirty: boolean) {
		this.state.dirty = dirty;
		if (!this.state.saving) { this.state.error = ""; }
	}

	async save() {
		if (this.state.saving || this.destroyed || !this.state.visible) { return; }
		this.state.saving = true;
		this.state.error = "";
		try {
			await this.onSave();
		} catch (error) {
			if (!this.destroyed) {
				this.state.error = error instanceof Error ? error.message : "Could not save paths.json";
				console.error("Could not save map paths:", error);
			}
		} finally {
			this.state.saving = false;
		}
	}

	destroy() {
		if (this.destroyed) { return; }
		this.destroyed = true;
		this.app.unmount();
		this.element.remove();
	}
}
