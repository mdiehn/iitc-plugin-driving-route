# Segmented Routes Design

Current draft for Portal Route segmented-route foundation work.

This doc defines an additive design for segmented routes. It is intentionally
implementation-free and keeps existing simple linear routes valid.

## Purpose

Portal Route currently treats a route as one ordered stop list. The segmented
foundation should let Portal Route also represent routes made of multiple ordered
sections without breaking:

- existing linear route editing
- existing saved routes
- current Google and ORS plotting behavior for normal route sections
- current Google Maps and Apple Maps export workflows

## Goals

- Accept segmented route data in a stable Portal Route-owned format.
- Store segmented routes in the route library, JSON, and shared storage.
- Display segmented structure without forcing a full segmented-route editor yet.
- Plot segmented routes on the map with clear degradation rules.
- Export segmented routes in ways that preserve data safely and degrade
  predictably for destinations that only support flat waypoint lists.
- Preserve existing simple linear routes as first-class routes, not legacy junk.
- Preserve unknown or external segment data without silently dropping it.

## Non-goals

- Full segmented-route editing UI.
- Mission or banner workflow design.
- Mission/Banner Companion-specific behavior.
- Destructive migration of existing saved routes.
- Per-leg travel modes inside a segment.
- Mode-specific line styling.
- New routing providers.
- Automatic conversion of every linear route into segmented form.

## Design summary

Portal Route should support two route shapes:

- `linear`: the current ordered stop list.
- `segmented`: an ordered list of segments plus a derived flat stop sequence for
  compatibility.

The key compatibility decision is:

- keep a flat ordered stop list available for every route record, including
  segmented routes
- store segmented structure as additive metadata beside that flat stop list

That keeps old routes valid, keeps older Portal Route builds able to load the
same points in order, and lets segmented support arrive incrementally.

## Proposed route data model

### Route record shape

Segmented-capable saved routes should move to a new saved-route schema version.
The current route-library design uses `schemaVersion: 1`; segmented support
should be introduced as `schemaVersion: 2`.

Suggested high-level record shape:

```json
{
  "schemaVersion": 2,
  "pluginVersion": "1.6.0",
  "id": "route-...",
  "name": "Example segmented route",
  "createdAt": "2026-06-07T12:00:00.000Z",
  "updatedAt": "2026-06-07T12:30:00.000Z",
  "map": {
    "center": { "lat": 43.642, "lng": -72.251 },
    "zoom": 15
  },
  "route": {
    "kind": "segmented",
    "stops": [],
    "segments": [],
    "segmentOrder": []
  },
  "settings": {}
}
```

Notes:

- `route.stops` remains the flat ordered compatibility view.
- `route.segments` stores the richer segmented structure.
- `route.segmentOrder` preserves explicit segment ordering without relying on
  array position alone.
- `route.kind` allows a route to stay explicitly `linear` even after segmented
  support ships.

### Segment model

Suggested segment shape:

```json
{
  "id": "segment-...",
  "type": "route",
  "label": "Downtown cluster",
  "ownership": "portal-route",
  "waypointRange": {
    "startIndex": 0,
    "endIndex": 4
  },
  "startAnchor": {
    "stopId": "stop-a"
  },
  "endAnchor": {
    "stopId": "stop-e"
  },
  "travelMode": "walk",
  "routingProvider": "google",
  "renderPolicy": "route",
  "exportPolicy": "include",
  "source": {
    "kind": "internal"
  },
  "externalData": null
}
```

### Stop model

The current stop model is already close to what the foundation needs. The main
addition is a stable stop ID so segments can reference stops safely.

Suggested stop shape:

```json
{
  "id": "stop-a",
  "guid": null,
  "type": "map",
  "title": "Home",
  "lat": 43.642,
  "lng": -72.251,
  "stopMinutes": null,
  "startOnMe": false,
  "home": true,
  "accuracy": null,
  "updatedAt": null
}
```

Notes:

- Existing saved routes without stop IDs can be upgraded lazily on load.
- Segment boundaries should reference stable stop IDs, not array positions only.
- `waypointRange` is still useful as a cached convenience view.

## Segment type definitions

### `route`

Normal Portal Route-owned route segment with ordered waypoints.

Behavior:

- Portal Route can calculate geometry for it using the selected provider.
- Contributes fully to flat route stops.
- Contributes normally to timing, distance, and map export.

### `connector`

Movement between route sections.

Behavior:

- Usually a light-weight bridge between two route sections.
- May have zero interior stops.
- Should preserve start/end anchors even if there is no rich geometry.
- Default export should be conservative: endpoints only unless a later
  implementation proves full waypoint inclusion is useful.

### `transfer`

Logistics or mode-change segment.

Behavior:

- Represents movement or handling between sections without pretending it is a
  normal portal sweep.
- May carry notes or mode-change intent later, but that is not required for the
  foundation.
- Should usually render distinctly from normal route sections.
- Should not be silently expanded into many guessed route points.

### `external`

Externally-owned segment whose data should be preserved safely.

Behavior:

- Portal Route should not assume it can edit or recalculate the segment.
- Raw payload and source metadata should be preserved.
- If Portal Route can flatten it safely, it may expose a compatibility stop
  sequence.
- If Portal Route cannot flatten it safely, it should preserve the segment and
  degrade gracefully in plotting/export.

## Backward compatibility strategy

### Existing simple routes

Existing saved routes remain valid as `schemaVersion: 1` linear routes.

Expected behavior:

- load without conversion prompts
- continue editing as normal linear routes
- save back in their original shape until the user uses a segmented-only feature
- remain exportable exactly as they are today

### Additive segmented support

