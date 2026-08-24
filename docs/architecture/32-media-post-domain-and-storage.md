# Media Post domain and storage

## Decision

`MediaPost` is a first-class business aggregate. It is not a subtype of `Watch`
and it does not add post fields to the Watch model. A post may reference zero or
many watches through `MediaPostWatch`, and may publish to zero or many configured
`PostTarget` records through `MediaPostTarget`.

The Media Core remains shared:

- `MediaObject` is the physical object identity.
- `MediaBinding(ownerType = MEDIA_POST, ownerId = MediaPost.id)` expresses usage.
- `MediaOperation` remains the durable/idempotent journal for NAS mutations.
- `TaskExecution(targetType = MEDIA_POST)` places a post in the existing Media
  production flow: Photography, Media Processing, Publish.

This separation avoids making Watch responsible for arbitrary editorial/social
content while preserving one media pipeline and one operational board.

## NAS/S3 layout

The inspected bucket has `media/men`, `media/women`, and `media/objects` at the
current media root. Media Post owns a sibling namespace:

```text
media/
  men/                         # existing source inboxes
  women/                       # existing source inboxes
  objects/                     # existing Watch/general canonical objects
  posts/
    {mediaPostId}/
      objects/
        {mediaObjectId}/
          original/{filename}
          derivatives/{variant}.{ext}
```

Selecting a source image for a Media Post calls the same idempotent ingest/move
operation as Watch. Only the destination policy differs. Existing Watch keys are
not rewritten and no implicit NAS migration is introduced.

Browser display is same-origin. `/api/media/sign` streams the object through the
Media Storage port for its normal image response; it must not redirect browsers
to the NAS endpoint. This keeps NAS DNS, TLS, ports, and credentials private to
the application network and makes images work consistently on every client.
The explicit `format=json` compatibility response may still return a short-lived
signed URL for trusted integrations that deliberately need direct object access.

## Lifecycle and events

The business events are deliberately Media Post-specific:

- `media.post.created` -> Photography
- `media.post.asset.selected` -> Media Processing
- `media.post.ready_for_publish` -> Publish
- `media.post.published` -> completed publication

These events are appropriate here because Media Post is a business domain with
an auditable lifecycle. This does not change the decision for free/ad-hoc work,
which remains user-managed with three direct statuses and no synthetic domain
event.

## Why not reuse Watch media paths or models

Reusing Watch as the owner would make non-product posts require fake products,
leak Watch-specific review/publish assumptions into editorial work, and make
retention or deletion ambiguous. Reusing the physical storage folder without a
post boundary would also make a post export and reconciliation expensive to
identify. The chosen boundary keeps the storage ownership explicit while the
underlying adapter, operations, binding lifecycle, signing, and reconciliation
mechanics stay reusable.

## Similar extension points

Future owner types such as campaign, article, or collection should follow the
same pattern when they have an independent lifecycle: domain aggregate, typed
MediaBinding owner, explicit path policy, and business-event routes. They should
not add conditionals to Watch services. Pure reuse of an existing object without
its own lifecycle should remain only another `MediaBinding` and should not receive
a new physical namespace.

## Projected command boundary

Any command whose result is consumed by a projection must use
`runBusinessEventTransaction` and `delivery.emit(...)`:

1. Domain state and `BusinessEventLog` are written atomically in one transaction.
2. `delivery.emit` automatically records the projection delivery key; callers do
   not manually collect or drain outbox keys.
3. After commit, durable consumers run in their declared order and release the
   projection delivery.
4. Projection builders subscribe through the event catalog. Actions and UI code
   must never call a projection builder directly.

The Media Production stage count and the visible stage rows must be returned by
the same `media-operation-board` projection query. The UI must not derive a
Media Post count from an event/task binding and then render rows from a different
reader. This keeps pagination, stage selection, and mixed `WATCH`/`MEDIA_POST`
targets under one contract.

On the client, a flow response is accepted only for the stage that requested it.
Stage totals come from `flowStageCounts`; `pagination.total` describes only the
requested page and must not overwrite another stage's badge while navigation is
in flight. Optimistically moved IDs remain hidden in the source response and are
released as soon as an authoritative destination response contains them.

Commands that create a projected item return a coordination outcome containing
the flow key, authoritative intake stage, and detail link. The caller navigates
to that stage and reloads it after the projection delivery barrier completes.
For `media.post.created` the authoritative stage is `photography`; retaining the
previously selected stage would make a successfully-created post appear lost.

The transaction boundary rejects a command that commits without at least one
event (`BUSINESS_COMMAND_EVENT_REQUIRED`). A non-projected maintenance command
must opt out explicitly with `allowNoEvents`; silence is never the default.

The projection event coverage test enforces both directions: every event that
declares the projection consumer must have a matching builder, and every builder
subscription must reference a catalogued event that allows projection. This is
the extension contract for future business domains.

Direct state commands follow the same rule. For example, Task Item status changes
emit `task.item.status.changed`; `coordination-workspace-summary` subscribes to
that event. This removes domain-specific refresh calls and makes the read model
consistent regardless of which UI initiated the command.
