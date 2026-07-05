# SM Sprint 48 - Watch Media Processing Review Flow V1

Type: SM Mode

M2 vertical slice:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership
```

## Mission

Turn the Media Processing workspace from a technical checkpoint into a practical
review flow.

The product decision is:

```text
Attach/Update media -> send to review
```

No extra media issue object is introduced. Missing image notes, retake requests,
and review comments should use the existing Workspace activity/feedback surface.

## Implemented

- `watch-media-processing` now uses a dedicated workflow:
  - `NEW`
  - `REVIEW`
  - `FEEDBACK`
  - `DONE`
- `Attach media` / `Update media` records media attachment metadata on the
  workspace binding.
- Attach/update moves the queue item to `REVIEW` directly.
- Attach/update emits `watch.media.asset.attached`.
- Manual `Trả về` moves `REVIEW -> FEEDBACK`.
- Manual `Duyệt xong` moves `REVIEW -> DONE`.
- Completing Media Processing emits `watch.media.ready_for_publish`.

## Contract

Media Processing owns coordination and workflow.

Watch domain remains the owner of Watch data, specs, content, and image storage.

Workspace can request changes through activity/feedback, but it does not own
Watch spec editing.

## Out Of Scope

- NAS picker UI.
- Real image upload/attachment implementation.
- Watch spec editing inside Workspace.
- Publish Workspace implementation.
- UI polish.

## Next

Sprint 49 should focus on Publish Workspace:

```text
watch.media.ready_for_publish -> Publish Workspace -> download tracking -> publish done
```
