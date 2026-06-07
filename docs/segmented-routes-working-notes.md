# Segmented Routes Working Notes

Working notes for the first segmented-route design pass.

## Scope guardrails

- This is foundation work only.
- Keep existing linear routes first-class.
- Keep Mission/Banner Companion out of the design boundary.
- Treat external producers as import/export neighbors, not dependencies.
- Do not require a destructive route-library migration.

## Current-model pressure points

Portal Route currently assumes:

- one active ordered stop array
- one route-level travel mode
- one route-level routing provider
- one route summary and one plotted line
- export built from one flat list

Segmented routes add pressure in these places:

- storage schema
- route normalization
- route list rendering
- plot/render ownership
- export degradation rules
- route-summary trustworthiness

## Foundation decisions captured in this pass

- Segmented support is additive, not a replacement for the flat model.
- Every segmented route keeps a flat ordered stop list for compatibility.
- `route.stops` is the canonical executable waypoint list in the first
  implementation.
- Segment structure is stored beside the flat stop list as an additive overlay.
- Segment IDs and stop IDs are required for stable references.
- External/unknown segments are preserved raw instead of coerced into normal
  route segments.
- JSON/library export is the lossless format; Google/Apple export is explicitly
  lossy for segmented meaning.
- Per-segment `travelMode` and `routingProvider` behavior is deferred and must
  not affect first-release behavior.
- Print falls back to the existing flat-route behavior unless optional labels
  can be added cheaply and safely.

## Why keep a flat stop list

Keeping flat stops beside segment metadata gives Portal Route four useful
properties:

- existing load/export code can degrade gracefully
- older Portal Route builds can still open many segmented routes as simple routes
- route-library and Drive storage stay inspectable and recoverable
- the first implementation can be incremental instead of all-or-nothing

The tradeoff is duplicated structure. That is acceptable for the foundation
because the first release now has a strict rule: `route.stops` is authoritative
for executable behavior, and segments may annotate it but must not overrule it.

## Working assumptions

- Segment order matters and should be explicit.
- Some segments may not be Portal Route-owned.
- Some segments may not be routeable by Google or ORS.
- Not every segment should contribute equally to Google/Apple export.
- Some segmented routes will only have partial plotting/export support at first.

## Deterministic rules for the first implementation

### Source of truth

- `route.stops` is canonical for plotting fallback, map-app export, simple-route
  compatibility, and older-build behavior.
- `route.segments` is a structural overlay that references spans or anchors in
  the canonical stop list.
- If segment metadata disagrees with `route.stops`, the stop list wins for
  executable behavior and the segment becomes partial or non-executable.

### Normalization precedence

- canonical stop order is `route.stops` array order
- `route.segments` array order is the default segment display/export order
- `segmentOrder`, if present, may be normalized into array order on load/save
- validated stop anchors outrank cached `waypointRange`
- `waypointRange` must be treated as a convenience cache, not a stronger source
  of truth than anchors or flat stop order
- invalid ranges or anchors make a segment non-executable but preserve it as
  metadata when possible
- unknown or external payload is preserved but not trusted for routing

### Save/load behavior

- segmented routes save both canonical stops and segment metadata
- normalization may add missing stop IDs and segment IDs
- normalization must not silently reorder canonical stops to satisfy segment
  metadata
- newer builds should rewrite inconsistent `segmentOrder` into deterministic
  segment array order before save

### Plotting/export/print fallback

- executable plotting/export follows canonical stops plus validated conservative
  segment behavior
- Google/Apple export is intentionally lossy and falls back to flat route
  behavior when needed
- print uses the existing flat stop list in the first release

### Older-build fallback

- older builds that ignore segment metadata should still load the flat route
  from `route.stops`
- segment labels/types may be lost if an older build rewrites the route
- compatibility depends on preserving the canonical flat stop list

### Segment payload depth

Open choice:

- anchors only for `connector` and `transfer`
- anchors plus optional interior stops
- anchors plus geometry only

Current recommendation:

- allow anchors plus optional interior stops, but do not require rich geometry
  in the first pass

### Schema version rollout

Open choice:

- upgrade every saved route to schema `2` on first write
- only write schema `2` for routes that actually use segments

Current recommendation:

- write schema `2` only for segmented routes in the first release that ships the
  foundation

Reason:

- less churn in route-library data
- easier debugging during rollout

## Degradation priorities

When Portal Route cannot fully honor segmented meaning, preserve in this order:

1. Route record loads.
2. Raw segment data survives round-trip.
3. Flat stop order survives when present.
4. Plotting degrades visibly.
5. Export degrades with a warning.

What not to do:

- silently drop an external segment
- silently reorder flattened stops
- pretend a transfer is a normal routed portal sweep

## First implementation slice

Smallest useful slice:

1. Add segmented-capable schema parsing and normalization.
2. Add stop IDs and segment IDs.
3. Preserve segmented data through JSON/library round-trip.
4. Add read-only segmented Route List rendering.
5. Add basic plotting fallback for non-route segments.
6. Add map-export warnings when flattening omits segment meaning.

This is enough to validate the foundation before building editing tools.

## Risks to watch

- duplicated flat-plus-segment state drifting out of sync
- unclear route totals when some segments are non-route or external
- export confusion if Google/Apple output looks simpler than the saved route
- UI clutter if segmented headers are bolted onto the current Route List without
  restraint
- over-scoping into mission/banner features

## Questions for the next session

- Where should authoritative flattening/validation live: `route-model`,
  `route-library`, or a new schema helper?
- Should current-route JSON export format stay `portal-route.v1` with additive
  fields or move to a new format tag?
- Do connector/transfer segments need user-visible labels in the first UI slice,
  or are type badges enough?

## Recommended next agent/session

Recommended next agent: `implementation`

Recommended session brief:

- turn the data-model decisions into a file-level implementation plan
- identify the minimum parser/serializer/test surfaces
- keep UI work read-only and minimal
