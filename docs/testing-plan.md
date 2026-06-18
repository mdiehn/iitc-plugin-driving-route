# Segmented Route Testing Plan

Manual-first testing plan for the currently implemented Portal Route
segmented-route foundation slice.

## Purpose and scope

This plan defines concrete validation for the current segmented-route
foundation slice.

It is meant to protect current linear route behavior while checking the additive
segmented support that now exists in storage, import/export, persistence, and
degradation handling.

In scope for the implemented slice:

- current simple route regression behavior
- route library save/load compatibility
- segmented route storage and round-trip preservation
- current-route JSON import/export preservation
- localStorage and undo/redo segmented-state preservation
- flat-stop plotting/export behavior for segmented records
- route splitting and export-limit behavior
- unknown and external segment preservation
- migration and degradation behavior
- invalid or partial segmented-route data

Out of scope for this plan:

- full segmented-route editing coverage
- a new automated test framework
- production implementation details beyond the shipped foundation
- broad historical regression coverage outside features likely to be touched by
  segmented-route foundation work

## Current harness status

Current repo test automation is minimal:

- `npm run build` builds the userscript
- `npm run check` runs syntax validation on the built userscript
- `npm test` only runs those two commands

There is no existing behavioral test harness, browser UI harness, parser test
suite, or test runner for saved-route records. Validation is still primarily a
manual IITC/browser exercise.

Concrete validation assets added in this repo:

- fixture files under `docs/fixtures/segmented-routes/`
- manual step-by-step checks in `docs/segmented-routes-manual-checks.md`
- no automated parser/model/UI harness yet

## Segmented-route coverage matrix

| Area | Expected behavior | Current best verification method |
| --- | --- | --- |
| Existing linear route load | `schemaVersion: 1` linear routes still load and behave normally | Manual JSON import/load check |
| Segmented route load | `schemaVersion: 2` routes load with canonical flat `route.stops`, additive `route.segments`, and normalized `route.segmentOrder` intact enough for round-trip | Manual JSON import/load check |
| Stop and segment IDs | Stable stop IDs and segment IDs are preserved; missing IDs are handled conservatively | Manual fixture round-trip now; future parser tests |
| Flat stop compatibility | Canonical `route.stops` order survives load, save, export, print, and degradation paths without silent reorder | Manual round-trip now; future fixture tests |
| Route kind preservation | Linear routes stay explicitly linear; segmented routes do not silently collapse to flat-only internal state | Manual load/save review; future model tests |
| Route library save/load | Local route library preserves segmented metadata through save, load, update, delete, and overwrite flows | Manual IITC/browser checks |
| Single-route JSON export/import | Export/import is lossless for segmented metadata and flat-stop compatibility data | Manual round-trip now; future fixture tests |
| Whole-library JSON export/import | Mixed linear and segmented records survive export/import without dropping segmented payloads | Manual library round-trip check |
| Drive shared storage | Push/pull preserves segmented records without schema loss | Manual shared-storage checks |
| Route List display | Linear routes stay on the current flat Route List; segmented-only headers/badges are not implemented in this slice | Manual UI checks |
| Plotting `route` segments | Google and ORS beta plotting behavior stays unchanged because execution still follows flat canonical stops | Manual map comparison |
| Per-segment mode/provider scope | Segment metadata does not introduce active per-segment `travelMode` or `routingProvider` behavior in the first release | Manual settings/plot review; future model tests |
| Plotting `connector` / `transfer` segments | Segment records are preserved, but execution still uses flat canonical stops and does not yet add segment-type-specific map behavior | Manual map comparison |
| Plotting `external` / unknown segments | Raw segment data survives round-trip even though plotting still follows flat canonical stops | Manual load/plot checks |
| Summary and totals degradation | Totals remain the existing flat-route totals; no segmented-only summary model is introduced in this slice | Manual UI checks |
| Google/Apple export degradation | Map-app export is intentionally lossy and keeps staged export behavior, but this slice does not yet add segmented-specific warning copy | Manual export checks |
| Print degradation | Segmented routes print using the existing flat stop list | Manual print check |
| Route splitting and export limits | Existing staged link behavior still works for large routes and degraded segmented exports | Manual long-route export checks |
| Older-build degradation | Older Portal Route builds can still use the flat stop sequence when segmented metadata is ignored | Future compatibility fixture checks |
| Partial-support degradation | Unsupported or partially supported segment data remains stored without silent loss | Manual load/save/export checks |
| Invalid or partial segmented data | Missing anchors, unknown types, malformed payloads, or impossible flattening do not silently drop raw segment data | Manual negative cases now; future parser tests |

## Validation assets

Fixture directory:

- `docs/fixtures/segmented-routes/simple-v1-route-record.json`
- `docs/fixtures/segmented-routes/segmented-v2-route-record.json`
- `docs/fixtures/segmented-routes/invalid-segment-v2-route-record.json`
- `docs/fixtures/segmented-routes/mixed-library.json`
- `docs/fixtures/segmented-routes/segmented-v2-current-route.json`

Manual checklist doc:

- `docs/segmented-routes-manual-checks.md`

These assets cover the current repo's two relevant JSON surfaces:

- saved-route and route-library records imported through the library UI
- current-route JSON imported through the route export/import UI

## Manual regression checklist for current features

Keep this checklist concise. It is not meant to retest every historical feature.
It protects the current surfaces most likely to be affected by segmented-route
foundation work.

### Baseline sanity

- Run `npm run build`.
- Run `npm run check`.
- Confirm the plugin still loads in IITC after the segmented-route foundation
  change set is built.

