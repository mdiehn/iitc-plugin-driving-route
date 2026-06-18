# Changelog

This project is in active development.

Latest release: `1.6.0`

## Unreleased

### Added

- Added segmented-route foundation support for current-route JSON, saved-route records, whole-library JSON, local route-library storage, and Google Drive round trips.
- Added segmented-route fixture files and manual validation docs under `docs/fixtures/segmented-routes/` and `docs/segmented-routes-manual-checks.md`.

### Changed

- Simple routes remain `schemaVersion: 1`.
- Routes write `schemaVersion: 2` only when segmented metadata exists.
- `route.stops` remains the canonical executable waypoint list, while `route.segments` and `route.segmentOrder` remain additive metadata for newer builds.
- Segmented route support in this slice is storage/import/export foundation only; no segmented route editor or mission/banner workflow is included.

### Fixed

- Clear stale segmented route-structure overlay state when stop-sequence edits change the canonical flat route.

## 1.6.0 - Released 2026-05-16

### Added

- Added configurable route line color, thickness, and style settings.
- Added saved Home settings with Home name, latitude, and longitude.
- Changed Home setup so selected portals can be saved as Home directly; otherwise Home is picked by tapping the map.
- Added Add Home, which adds the saved Home point and selects it so existing route actions can immediately set it as the start or end.
- Added a distinct Home marker icon while keeping Home waypoints draggable and selectable like other map points.
- Pick Home on map and Set Home to portal now save Home and add or update the interactive Home waypoint immediately.
- Added Loop/Unloop controls beside Fit on the info panel and route list panel.
- Moved Reverse route to the route list panel and ordered the route list action buttons as Del, Undo, Loop, Fit, Reverse, Print, Save, Load, Menu.
- Widened the Home latitude and longitude fields.
- Kept the Route List, Settings, and Route Library action bars pinned while their long content scrolls.

### Fixed

- Fixed Route List scrolling after pinning its action bar.
- Kept Route Library buttons pinned while the saved-route list scrolls.

## 1.5.0 - Released 2026-05-09

### Added

- Added internal `drive`, `bike`, and `walk` travel modes.
- Added settings for default travel mode and per-mode average speed estimates.
- Added small export-provider wiring around Google Maps so travel modes can map cleanly to provider-specific export parameters.
- Added OpenRouteService as an opt-in beta routing provider for route geometry.
- Added OpenRouteService API key and base URL settings.

### Changed

- Route and leg travel times now use the selected travel mode and configured average speed while keeping distance calculation unchanged.
- Google Maps route calculation and export now map Portal Route travel modes to Google's `driving`, `bicycling`, and `walking` modes.
- ORS beta maps Portal Route modes to `driving-car`, `cycling-regular`, and `foot-walking`.
- Saved routes, route JSON, restored state, and undo snapshots now carry travel-mode and routing-provider settings without exporting ORS API keys.
- Keep travel mode and speed controls with the route list, while routing-provider and API credential fields stay in global settings with wider text inputs.

## 1.4.1 - Released 2026-05-09

### Fixed

- Removed the hardcoded Google Drive credential from Portal Route.
- Prefer IITC Sync's existing Google auth session for Drive actions when it is available.
- Fall back to a user-configured Google Drive OAuth Client ID in Portal Route settings when Sync auth is not available.
- Show a clear user-facing message when Drive is used without either Sync auth or a configured OAuth Client ID.

## 1.4.0 - Released 2026-05-09

### Added

- Keep the Bookmarks bulk-select picker and follow-on preview larger and anchored near the clicked menu item.
- Added Bookmarks folder support to bulk selection, using saved portal positions from IITC Bookmarks.
- Added start/end portal choices to bulk selection preview so selected portals can be ordered between explicit endpoints.
- Open the shape selector chooser beside the Bulk select menu item instead of replacing the main menu.
- Added first-pass shape selection for loaded IITC portals, with circle/polygon drawing, preview counts, add-to-route, and replace-route actions.
- Added graduated preview notes for larger shape selections so users get a heads-up before building chunky routes.
- Made shape-selection drawing easier to see with higher-contrast vertices, live connecting lines, and translucent polygon/circle fills.

## 1.3.1 - Released 2026-05-08

### Fixed

- Hide Portal Route controls injected into the IITC portal info panel when the Portal Route layer is turned off.

## 1.3.0 - Released 2026-05-08

### Added

- Added clearer manual-point placement feedback, including a small panel/info-panel hint while Add placement mode is armed.
- Added a stronger stale-route cue with a highlighted Replot button, stale compact stats, and a Menu Route/Replot fallback.
- Added Undo to the shared Menu.

### Changed

