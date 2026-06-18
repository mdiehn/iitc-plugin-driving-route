# Segmented Routes Design

Current implemented foundation for Portal Route segmented-route storage and
compatibility.

This doc describes what the branch actually implements, plus the still-open
follow-on UI and workflow work. It does not imply a segmented route editor,
mission support, or banner support exists today.

## Purpose

Portal Route still executes routes from one ordered stop list. The segmented
foundation adds a compatibility-preserving way to store richer segmented
structure beside that flat route without breaking:

- existing linear route editing
- existing saved routes
- current Google and ORS plotting behavior for flat routes
- current Google Maps and Apple Maps export workflows

## Implemented branch status

Implemented in this branch:

- segmented-capable normalization for current-route JSON and saved-route/library
  records
- stable stop IDs and segment IDs during import/save normalization
- segmented metadata preservation through route-library save/load,
  whole-library JSON import/export, current-route JSON import/export, local
  persistence, undo/redo, and Drive-backed library round trips
- conservative schema-version behavior where simple routes stay
  `schemaVersion: 1` and segmented metadata writes `schemaVersion: 2` only when
  segment metadata actually exists
- stale segmented overlay state clearing when canonical stop-sequence edits
  change the route

Not implemented in this branch:

- segmented route creation or editing UI
- segmented Route List headers, badges, or grouped rows
- segment-type-specific plotting behavior
- segment-aware print layout, totals, or export warnings
- mission or banner workflows

## Goals of the implemented foundation

- Accept segmented route data in a stable Portal Route-owned format.
- Store segmented routes in the route library, JSON, and shared storage.
- Preserve segmented structure without forcing a full segmented-route editor yet.
- Keep plotting/export execution on the canonical flat stop list until a later
  segment-aware UI/workflow slice exists.
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

Portal Route now supports two route shapes:

- `linear`: the current ordered stop list.
- `segmented`: an ordered list of segments plus a derived flat stop sequence for
  compatibility.

The key compatibility decision is unchanged:

- keep a flat ordered stop list available for every route record, including
  segmented routes
- treat `route.stops` as the canonical executable waypoint list
- store segmented structure as additive metadata beside that flat stop list
- require segmented routes to degrade safely to flat routes when segment
  metadata is ignored

That keeps old routes valid, keeps older Portal Route builds able to load the
same points in order, and lets segmented support arrive incrementally.

## Canonical source of truth

For the current segmented-route foundation, `route.stops` is the authoritative
route sequence for execution-oriented behavior:

- save/load normalization
- plotting fallback
- Google Maps and Apple Maps export
- simple-route compatibility
- older-build degradation
- print fallback

`route.segments` is a structural overlay that describes how the canonical stop
list is grouped, labeled, and partially interpreted by newer builds.

Rules:

- segmented metadata may reference or annotate canonical stops, but it does not
  replace them in this release
- executable plotting/export paths must never trust segment metadata more than
  the canonical stop list
- if segment metadata is missing, ignored, or partially invalid, the route must
  still degrade to the canonical flat stop list when possible
- if segment metadata disagrees with `route.stops`, the stop list wins for
  executable behavior and the segment data is treated as partial or invalid

## Implemented route data model

### Route record shape

Segmented-capable saved routes use saved-route `schemaVersion: 2` when real
segment metadata exists. Existing simple routes remain on `schemaVersion: 1`.

Implemented high-level record shape for segmented records:

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

- `route.stops` remains the canonical executable stop list.
- `route.segments` stores the richer segmented structure.
- `route.segmentOrder` is optional compatibility metadata and must not outrank
  validated array order plus stop anchors.
- `route.kind` allows a route to stay explicitly `linear` even after segmented
  support ships.
- Routes without segment metadata remain flat `schemaVersion: 1` records.

### Segment model

