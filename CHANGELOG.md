# Changelog

This project does not have a formal public release yet.

Current working milestone: `0.2.0-dev`

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
