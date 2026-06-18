# Agent Handoff

Current handoff after segmented-route foundation implementation and doc sync.

## What was done

- Read the current repo guidance, release notes, roadmap, and route/storage/UI
  design docs.
- Read `docs/testing-plan.md` plus the fixture/manual validation docs.
- Read the project-scoped `docs-keeper` agent guidance.
- Noted the available project-scoped agent configs under `.codex/agents/*.toml`.
- Synced release-facing and design/testing docs with the implemented storage
  foundation.
- Kept future segmented UI/editor work clearly separate from the implemented
  slice.

## New docs

- `docs/segmented-routes-design.md` now reflects the implemented foundation
  instead of the earlier proposal-only state.
- `docs/segmented-routes-working-notes.md` now separates completed foundation
  work from deferred UI/workflow work.
- `docs/testing-plan.md` now matches the actual validation slice: fixtures plus
  manual checks, not a segmented UI harness.

## Main decisions

- Segmented routes are additive and must preserve existing linear routes.
- Every segmented route keeps a flat ordered stop list for compatibility.
- `route.stops` is the canonical executable waypoint list for the first
  implementation.
- Segment metadata is stored beside flat stops, not instead of them.
- Simple routes remain `schemaVersion: 1`; segmented routes use
  `schemaVersion: 2` only when segment metadata exists.
- Unknown and external segments must round-trip safely even without full support.
- Google/Apple map export is explicitly a flattened degradation path, not the
  lossless representation.
- Per-segment `travelMode` and `routingProvider` behavior is deferred and must
  not affect first-release behavior.
- Print degrades to the existing flat-route behavior in this slice.
- Stop-sequence edits clear stale segmented overlay state instead of forcing a
  mismatched structure to survive.

## Out of scope kept out

- production code
- segmented editor or grouped Route List UI
- mission/banner flows
- Mission/Banner Companion behavior
- destructive saved-route migration

## Remaining gaps to verify manually

- IITC/browser proof for mixed local-library and Drive-library segmented round
  trips.
- Browser proof that reload, undo, and stop-sequence edits always clear or
  preserve `routeStructure` at the right times.
- Browser proof that flat-stop Google/Apple export and print stay unsurprising
  for segmented records with invalid or external metadata.

## Recommended next agent

`gatekeeper`

## Recommended next task

Review the implemented branch for readiness, with focus on docs accuracy,
manual-validation sufficiency, and whether any blocker-level regressions remain
before merge.
