# Business Event and Media Recovery Runbook

Date: 2026-07-30  
Applies to: operation flows, durable business-event consumers, projections,
and canonical Media ingest.

## Purpose

Use this runbook when a command reports success but a list, board, counter,
actor, last action, or media path has not reconciled. It is a recovery guide,
not an alternative write path.

Never repair these incidents by writing a projection directly, manually
rewriting `ProductImage.fileKey`, or moving a NAS object outside the canonical
Media application service.

## Expected command path

```text
domain transaction
  -> business truth
  -> BusinessEventLog
  -> BusinessEventConsumerDelivery
  -> blocked/ready ProjectionEventDelivery
commit
  -> after() callback or projection maintenance
  -> coordination/workflow barriers
  -> projection rebuild
  -> list, board and counters reconcile
```

For Media, NAS I/O is deliberately outside the Prisma transaction:

```text
MediaOperation journal
  -> idempotent canonical move/copy
  -> short DB finalize transaction
     -> MediaObject/MediaBinding/ProductImage
     -> BusinessEventLog and delivery outboxes
```

## First response checklist

1. Record the business target ID, event key, operation key, actor, and request
   time.
2. Confirm business truth changed in the owning domain table.
3. Find the matching `BusinessEventLog`.
4. Inspect every `BusinessEventConsumerDelivery` with the same
   `operationKey`.
5. Inspect the matching `ProjectionEventDelivery`.
6. For Media, also inspect the `MediaOperation` by deterministic idempotency
   key/source and destination.

Interpretation:

- no business truth: the command rolled back; correct the command error and
  retry normally;
- truth exists but no event: producer-boundary defect; do not fabricate a
  projection row;
- event exists and consumer is `PENDING`/`FAILED`: run normal maintenance and
  inspect the stored error;
- consumer is `DEAD`: fix the deterministic cause before retrying; repeated
  blind retries are prohibited;
- barriers succeeded but projection is `BLOCKED`: projection-barrier defect;
- projection succeeded but UI is stale: query/cache/refresh contract defect,
  not an event replay problem.

## Safe recovery

Run the normal maintenance path, which drains consumer deliveries before
projection deliveries:

```powershell
npm run projection:smoke-runtime
```

Then re-check delivery status and refresh through the application's common
refresh mechanism. The worker uses row claims and idempotency keys, so
concurrent workers must not execute a terminal delivery twice.

Do not set delivery rows to `SUCCEEDED` manually. Do not unblock a projection
while a required `coordination` or `workflow` delivery is not
`SUCCEEDED`/`SKIPPED`.

## Media-specific recovery

### NAS operation succeeded, DB finalize failed

Retry the same user command with the same source/destination identity. The
canonical Media operation recognizes the existing destination and the
deterministic journal entry; the DB finalize can then attach the canonical
object and enqueue its event.

Do not move the file back. Do not create a second destination. Do not edit old
inline paths by hand.

### Source and destination are both missing

Stop automated recovery. Preserve the failed `MediaOperation` and its error,
verify the actual NAS mount/environment, and restore the object from its
authoritative source or backup before retrying. A missing object is not fixed
by changing the database path.

### Destination exists but an old screen still shows the inline path

Verify the screen reads the canonical Media resolver/binding. Repair the
consumer/read model or rerun its projection delivery. Compatibility reads may
fall back to an old path only while the original object still exists; fallback
must not become a new write architecture.

## Retry and idempotency rules

- Preserve `eventInstanceId`, `sourceId`, and operation key for a retry of the
  same business action.
- A genuinely new user action must receive a new event instance.
- `coordination` runs before other consumers for the same operation.
- `coordination` and `workflow` are projection barriers when declared by the
  event contract.
- Timeline and notification retry independently and do not hold a business
  list projection unless the contract explicitly makes them barriers.
- External I/O must never execute inside a Prisma transaction.

## Production checks

Before closing an incident:

- no relevant delivery remains `PENDING`, stale `PROCESSING`, `FAILED`, or
  `DEAD`;
- list and board contain the same stage membership;
- stage count equals the canonical filtered total;
- actor and last action identify the authenticated user/action;
- a page reload and the common refresh button produce the same result;
- Media references resolve through the canonical object path on every
  affected screen.

Record the incident, root cause, repaired operation keys, commands used, and
verification evidence in the dated architecture audit.
