# Segmented Routes Working Notes

Working notes after the segmented-route foundation implementation and
fixture-validation slices.

## Scope guardrails

- This is foundation work only.
- Keep existing linear routes first-class.
- Keep Mission/Banner Companion out of the design boundary.
- Treat external producers as import/export neighbors, not dependencies.
- Do not require a destructive route-library migration.

## Foundation decisions now implemented

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
- Print falls back to the existing flat-route behavior.

## What this branch actually added

- segmented-capable schema normalization for saved-route records and current
  route JSON
- stable stop/segment IDs during normalization
- per-route `schemaVersion` handling where simple routes stay `1` and routes
  only write `2` when segment metadata exists
- route-library, current-route JSON, localStorage, undo/redo, and Drive
  round-trip preservation for additive segmented metadata
- stale `routeStructure` clearing when canonical stop-sequence edits change the
  flat route

## What this branch did not add

- a segmented route editor
- segmented Route List grouping, headers, or badges
- segment-aware plotting behavior by type
- segment-aware print layout or export warnings
- mission or banner features

## Why keep a flat stop list

Keeping flat stops beside segment metadata gives Portal Route four useful
properties:

- existing load/export code can degrade gracefully
- older Portal Route builds can still open many segmented routes as simple routes
- route-library and Drive storage stay inspectable and recoverable
- the first implementation can be incremental instead of all-or-nothing

The tradeoff is duplicated structure. That is acceptable for the foundation
because the current rule is strict: `route.stops` is authoritative for
executable behavior, and segments may annotate it but must not overrule it.

## Deterministic rules in the implemented slice

### Source of truth

- `route.stops` is canonical for plotting fallback, map-app export,
  simple-route compatibility, older-build behavior, and print fallback.
- `route.segments` is a structural overlay that references spans or anchors in
  the canonical stop list.
- If segment metadata disagrees with `route.stops`, the stop list wins for
  executable behavior and the segment becomes partial or non-executable.

### Normalization precedence

- canonical stop order is `route.stops` array order
- `route.segments` array order is the default segment display/export order
- `segmentOrder`, if present, may be normalized into array order on load/save
- validated stop anchors outrank cached `waypointRange`
- `waypointRange` is a convenience cache, not a stronger source of truth than
  anchors or flat stop order
- invalid ranges or anchors preserve the segment metadata but do not change
  canonical stop order
- unknown or external payload is preserved but not trusted for routing

### Save/load behavior

- segmented routes save both canonical stops and segment metadata
- normalization may add missing stop IDs and segment IDs
- normalization must not silently reorder canonical stops to satisfy segment
  metadata
- newer builds rewrite inconsistent `segmentOrder` into deterministic segment
  array order before save
- stop-sequence edits clear stale overlay state instead of leaving a mismatched
  `routeStructure` behind

### Plotting/export/print fallback

- executable plotting/export follows canonical flat stops
- Google/Apple export is intentionally lossy and falls back to the flat route
  behavior
- print uses the existing flat stop list

### Older-build fallback

- older builds that ignore segment metadata should still load the flat route
  from `route.stops`
- segment labels/types may be lost if an older build rewrites the route
- compatibility depends on preserving the canonical flat stop list

### Schema version rollout

- simple routes remain `schemaVersion: 1`
- only routes with segmented metadata write `schemaVersion: 2`
- this keeps route-library churn down and keeps rollout/debugging simpler

## Degradation priorities

When Portal Route cannot fully honor segmented meaning, preserve in this order:

1. Route record loads.
2. Raw segment data survives round-trip.
3. Flat stop order survives when present.
4. Flat-stop plotting/export stays executable.

What not to do:

- silently drop an external segment
- silently reorder flattened stops
- pretend a segmented editor exists when this branch only shipped storage
  foundation

## Implemented slice summary

Completed slice:

1. Added segmented-capable schema parsing and normalization.
2. Added stop IDs and segment IDs.
3. Preserved segmented data through current-route JSON, route-library, Drive,
   localStorage, and undo/redo round trips.
4. Kept execution on canonical flat stops and cleared stale overlay state when
   stop-sequence edits would desynchronize the structure.

Deferred slice:

1. Read-only segmented Route List rendering.
2. Segment-type-specific plotting fallback.
3. User-facing export warnings for flattened segment meaning.

## Risks to keep watching

- duplicated flat-plus-segment state drifting out of sync
- unclear user expectations if JSON preserves segmented structure but the UI
  stays flat
- export confusion if Google/Apple output looks simpler than the saved route
- over-scoping into mission/banner features

## Questions for the next session

- Does the current fixture/manual coverage catch every blocker-level regression
  around save/load, reload, and Drive round trips?
- Should the next segmented UI slice start in the Route List, the library, or a
  separate read-only detail view?
- What is the smallest honest user-facing warning copy for flattened map-app
  export?

## Recommended next agent/session

Recommended next agent: `gatekeeper`

Recommended session brief:

- review this branch for merge readiness after the storage foundation and docs
- call out any remaining manual validation blockers
- keep future segmented UI/editor scope separate from this completed foundation
