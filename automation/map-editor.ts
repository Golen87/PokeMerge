import { randomUUID } from "node:crypto";
import { rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PluginOption } from "vite";
import { MAP_PATHS_SAVE_URL } from "../src/scripts/constants";
import type { SaveState } from "../src/scripts/components/MapPaths";

const MAX_BODY_BYTES = 1024 * 1024;

function parsePaths(value: unknown): SaveState {
	const data = value as SaveState | null;
	if (
		!data ||
		!Array.isArray(data.nodes) ||
		!data.nodes.length ||
		!Array.isArray(data.edges)
	) {
		throw new Error(
			"Path data must contain nodes and edges, with at least one node.",
		);
	}
	const ids = new Set<number>();
	for (const node of data.nodes) {
		if (
			!node ||
			!Number.isSafeInteger(node.id) ||
			node.id < 1 ||
			ids.has(node.id) ||
			!Number.isFinite(node.x) ||
			!Number.isFinite(node.y) ||
			(node.primary !== undefined && typeof node.primary !== "boolean")
		) {
			throw new Error(
				"Nodes need unique positive integer IDs, finite coordinates, and an optional primary flag.",
			);
		}
		ids.add(node.id);
	}
	const children = new Map<number, number[]>();
	for (const edge of data.edges) {
		if (
			!edge ||
			!ids.has(edge.source) ||
			!ids.has(edge.target) ||
			edge.source === edge.target
		) {
			throw new Error("Edges must connect two different existing nodes.");
		}
		const targets = children.get(edge.source) ?? [];
		targets.push(edge.target);
		children.set(edge.source, targets);
	}
	const visited = new Set<number>();
	const pending = [data.nodes[0].id];
	while (pending.length) {
		const id = pending.pop()!;
		if (visited.has(id)) {
			throw new Error(
				"Paths must form a tree without cycles or repeated connections.",
			);
		}
		visited.add(id);
		pending.push(...(children.get(id) ?? []));
	}
	if (visited.size !== ids.size) {
		throw new Error("Every node must be reachable from the first node.");
	}
	return {
		nodes: data.nodes.map(({ id, x, y, primary }) => ({ id, x, y, primary })),
		edges: data.edges.map(({ source, target }) => ({ source, target })),
	};
}

export default function mapEditor(): PluginOption {
	let pathsFile: string;
	let editorSavedContent: string | undefined;

	return {
		name: "map-editor",
		apply: "serve",
		configureServer(server) {
			pathsFile = path.resolve(server.config.root, "scripts/assets/paths.json");
			server.middlewares.use(async (req, res, next) => {
				if (req.url?.split("?")[0] !== MAP_PATHS_SAVE_URL) {
					return next();
				}
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.setHeader("Cache-Control", "no-store");
				if (req.method !== "POST") {
					res.setHeader("Allow", "POST");
					res.writeHead(405).end("Use POST to save paths.");
					return;
				}
				if (
					req.headers.origin &&
					req.headers.origin !== `http://${req.headers.host}` &&
					req.headers.origin !== `https://${req.headers.host}`
				) {
					res.writeHead(403).end("Save paths from the development app.");
					return;
				}
				if (req.headers["content-type"]?.split(";")[0] !== "application/json") {
					res.writeHead(415).end("Path data must be JSON.");
					return;
				}

				let data: SaveState;
				try {
					req.setEncoding("utf8");
					let body = "";
					let bytes = 0;
					for await (const chunk of req) {
						bytes += Buffer.byteLength(chunk);
						if (bytes <= MAX_BODY_BYTES) {
							body += chunk;
						}
					}
					if (bytes > MAX_BODY_BYTES) {
						res.writeHead(413).end("Path data exceeds 1 MB.");
						return;
					}
					data = parsePaths(JSON.parse(body));
				} catch (error) {
					res
						.writeHead(400)
						.end(error instanceof Error ? error.message : "Invalid path data.");
					return;
				}

				// Replace the fixed asset atomically so an interrupted save cannot truncate it.
				const temporaryFile = `${pathsFile}.${randomUUID()}.tmp`;
				try {
					const content = JSON.stringify(data) + "\n";
					await writeFile(temporaryFile, content, { flag: "wx" });
					editorSavedContent = content;
					await rename(temporaryFile, pathsFile);
					res.writeHead(204).end();
				} catch (error) {
					editorSavedContent = undefined;
					server.config.logger.error(
						`Could not save map paths: ${String(error)}`,
					);
					res
						.writeHead(500)
						.end(
							"Could not write paths.json. Check the development server console.",
						);
				} finally {
					await unlink(temporaryFile).catch(() => {});
				}
			});
		},
		async handleHotUpdate(context) {
			if (context.file !== pathsFile || editorSavedContent === undefined)
				return;
			if ((await context.read()) !== editorSavedContent) {
				editorSavedContent = undefined;
				return;
			}
			// Refresh Vite's cache while keeping the current editor, camera, and undo history.
			for (const module of context.modules) {
				context.server.moduleGraph.invalidateModule(
					module,
					undefined,
					context.timestamp,
					true,
				);
			}
			return [];
		},
	};
}
