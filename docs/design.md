# Portal Route design

Portal Route is a mobile-first IITC plugin for planning routes through selected portals.

The plugin is meant to help an agent:

- add portals to an ordered route
- label stops on the map
- plot a driving route
- include stop time at portals
- see drive time, stop time, trip time, and distance
- export the route to Google Maps
- export/import route data as JSON
- print a simple route summary
- restore the current route after an IITC reload

## Design docs

- [Phase 1 design](design-phase-1.md)
- [Usability notes](usability-notes.md)

## Phase 1

Phase 1 is a practical manual route planner.

It includes:

- manual stop order
- portal-based stops
- route plotting
- per-stop wait time
- stale route tracking
- persisted route state
- Google Maps export
- Google Maps export-limit warning
- JSON import/export
- printable route summary

It does not try to be a full navigation app.

## UI direction

Keep the UI small, plain, and mobile-friendly.

Prefer:

- visible buttons over hidden gestures
- compact rows over wide tables
- stable layout over clever animation
- plain text over icons that render poorly on mobile
- clear stale-state warnings over silent bad data

## Later work

Likely later phases:

- split long Google Maps exports into multiple links
- saved named routes
- route optimization
- freeform map waypoints
- snap-to-portal behavior
- better names for non-portal points
- Apple Maps and Waze links
- IITC Sync support
- turn-by-turn directions inside IITC

## Credit

Portal Route is a separate implementation inspired in part by the IITC Traveling Agent plugin by yavidor and the Map Route Planner plugin.
