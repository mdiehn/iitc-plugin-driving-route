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
- Segment structure is stored beside the flat stop list.
- Segment IDs and stop IDs are required for stable references.
- External/unknown segments are preserved raw instead of coerced into normal
  route segments.
- JSON/library export is the lossless format; Google/Apple export is explicitly
  lossy for segmented meaning.

## Why keep a flat stop list

Keeping flat stops beside segment metadata gives Portal Route four useful
properties:

- existing load/export code can degrade gracefully
- older Portal Route builds can still open many segmented routes as simple routes
- route-library and Drive storage stay inspectable and recoverable
- the first implementation can be incremental instead of all-or-nothing

The tradeoff is duplicated structure. That is acceptable for the foundation if
the implementation clearly defines which fields are authoritative in each code
path.

## Working assumptions

- Segment order matters and should be explicit.
- Some segments may not be Portal Route-owned.
- Some segments may not be routeable by Google or ORS.
- Not every segment should contribute equally to Google/Apple export.
- Some segmented routes will only have partial plotting/export support at first.

## Unresolved modeling choices

### Authoritative source of truth

Open choice:

- flat `route.stops` is authoritative, with segments as structure metadata
- segments are authoritative, with `route.stops` as a derived compatibility view

Current recommendation:

- for the first implementation, keep `route.stops` authoritative for backward
  compatibility and make segmented helpers validate against it

Reason:

- smaller implementation risk
- easier fallback to current save/load/export paths
- easier diff against existing route behavior

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
- Should print output be blocked for partial/unknown segmented routes at first,
  or allowed with warnings?
- Do connector/transfer segments need user-visible labels in the first UI slice,
  or are type badges enough?

## Recommended next agent/session

Recommended next agent: `implementation`

Recommended session brief:

- turn the data-model decisions into a file-level implementation plan
- identify the minimum parser/serializer/test surfaces
- keep UI work read-only and minimal
