# SM Sprint 46: Watch Photoshoot Completion Handoff V1

Type: SM Mode

## Mission

Complete the handoff after Photoshoot so a Watch can move from Photoshoot work
into Media Processing work through business events and Blueprint auto-binding.

## Implemented

- Photoshoot request now skips Watches already present in an active Photoshoot
  Workspace queue.
- `watch.media.photoshoot.completed` is now an active Watch business event.
- Blueprint event binding for `watch.media.photoshoot.completed` is active for
  the Media Processing Workspace.
- When a Photoshoot queue item reaches `DONE` through manual workflow, the
  system emits `watch.media.photoshoot.completed`.
- Coordination consumer uses the existing Blueprint receiver selection to bind
  the completed Watch into the selected Media Processing Workspace.

## Runtime Flow

```text
Watch list
-> request photoshoot
-> Photoshoot Workspace receives Watch queue item
-> user marks queue item DONE
-> watch.media.photoshoot.completed
-> Media Processing Workspace receives Watch queue item
```

## Duplicate Guard

A Watch is skipped from Photoshoot request when:

- Watch does not exist.
- Watch already has gallery image.
- Watch already has an active Photoshoot Workspace queue binding.

Active Photoshoot binding means:

- `TaskExecution.targetType = WATCH`
- `TaskExecution.targetId = watch.id`
- linked Workspace note contains `workTypeKey: photography`
- linked Workspace is not `DONE` or `CANCELLED`

## Watch Update Contract

This sprint does not update Watch image/content states directly.

Future Media Processing steps must emit explicit Watch business events, then
Watch domain services update Watch status/filter data.

Examples:

- `watch.media.asset.attached`
- `watch.content.submitted`
- `watch.content.approved`
- `watch.image.submitted`
- `watch.image.approved`
- `watch.media.ready_for_publish`

## Files Changed

- `src/domains/watch/server/media-work/watch-media-work.service.ts`
- `src/domains/watch/server/media-work/index.ts`
- `src/domains/watch/server/events/watch-business-event.contract.ts`
- `src/domains/watch/server/events/watch-business-event.emitter.ts`
- `src/domains/blueprint/shared/event-bindings.ts`
- `src/domains/task/actions/task.actions.ts`

## Acceptance

PASS.

