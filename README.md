# Poké Merge

A Pokémon-themed merge game inspired by Merge Mansion and similar games. Merge matching items into higher tiers, and complete tasks to progress through the game.

The game is built with Phaser 4, TypeScript, Vite, and Neutralino.

Sprites used:
- Pokemon Shuffle, https://www.spriters-resource.com/
- Pokemon Dream World, https://archives.bulbagarden.net/
- Various Pokémon 3D models, https://www.models-resource.com/

All credits goes to Nintendo. I just want a free merge game without ads.


## Quick start

### Prerequisites

- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (Node.js 22.12 or newer)
- **Web**: Modern browser with WebGL support
- **Windows**: Microsoft Edge WebView2 runtime
- **Mac**: Compatible macOS version with WebKit support
- **Linux**: WebKitGTK and native libraries required by Neutralino

### Steps

```bash
git clone git@github.com:Golen87/MergeGame.git
cd MergeGame
npm ci
npm run dev
```

Open `http://localhost:5173/` in a browser.


## Building

Run the production build:

```bash
npm run build
```

Build output is placed in the `dist/` directory.

The build also packages the desktop applications using Neutralino. Creating the macOS disk image requires `mkisofs` or `xorrisofs`.
