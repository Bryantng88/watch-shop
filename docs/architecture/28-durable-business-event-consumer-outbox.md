# Durable Business Event Consumer Outbox

Status: accepted; durable foundation implemented, producer rollout in progress  
Accepted: 2026-07-30

## Context

Business mutations previously committed before their `BusinessEventLog` was
persisted. After the event was recorded, coordination, workflow, timeline and
notification consumers were dispatched directly. A slow consumer therefore
either extended request latency or timed out after business truth had already
committed.

Projection delivery already had a durable outbox, but non-projection consumers
did not. Moving the existing direct dispatcher into a Prisma transaction is not
allowed because it would retain locks while running cross-domain work.

## Decision

Every operation-visible command follows this pipeline:

```text
owning domain transaction
  -> write business truth
  -> upsert BusinessEventLog
  -> insert BusinessEventConsumerDelivery rows
  -> insert blocked ProjectionEventDelivery
commit
  -> after-commit scheduler or maintenance worker
  -> claim each consumer delivery with SKIP LOCKED
  -> run one consumer
  -> mark SUCCEEDED / SKIPPED / FAILED / DEAD
  -> release projection after required barriers
  -> build projections
  -> UI observes projection delivery SUCCEEDED
```

## Delivery contract

`BusinessEventConsumerDelivery` stores:

- one row per event operation and consumer;
- `operationKey` shared with the projection delivery key;
- unique `idempotencyKey = operationKey:consumerKey`;
- event context and payload required to reconstruct dispatch;
- status, attempts, retry time, lock time, completion and error;
- a JSON result for diagnostics.

States:

- `PENDING`: ready for a worker;
- `PROCESSING`: claimed with a bounded lock;
- `SUCCEEDED`: consumer completed;
- `SKIPPED`: contract-valid no-op;
- `FAILED`: retryable with exponential backoff;
- `DEAD`: eight attempts exhausted.

Workers claim rows with `FOR UPDATE SKIP LOCKED`. A stale `PROCESSING` lock can
be reclaimed after the configured lock timeout.

The original dispatcher ordering is preserved: if an operation has a
`coordination` delivery, every other consumer delivery waits until coordination
is terminal. Operation-scoped workers drain successive passes, so workflow,
timeline and notification cannot race ahead of binding creation.

## Projection barriers

`coordination` and `workflow` are completion barriers when they appear in the
event contract. Projection remains `BLOCKED` until every required barrier is
`SUCCEEDED` or `SKIPPED`.

Timeline and notification are durable and retry independently, but they do not
block the business list projection. This prevents non-critical notification
latency from freezing operation lists.

Events without coordination/workflow barriers mark projection ready in the
same transaction. Projection building still occurs after commit.

## Runtime scheduling

- Server actions pass the Next.js `after()` scheduler.
- Deferred work always reloads state with the global Prisma client.
- A Prisma TransactionClient is never captured after commit.
- Projection maintenance drains consumer deliveries before projection
  deliveries, providing recovery when the runtime callback does not run.

### Managed transaction boundary

Commands that write business truth and enqueue events in the same Prisma
transaction must use `runBusinessEventTransaction()`.

The wrapper owns the complete command boundary:

```text
runBusinessEventTransaction
  -> open owning Prisma transaction
  -> write business truth
  -> enqueue BusinessEventLog and durable delivery rows
  -> collect projectionDeliveryKey with delivery.track(event)
  -> commit
  -> schedule the exact operation keys with Next.js after(), or
     process them synchronously when no scheduler is supplied
```

An emitter called with a `TransactionClient` never owns after-commit dispatch.
It only enqueues durable state. Calling `revalidatePath()` or `router.refresh()`
does not satisfy the delivery contract.

Direct event emitters inside a raw `prisma.$transaction()` are prohibited for
new code. `npm run check:business-event-after-commit` enforces this rule. The
small reviewed legacy list contains producers that already forward an explicit
after-commit scheduler or drain returned delivery keys; it must only shrink.

The recurring projection-maintenance worker remains the recovery layer. It is
not the normal immediate runner: a successful interactive command must attempt
its exact delivery without waiting for cron.

## Compatibility

The existing `ProjectionEventDelivery` remains the public progress handle.
This avoids changing every list/board client at once. Its status now represents
completion of required business barriers plus projection reconciliation.

Producers not yet moved into their owning transaction continue to work through
the same outbox. They remain listed in the architecture audit until their
domain write and event enqueue are atomic.

`recordBusinessEvent(prisma, ...)` owns a short internal transaction even when
the caller has no domain transaction. This guarantees that `BusinessEventLog`,
consumer delivery and projection delivery cannot be partially persisted.
Commands that mutate domain state must still pass their existing
`TransactionClient`; the internal transaction is not a substitute for the
domain command boundary.

Storage/NAS work must never run while a Prisma transaction is open. Media uses
its journaled, idempotent `MediaOperation` as the external-operation boundary,
then finalizes database references and the business event in a short database
transaction. A caller must not hold a database transaction while invoking
`executeMediaMove`.

## UI completion and bulk consistency

Command commit and UI completion are distinct milestones:

```text
command committed
-> projectionDeliveryKey returned for every committed item
-> affected action remains locked
-> required delivery reaches SUCCEEDED
-> scoped projection endpoint reloads
-> selection and eligibility are recalculated
-> action unlocks
```

The UI waits only for the projection delivery representing the required
coordination/workflow barriers plus projection reconciliation. It does not wait
for unrelated Timeline or Notification delivery.

For bulk commands, delivery handles are mandatory per committed item and are
waited with bounded concurrency. `revalidatePath()`, `router.refresh()`, and a
no-store request are cache/read controls, not completion barriers. Reporting a
bulk item as complete before its required delivery succeeds violates this
contract because the stale row can remain eligible and be submitted again.

Delivery failure does not authorize repeating the business command. The
durable delivery is retried or repaired idempotently, while the UI reports the
affected item and keeps command acceptance distinct from projection completion.

## Ownership rules

- Owning domains write business truth and enqueue events only.
- Consumers own their downstream domain writes.
- Projection builders are invoked only by projection delivery processing or
  explicit maintenance/backfill.
- GET paths never dispatch consumers or repair projections.

## Production gate

Before production:

- all operation-visible producers enqueue within their domain transaction;
- no stale `PENDING`, `PROCESSING`, `FAILED` or `DEAD` consumer deliveries;
- retry and idempotency smoke tests pass;
- a failed barrier demonstrably keeps projection `BLOCKED`;
- successful retry releases projection exactly once;
- list, board, counters, actor and last action reconcile after delivery.
