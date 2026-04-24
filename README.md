# IITC Plugin: Driving Route

An IITC plugin concept for planning a driving route with optional portal detours.

## Status

Early scaffold and design draft.

## Core idea

The plugin lets the user define a driving route using two or more points on the map, calculate travel time for the full route and each leg, and evaluate nearby portals as optional detours based on:

- allowed detour time
- assumed portal hack time

Eligible portals can then be manually included or excluded.

## Repository layout

- `docs/design.md` — first-pass design spec
- `docs/TODO.md` — phased implementation plan
- `src/` — source files for the plugin
- `dist/` — built userscript output
- `build.js` — simple build script for concatenating source files

## Development notes

This repository currently contains placeholder source files and packaging boilerplate so implementation can begin incrementally.
