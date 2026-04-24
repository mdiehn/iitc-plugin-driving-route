#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = __dirname;
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');
const outFile = path.join(distDir, 'driving-route.user.js');

const files = [
  'banner.js',
  'wrapper-start.js',
  'constants.js',
  'state.js',
  'settings.js',
  'route.js',
  'portals.js',
  'render.js',
  'ui.js',
  'actions.js',
  'wrapper-end.js'
];

fs.mkdirSync(distDir, { recursive: true });

const content = files
  .map((name) => fs.readFileSync(path.join(srcDir, name), 'utf8'))
  .join('\n');

fs.writeFileSync(outFile, content);
console.log(`Wrote ${outFile}`);