Implemented normalization preserves segment records in this general shape:

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
  "renderPolicy": "route",
  "exportPolicy": "include",
  "source": {
    "kind": "internal"
  },
  "externalData": null
}
```

### Stop model

The stop model now includes stable stop IDs so segments can reference stops
safely.

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

- Existing saved routes without stop IDs are upgraded lazily on load.
- Segment boundaries reference stable stop IDs, not just array positions.
- `waypointRange` remains a convenience cache rather than the authoritative
  segment boundary source.

### Deferred per-segment routing metadata

Per-segment `travelMode` and `routingProvider` behavior is still out of scope
for this foundation slice.

For this release:

- route-level travel mode remains the only executable travel-mode input
- route-level routing provider remains the only executable routing-provider
  input
- segment records do not define active per-segment routing behavior

If future-facing metadata is preserved:

- treat it as non-executable deferred metadata only
- do not surface it as active behavior in this release
- do not let it alter normalization, plotting, export, or totals

## Segment type definitions

### `route`

Current branch behavior:

- the segment record is preserved
- executable plotting/export still follows canonical flat `route.stops`
- segment-specific routing behavior is deferred

### `connector`

Current branch behavior:

- the segment record is preserved
- no connector-specific plotting or export behavior is implemented yet
- flat-stop fallback remains the executable behavior

### `transfer`

Current branch behavior:

- the segment record is preserved
- no transfer-specific rendering or execution behavior is implemented yet
- flat-stop fallback remains the executable behavior

### `external`

Current branch behavior:

- Portal Route preserves raw payload and source metadata during round-trip
- the branch does not assume the segment can be edited or recalculated
- flat-stop fallback remains the executable behavior when compatible stops exist

## Backward compatibility strategy

### Existing simple routes

Existing saved routes remain valid as `schemaVersion: 1` linear routes.

Expected behavior:

- load without conversion prompts
- continue editing as normal linear routes
- save back in their original shape until the user uses a segmented-only feature
- remain exportable exactly as they are today

### Additive segmented support

Segmented routes are additive rather than replacing the current model.

Compatibility rules:

- every segmented route stores a flat `route.stops` view
- that flat stop list is the canonical executable list
- old Portal Route builds that know only flat stops can still load the route as
  a simple route if they ignore `segments`
- new Portal Route builds can round-trip both the flat view and the segmented
  view

### Schema migration

Current implementation:

- reads both schema versions `1` and `2`
- writes `schemaVersion: 2` only when a route actually uses segmented structure
- allows linear routes to remain `schemaVersion: 1` to minimize churn

## Storage and route-library behavior

Segmented routes use the same library/storage channels as linear routes:

- local browser route library
- route JSON import/export
- whole-library JSON import/export
- Google Drive shared storage
- localStorage current-route persistence
- undo/redo snapshots

Storage rules:

- preserve segment order deterministically
- preserve raw unknown/external segment payloads
- preserve the flat stop list alongside segments
- do not silently rewrite external segments into Portal Route-owned route
  segments
- keep shared storage explicit and user-driven

Route-library behavior:

- library rows remain route-first, not segment-first
- save/load/update/delete behavior stays the same at the route level
- import conflicts remain conservative
- segmented routes may carry segment-count metadata internally, but this branch
  does not add a dedicated segmented editor view

## Normalization and disagreement rules

Normalization is deterministic and conservative.

Precedence rules:

- canonical stop order is `route.stops` array order
- `route.segments` array order is the default segment display/export order
- `route.segmentOrder`, if present, may be normalized into `route.segments`
  array order on load/save, but must not override canonical stop order
- `startAnchor`, `endAnchor`, and `waypointRange` are validated against
  `route.stops`
- stop-anchor references are more trustworthy than cached ranges when both are
  present and disagree
- unknown or external payload may be preserved, but it is not trusted for
  executable routing unless it resolves cleanly against canonical stops

Load/save normalization rules:

- missing stop IDs may be generated during normalization
- missing segment IDs may be generated during normalization
- if `segmentOrder` disagrees with `route.segments` array order, normalize to
  one segment array order before save
- normalization must not silently reorder `route.stops` to satisfy segment
  metadata
- if the canonical stop sequence changes through normal route editing, stale
  `routeStructure` overlay state is cleared rather than forced to survive

Invalid segment handling:

- invalid stop anchors or impossible ranges make a segment non-executable for
  future segment-aware behavior
- invalid segments are preserved as metadata when possible instead of being
  silently dropped
- executable plotting/export uses only canonical flat stops in this slice
- disagreement must surface as partial support, not destructive repair

## Display behavior

Current branch behavior:

- a segmented route still appears as one active route
- the Route List stays on the current flat stop workflow
- linear routes keep the current flat list without segmented clutter
- no segmented editor, grouped headers, or placeholder rows are implemented yet

## Plotting behavior

Current branch behavior:

- plotting still follows the canonical flat `route.stops` list
- provider behavior for ordinary flat routes remains unchanged
- no segment-type-specific plotting rules are implemented yet
- preserving segmented metadata must not break replots of the flat stop list

## Export behavior

Portal Route has two export classes:

- Portal Route JSON/library export
- map-app export such as Google Maps and Apple Maps

### JSON and library export

JSON and library export preserve the full segmented structure:

- `route.kind`
- flat `route.stops`
- `route.segments`
- `route.segmentOrder`
- source and external payload metadata

This is the authoritative lossless export path.

### Map-app export

Google Maps and Apple Maps only understand flat waypoint lists, so segmented
routes degrade to a flat export plan.

Current branch behavior:

- keep current staging/splitting behavior
- Google Maps and Apple Maps export operate on canonical flat `route.stops`
- export does not yet add segmented-specific warning copy
- map-app export must never be treated as a lossless segmented representation

## Print behavior

Current branch behavior:

- printing uses the canonical `route.stops` list
- segment-aware print layout is not implemented in this slice
- segmented routes print exactly like simple routes and lose segmented meaning
  in print output

## Unknown and external segment handling

Portal Route treats unknown segment types as preserved data, not as errors that
force deletion.

Rules:

- keep raw segment payload under `externalData` or equivalent preserved storage
- preserve source metadata such as producer name and version when available
- allow load, save, export, and round-trip even when edit support is missing
- do not silently invent replacement route points

If flattening is impossible:

- keep the route loadable when canonical flat stops exist
- keep the segment stored intact
- keep plotting/export on the flat-stop fallback path

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

- segmented labels/types are lost
- external segment metadata is ignored
- canonical flat stop order remains usable and must be preserved by newer builds
- the route still opens as a simple ordered route when the flat stop list is
  sufficient

### Partial-support degradation

If a new build can load a segmented route but not fully render or interpret one
segment:

- keep the route
- keep the flat stop list
- keep the raw segment data
- keep execution on the canonical flat route

## Open questions

- When the first segmented UI slice lands, should it start with badges,
  headers, or a separate read-only structure view?
- Should external segments ever be allowed to carry rendered polyline geometry
  directly in saved JSON?
- Should future map-app export add warnings only, or also per-segment reduction
  summaries?
- Should future print output stay fully flat, or add optional segment labels?

## Implemented foundation checklist

- Add schema-reading support for both linear and segmented route records.
- Add stable stop IDs and segment IDs.
- Keep flat stop serialization intact for all route records.
- Add route-level detection for `linear` versus `segmented`.
- Add lossless current-route JSON import/export for segmented routes.
- Add route-library normalization that preserves unknown/external segments.
- Normalize `segmentOrder` into deterministic segment array order without
  mutating canonical flat stop order.
- Preserve segmented route metadata through local persistence, undo/redo, and
  Drive-backed route-library round trips.
- Clear stale segmented overlay state when stop-sequence edits change canonical
  flat stops.

## Recommended next agent/session

Recommended next agent: `gatekeeper`

Recommended next session goal:

- review the implemented foundation and fixture-validation branch for readiness
- confirm the docs match shipped behavior
- identify any remaining blocker-level manual verification gaps before merge
