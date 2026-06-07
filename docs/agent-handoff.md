# Agent Handoff

Current handoff for segmented-route foundation work.

## What was done

- Read the current repo guidance, release notes, roadmap, and route/storage/UI
  design docs.
- Read the project-scoped `architect` agent guidance.
- Added an initial segmented-route design doc.
- Added working notes focused on compatibility, degradation, and rollout scope.

## New docs

- `docs/segmented-routes-design.md`
- `docs/segmented-routes-working-notes.md`

## Main decisions

- Segmented routes are additive and must preserve existing linear routes.
- Every segmented route keeps a flat ordered stop list for compatibility.
- Segment metadata is stored beside flat stops, not instead of them.
- Suggested saved-route upgrade path is `schemaVersion: 2` for segmented routes.
- Unknown and external segments must round-trip safely even without full support.
- Google/Apple map export is explicitly a flattened degradation path, not the
  lossless representation.

## Out of scope kept out

- production code
- segmented editor design beyond read-only structure display
- mission/banner flows
- Mission/Banner Companion behavior
- destructive saved-route migration

## Open questions to resolve before coding deeply

- Should flat stops or segments be authoritative in the first implementation?
- How much interior structure should connector/transfer segments own?
- Should segmented support write schema `2` only when needed, or for all routes
  on next save?
- How should print output behave for partial or external segments?

## Recommended next agent

`implementation`

## Recommended next task

Create a small implementation plan that maps the design to concrete parser,
serializer, display, plotting, and test changes without editing release files or
expanding into a full segmented-route editor.
