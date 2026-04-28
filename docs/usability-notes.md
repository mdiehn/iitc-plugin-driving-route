# Usability Notes

This document tracks practical UI/UX issues found while building and testing `iitc-plugin-portal-route`.

## Fixed issues

### Map interaction

- Waypoint markers no longer block portal selection.
- Hover labels no longer block portal selection.

### Mini-control

- Added a better compact button set: Maps, Plot, +/- toggle, count, and menu.
- Replaced mobile-unfriendly glyphs and emoji with ASCII labels.
- Renamed `R` to `P` for Plot.

### Panel and dialog

- Reduced panel width and font size.
- Removed most custom CSS that fought IITC styles.
- Stopped panel recentering on every click.
- Removed horizontal scrollbar.
- Mobile panel is full-width and bottom-anchored.
- Close removes the panel.
- Controls no longer move the panel unexpectedly.

### Waypoint editing

- Removed the separate edit panel.
- Moved waypoint editing into the main menu.
- Replaced table-based waypoint rows with div-based grid rows.
- Fixed the clipped remove-stop button.
- Restored yellow badge circles.
- Removed unwanted yellow borders around cells and buttons.
- Centered controls in their cells.
- Added per-stop wait-time editing.
- Added flexible wait-time input such as `15m`, `1.5h`, and `2d`.
- Added an Add button in the main panel.
- Badge clicks center the map; name clicks do not.

### Route behavior

- Renamed Calculate to Plot.
- Added stale route tracking for stop and wait-time changes.
- Changed Plot to Replot when the plotted route is stale.
- Persisted route state across IITC reloads.
- Moved segment details so the AB segment appears between row A and row B.
- Added optional segment drive-time labels on the map.

## Known limitations

### Mobile hover behavior

Hover labels are still limited on mobile because touch devices do not have a reliable hover state.

### Google Maps export limit

Google Maps appears to support the first point, final point, and up to 9 intermediate stops. Routes with more than 11 total points may export incompletely.

Possible fixes:

- warn users when exporting more than 11 points
- split large routes into multiple Google Maps links
- offer a copied list of stops as a fallback

## Planned improvements

- Clearer handling for Google Maps export limits.
- Better handling for routes that cannot be calculated.
- Better release tracking docs and checklist.

## Future ideas

- Drag-and-drop waypoint reordering.
- Freeform map waypoints by tapping anywhere on the map.
- Snap-to-portal behavior when dragging points near portals.
- Better naming for non-portal points, using place name, street address, or latitude/longitude.
- IITC Sync support or import/export.
- Saved named routes.
- Route optimization.
- Apple Maps and Waze links.
