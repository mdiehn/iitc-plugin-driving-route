#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname);
const distDir = path.join(root, "dist");
const outFile = path.join(distDir, "portal-route.user.js");
const readmeFile = path.join(root, "README.md");

const sources = [
  "src/banner.js",
  "src/wrapper-start.js",
  "src/styles.js",
  "src/constants.js",
  "src/state.js",
  "src/storage.js",
  "src/undo.js",
  "src/format.js",
  "src/ui-controls.js",
  "src/portal-actions.js",
  "src/route-model.js",
  "src/route-schema.js",
  "src/route-google.js",
  "src/route-ors.js",
  "src/route-providers.js",
  "src/render-map.js",
  "src/render-panel.js",
  "src/export-links.js",
  "src/route-library.js",
  "src/drive-storage.js",
  "src/shape-select.js",
  "src/ui.js",
  "src/layer-ui-cleanup.js",
  "src/wrapper-end.js",
];

fs.mkdirSync(distDir, { recursive: true });

let output = sources
  .map((file) => {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing source file: ${file}`);
    }
    return fs.readFileSync(fullPath, "utf8").trimEnd() + "\n";
  })
  .join("\n");

function pad(value) {
  return String(value).padStart(2, "0");
}

function buildStamp(date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function stampDevVersion(source) {
  const versionMatch = source.match(/^\/\/ @version\s+(.+)$/m);
  if (!versionMatch) return source;

  const version = versionMatch[1].trim();
  if (version.indexOf("-dev") === -1) return source;

  const stampedVersion = `${version}.${buildStamp(new Date())}`;
  const branch = getCurrentBranch();
  const metaUrl = `https://raw.githubusercontent.com/mdiehn/iitc-plugin-portal-route/refs/heads/${branch}/dist/portal-route.meta.js`;
  const userUrl = `https://raw.githubusercontent.com/mdiehn/iitc-plugin-portal-route/refs/heads/${branch}/dist/portal-route.user.js`;

  return source
    .replace(/^\/\/ @version\s+.+$/m, `// @version ${stampedVersion}`)
    .replace(/^\/\/ @updateURL\s+.+$/m, `// @updateURL ${metaUrl}`)
    .replace(/^\/\/ @downloadURL\s+.+$/m, `// @downloadURL ${userUrl}`)
    .replace(/pr\.VERSION = ['"][^'"]+['"];/, `pr.VERSION = '${stampedVersion}';`);
}

output = stampDevVersion(output);
fs.writeFileSync(outFile, output, "utf8");

const metaFile = path.join(distDir, "portal-route.meta.js");
const metaMatch = output.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/);
if (!metaMatch) {
  throw new Error("Could not find userscript metadata block");
}
fs.writeFileSync(metaFile, metaMatch[0] + "\n", "utf8");

function getCurrentBranch() {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return branch && branch !== "HEAD" ? branch : "main";
  } catch (e) {
    return "main";
  }
}

function updateReadmeInstallLink() {
  if (!fs.existsSync(readmeFile)) return;

  const branch = getCurrentBranch();
  const readme = fs.readFileSync(readmeFile, "utf8");
  const installUrl = `https://github.com/mdiehn/iitc-plugin-portal-route/raw/refs/heads/${branch}/dist/portal-route.user.js`;
  const updated = readme.replace(
    /\*\*Install:\*\* \[`portal-route\.user\.js`\]\([^)]+\)/,
    `**Install:** [\`portal-route.user.js\`](${installUrl})`
  );

  if (updated !== readme) {
    fs.writeFileSync(readmeFile, updated, "utf8");
    console.log(`Updated README install link for ${branch}`);
  }
}

updateReadmeInstallLink();
console.log(`Wrote ${path.relative(root, outFile)}`);
console.log(`Wrote ${path.relative(root, metaFile)}`);
