# Drive Ranges: Route With Portal Detours

## Overview

This plugin helps a user plan a driving route that can include optional portal stops along the way.

The user defines a route using two or more points on the map. The plugin calculates the driving route, shows it on the map, and reports both the total travel time and the travel time for each leg between consecutive route points.

The plugin also supports optional portal detours. The user sets:

- a maximum allowed detour time
- an assumed portal hack time

For each portal near the route, the plugin estimates whether the user can leave the route, drive to the portal, spend the configured hack time there, return to the route, and continue the trip, all within the allowed detour time. Portals that meet that rule are treated as eligible detours.

The user can then manually include or exclude those portals from the final route.

## Core Features

### 1. Multi-point driving route

The plugin shall allow the user to define a route with:

- a start point
- an end point
- zero or more intermediate route points

The plugin shall:

- calculate the full driving route through all points in order
- display the route on the map
- show total travel time for the whole route
- show travel time for each leg between consecutive route points

Example:

- Leg 1: A to B
- Leg 2: B to C
- Leg 3: C to D
- Total: A to D through B and C

### 2. Portal detour evaluation

The plugin shall evaluate portals near the route as possible detours.

For each candidate portal, the plugin shall estimate:

- travel time from the route to the portal
- travel time from the portal back to the route
- configured portal hack time

These values are added together to produce the portal’s total detour cost.

If that total is less than or equal to the user’s allowed detour time, the portal is eligible.

### 3. User-configurable timing

The plugin shall support at least these user settings:

- **Allowed detour time**  
  Maximum extra time the user is willing to spend for a portal stop.

- **Portal hack time**  
  Assumed time spent at the portal.  
  Default: **5 minutes**

These settings should be easy to change without rebuilding the route from scratch.

### 4. Manual portal selection

After candidate portals are evaluated, the plugin shall allow the user to:

- include an eligible portal
- exclude an eligible portal
- possibly force-include or force-exclude portals regardless of automatic selection rules

This lets the user adjust the route interactively.

## Suggested User Flow

1. User places route points on the map.
2. Plugin calculates and displays the driving route.
3. Plugin displays:
   - total route time
   - per-leg times
4. User sets:
   - allowed detour time
   - portal hack time
5. Plugin finds nearby portals and evaluates them as detour candidates.
6. Eligible portals are highlighted on the map.
7. User manually selects or deselects portals.
8. Plugin updates route summary and detour information.

## Data / Calculation Model

### Route points

Ordered list of user-defined stops:

```text
[P0, P1, P2, ... Pn]
```

### Legs

Each consecutive pair of route points forms one leg:

```text
P0->P1
P1->P2
P2->P3
...
```

Each leg has:

- geometry
- travel time
- travel distance

### Portal detour cost

For each candidate portal:

```text
detour_cost =
  time_from_route_to_portal
  + portal_hack_time
  + time_from_portal_back_to_route
```

Portal is eligible if:

```text
detour_cost <= allowed_detour_time
```

## Open Design Questions

These need to be decided during implementation.

### 1. What counts as “return to the route”?

Possible interpretations:

- return to the nearest point on the same route geometry
- leave the route at one point and rejoin farther ahead
- treat the portal as an inserted waypoint and recalculate the route

This choice affects both correctness and complexity.

### 2. How are nearby candidate portals found?

Possible approaches:

- portals within a fixed distance buffer of the route
- portals near each leg separately
- portals near sampled points along the route

### 3. How should selected portals affect the final route?

Possible modes:

- informational only: show portal eligibility without changing the main route
- inserted stops: selected portals become actual waypoints in the route
- hybrid: show both detour cost and a recalculated route with chosen portals

### 4. Ordering of multiple selected portals

If several portals are selected, the plugin must decide:

- preserve original route and treat each portal independently
- optimize portal visit order
- insert portals into the nearest leg without global optimization

## Recommended MVP

For a first version, keep it simple:

- support 2 or more route points
- show full route and leg times
- support user-set allowed detour time
- support user-set portal hack time, default 5 minutes
- find portals near the route
- evaluate each portal independently
- let user mark portals in or out
- show portal detour times
- do **not** attempt full multi-portal route optimization yet

That gives a usable first version without turning this into a traveling-salesman problem.

## Possible Future Enhancements

- optimize order of selected portal visits
- separate drive time and hack time in the UI
- different hack-time presets
- filters by portal type, faction, level, or status
- show cumulative added time from selected portals
- export/share route plan
- save named route plans
- support non-driving travel modes
