# Coordination Runtime And Global Activity Contract

## Decision

Operational Blueprint remains a design-time and provisioning capability. It is
not the hot-path runtime engine for established Coordination flows.

Established flows run from explicit, versioned flow definitions and
projection-backed List/Board reads:

```text
Business command
-> business truth + catalogued event
-> Coordination/workflow consumers
-> flow projection
-> List / Board
```

Blueprint may create or describe a Workspace, but List/Board requests must not
load Blueprint management options, parse full Blueprint snapshots per item, or
derive domain validation from Blueprint metadata.

## Runtime Boundary

For an established operation:

- the owning domain owns validation and business truth;
- an application command owns the typed action contract;
- events announce committed business facts;
- Coordination owns binding and stage membership;
- projection owns List/Board fields, counters, comment signals, and the latest
  activity snapshot;
- Workspace remains an internal collaboration/binding context where needed;
- Blueprint remains available for authoring, preview, provisioning, and truly
  dynamic/ad-hoc operations.

Removing Blueprint from a hot read path must not change current stage
membership, transitions, actions, counters, pagination, reconciliation, or
List/Board parity.

## Comment Contract

Comment is an operational collaboration capability and stays close to the
item. List/Board reads carry only lightweight signals:

```ts
type CommentSignals = {
  commentCount: number;
  unreadCommentCount: number;
  mentionedMeCount: number;
  latestCommentAt: string | null;
  latestCommentPreview: string | null;
};
```

Comment bodies and threads are loaded on demand. List/Board queries must not
hydrate complete discussions. Comment writes update their projection signals
through the normal event/consumer path.

## Latest Activity Contract

List/Board keeps one denormalized event snapshot:

```ts
type LastActivitySnapshot = {
  eventKey: string;
  label: string;
  note: string | null;
  actorUserId: string | null;
  actorLabel: string | null;
  actorAvatarUrl: string | null;
  occurredAt: string;
};
```

The snapshot is updated by an event projection consumer. List/Board must not
load an Activity collection, join Timeline history, or query Activity once per
row. The snapshot is read context, not business truth.

## Global Activity

Full Activity is a separate, rebuildable system projection and has its own
admin menu. It behaves as a system log:

- newest-first pagination;
- search by event, target, actor, label, or reference;
- filters for domain/target type, event key, actor, and time period;
- links back to the relevant business surface;
- no domain mutation and no workflow orchestration;
- no dependency from Coordination List/Board reads.

The Global Activity page reads projection data only. Business events and their
consumers remain the source used to rebuild it.

## Performance Rules

- `ensureCycle` and provisioning are write/repair concerns, not ordinary list
  read work.
- List and Board request only the active view and its narrow DTO.
- Blueprint authoring/management data is loaded only when its management UI is
  opened.
- Stage membership, action availability, comment signals, counters, and latest
  activity come from one compatible projection generation.
- Detail, comments, and full activity hydrate independently and lazily.
- Existing committed-reconciliation rules remain mandatory.

## Migration Strategy

1. Add or verify lightweight comment and latest-activity projection fields.
2. Stop returning Activity collections from Coordination List/Board DTOs.
3. Move Blueprint management reads behind an explicit management request.
4. Remove per-item Blueprint snapshot parsing from established flow reads.
5. Move cycle provisioning out of the normal read request.
6. Add Global Activity projection and UI.
7. Compare List/Board rows, counters, actions, and transitions before removing
   compatibility fallbacks.

## Implemented 2026-07-30

- Ordinary Coordination reads resolve the existing cycle without mutating it.
  `ensureCoordinationCycle` remains only as a first-run compatibility fallback.
- Last-activity reads exclude `DISCUSSION`; comment counts remain a separate
  signal.
- Latest activity is fetched as one row per TaskItem instead of hydrating the
  complete Activity history.
- Viewer mention queries load only activities/replies that contain the current
  user mention.
- Flow List no longer owns or opens a full Activity collection. Its
  `lastActivity` link opens the Global Activity menu.
- Flow rows surface comment count beside the business item and retain the
  existing TaskItem discussion destination.
- `/admin/activity` provides the permission-gated Global Activity read surface
  with search, domain, event, actor, period, and pagination controls.
- Global Activity reads the existing `TaskItemActivity` event projection and
  excludes `DISCUSSION`; it does not read domain aggregates.
- The global chronological read is supported by
  `TaskItemActivity(sourceType, occurredAt DESC)`.

Compatibility retained intentionally:

- existing stage membership, action adapters, commands, counters, pagination,
  board/list mapping, and committed reconciliation were not changed;
- live board builders remain fallback/repair paths while projection-backed
  reads remain primary;
- Blueprint authoring and Workspace provisioning remain available outside the
  established-flow hot read path.
