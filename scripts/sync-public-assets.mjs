import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const srcAssets = resolve(root, "src/assets");
const publicAssets = resolve(root, "public/assets");

if (!existsSync(srcAssets)) {
    console.warn("src/assets not found, skipping asset sync.");
    process.exit(0);
}

if (existsSync(publicAssets)) {
    rmSync(publicAssets, { recursive: true, force: true });
}

mkdirSync(publicAssets, { recursive: true });
cpSync(srcAssets, publicAssets, { recursive: true });
console.log("Synced src/assets -> public/assets");
