# IITC plugin: Portal Route

Portal Route is an IITC plugin for planning a route through selected Ingress portals.

The plugin is being built for mobile-first use, but it also works on desktop IITC. It focuses on selecting portals as stops, plotting the route, tracking stop time, showing route and segment timing, and exporting the waypoint route to Google Maps.

## Current status

Current milestone: `0.2.0-dev`

This project is still in active development. The current code is usable enough for local testing and early public review, but it should still be treated as a development build.

## Main features

- Add selected portals as route waypoints.
- Edit waypoints in the main route panel.
- Remove and reorder waypoint stops.
- Set a default stop time per portal.
- Override stop time per waypoint.
- Accept flexible stop-time input like `15m`, `1.5h`, and `2d`.
- Plot a route through the waypoint list.
- Show total route time, stop time, trip time, and distance.
- Show route leg details between the two waypoint rows they describe.
- Mark route state stale after route-affecting edits.
- Show Replot when the saved route needs recalculation.
- Persist waypoints and plotted route data across IITC reloads.
- Optionally show per-segment drive-time labels on the map.
- Export the waypoint route to Google Maps.

## Known limitations

### Google Maps waypoint limit

Google Maps appears to plot the first point, final point, and up to 9 intermediate stops. That means routes with more than 11 total points may export incompletely.

Portal Route warns before opening Google Maps with more than 11 route points. Better route splitting is planned for later.

### Mobile hover behavior

Hover labels are limited on mobile because touch devices do not have a reliable hover state.

## Repository layout

```text
build/
  build.sh

dist/
  portal-route.meta.js
  portal-route.user.js

docs/
  design.md
  design-phase-1.md
  usability-notes.md

src/
  banner.js
  wrapper-start.js
  constants.js
  state.js
  storage.js
  format.js
  portal-actions.js
  route-model.js
  route-google.js
  render-map.js
  render-panel.js
  export-links.js
  ui.js
  wrapper-end.js

CHANGELOG.md
README.md
VERSION
package.json
```

## Building

From the repository root:

```bash
./build.sh
```

The built userscript and metadata file are written to:

```text
dist/portal-route.user.js
dist/portal-route.meta.js
```

Optional syntax check:

```bash
node --check dist/portal-route.user.js
```

If using npm:

```bash
npm run build
npm run check
```

## Installing for testing

Install the built userscript from the raw GitHub URL:

```text
https://raw.githubusercontent.com/mdiehn/iitc-plugin-portal-route/main/dist/portal-route.user.js
```

Or load `dist/portal-route.user.js` directly into your userscript manager while testing local builds.

## Development notes

The userscript is built by concatenating files from `src/`. Source changes should be made in `src/`; generated files in `dist/` should be treated as build output.

The current version is stored in:

```text
VERSION
```

The userscript metadata version is stored in:

```text
src/banner.js
```

For now, keep those in sync manually.

Design notes and the active roadmap are tracked in:

```text
docs/design.md
docs/usability-notes.md
```

Changes by milestone are tracked in:

```text
CHANGELOG.md
```

## Design docs

- [Design overview](docs/design.md)
- [Phase 1 design](docs/design-phase-1.md)
- [Usability notes](docs/usability-notes.md)

## Credits

This plugin is a separate implementation inspired in part by the IITC Traveling Agent plugin by yavidor and the Map Route Planner plugin.
