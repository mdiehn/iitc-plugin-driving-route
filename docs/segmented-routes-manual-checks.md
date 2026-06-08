# Segmented Route Manual Checks

Concrete manual validation for the segmented-route foundation slice.

Use these checks with the fixture files in `docs/fixtures/segmented-routes/`.
They are written for the current repo state: no behavioral harness, no parser
unit tests, and no browser automation.

## Fixture set

- `simple-v1-route-record.json`
  Expected use: saved-route import and v1 compatibility checks.
- `segmented-v2-route-record.json`
  Expected use: saved-route import, save/load, export, print, and flat-stop
  fallback checks.
- `invalid-segment-v2-route-record.json`
  Expected use: invalid-segment preservation, unknown-field preservation, and
  degraded plotting/export checks.
- `mixed-library.json`
  Expected use: whole-library import/export and mixed local/Drive storage checks.
- `segmented-v2-current-route.json`
  Expected use: current-route import/export round-trip checks.

## Prep

1. Run `npm run build`.
2. Run `npm run check`.
3. Load the built plugin in IITC.
4. Open browser devtools so localStorage and exported JSON can be inspected.
5. Start with an empty local route library if you want clean counts.

## JSON surfaces to inspect

Saved route record shape:

- top-level `schemaVersion`
- `route.kind` for segmented routes
- `route.stops`
- `route.segments`
- `route.segmentOrder`

Current-route export shape:

- top-level `format`
- top-level `stops`
- top-level `routeSchemaVersion`
- top-level `routeData.kind`
- top-level `routeData.stops`
- top-level `routeData.segments`
- top-level `routeData.segmentOrder`

Persistent localStorage keys:

- `iitc-portal-route-stops`
- `iitc-portal-route-route`
- `iitc-portal-route-route-structure`
- `iitc-portal-route-route-dirty`
- `iitc-portal-route-library`
- `iitc-portal-route-drive-library-cache`

## Script 1: v1 saved-route compatibility

1. Open the route library and import `simple-v1-route-record.json`.
2. Load the imported route.
3. Confirm the route list shows a normal flat list with no segmented-only UI.
4. Export the saved route back out from the library.
5. Inspect the exported file.

Expected JSON:

- `schemaVersion` stays `1`.
- `route.stops` still has exactly 3 stops.
- `route.segments` is absent.
- `route.kind` is absent.

Expected IITC behavior:

- The route loads normally.
- Google and Apple export options work from the flat stop list.
- Loop and unloop still behave like a normal simple route.
- Replot keeps working for the simple route after load and after edits.

## Script 2: current-route segmented import/export round trip

1. Use current-route import to import `segmented-v2-current-route.json`.
2. Confirm the current route loads without needing a saved-route/library step.
3. Export the current route as JSON.
4. Import the just-exported file again.
5. Inspect both exported files.

Expected JSON:

- `format` stays `portal-route.v1`.
- `routeSchemaVersion` is `2`.
- `routeData.kind` is `segmented`.
- `stops.length` matches `routeData.stops.length`.
- `routeData.segmentOrder` matches the two segment IDs in order.
- Stop IDs such as `stop-home` and segment IDs such as `segment-downtown`
  survive the round trip.

Expected IITC behavior:

- The route list keeps the same stop order before and after re-import.
- The route remains editable and can be replotted.
- No segment metadata is dropped during current-route export/import.

## Script 3: mixed library save/load/overwrite/delete

1. Import `mixed-library.json` into the route library.
2. Confirm at least 3 routes appear, including one v1 route, one valid
   segmented v2 route, and one invalid/external segmented v2 route.
3. Load each route once.
4. With the valid segmented route loaded, save it back over itself.
5. Uncheck the selected route, then save the same current route as a new copy.
6. Delete one copied route.
7. Export the whole library.
8. Inspect the exported library JSON.

Expected JSON:

- Top-level `schemaVersion` is `2` once the library contains any segmented route.
- The v1 route record remains `schemaVersion: 1`.
- The valid segmented route still has `route.kind`, `route.segments`, and
  `route.segmentOrder`.
