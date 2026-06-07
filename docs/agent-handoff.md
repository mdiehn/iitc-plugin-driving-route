# Agent Handoff

Current handoff for segmented-route foundation work.

## What was done

- Read the current repo guidance, release notes, roadmap, and route/storage/UI
  design docs.
- Read `docs/testing-plan.md` for segmented-route validation expectations.
- Read the project-scoped `architect` agent guidance.
- Noted the available project-scoped agent configs under `.codex/agents/*.toml`.
- Added an initial segmented-route design doc.
- Added working notes focused on compatibility, degradation, and rollout scope.

## New docs

- `docs/segmented-routes-design.md`
- `docs/segmented-routes-working-notes.md`
- `docs/testing-plan.md` is now part of the required context for follow-on work.

## Main decisions

- Segmented routes are additive and must preserve existing linear routes.
- Every segmented route keeps a flat ordered stop list for compatibility.
- `route.stops` is the canonical executable waypoint list for the first
  implementation.
- Segment metadata is stored beside flat stops, not instead of them.
- Suggested saved-route upgrade path is `schemaVersion: 2` for segmented routes.
- Unknown and external segments must round-trip safely even without full support.
- Google/Apple map export is explicitly a flattened degradation path, not the
  lossless representation.
- Per-segment `travelMode` and `routingProvider` behavior is deferred and must
  not affect first-release behavior.
- Print degrades to the existing flat-route behavior in the first release unless
  optional labels are cheap and safe.

## Out of scope kept out

- production code
- segmented editor design beyond read-only structure display
- mission/banner flows
- Mission/Banner Companion behavior
- destructive saved-route migration

## Open questions to resolve before coding deeply

- How much interior structure should connector/transfer segments own?
- Should segmented support write schema `2` only when needed, or for all routes
  on next save?
- Should external segments be allowed to carry rendered geometry directly in
  saved JSON?
- Do connector/transfer segments need type badges only, or labels too, in the
  first Route List UI slice?

## Recommended next agent

`implementation`

## Recommended next task

Create a small implementation plan that maps the design to concrete parser,
serializer, display, plotting, and test changes without editing release files or
expanding into a full segmented-route editor.
