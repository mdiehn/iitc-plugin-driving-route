# TODO

## Phase 1: repository and packaging

- [x] Create repository scaffold
- [x] Add README, changelog, and license
- [x] Add first-pass design doc
- [x] Add build script
- [x] Add source file stubs

## Phase 2: route model

- [ ] Represent ordered route points
- [ ] Represent route legs and total route summary
- [ ] Add state structure for route geometry, timing, and selected portals
- [ ] Add helper functions for resetting and rebuilding route state

## Phase 3: route calculation

- [ ] Choose routing backend/API
- [ ] Calculate route geometry for two or more points
- [ ] Store total travel time and distance
- [ ] Store per-leg travel time and distance
- [ ] Render the route on the map

## Phase 4: settings

- [ ] Add allowed detour time setting
- [ ] Add portal hack time setting
- [ ] Default portal hack time to 5 minutes
- [ ] Persist settings locally
- [ ] Re-run candidate evaluation when settings change

## Phase 5: portal candidate discovery

- [ ] Choose strategy for finding portals near the route
- [ ] Collect candidate portals
- [ ] Avoid duplicates across legs or route samples
- [ ] Add filtering hooks for future portal filters

## Phase 6: portal detour evaluation

- [ ] Define first MVP rule for leaving and rejoining the route
- [ ] Estimate detour travel time for each candidate portal
- [ ] Add configured portal hack time
- [ ] Mark portals eligible or ineligible
- [ ] Show detour timing in UI

## Phase 7: interaction

- [ ] Add map interaction for placing route points
- [ ] Add route-point editing and removal
- [ ] Add portal include/exclude controls
- [ ] Add clear/reset actions

## Phase 8: UI panels and rendering

- [ ] Show total route time and distance
- [ ] Show per-leg timing
- [ ] Show eligible portal list
- [ ] Highlight eligible and selected portals differently
- [ ] Refresh rendering cleanly when route or settings change

## Phase 9: selected portal handling

- [ ] Define initial behavior for selected portals
- [ ] Show cumulative added time from selected portals
- [ ] Decide whether selected portals alter displayed route geometry in MVP or later

## Phase 10: cleanup and release prep

- [ ] Review naming and terminology
- [ ] Add screenshots or example workflow to README
- [ ] Add version banner metadata
- [ ] Test in IITC desktop
- [ ] Test in IITC Mobile