Segmented routes should be additive rather than replacing the current model.

Compatibility rules:

- every segmented route stores a flat `route.stops` view
- old Portal Route builds that know only flat stops can still load the route as
  a simple route if they ignore `segments`
- new Portal Route builds can round-trip both the flat view and the segmented
  view

### Schema migration

Recommended approach:

- support reading both schema versions `1` and `2`
- write `schemaVersion: 2` only when a route actually uses segmented structure
- allow linear routes to remain `schemaVersion: 1` for a while to minimize churn

This keeps migration small and non-destructive.

## Storage and route-library behavior

Segmented routes should use the same library/storage channels as linear routes:

- local browser route library
- route JSON import/export
- whole-library JSON import/export
- Google Drive shared storage

Storage rules:

- preserve segment order exactly
- preserve raw unknown/external segment payloads
- preserve the flat stop list alongside segments
- do not silently rewrite external segments into Portal Route-owned route
  segments
- keep shared storage explicit and user-driven

Route-library behavior:

- library rows should remain route-first, not segment-first
- segmented routes may later show a small badge or summary like `4 segments`
- save/load/update/delete behavior should stay the same at the route level
- import conflicts should remain conservative

## Display behavior

Initial display foundation should be read-mostly rather than a full editor.

Expected display model:

- a segmented route still appears as one active route
- the Route List can show segment headers with their contained stops
- segment headers should show type and label
- unknown or external segments should be visibly marked
- linear routes should keep the current flat list without added clutter

Degradation rules:

- if segmented UI is unavailable, fall back to the flat stop list
- if a segment cannot be expanded, show a compact placeholder row rather than
  discarding it

## Plotting behavior

Plotting should preserve current provider behavior for normal route sections.

Recommended plotting rules by segment type:

- `route`: calculate and render with the normal provider workflow
- `connector`: render with a simpler connector style; use explicit geometry if
  provided, otherwise connect anchors conservatively
- `transfer`: render distinctly and avoid pretending it is a normal routed leg
- `external`: render provided geometry when present; otherwise render anchors or
  a placeholder indication

Key rule:

- provider routing failures for one segment must not destroy the route record or
  other segment data

For the foundation, the full route summary may still be derived from the flat
stop list until segment-aware totals are implemented. Any mismatch should be
called out rather than hidden.

## Export behavior

Portal Route has two export classes now:

- Portal Route JSON/library export
- map-app export such as Google Maps and Apple Maps

### JSON and library export

JSON and library export should preserve the full segmented structure:

- `route.kind`
- flat `route.stops`
- `route.segments`
- source and external payload metadata

This is the authoritative lossless export path.

### Map-app export

Google Maps and Apple Maps only understand flat waypoint lists, so segmented
routes must degrade to a flat export plan.

Recommended default export policies:

- `route`: include normal stops
- `connector`: endpoints only
- `transfer`: endpoints only
- `external`: omit unless the segment provides an explicit exportable flat stop
  list

Export rules:

- keep current staging/splitting behavior
- warn when segment metadata is being flattened or omitted
- never imply that Google or Apple Maps will preserve segmented meaning

## Unknown and external segment handling

Portal Route should handle unknown segment types as preserved data, not as
errors that force deletion.

Rules:

- keep raw segment payload under `externalData` or equivalent preserved storage
- preserve source metadata such as producer name and version when available
- show a visible `external` or `unknown` marker in the UI
- allow load, save, export, and round-trip even when edit support is missing

If flattening is impossible:

- keep the route loadable
- keep the segment stored intact
- mark plotting/export as partial or unavailable
- do not silently invent replacement route points

## Migration and degradation behavior

### Linear to segmented

Do not auto-convert ordinary saved routes just because segmented support exists.

If a future feature creates a segmented route from a linear route:

- assign stop IDs
- create explicit segment IDs
- preserve the original stop order exactly
- keep the resulting flat stop list identical unless the user intentionally
  changed the route

### Segmented to older Portal Route

Older builds should still be able to use the flat stop list.

Expected degradation:

- segmented headers/types are lost
- external segment metadata is ignored
- the route still opens as a simple ordered route when the flat stop list is
  sufficient

### Partial-support degradation

If a new build can load a segmented route but not fully render/edit one segment:

- keep the route
- keep the flat stop list
- keep the raw segment data
- show partial-support messaging where needed

## Open questions

- Should flat `route.stops` remain authoritative for totals/export, or should
  segments become the only source of truth once implementation starts?
- Should `connector` and `transfer` be allowed to own interior waypoints in the
  first implementation, or just anchors?
- Should linear routes stay on `schemaVersion: 1` indefinitely until edited as
  segmented routes?
- Should external segments be allowed to carry rendered polyline geometry
  directly in saved JSON?
- How should print output summarize omitted or external segments?
- Should route-level travel mode stay global for segmented routes at first, even
  when segments have different types?

## First implementation checklist

- Add schema-reading support for both linear and segmented route records.
- Add stable stop IDs and segment IDs.
- Keep flat stop serialization intact for all route records.
- Add route-level detection for `linear` versus `segmented`.
- Add lossless JSON import/export for segmented routes.
- Add route-library normalization that preserves unknown/external segments.
- Add a minimal read-only segmented Route List view.
- Add minimal plotting rules for each segment type.
- Add flat map-app export degradation with clear warnings.
- Add tests for round-trip preservation and old-build fallback behavior.

## Recommended next agent/session

Recommended next agent: `implementation`

Recommended next session goal:

- translate this doc into a small implementation plan for schema parsing,
  serialization helpers, and read-only segmented display scaffolding without yet
  building a full segmented editor