### Saved routes and route library

- Save a normal linear route to the local route library.
- Load a saved route and confirm route order, route stats, and map view are
  preserved.
- Overwrite one saved route with the current route and confirm the selected
  record updates cleanly.
- Delete a saved route and confirm nearby route-library behavior still works.
- Export a saved route as JSON and import it back.
- Export the whole route library and import it back.

### Current route editing and display

- Build a normal route with portals, a manual point, Add me, and Home.
- Reorder route points and confirm the route recalculates as expected.
- Drag a point on the map and confirm the route updates.
- Use row-level editing flows such as rename, delete, set start, and set end.
- Use Bulk select to create or replace a route and confirm the result is still
  editable and savable.
- Confirm Route List behavior stays readable and uncluttered for normal linear
  routes.

### Routing providers and travel modes

- Plot a normal route with Google routing.
- Switch to ORS beta and confirm the route still plots.
- Switch between `drive`, `bike`, and `walk` and confirm route mode display and
  travel time behavior update correctly.
- Confirm per-mode speed display in the Route List still reflects current
  settings.
- Confirm global route engine settings still apply as expected.

### Export and route splitting

- Export a normal route to Google Maps and confirm the link opens.
- Export a long route and confirm staged Google Maps links still split
  correctly.
- Export a normal route to Apple Maps and confirm staged export behavior still
  works for longer routes.
- Confirm export-limit behavior remains consistent with current practical stop
  limits.

## Segmented-route expectations by subsystem

### Schema and normalization

- `schemaVersion: 1` linear routes remain valid and first-class.
- `schemaVersion: 2` is used only for routes that actually use segmented
  structure.
- Segmented routes preserve `route.kind`, canonical flat `route.stops`,
  additive `route.segments`, and normalized `route.segmentOrder`.
- `route.stops` remains the canonical executable waypoint list.
- Segmented load paths must not silently reorder or rewrite canonical flat
  stops when degradation is required.
- Validated stop anchors outrank cached `waypointRange`.
- Invalid segment ranges or anchors produce partial/non-executable segments
  without destructive repair.

### Storage and round-trip preservation

- Local route library preserves segmented metadata on save/load/update/delete.
- Single-route JSON export/import is the lossless path for segmented data.
- Whole-library JSON export/import preserves mixed linear and segmented records.
- Google Drive shared storage preserves segmented records without stripping
  unknown or external payloads.
- Reload persistence and undo/redo preserve segmented metadata when the
  canonical stop sequence has not changed.
- Stop-sequence edits clear stale `routeStructure` overlay state instead of
  forcing it to survive a mismatch.

### Display

- Linear routes keep the existing flat Route List presentation.
- This slice does not add segmented headers, labels, badges, or grouped rows.
- Unknown or external segment metadata should survive storage round trips even
  when the Route List stays flat.

### Plotting

- Canonical flat `route.stops` preserve current Google and ORS beta plotting
  behavior.
- Route-level travel mode and routing provider remain authoritative for the
  first release.
- `connector`, `transfer`, `external`, and unknown segments are preserved as
  metadata, but this slice does not add per-type plotting behavior.
- A plotting failure in one segment must not wipe other segment data or the
  route record itself.

### Export

- Route-library and JSON export stay lossless for segmented structure.
- Google Maps and Apple Maps export are intentionally lossy for segmented
  meaning and operate on a flattened export plan.
- Export follows canonical `route.stops` when segment metadata is partial,
  invalid, or ignored.
- Existing staged export behavior for long routes remains intact.
- Export does not yet include segmented-specific warning copy; manual checks
  should confirm the flat-stop fallback remains executable and unsurprising.

### Print

- First-release print follows the existing flat-route behavior.
- Print uses canonical `route.stops`.
- Segment-aware print grouping is not part of this implemented slice.

### Migration and degradation

- Older Portal Route builds should still be able to use a segmented route's flat
  stop sequence when segmented metadata is ignored.
- Newer builds must preserve the canonical flat stop list so older builds have a
  best-effort fallback path.
- Newer builds with partial support must keep the route loadable and preserve
  raw segment data.
- Linear routes must not be auto-converted to segmented routes unless a
  segmented-only feature explicitly requires it.

### Invalid or partial data handling

- Missing anchors, mismatched waypoint ranges, unknown segment types, duplicate
  IDs, and malformed payloads should fail conservatively.
- Raw unknown or external segment payloads must not be silently dropped.
- If flattening is impossible, the route should remain loadable and the failure
  should surface as partial plotting/export support rather than destructive data
  loss.

## Concrete checks covered now

The manual checklist and fixture set now give concrete coverage for:

- v1 simple route compatibility
- v2 segmented route preservation
- route-schema normalization entry points used by saved-route and current-route
  import
- current-route JSON import/export round trips
- saved-route and whole-library save/load round trips
- invalid-segment preservation
- unknown/custom segment field preservation
- flat-stop fallback for Google Maps, Apple Maps, and print
- undo, redo, localStorage `routeStructure`, and reload persistence checks
- mixed local and Google Drive library round trips
- schema-version behavior where simple routes stay `1` and segmented routes use
  `2` only when segment metadata exists

Still future work if the repo ever gains a harness:

- parser-level normalization assertions
- storage mock tests
- UI rendering tests
- provider-specific plotting regression automation
- segmented UI/editor behavior once that work exists

## Harness gaps

- No automated behavioral test framework, directory, or test runner exists.
- `npm test` is build plus syntax validation, not feature verification.
