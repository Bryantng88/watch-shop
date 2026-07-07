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
- Media Workspace item row UI now uses a shared queue-row presentation adapter
  instead of hardcoding status/progress/workflow display directly inside the
  detail page.
- Media progress chips such as `1/3`, `2/3`, `3/3` are scoped to the owning
  Media Processing Workspace only. They must not leak into Photoshoot or
  Publish Workspaces.
- Activity feed is scoped by current Workspace workType and queue targets so a
  Photoshoot Workspace does not show Media Processing or Publish-only activity.
- Activity/discussion UI was extracted from `TaskItemDetailClient.tsx` into a
  task-work activity module to keep the detail page from becoming the only
  place where Workspace behavior lives.
- Queue item thumbnails now use the same Watch preview image resolution order
  as the business preview modal:
  `productImage.fileKey -> primaryImageUrl -> storefrontImageKey`.

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
- A Workspace row status is the status of that queue item in the current
  Workspace, not a cross-flow media readiness badge.
- The workflow/next-step column should present the next available action or
  state for the current Workspace only.
- Activity shown in a Workspace must be in scope for that Workspace. Cross-WP
  activity belongs in a dedicated flow/core view later, not inside every WP
  activity tab by default.

## Architecture Guardrail

When implementing Workspace UI, always decide where the behavior belongs before
coding. Do not keep adding JSX, policy, and domain adapters into one growing
client file. New behavior should move into focused modules such as
`task-work/queue-row-presentation.ts`, `task-work/QueueWorkQueue.tsx`, or
`task-work/activity/ActivityFeed.tsx` so other Workspaces can reuse the same
rules without another refactor pass.

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
- `src/domains/task/client/TaskItemDetailClient.tsx`
- `src/domains/task/server/activity/task-item-activity.service.ts`
- `src/domains/task/server/activity/task-item-activity.types.ts`
- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/core/task-item-detail.repo.ts`
- `src/domains/task/ui/task-work/QueueWorkQueue.tsx`
- `src/domains/task/ui/task-work/activity/ActivityFeed.tsx`
- `src/domains/task/ui/task-work/queue-row-presentation.ts`
- `src/domains/watch/client/WatchListClient.tsx`

## Out Of Scope

- Reworking Watch list UI.
- Reworking Media Asset Center.
- Realtime streaming progress from server.
- Notification/Zalo flow.
- Permission model redesign.
- Moving all Watch edit behavior into Workspace.
- Manual archive for completed queue items. This is intentionally postponed.
- Core-flow-wide activity view. Current WP activity tabs stay scoped to their
  own Workspace.

## Known Follow-Up

The rollover appLoading is currently result-step based, not true realtime.

For true realtime progress, split rollover into:

```text
plan rollover items -> move one binding per client step -> refresh summary
```

This is intentionally deferred to avoid expanding the sprint while quota is
low.

Planned next cleanup:

- Add manual archive for completed queue items when the Workspace list becomes
  too noisy.
- Introduce a durable core-flow model/rule layer so fixed core Workspaces in a
  Space are created and ordered as one business flow, not ad hoc per screen.
- Continue extracting `TaskItemDetailClient.tsx` by responsibility if the file
  grows again: header, sidebar metadata, checklist, and workflow panel should
  not collapse back into a single monolith.

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
