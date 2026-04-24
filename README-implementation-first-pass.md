# Driving Route first-pass implementation notes

This tarball is a first implementation pass for `iitc-plugin-driving-route`.

It is meant to be unpacked over, or copied into, the repo and reviewed before commit.

## What is included

- mobile-first route panel
- portal details action: `Add to Driving Route`
- route stop list
- remove and clear buttons
- default stop-time setting, persisted in local storage
- numbered route labels on the map
- Google Directions route calculation, when `google.maps.DirectionsService` is available
- per-leg drive time and distance display
- total drive time, stop time, trip time, and distance
- Google Maps external directions link
- simple build script producing `dist/driving-route.user.js`

## Important limitations

Phase 1 currently uses the first selected portal as the route origin and the last selected portal as the destination.

It does not yet support:

- player/map-center start location
- return-to-start routing
- route optimization
- manual reordering
- per-portal stop-time overrides
- Apple Maps or Waze
- turn-by-turn directions inside IITC

## Suggested first test

```bash
bash build/build.sh
```

Then install or load:

```text
dist/driving-route.user.js
```

## Likely first fixes

The most likely IITC-specific area that may need adjustment is the portal details injection:

```js
dr.injectPortalDetailsAction()
```

If the link does not appear in IITC Mobile, inspect the portal details DOM and change the target selector.

## Suggested first commit

```text
Add mobile-first driving route phase 1 scaffold

Adds the first implementation pass for the Driving Route IITC plugin, including
route state, persistent settings, a mobile-first route panel, portal add/remove
handling, numbered map labels, Google Directions route calculation, route totals,
and Google Maps export.
```
