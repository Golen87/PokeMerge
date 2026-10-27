import Phaser from "phaser";

// Phaser's ESM build does not install the global used by the game's components.
// Import this module before scenes so their base classes are available at load time.
globalThis.Phaser = Phaser;
