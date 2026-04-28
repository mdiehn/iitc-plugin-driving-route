# IITC Portal Route Plugin Design

## Overview

`iitc-plugin-portal-route` is a mobile-first IITC plugin for planning routes through selected portals.

The plugin is intended to help users:

- add portals to an ordered route
- label stops on the map
- show drive time and distance for each segment
- include expected stop time at each portal
- calculate total trip time
- optionally show segment drive times on the map
- open the route in an external navigation app
- restore the current planned route after an IITC reload

## Design documents

- [Phase 1 Design](design-phase-1.md) - mobile-first MVP route planner
- [Usability Notes](usability-notes.md) - fixed issues, known limitations, planned improvements, and future ideas

## Phase summary

### Phase 1: Mobile-first MVP

Phase 1 focuses on a practical manual route planner:

- add portals to a route
- preserve manual order
- label stops on the map
- calculate route
- show per-leg drive time and distance
- show total drive time, stop time, trip time, and distance
- support per-stop wait time
- provide a Google Maps directions link
- persist route state across reloads

### Later phases

Later phases may add:

- route optimization
- freeform map waypoints
- snap-to-portal behavior
- better naming for non-portal points
- saved named routes
- Apple Maps and Waze links
- route splitting for external-map export limits
- IITC Sync support or import/export
- turn-by-turn directions inside IITC

## Credit

This plugin is a separate implementation inspired in part by the IITC Traveling Agent plugin by yavidor and the Map Route Planner plugin.
