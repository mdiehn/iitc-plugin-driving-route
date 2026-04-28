# Phase 1 design

`iitc-plugin-portal-route` helps an IITC user plan a route through selected portals.

Phase 1 is the mobile-first manual route planner.

## Feature set

- Add portals to an ordered route from the portal details panel.
- Show a compact route panel.
- Label route stops on the map.
- Plot a route through selected portals.
- Show drive time and distance for each route leg.
- Show total drive time, stop time, trip time, and distance.
- Support a global default stop time.
- Support per-stop wait-time overrides.
- Mark plotted route data stale when stops or stop times change.
- Show route leg details in the stop list.
- Optionally show segment drive-time labels on the map.
- Persist route state across IITC reloads.
- Export the current route to Google Maps.
- Warn when Google Maps may omit stops.
- Export and import route data as JSON.
- Open a printable route summary.

## Mobile-first rules

- No hover-only controls.
- No tiny buttons for core actions.
- Avoid wide tables.
- Do not depend on drag-and-drop.
- Keep route controls compact.
- Keep the map usable while the panel is open.
- Use plain labels when glyphs are risky on mobile.

## Route state

The plugin tracks:

- ordered stops
- stop wait times
- settings
- plotted route data
- whether the plotted route is stale

A plotted route becomes stale when:

- a stop is added
- a stop is removed
- a stop is moved
- a per-stop wait time changes
- the default stop time changes

When data is stale, the UI should show that the route needs to be replotted.

## Google Maps export

Observed Google Maps behavior:

- first point is used as the origin
- final point is used as the destination
- up to 9 intermediate stops are included
- more than 11 total route points may export incompletely

Current behavior:

- warn before opening Google Maps when the route has more than 11 points
- list the stops Google Maps may omit
- let the user cancel or continue anyway

Route splitting is deferred.

## Import, export, and print

JSON export/import is meant to be simple route backup and sharing.

Imported routes restore stop order and stop timing. Imported route data should be treated as stale until replotted.

The printable view is meant for quick paper or PDF output, not rich formatting.

## Related plugins

Portal Route is a separate implementation, but its design was informed by existing IITC route-planning plugins, including Traveling Agent and Map Route Planner.

## Deferred features

- Route optimization.
- Drag-and-drop waypoint reordering.
- Freeform map waypoints.
- Snap-to-portal behavior.
- Player/map-center start location.
- Return-to-start routing.
- Apple Maps and Waze links.
- Saved named routes.
- IITC Sync support.
- Turn-by-turn directions inside IITC.
