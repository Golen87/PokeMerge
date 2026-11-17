<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { MapEditorPanelState } from "./MapEditorPanel";

const props = defineProps<{
	state: MapEditorPanelState;
	save: () => Promise<void>;
}>();

const element = ref<HTMLDetailsElement | null>(null);
const status = computed(() => {
	if (props.state.saving) { return "Saving…"; }
	return props.state.error || (props.state.dirty ? "Unsaved changes" : "Up to date");
});

const controls = [
	["Select a node", "Click"],
	["Move a node", "Drag"],
	["Extend from selected node", "Ctrl + click the map"],
	["Toggle primary/control", "Space / double-click"],
	["Insert before selection", "Ctrl + Space"],
	["Delete selected node", "Delete"],
	["Clear selection", "Escape"],
	["Undo", "Ctrl + Z"],
	["Save to paths.json", "Ctrl + S"],
];

function onKeyDown(event: KeyboardEvent) {
	if ((event.ctrlKey || event.metaKey) && event.code === "KeyS") {
		event.preventDefault();
		if (!event.repeat) { void props.save(); }
	}
}

function onOutsidePointerDown(event: PointerEvent) {
	const panel = element.value;
	const focused = document.activeElement;
	if (panel && !panel.contains(event.target as Node) && focused instanceof HTMLElement &&
		panel.contains(focused)) {
		focused.blur();
	}
}

onMounted(() => window.addEventListener("pointerdown", onOutsidePointerDown));
onBeforeUnmount(() => window.removeEventListener("pointerdown", onOutsidePointerDown));
</script>

<template>
	<details ref="element" class="map-editor-panel" :hidden="!state.visible" @pointerdown.stop @mousedown.stop
		@touchstart.stop @wheel.stop @click.stop @keyup.stop @keydown.stop="onKeyDown">
		<summary>Map editor</summary>
		<div class="map-editor-panel-body">
			<button type="button" :disabled="state.saving" @click="save">
				Save to paths.json
			</button>
			<p role="status" aria-live="polite" aria-atomic="true">{{ status }}</p>
			<details class="map-editor-instructions">
				<summary>How to use</summary>
				<table aria-label="Map editor controls">
					<thead>
						<tr>
							<th scope="col">Action</th>
							<th scope="col">Control</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="[action, control] in controls" :key="action">
							<td>{{ action }}</td>
							<td>{{ control }}</td>
						</tr>
					</tbody>
				</table>
			</details>
		</div>
	</details>
</template>

<style>
.map-editor-panel {
	position: fixed;
	top: 12px;
	left: 12px;
	z-index: 1000;
	box-sizing: border-box;
	width: 300px;
	max-width: calc(100vw - 24px);
	max-height: calc(100dvh - 24px);
	overflow: auto;
	border-radius: 6px;
	background: rgba(0, 0, 0, 0.8);
	color: #fff;
	font: 14px / 1.4 LatoRegular, sans-serif;
	scrollbar-width: thin;
}

.map-editor-panel>summary {
	padding: 12px 14px;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	user-select: none;
}

.map-editor-panel-body {
	padding: 0 14px 14px;
}

.map-editor-panel-body p[role="status"] {
	text-align: right;
}

.map-editor-panel button {
	width: 100%;
	min-height: 36px;
	padding: 8px 12px;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 6px;
	background: rgba(255, 255, 255, 0.15);
	color: inherit;
	font: inherit;
	cursor: pointer;
}

.map-editor-panel button:hover:not(:disabled) {
	background: rgba(255, 255, 255, 0.25);
}

.map-editor-panel button:disabled {
	opacity: 0.6;
	cursor: wait;
}

.map-editor-panel :is(button, summary):focus-visible {
	outline: 2px solid #fff;
	outline-offset: -2px;
}

.map-editor-panel p {
	margin: 8px 0 12px;
	font-size: 12px;
	overflow-wrap: anywhere;
}

.map-editor-instructions>summary {
	cursor: pointer;
	user-select: none;
}

.map-editor-panel table {
	width: 100%;
	margin-top: 8px;
	border-collapse: collapse;
	font-size: 12px;
	text-align: left;
}

.map-editor-panel :is(th, td) {
	padding: 6px 4px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	vertical-align: top;
}
</style>
