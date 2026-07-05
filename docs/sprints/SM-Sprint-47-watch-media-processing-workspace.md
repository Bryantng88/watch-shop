# SM Sprint 47: Watch Media Processing Workspace V1

Type: SM Mode

## Mission

Make the Media Processing Workspace usable after Photoshoot handoff.

The Workspace receives Watches from `watch.media.photoshoot.completed` and can
emit the first media-processing progress event back into the business event
pipeline.

## Implemented

- Activated Blueprint binding for `watch.media.asset.attached`.
- Activated Watch business event contract for `watch.media.asset.attached`.
- Added `emitWatchMediaAssetAttachedEvent`.
- Added Media Processing queue action:

```text
Media attached
```

- The action is only shown inside Media Processing Workspaces for Watch queue
  items.
- The action records `mediaAssetAttachedAt` on the queue binding metadata.
- The action emits `watch.media.asset.attached`.
- Coordination consumer can process the event as a Media Processing progress
  event through existing Blueprint binding rules.

## Runtime Flow

```text
Photoshoot DONE
-> watch.media.photoshoot.completed
-> Media Processing Workspace receives Watch
-> user clicks Media attached
-> watch.media.asset.attached
-> timeline/workflow consumers receive progress event
```

## Scope Notes

This sprint does not implement real NAS asset selection or gallery upload.

It creates the event/action contract needed for the next sprint to attach real
NAS media and update Watch read/filter state through Watch domain services.

## Files Changed

- `src/domains/blueprint/shared/event-bindings.ts`
- `src/domains/task/client/TaskItemDetailClient.tsx`
- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/business-binding.types.ts`
- `src/domains/watch/client/media-work/watch-media-work.actions.ts`
- `src/domains/watch/server/events/watch-business-event.contract.ts`
- `src/domains/watch/server/events/watch-business-event.emitter.ts`
- `src/domains/watch/server/media-work/index.ts`
- `src/domains/watch/server/media-work/watch-media-work.service.ts`

## Acceptance

PASS.

