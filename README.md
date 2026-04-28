# IITC plugin: Portal Route

Portal Route is an IITC plugin for planning a route through selected Ingress portals.

It is built for mobile-first use, but works on desktop IITC too. Pick portals, keep them in order, plot the route, track stop time, and send the route to Google Maps when you are ready.

## Status

Current milestone: `0.2.0-dev`

This is usable for testing and early public review. It is still a development build.

## Install

Install the userscript from this raw GitHub URL:

```text
https://raw.githubusercontent.com/mdiehn/iitc-plugin-portal-route/main/dist/portal-route.user.js
```

Then open IITC and enable the plugin if your IITC setup requires it.

## Quick start

1. Select a portal in IITC.
2. Use **Add to Portal Route**.
3. Add more portals.
4. Open the Portal Route panel.
5. Adjust stop times if needed.
6. Click **Plot**.
7. Use **Maps**, **Print**, or **Export** as needed.

## Main features

- Add selected portals as route stops.
- Edit stops in the main route panel.
- Remove and reorder stops.
- Set a default stop time.
- Override stop time per stop.
- Use flexible stop times like `15m`, `1.5h`, and `2d`.
- Plot a route through the stop list.
- Show total drive time, stop time, trip time, and distance.
- Show per-leg time and distance in the stop list.
- Mark route data stale after edits.
- Show **Replot** when the route needs recalculation.
- Persist waypoints and plotted route data across IITC reloads.
- Optionally show segment time labels on the map.
- Export the route to Google Maps.
- Export and import route JSON.
- Open a printable route summary.

## Known limits

### Google Maps waypoint limit

Google Maps appears to plot the first point, final point, and up to 9 intermediate stops. That means routes with more than 11 total points may export incompletely.

Portal Route warns before opening Google Maps with more than 11 route points and lists the stops Google Maps may omit. Route splitting is planned for later.

### Mobile hover behavior

Hover labels are limited on mobile because touch devices do not have reliable hover.

### Stale route data

Changing stops or stop times marks the plotted route stale. Replot before trusting totals, segment data, or the route line.

## Build

From the repo root:

```bash
npm run build
```

Or directly:

```bash
node build.js
```

The built userscript and metadata file are written to:

```text
dist/portal-route.user.js
dist/portal-route.meta.js
```

Syntax check:

```bash
npm run check
```

or:

```bash
node --check dist/portal-route.user.js
```

## Repository layout

```text
dist/                 built userscript files
docs/                 design and usability notes
src/                  plugin source files
CHANGELOG.md          changes by milestone
README.md             this file
VERSION               current working version
build.js              build script
package.json          npm scripts and package info
```

Source changes should be made in `src/`. Files in `dist/` are build output.

For now, keep these versions in sync by hand:

```text
VERSION
src/banner.js
package.json
```

## Docs

- [Design overview](docs/design.md)
- [Phase 1 design](docs/design-phase-1.md)
- [Usability notes](docs/usability-notes.md)

## Credits

Portal Route is a separate implementation inspired in part by the IITC Traveling Agent plugin by yavidor and the Map Route Planner plugin.
