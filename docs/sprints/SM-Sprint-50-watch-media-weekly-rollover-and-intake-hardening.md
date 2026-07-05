# SM Sprint 50 - Watch Media Weekly Rollover and Intake Hardening

Type: SM Mode

M2 vertical slice:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership
```

## Mission

Harden the Watch Media flow after Sprint 49 so it survives the real weekly
cycle boundary.

Operational rule:

Watch domain actions must always route into the current active Media weekly
Space/Workspace. Unfinished Media items from the previous weekly Space must be
movable into the matching current-week core Workspace.

## Implemented

- Fixed Watch list bulk action: send ready Watches to Media Processing
  Workspace.
- Changed `watch.media.asset.attached` from `PROGRESS` to `INTAKE` for
  `media-processing`.
- Existing Media Processing Workspaces are still resolved through Blueprint
  snapshot matching.
- Effective event mode now follows the current coordination route, so old
  Workspace snapshots do not stay stuck on an outdated `PROGRESS` mode.
- Coordination event consumer now ensures the current weekly coordination
  cycle before binding events.
- On a new week, Watch events can create/use the new Media Space and its core
  Workspaces without requiring the user to open the Media page first.
- Added step-based `appLoading` support through `AppProgressProvider`.
- Watch list bulk move now displays per-watch progress:
  pending, running, done, skipped, or error.
- Fixed previous-week rollover resolver.
- Rollover no longer selects the wrong previous Space just because it shares
  `BUSINESS` kind or legacy workType names.
- Media rollover now prioritizes the previous Space matching Media context,
  then matches core Workspaces by workType.
- Rollover action displays moved/skipped/failed result steps in appLoading
  before the final summary dialog.

## Current Media Weekly Flow

```text
Watch list
-> select Watches with image/content
-> emit watch.media.asset.attached
-> current Media weekly Space is ensured
-> Media Processing Workspace receives item
```

```text
New Media weekly Space
-> receive previous-week unfinished items
-> unfinished previous Media core items move to matching current-week core WP
-> old binding is marked CANCELLED
-> new binding keeps rollover metadata and activity
```

## Runtime Rules

- `watch.media.asset.attached` is an intake event for Media Processing.
- Progress-only events must not create new Workspace items.
- Intake events may create a new Workspace item in the current active weekly
  Space.
- Previous-cycle rollover only moves unfinished core Workspace bindings.
- Finished bindings are skipped.
- Existing current-week bindings are skipped as `ALREADY_EXISTS`.
- Old bindings are cancelled after successful rollover so they no longer appear
  active.

## Verified During Sprint

Read-only DB check on `2026-07-06` showed:

- `Media week 27` had 17 Media bindings.
- 10 bindings were still open.
- Rollover initially returned 0 because resolver could choose a wrong legacy
  Space.
- After resolver fix, it selected `Media week 27` correctly.
- Rollover then moved open items into `Media week 28`.

## Files Changed

- `src/domains/blueprint/shared/event-bindings.ts`
- `src/domains/coordination/server/coordination-router.registry.ts`
- `src/domains/coordination/server/coordination-event-consumer.ts`
- `src/domains/coordination/server/coordination-rollover.service.ts`
- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `src/domains/shared/feedback/AppProgressProvider.tsx`
- `src/domains/watch/client/WatchListClient.tsx`

## Out Of Scope

- Reworking Watch list UI.
- Reworking Media Asset Center.
- Realtime streaming progress from server.
- Notification/Zalo flow.
- Permission model redesign.
- Moving all Watch edit behavior into Workspace.

## Known Follow-Up

The rollover appLoading is currently result-step based, not true realtime.

For true realtime progress, split rollover into:

```text
plan rollover items -> move one binding per client step -> refresh summary
```

This is intentionally deferred to avoid expanding the sprint while quota is
low.

## Acceptance

Sprint 50 passes if:

- Watch list can send ready Watches into the current-week Media Processing
  Workspace.
- A new weekly Media Space is ensured when Watch business events arrive.
- Previous-week unfinished items move from the previous Media Space into the
  current-week matching core Workspaces.
- Rollover does not choose unrelated Operation/Sales/Technical Spaces.
- Users get visible appLoading progress for bulk Watch move and rollover
  result steps.
