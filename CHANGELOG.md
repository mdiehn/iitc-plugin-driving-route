# Changelog

All notable changes to this project will be tracked here.

This project does not have a formal public release yet. The current working milestone is `0.2.0-dev`.

## 0.2.0-dev - Unreleased

### Added
- Main-panel waypoint editing.
- Per-stop wait time editing.
- Flexible duration input such as `15m`, `1.5h`, and `2d`.
- Add, remove, and move controls for waypoint rows.
- Persistent panel and route state across IITC reloads.
- Dirty/stale route tracking after route-affecting edits.
- Replot button state when the saved route needs recalculation.
- Segment detail display between the two waypoint rows for that route leg.
- Optional map labels for per-segment drive times.
- Google Maps export for the current waypoint route.
- Development version display in the panel.
- Meta-file generation during build.

### Changed
- Renamed Calculate behavior/UI language toward Plot/Replot.
- Reworked waypoint row layout from table markup to div/grid markup.
- Simplified panel styling so it fights IITC and jQuery UI less.
- Improved mobile-oriented panel sizing and controls.
- Switched mobile-unfriendly glyphs/emoji to plain ASCII controls.
- Made route map overlays non-blocking so they do not interfere with portal selection.

### Fixed
- Waypoint markers blocking portal selection.
- Hover labels blocking portal selection.
- Panel recentering itself after clicks.
- Horizontal scrollbar in the route panel.
- Missing or clipped remove-stop button in waypoint rows.
- Yellow badge and border styling regressions in waypoint controls.
- Control centering problems in waypoint rows.

### Known limitations
- Hover labels still do not behave especially well on mobile.
- Panel bottom anchoring near IITC mobile nav/status areas may still need refinement.
- Route persistence restores saved data but does not automatically recalculate directions on reload.

## 0.1.x - Early development

### Added
- Initial mobile-first route planning plugin structure.
- Mini-control for route actions.
- Portal waypoint selection.
- Route plotting through Google directions data.
