# SM Sprint 45: Watch Photoshoot Intake Action V1

Date: 2026-07-04

Status: Implemented

## Mission

Implement the first real intake step of the Watch Media Workspace pipeline:

```text
Watch list -> select Watches without gallery images -> send to Photoshoot Workspace
```

This sprint keeps the boundary agreed in Sprint 44:

```text
Watch owns data.
Workspace owns work.
Business Event is the contract.
Blueprint owns workspace routing.
```

## Implemented

- Activated `watch.media.photoshoot.requested`.
- Added Watch Media pipeline payload/alias helpers.
- Added `emitWatchPhotoshootRequestedEvent`.
- Added Watch domain service `requestWatchPhotoshoot`.
- Added server action `requestWatchPhotoshootAction`.
- Added bulk action in Watch list toolbar: `Gửi chụp ảnh`.
- The action only sends selected Watches that do not have gallery images.
- The action ensures the current Media weekly Space/work tickets exist before
  emitting intake events.
- Existing weekly fixed work tickets can receive missing Blueprint event binding
  snapshot notes during ensure.
- Blueprint binding for `watch.media.photoshoot.requested` is active:

```text
workTypeKey: photography
scopeContext: MEDIA
mode: INTAKE
consumer: coordination
```

## Runtime Flow

```text
User selects Watches in Watch list
User clicks "Gửi chụp ảnh"
Server action checks permission
Server action ensures current Media weekly Space exists
Watch service validates selected Watches
Watch service skips Watches that already have gallery images
Watch service emits watch.media.photoshoot.requested
Coordination consumer resolves Blueprint snapshot binding
Photoshoot work ticket receives the Watch binding/activity
```

## Eligibility

Sprint 45 uses a conservative rule:

```text
Only Watches without GALLERY images can be sent to Photoshoot.
```

Skipped reasons:

```text
WATCH_NOT_FOUND
WATCH_ALREADY_HAS_IMAGE
```

## Out Of Scope

- Photoshoot `DONE` action.
- `watch.media.photoshoot.completed`.
- Intake into Media Processing.
- NAS asset picker.
- Attach-from-NAS Watch command.
- Review/approve/reject inside Workspace.
- Ready-for-publish flow.
- Removing existing Watch domain media actions.

## Files Changed

- `src/domains/watch/server/events/watch-business-event.contract.ts`
- `src/domains/watch/server/events/watch-business-event.emitter.ts`
- `src/domains/watch/server/events/index.ts`
- `src/domains/blueprint/shared/event-bindings.ts`
- `src/domains/watch/server/media-work/watch-media-work.service.ts`
- `src/domains/watch/server/media-work/index.ts`
- `src/domains/watch/server/index.ts`
- `src/domains/watch/client/media-work/watch-media-work.actions.ts`
- `src/domains/watch/client/WatchListClient.tsx`
- `src/domains/watch/ui/list/WatchListToolBar.tsx`
- `src/domains/coordination/server/coordination-cycle.service.ts`
- `docs/sprints/CURRENT.md`

## Acceptance

Sprint 45 passes if:

- Watch list can send selected eligible Watches to Photoshoot.
- Event contract/config is active and visible in diagnostics.
- Intake goes through BusinessEvent + Blueprint binding.
- Workspace binding is not created directly by Watch UI.
- Watches with existing gallery images are skipped.

Status: PASS.
