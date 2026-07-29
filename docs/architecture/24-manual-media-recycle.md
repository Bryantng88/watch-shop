# Manual Media Recycle

## Decision

Unused source images are moved to Recycle only by an explicit user command in
the multi-image NAS picker. There is no automatic age rule, background cleanup,
or inference from whether an image was added to a pool.

The physical location is:

```text
<media profile root>/recycle/<original relative path>
```

Keeping the original relative path makes a manual restore deterministic.

## Command boundary

`POST /api/media/recycle` is the only UI command boundary for both operations:

- `RECYCLE`: move selected source files into Recycle.
- `RESTORE`: move selected recycled files back to their original paths.

The command requires `PRODUCT_UPDATE`, carries the authenticated actor, accepts
a caller-generated `commandId`, and executes each file through the durable,
idempotent `MediaOperation` move path. A batch returns a result per file so one
conflict does not hide the outcome of the other selections.

## Safety invariants

- A key must remain inside the selected profile and audience-segment root.
- Recycle cannot accept a key already below its Recycle root.
- A source image referenced by `ProductImage` cannot be recycled.
- A `MediaObject` with an active `MediaBinding` cannot be recycled.
- Recycle and restore never overwrite an existing destination key.
- Restore is manual and is available from the same picker.
- The Recycle folder is hidden from ordinary library browsing and can only be
  entered through the explicit `Xem Recycle` control.
- Changing between the library and Recycle clears the current selection.

Legacy `MediaAsset` rows are synchronized after a successful physical move:
Recycle uses `ARCHIVED`, restore uses `ACTIVE`, and `movedFromKey` preserves the
previous key. Canonical `MediaObject` movement remains owned by
`executeMediaMove`; business ownership continues to live in `MediaBinding`.

## Non-goals

- Automatically deciding that an unused image is disposable.
- Scheduled deletion or retention expiry.
- Permanent deletion from the Recycle folder.
- Moving files merely because the picker modal was opened or browsed.

Any future permanent purge must be a separate explicit command with its own
authorization, retention policy, audit trail, and operator confirmation.
