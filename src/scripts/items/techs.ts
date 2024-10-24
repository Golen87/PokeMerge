import Asset from "../assets/Asset";

import bindingBand from "../../assets/items/tech/Dream_Binding_Band_Sprite.png";
import escapeRope from "../../assets/items/tech/Dream_Escape_Rope_Sprite.png";
import expShare from "../../assets/items/tech/Dream_Exp._Share_Sprite.png";
import luckyPunch from "../../assets/items/tech/Dream_Lucky_Punch_Sprite.png";
import machoBrace from "../../assets/items/tech/Dream_Macho_Brace_Sprite.png";
import scopeLens from "../../assets/items/tech/Dream_Scope_Lens_Sprite.png";
import wideLens from "../../assets/items/tech/Dream_Wide_Lens_Sprite.png";
import zoomLens from "../../assets/items/tech/Dream_Zoom_Lens_Sprite.png";

export const techAssets: Asset[] = [
	{ key: "bindingBand", path: bindingBand },
	{ key: "escapeRope", path: escapeRope },
	{ key: "expShare", path: expShare },
	{ key: "luckyPunch", path: luckyPunch },
	{ key: "machoBrace", path: machoBrace },
	{ key: "scopeLens", path: scopeLens },
	{ key: "wideLens", path: wideLens },
	{ key: "zoomLens", path: zoomLens },
];

import ItemData from "./ItemData";

export const techItems: ItemData[] = [
	{
		key: "bindingBand",
		name: "Binding Band",
		scale: 1.33,
	},

	{
		key: "escapeRope",
		name: "Escape Rope",
		scale: 1.08,
	},

	{
		key: "luckyPunch",
		name: "Lucky Punch",
		scale: 1.08,
	},

	{
		key: "machoBrace",
		name: "Macho Brace",
		scale: 1.1,
	},

	{
		key: "expShare",
		name: "Exp. Share",
		scale: 1.07,
	},

	{
		key: "zoomLens",
		name: "Zoom Lens",
		scale: 1.1,
	},

	{
		key: "scopeLens",
		name: "Scope Lens",
		scale: 1.11,
	},

	{
		key: "wideLens",
		name: "Wide Lens",
		scale: 1.19,
	},
];
