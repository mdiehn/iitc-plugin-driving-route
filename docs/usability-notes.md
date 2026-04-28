# Usability notes

Practical UI/UX notes for `iitc-plugin-portal-route`.

## Fixed issues

### Map interaction

- Waypoint markers no longer block portal selection.
- Hover labels no longer block portal selection.
- Route overlays no longer block normal map interaction.

### Mini-control

- Added compact buttons for Maps, Plot, add/remove, count, and menu.
- Replaced mobile-unfriendly glyphs and emoji with ASCII labels.
- Renamed `R` to `P` for Plot.

### Panel and dialog

- Reduced panel width and font size.
- Removed most custom CSS that fought IITC styles.
- Stopped the panel recentering on every click.
- Removed the horizontal scrollbar.
- Mobile panel is full-width and bottom-anchored.
- Close removes the panel.
- Controls no longer move the panel unexpectedly.

### Waypoint editing

- Removed the separate edit panel.
- Moved waypoint editing into the main menu.
- Replaced table-based rows with div/grid rows.
- Fixed the clipped remove-stop button.
- Restored yellow badge circles.
- Removed unwanted yellow borders.
- Centered row controls.
- Added per-stop wait-time editing.
- Added flexible wait-time input such as `15m`, `1.5h`, and `2d`.
- Added an Add button in the main panel.
- Badge clicks center the map; name clicks do not.

### Route behavior

- Renamed Calculate to Plot.
- Added stale route tracking for stop and wait-time changes.
- Changed Plot to Replot when the route is stale.
- Persisted route state across IITC reloads.
- Added optional segment drive-time labels on the map.
- Added Google Maps export-limit warning.
- Added JSON route export and import.
- Added printable route summary output.
- Fixed blank print output in some browsers/WebViews.

### Segment display

- Tried segment details between rows.
- Tried segment details on a second line inside the stop row.
- Tried segment details inline with the stop row.
- Current direction: inline segment data, with long portal names truncating first.

## Known limitations

### Mobile hover behavior

Hover labels are still limited on mobile because touch devices do not have reliable hover.

### Google Maps export limit

Google Maps appears to support the first point, final point, and up to 9 intermediate stops. Routes with more than 11 total points may export incompletely.

Current behavior:

- warn before opening Google Maps when exporting more than 11 points
- list the stops Google Maps may omit
- allow cancel or continue

Possible future fixes:

- split large routes into multiple Google Maps links
- offer a copied list of stops as a fallback

### Route freshness

Saved route data can be stale after edits. The UI marks it stale and asks for Replot, but it does not recalculate automatically.

## Planned improvements

- Split long Google Maps exports into multiple links.
- Improve failures when a route cannot be calculated.
- Add saved named routes.
- Add cleaner route sharing/import workflows.

## Future ideas

- Drag-and-drop waypoint reordering.
- Freeform map waypoints by tapping anywhere on the map.
- Snap-to-portal behavior when dragging points near portals.
- Better naming for non-portal points using place name, street address, or coordinates.
- IITC Sync support.
- Route optimization.
- Apple Maps and Waze links.
