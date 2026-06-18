# Roadmap

Latest release: `1.6.0`

Portal Route is now in a stable feature-building phase. The core workflow is usable: add portals, manual points, current location, and saved Home; drag, reorder, remove, loop, reverse, and edit route points; choose travel mode and routing engine; customize route line color, thickness, and style; export to staged Google Maps links; import/export JSON; print; and keep state across reloads.

Recent releases have focused on making the plugin more comfortable for real use: better mobile controls, route library improvements, route-provider support, pinned action bars in long panels, Home location support, and more visible route controls in the Route List.

## Unreleased branch work: segmented-route foundation

Current branch status:

- Current-route JSON, saved-route records, whole-library JSON, local persistence, undo/redo, and Drive-backed library flows now preserve segmented-route metadata when it exists.
- Simple routes remain first-class flat routes on `schemaVersion: 1`.
- `schemaVersion: 2` is only written when a route actually carries segmented metadata.
- `route.stops` remains the canonical executable waypoint list.
- `route.segments` and `route.segmentOrder` are additive structure metadata and do not override canonical stop order.
- Stop-sequence edits clear stale segmented overlay state instead of trying to keep mismatched segment metadata alive.

Still future:

- a segmented route editor
- Route List segment headers/badges beyond the existing flat route workflow
- segment-aware plotting, totals, print grouping, or export warnings beyond flat-stop fallback
- mission or banner workflows

## Current state: 1.6.0

### Route building and editing

- Add portals from the IITC portal details panel.
- Add manual map points.
- Add current location.
- Add saved Home as an editable route waypoint.
- Pick Home from a selected portal or map point.
- Show Home with distinct marker styling.
- Rename manual/map points.
- Drag manual points and route handles.
- Replace waypoints by dragging numbered labels:
  - drop near a loaded portal to replace with that portal
  - drop elsewhere to replace with a manual map point
- Reorder waypoints from the Route List.
- Remove waypoints from the Route List or selected-point controls.
- Undo recent route edits.
- Loop/unloop routes.
- Reverse routes.
- Fit the map to the current route.
- Keep the current route across IITC reloads.

### Routing, timing, and display

- Calculate route geometry automatically after edits.
- Replot stale routes explicitly when needed.
- Choose travel mode.
- Choose routing provider, including Google and OpenRouteService-backed routing.
- Configure per-mode average speeds for travel-time estimates.
- Configure per-stop wait times and default stop time.
- Show route summary time, stop time, trip time, and distance.
- Show per-leg time and distance in the Route List.
- Optionally show segment labels on the map.
- Customize route line color, thickness, and style.

### Export, printing, and route library

- Export staged Google Maps links, including handling routes over the practical 11-point limit.
- Export Apple Maps links.
- Print route summaries.
- Save and load routes in the route library.
- Export and import a saved route as JSON.
- Export and import the whole route library as JSON.
- Use Google Drive shared storage for route-library data.
- Preserve route state, route library records, and Home waypoint metadata through save/load and JSON import/export.

### UI baseline

- Mini-control provides compact map access to Maps export, route list, add/remove, and menu actions.
- Route List is the main working panel for route editing and route actions.
- Route Library is separate from the current-route editor.
- Settings holds global routing, provider, route-line appearance, and Home settings.
- Route List, Route Library, and Settings use scrollable content with pinned action bars.
- Embedded IITC portal-details behavior is left to IITC as much as possible.

## Recent progress since 1.1.0

The original post-1.1 roadmap focused heavily on route-library structure and storage. Most of that foundation is now done. Since then, the project has added or improved:

- route library save/load workflows
- route and library JSON import/export
- Google Drive shared route storage
- Google and OpenRouteService routing support
- travel mode selection
- automatic stale-route replot behavior
- manual and portal waypoint dragging/replacement
- route looping and reversing
- Google Maps staged export behavior
- Apple Maps export
- compact mini-control refinements
- mobile panel and button behavior
- route line appearance settings
- saved Home location support
- pinned action bars for long standalone panels
- external route import API for other IITC plugins
- first-pass bulk portal selection from shapes

## Future topic index

Topics discussed for future work:

- segmented-route UI and workflow beyond the current storage foundation
- Route Follow Mode
- bulk portal selection and optimized route building
- route splitting and export-limit handling
- per-leg and multi-modal routing
- route-line styling by travel mode
- route library and shared-storage polish
- shared map/route handoff between devices
- waypoint dragging, snapping, and selected-waypoint actions
- bookmark, polygon/circle, and mission-based route creation
- routing/export destinations beyond Google and Apple Maps
- IITC update/install polish and release ergonomics

## Route Follow Mode

Goal: make Portal Route behave more like a navigation companion while traveling along a planned route.

Planned ideas:

- follow the user’s current location more smoothly than IITC’s default behavior
- keep more route ahead visible than behind
- shift the map after the user moves a configurable amount through the visible route
- optionally rotate the map in the direction of travel if Leaflet/IITC support makes it clean enough
- show portals in a configurable corridor around the route
- support configurable look-ahead distance or look-ahead percentage
- limit Intel/IITC portal refreshes by corridor size, movement threshold, and update rate

Design caution:

- avoid excessive Intel data polling
- avoid surprising map jumps
- make the behavior easy to turn off
- keep the defaults conservative

## Bulk portal selection and optimized route building

Goal: create routes from groups of portals instead of adding every portal one at a time.

Possible inputs:

- IITC bookmarks or bookmark folders
- selected portals inside a bounding box
- selected portals inside a polygon or circle
- selected portals from Draw Tools shapes, if integration is practical
- portals associated with a mission, if a reliable source is available

Possible route-building modes:

- preserve the user’s selected order
- nearest-neighbor ordering
- optimized route ordering through an external service
- start/end-fixed optimization
- loop optimization

Open questions:

- how large can a generated route get before UI and export workflows become awkward?
- should Portal Route warn at selection-size thresholds?
- should generated routes preview before replacing the current route?
- how should route optimization handle portals that require walking or biking paths?

## Route splitting and export-limit handling

Google Maps export has practical waypoint limits. Portal Route already stages Google Maps links for longer routes, but this can be clearer.

Future polish:

- clearer stage naming
- clearer explanation of why staged links are needed
- better handoff instructions for mobile use
- optional route splitting preview
- warnings when export destinations will omit intermediate stops
- better handling of the first/last plus intermediate-stop limit

## Per-leg and multi-modal routing

Goal: allow a route to mix travel modes, such as driving to an area, walking a group of portals, then driving again.

Possible work:

- per-leg travel mode
- per-leg routing provider choice, if needed
- different line textures or styles by mode
- mode-aware time summaries
- clearer total time vs. drive/walk/bike time
- route-list controls that do not make the UI too crowded

This should probably be a focused minor release because it touches route records, UI, summaries, rendering, and export behavior.

## Segmented-route UI and workflow

Current state:

- The additive segmented-route storage foundation exists on this branch.
- Flat routes still run on canonical `route.stops`.
- JSON/library/Drive round trips can preserve `route.segments` metadata.
- Portal Route does not yet provide a segmented route editor or segmented-only route execution behavior.

Future work:

- decide how segmented structure should appear in the Route List without cluttering normal routes
- add user-facing segmented-route creation and editing flows
- decide whether segment headers, badges, or a separate read-only structure view is the best first UI
- add explicit partial-support messaging when segmented meaning is flattened for print or map-app export
- keep mission/banner-specific flows out of scope unless they become a separately approved project

## Route line styling by mode

Current state:

- users can choose route line color, thickness, and style globally.

Possible future work:

- default styles per travel mode
- different styles for drive, bike, walk, and mixed-mode legs
- style presets that are easy to see on the IITC map
- accessible defaults that remain visible over busy portal/link fields

## Route library and shared-storage polish

Current state:

- local route library works
- route and library JSON import/export works
- Google Drive shared storage exists

Future polish:

- make shared-storage status clearer
- improve conflict handling when two devices edit the library
- make Save vs. Save As behavior clearer if field use shows confusion
- improve route metadata display
- possibly add route folders/tags later
- keep the route record schema stable enough for future migrations

## Shared map and route handoff

Goal: let desktop and phone hand off the current map/route context without pretending to do live sync.

Possible first version:

- Save shared view
- Load shared view

Possible shared snapshot:

```json
{
  "schemaVersion": 1,
  "pluginVersion": "1.6.0",
  "updatedAt": "2026-05-16T12:00:00.000Z",
  "deviceName": "desktop",
  "map": {
    "center": { "lat": 43.642, "lng": -72.251 },
    "zoom": 15
  },
  "selectedPortalGuid": "...",
  "activeRouteId": "route-..."
}
```

Avoid automatic polling or live sync at first. Auto-sync adds conflict handling, stale writes, network weirdness, mobile battery concerns, and surprising map jumps.

## Waypoint dragging, snapping, and selected-waypoint actions

Waypoint dragging works, but still needs field testing.

Future polish:

- tune snap distance threshold
- add better snap-target feedback while dragging
- decide whether snapping should happen live during drag or only on drag end
- confirm manual-to-portal, portal-to-portal, and portal-to-map-point replacement on mobile
- decide whether to add explicit Set Start and Set End actions
- keep Home waypoints normal and editable rather than special-casing them too much

## Bookmark, polygon/circle, and mission-based route creation

Related to bulk selection, but focused on input sources.

Possible work:

- import portals from a bookmark folder
- select portals inside a polygon/circle
- integrate with Draw Tools if it avoids too much coupling
- explore whether mission portal lists can be read reliably
- provide a review step before committing generated route points

## Routing and export destinations

Possible future targets:

- Waze links
- GPX export
- KML export
- copied stop list for external tools
- clearer Google Maps stage handoff
- provider-specific warnings when an export target cannot represent the full route

## IITC integration and release ergonomics

Keep these habits unless there is a reason to change them:

- avoid fighting IITC’s own portal-details/sidebar behavior
- keep generated `dist/` files out of normal source-change tarballs unless preparing a release
- update generated userscript and meta files for release builds
- keep install/update URLs aligned with the intended release branch
- keep changelog entries under the correct dev/release version
- use short, user-facing release notes
- provide tarballs with whole updated files when that is easier to review than patches