- Continued the button/menu helper refactor by normalizing Route/Replot, map export menu items, mini-control button options, and shared control class names through the helper layer.
- Started the button/menu helper refactor by extracting shared Portal Route helpers for smart buttons, mini-control buttons, and context menus without intended behavior changes.
- Add now toggles manual point placement when nothing is selected, so pressing Add again cancels placement mode.
- Escape now cancels manual point placement on desktop.
- Opening Menu, Maps, Route, Library, or Settings cancels manual point placement.
- Route row buttons use compact symbols on mobile while keeping full Up/Dn/Del labels on wider screens.
- The shared Menu now has a direct Route/Replot action, with the route list split out as Route List.

### Fixed

- Clear Portal Route's cached selected portal when IITC unselects a portal, so Add can enter manual point placement mode again.

## 1.2.0 - Released 2026-05-06

### Added

- Added a direct **Add** / **Del** control in the route list and portal info panel.
- Restored compact **Up**, **Dn**, and **Del** controls on each editable route row.
- Added small route stats to the portal info panel: total time, drive time, wait time, and distance.
- Added Undo for recent route edits, including adds, deletes, moves, imports, route loads, loop changes, and wait-time changes.
- Added one shared **Menu** smart button for Add me, Loop, Clear Route, Save, Google Maps, Apple Maps, Route, Library, and Settings.
- Added an active manual-point placement state for **Add**, including a crosshair cursor on desktop.

### Changed

- Loop mode now keeps start/end marker letters visible and only changes their styling to loop-blue.
- Replaced the separate panel Actions, Maps, and Menus smart buttons with the shared **Menu** button.
- Kept the mini control exception layout as **M**, **L**, **+/-**, **count**, **=**, with **M** for map exports and **=** for Menu.
- Make compact route stats in the info panel slightly more visible while keeping them small.
- Removed native browser/mobile tooltips from controls; controls now use accessible labels instead.
- Restored the mini-control **=** button to the normal black mini-control styling.

### Fixed

- Fixed mini-control **+** on an empty route so a selected portal is added before falling back to manual waypoint add mode.
- Fixed **Add** with nothing selected so it arms manual map-point placement instead of adding current location.

## 1.1.0 - Released 2026-05-03

### Added

- Added route library design notes for the planned v1.1.0 save/load and Google Drive shared storage work.
- Wired Save and Load to a local route library stored in this browser.
- Added schemaVersion 1 saved route records with route metadata, stops, map center/zoom, and route-relevant settings.
- Added inline rename, update, delete, and JSON import/export actions for locally saved routes.
- Added whole-library JSON export and import/merge for the local route library.
- Changed the route library to select rows with checkboxes and use bottom action buttons for selected routes.
- Let route library checkboxes select multiple routes, with Load/Update limited to one route and Export/Delete supporting multiple routes.
- Simplified the mini control, settings panel, route list, and info panel toward the new smart Add workflow.
- Added a shared Add context menu for right-click and long-press actions.
- Moved route-list row actions into a row context menu with delete, rename, set start, and set end.
- Updated remaining route status text for automatic routing.
- Replaced the Settings panel Add button with Recalc Route for manual route refreshes.
- Added Save to the Route Library panel, with confirmation before overwriting a checked saved route.
- Moved single-route Import to the Route Library action row.
- Removed hidden auto-replot and old row-action plumbing after the smart Add refactor.
- Kept the Route Library panel in place while changing row checkbox selection.
- Kept the Route Library panel in place after save, update, delete, and import actions.
- Automatically recalculated routes loaded from the library or restored from saved state.
- Fixed double-clicking a map route handle to open the route list instead of settings.
- Restored the Loop toggle to the mini control under Maps.
- Updated README screenshots for the refreshed controls, route list, settings panel, and route library.
- Set default dialog sizes for settings, route list, and route library panels.
- Updated design docs for smart Add, automatic routing, and current route-library behavior.
- Added an active route-library storage backend helper so the UI can move beyond localStorage.
- Stamped dev build versions with `YYYYMMDDHHMMSS` so userscript updaters notice fresh builds.
- Added an initial Google Drive route-library backend with manual Connect, Pull, and Push actions.
- Added Drive-backed route-library caching with a visible `IITC Portal Route/route-library.json` file.
- Added Route Library panel messages for save/load/import/export and Drive actions.
- Added a shared Route menu for Route, Library, and Settings navigation.
- Added staged Apple Maps route export links from the route list and info panel.
- Made Maps a smart menu with Google Maps and Apple Maps choices.

### Changed

- Refactored route panel event handling and map marker rendering into smaller helpers.
- Tightened imported settings handling so only known settings are applied.
- Moved day-to-day route actions onto the route list footer, grouped the footer actions, and shortened route-list labels.
- Tightened the app panel width and added Clear Route to the Data group.
- Moved route summary info to the top of the route list panel and show distance in miles and kilometers.
- Slimmed the settings panel by moving route actions and summary details into the route list workflow.
- Replaced the settings panel Data box with a Route Library button.
- Replaced repeated Route/Library/Settings navigation buttons with a distinct smart menu button.
- Styled the smart route action button separately and renamed smart Add surfaces to Actions.
- Kept portal details controls from disappearing after dismissing a context menu.
- Made Actions and Menus smart buttons open menus consistently on left-click.
- Renamed smart buttons to Actions and Menus, revised the Actions menu, and added Fit to the info panel.
- Added Loop to start and Reverse route controls to the settings panel.

