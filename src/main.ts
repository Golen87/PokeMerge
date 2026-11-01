import "@/utils/neu";
import "@/utils/storage";
import { Game } from "./game";

if (import.meta.hot) {
	import.meta.hot.on("vite:beforeUpdate", () => console.clear());
	import.meta.hot.on("vite:beforeFullReload", () => console.clear());
}

Game();