- The invalid segmented route still contains `segment-bad-anchor`.
- The invalid segmented route still contains `customField.keepMe`.

Expected IITC behavior:

- Mixed v1/v2 routes can coexist in the same library.
- Loading a v1 route does not erase later segmented routes from the library.
- Overwrite/save/delete flows keep working with the mixed library.

## Script 4: invalid-segment preservation and flat-stop fallback

1. Import `invalid-segment-v2-route-record.json` as a saved route.
2. Load it into the current route.
3. Export the saved route from the library.
4. Export the current route as JSON.
5. Inspect both exports.
6. Use Google Maps export.
7. Use Apple Maps export.

Expected JSON:

- `route.stops` or current-route `stops` still contains exactly the 3 canonical
  flat stops.
- `segment-bad-anchor` is still present after load/save/export.
- `customField.keepMe` is still `true`.
- The invalid `waypointRange` and unknown `endAnchor.stopId` are still preserved
  as metadata.

Expected IITC behavior:

- The route stays loadable even with invalid segment metadata.
- Google Maps and Apple Maps export still build links from flat stops.
- Export should not depend on the invalid anchor to succeed.
- The app should not crash or silently delete the invalid segment payload.

## Script 5: route-library and Drive round trip

1. Start from `mixed-library.json` imported locally.
2. Switch route storage to Google Drive.
3. Push the library.
4. Pull the library back into a fresh session or after clearing the local view.
5. Export the Drive-backed library and inspect it.

Expected JSON:

- The pulled/exported library still contains all mixed routes.
- Segmented records still contain `route.segments` and `route.segmentOrder`.
- Invalid/external payloads still contain custom fields.

Expected IITC behavior:

- Push and pull complete without schema downgrade.
- Mixed v1/v2 records remain selectable and loadable after Drive sync.

## Script 6: undo, redo, and localStorage routeStructure coverage

1. Load `segmented-v2-route-record.json`.
2. Open devtools and inspect `iitc-portal-route-route-structure`.
3. Make a route edit that changes the current route state.
4. Undo the edit.
5. Redo the edit.
6. Reload IITC.
7. Inspect localStorage again after reload.

Expected JSON:

- `iitc-portal-route-route-structure` exists for the segmented route.
- It includes `kind`, `segments`, and `segmentOrder`.
- The stop list remains in `iitc-portal-route-stops`.
- After reload, `routeStructure` still matches the segmented route.

Expected IITC behavior:

- Undo and redo keep segmented structure aligned with the current stop list.
- Reload restores the segmented structure instead of flattening it away.
- Route recalculation can mark the route stale/replot without losing structure.

## Script 7: flat-stop behavior and regressions around simple routes

1. Load `simple-v1-route-record.json`.
2. Enable Loop, then disable it again.
3. Change route line color, thickness, and style.
4. Replot the route.
5. Print the route.

Expected IITC behavior:

- Loop and unloop still operate on the flat route.
- Route line appearance settings still apply.
- Replot works without segmented-only side effects.
- Print still renders the flat stop list safely.

## Script 8: segmented route export, print, and stale/replot behavior

1. Load `segmented-v2-route-record.json`.
2. Export to Google Maps.
3. Export to Apple Maps.
4. Print the route.
5. Make a small route edit so the route becomes stale.
6. Replot it.

Expected JSON or URL behavior:

- Google and Apple export use the flat stop order from `route.stops`.
- Export stage splitting still follows stop-count limits if you extend the route.

Expected IITC behavior:

- Print degrades to the existing flat-route layout.
- Stale/replot behavior still works after segmented-route load.
- Export remains executable even though segmented meaning is lossy.

## Gaps that still need human IITC verification

- Exact Route List segmented headers or badges once the UI slice lands.
- Provider-specific plotting differences between Google and ORS for segmented
  route sections.
- Any user-facing warning copy for flattened or omitted segment meaning.
- Browser-specific popup behavior for staged Google/Apple export dialogs.
