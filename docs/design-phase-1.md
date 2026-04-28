# IITC Portal Route Plugin - Phase 1 Design

## Purpose

`iitc-plugin-portal-route` helps an IITC user plan a route through selected portals.

Phase 1 is a mobile-first manual route planner. It is meant to make route planning usable directly from IITC without trying to become a full navigation app.

## Phase 1 feature set

- Add portals to an ordered route from the portal details panel.
- Show a collapsible mobile-friendly route panel.
- Label portals on the map by route order.
- Calculate a route through selected portals.
- Show drive time and distance for each route segment.
- Show total drive time, stop time, trip time, and distance.
- Support a global default stop-time setting, defaulting to 5 minutes.
- Support per-stop wait-time overrides.
- Mark plotted route data stale when stops or stop times change.
- Show segment details between the two waypoint rows they describe.
- Optionally show segment drive-time labels on the map.
- Persist route state across IITC reloads.
- Open the current route in Google Maps.

## Mobile-first rules

- No hover-only controls.
- No tiny buttons.
- Avoid wide tables for interactive controls.
- Do not depend on drag-and-drop for core functionality.
- Keep route controls compact.
- Keep the map usable while the panel is open.
- Prefer explicit buttons and toggles over hidden gestures.

## Route state

The plugin tracks both the ordered waypoint list and the calculated route result.

A plotted route becomes stale when:

- a stop is added
- a stop is removed
- a stop is moved
- a per-stop wait time changes
- the default stop time changes

When the route is stale, the UI should make it clear that the user needs to replot before the displayed totals and route line should be treated as current.

## External map export

Google Maps export is useful but has waypoint limits.

Observed Google Maps behavior:

- Google Maps appears to plot the first point and final point, plus up to 9 intermediate stops.
- That means 11 total route points.
- With more than 11 total points, Google Maps may omit stops between the ninth intermediate stop and the final destination.

The plugin currently warns before opening Google Maps when the route exceeds this limit and lists the stops that Google Maps may omit. Route splitting is deferred.

## Related plugins

This plugin is a separate implementation, but its design was informed by existing IITC route-planning plugins, including Traveling Agent and Map Route Planner.

## Deferred features

- Route optimization.
- Drag-and-drop waypoint reordering.
- Freeform map waypoints.
- Snap-to-portal behavior.
- Player/map-center start location.
- Return-to-start routing.
- Apple Maps and Waze links.
- Saved named routes.
- IITC Sync support or import/export.
- Turn-by-turn directions inside IITC.
