# SM Sprint 49 - Watch Publish Workspace V1

Type: SM Mode

M2 vertical slice:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership
```

## Mission

Wire the handoff from Media Processing into the Publish workspace.

Publish is not the owner of Watch assets or content. Watch detail remains the
place where users download actual assets/content. The Publish workspace owns
queue visibility, workflow, activity, and completion tracking.

## Implemented

- `watch.media.ready_for_publish` is now an ACTIVE Blueprint binding for the
  `publish` work type.
- `watch.publish.assets.downloaded` is now an ACTIVE Watch business event.
- Existing Publish workspace snapshots can still receive enabled routes through
  the coordination consumer's current-route snapshot fallback.
- `watch-publish` now starts at `READY_TO_POST`.
- `watch.media.ready_for_publish` moves Publish item workflow to
  `READY_TO_POST`.
- Copy content and gallery download from Watch detail emit
  `watch.publish.assets.downloaded`.
- Publish download events write activity/progress into the Publish workspace
  while the actual download remains in Watch domain.
- Publish workflow exposes `OPEN_TARGET` as a reusable manual intent for
  transitions that must send the user back to the owning business screen.
- Publish items stay in `READY_TO_POST` until both content and image assets have
  been used from Watch detail, then move to `DONE` from the
  `watch.publish.assets.downloaded` event payload.

## Out Of Scope

- Reworking Watch list/detail UI.
- Moving asset storage/download UI into Workspace.
- Reworking final publish/posting domain state beyond Watch post usage.
- Notifications.
- UI polish.

## Acceptance

- Media Processing approval sends Watch into Publish workspace.
- Publish workspace action opens Watch detail instead of owning the heavy
  download UI.
- Watch detail copy/download actions emit business events.
- Publish workspace receives the events, records activity, and closes the item
  when Watch post usage reports both content and image done.
