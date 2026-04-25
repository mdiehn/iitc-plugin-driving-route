#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const distDir = path.join(root, "dist");
const outFile = path.join(distDir, "driving-route.user.js");

const sources = [
  "src/banner.js",
  "src/wrapper-start.js",
  "src/styles.js",
  "src/constants.js",
  "src/state.js",
  "src/storage.js",
  "src/format.js",
  "src/portal-actions.js",
  "src/route-model.js",
  "src/route-google.js",
  "src/render-map.js",
  "src/render-panel.js",
  "src/export-links.js",
  "src/ui.js",
  "src/wrapper-end.js",
];

fs.mkdirSync(distDir, { recursive: true });

const output = sources
  .map((file) => {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing source file: ${file}`);
    }

    return fs.readFileSync(fullPath, "utf8").trimEnd() + "\n";
  })
  .join("\n");

fs.writeFileSync(outFile, output, "utf8");

console.log(`Wrote ${path.relative(root, outFile)}`);