## 1.0.0 - Released - 2026-05-02

### Added

- Manual map point dragging from map handles and numbered labels.
- Waypoint replacement dragging from numbered labels: drop near a loaded portal to replace the waypoint with that portal, or drop elsewhere to replace it with a manual point.
- Portal details panel controls for Add/Remove, Menu, List, Plot/Replot, and Clear.
- Fit Route action for explicitly fitting the plotted route on the map.
- Auto-replot setting for refreshing an existing route after edits.
- Split Google Maps exports into stage links when routes exceed the practical point limit.
- Mini-control and info-panel control visibility settings.

### Changed

- Plotting and replotting no longer move the map automatically.
- Fan Fields 2 imports open the route list.
- Portal details controls sit below the History line and use compact sidebar styling.

## 0.4.0 - Released

### Added

- Start on me option that adds the current browser/device location as the first stop and keeps it first while enabled.
- Add Current Location action for adding the current browser/device location as a normal manual point.
- Loop back to start option with a generated final loop endpoint.
- Generated loop endpoint marker labeled `L`.
- Mini-control `L` button for toggling loop back to start.
- README usage notes and real UI screenshots.

### Changed

- Reorganized the main panel controls into Add, Route, and Data sections.
- Moved route summary information above the action buttons.
- Moved Clear list next to the default stop time control.
- Moved route settings into a single checkbox row.
- Removed the duplicate Close button from the panel body.
- Replaced the duplicate mini-control bottom action with the loop toggle.
- Updated route plotting, labels, Google Maps export, print output, JSON export, and JSON import to handle generated loop endpoints.

### Fixed

- Avoided forcing current location into the route when adding the first portal.
- Kept generated Start on me and loop endpoints from being directly edited, moved, or removed while managed by their settings.

### Known limitations

- Browser/device location may be inaccurate, especially on desktop systems.
- The generated loop endpoint is managed by the loop option, not edited as a normal waypoint.
- Saved route library is planned for a later milestone.

## 0.3.0-dev - Unreleased

### Added

- Manual map points that can be added by tapping/clicking the map.
- Editable names for manual map points.

### Changed

- Renamed the main-panel Add button to Add Portal.

### Fixed

- Manual map-point labels can now be selected from the map.
- The mini-control remove button now removes a selected manual map point.
- Manual map-point names now have a subtle editable-field style.
- Selecting a manual map point now clears IITC portal details instead of leaving the previous portal displayed.

### Known limitations

## 0.2.0-dev - Unreleased

### Added

- Main-panel waypoint editing.
- Add, remove, and move controls for route stops.
- Per-stop wait time editing.
- Flexible duration input such as `15m`, `1.5h`, and `2d`.
- Persistent panel and route state across IITC reloads.
- Stale route tracking after route-affecting edits.
- **Replot** state when the saved route needs recalculation.
- Per-leg route time and distance display in the stop list.
- Optional map labels for per-segment drive times.
- Google Maps export for the current route.
- Warning before Google Maps export when routes exceed the observed 11-point limit.
- JSON route export and import.
- Printable route summary.
- Development version display in the panel.
- Metadata file generation during build.

### Changed

- Renamed the plugin from Driving Route to Portal Route.
- Renamed Calculate behavior and UI language toward Plot/Replot.
- Reworked waypoint rows from table markup to div/grid markup.
- Moved segment time/distance into the stop row to keep the list height stable.
- Let long portal names truncate before segment data truncates.
- Simplified panel styling so it fights IITC and jQuery UI less.
- Improved mobile-oriented panel sizing and controls.
- Switched mobile-unfriendly glyphs and emoji to plain ASCII controls.
- Made route map overlays non-blocking so they do not interfere with portal selection.

### Fixed

- Waypoint markers blocking portal selection.
- Hover labels blocking portal selection.
- Panel recentering itself after clicks.
- Horizontal scrollbar in the route panel.
- Missing or clipped remove-stop button in waypoint rows.
- Yellow badge and border styling regressions in waypoint controls.
- Control centering problems in waypoint rows.
- Blank printable route page in some browsers/WebViews.

### Known limitations

- Hover labels still do not behave especially well on mobile.
- Panel bottom anchoring near IITC mobile nav/status areas may still need refinement.
- Route persistence restores saved data but does not automatically recalculate directions on reload.
- Google Maps export may omit stops after the ninth intermediate stop when routes exceed 11 total points.
- Long Google Maps routes are warned about, but not split yet.

## 0.1.x - Early development

### Added

- Initial mobile-first route planning plugin structure.
- Mini-control for route actions.
- Portal waypoint selection.
- Route plotting through Google directions data.
