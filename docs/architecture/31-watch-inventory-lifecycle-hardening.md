# Watch Inventory Lifecycle Hardening

Status: design and implementation handoff (2026-08-24).

## Purpose

Watch inventory state must remain correct across repeated sale, cancellation,
return, trade-in, and buy-back cycles. A historical order must never override
the state of a later inventory cycle.

This work is required because inventory truth is currently reconstructed from
all `OrderItem` rows for a product. In `resolveEffectByProductId()` in
`src/domains/order/server/order-watch-sync.service.ts`, any historical
`COMPLETED` order wins as `SOLD`, even when a later posted buy-back has returned
the same physical Watch to stock.

## Production Incident That Exposed The Gap

Product `cmpo6ukuj000tvk0s43uh30cc`, SKU `SEI-31052026-002`, had this history:

1. order `OD-120626-000002` completed and sold the Watch;
2. buy-back acquisition `PN-240826-000001` posted on 2026-08-24 and restored it
   to `AVAILABLE / IN_STOCK / READY`;
3. new order `OD-240826-000001` included this Watch and another Watch;
4. the new order was `POSTED / UNPAID`, so both items should have been `HOLD`;
5. the synchronizer saw the old completed order and set this Watch to `SOLD`,
   while the other item correctly remained `HOLD`.

The immediate order-lock fix in release
`production-20260824-watch-detail-buyback` allows a bought-back Watch to enter a
new order. It does not by itself give the synchronizer a lifecycle boundary.

## Required Invariants

These are business invariants, not UI conventions:

- one physical Watch has exactly one current inventory cycle;
- a posted purchase, buy-back, or eligible trade-in starts a new inventory
  cycle;
- orders from an earlier cycle are immutable history and have no effect on the
  current inventory state;
- at most one active order may hold a Watch in its current cycle;
- an active hold-order makes every product Watch item in that order `HOLD`;
- a completed sale makes every product Watch item in that order `SOLD`;
- cancelling the active order restores the snapshot for the same cycle;
- posting a buy-back/trade-in restores the Watch in a new cycle, not by erasing
  the previous sale;
- repeating reconciliation is idempotent and produces the same result;
- `Product.status`, `Watch.saleStage`, and `Watch.stockStage` must describe one
  atomic state transition and must not diverge.

## Target Model

Introduce an explicit inventory-cycle identity. Exact naming may be adjusted
during schema review, but the relationship must be durable:

```text
WatchInventoryCycle
  id
  productId
  sequence
  sourceAcquisitionItemId
  openedAt
  closedAt
  closeReason

OrderItem.inventoryCycleId
AcquisitionItem.inventoryCycleId
Watch.currentInventoryCycleId
```

Recommended constraints:

- unique `(productId, sequence)`;
- only one open cycle per product (partial unique index where `closedAt IS
  NULL`);
- `OrderItem.inventoryCycleId` must belong to its `productId`;
- an active-order ownership table or partial unique lock must allow only one
  active order per `inventoryCycleId`;
- cycle creation and Watch restoration must occur in the same transaction as
  posting the acquisition.

Do not infer the current cycle permanently from timestamps. Timestamps can be
used for a controlled backfill, but explicit identity is the target contract.

## Single State Machine

All Order, Acquisition, cancellation, return, and repair paths must call one
authoritative transition service. No caller may independently write only one of
the three inventory fields.

```text
AVAILABLE --active order--> HOLD --completed sale--> SOLD
    ^                         |
    |                         +--cancelled/expired--> AVAILABLE
    |
    +--posted buy-back/trade-in creates a new cycle-- SOLD

SOLD --return workflow--> RETURNING --accepted return/new cycle--> AVAILABLE
```

The transition result should include:

- `inventoryCycleId`;
- previous and next canonical state;
- triggering entity and event;
- affected product/order/acquisition IDs;
- idempotency key;
- projection delivery keys.

Map canonical state to persisted fields in one function:

| Canonical state | Product.status | Watch.saleStage | Watch.stockStage |
| --- | --- | --- | --- |
| AVAILABLE | AVAILABLE | READY or PROCESSING by readiness policy | IN_STOCK |
| HOLD | HOLD | HOLD | RESERVED |
| SOLD | SOLD | SOLD | OUT_OF_STOCK |

Service state remains orthogonal and must not silently alter the sales cycle.

## Reconciliation Rule

Until the explicit cycle schema is deployed, the compatibility repair may use
the latest posted `BUY_BACK` or eligible `TRADE_IN` acquisition item as a lower
time boundary. Only order items created in or after that lifecycle boundary may
affect the current Watch state.

This compatibility rule must be isolated and deleted after backfill. Do not
spread timestamp comparisons into Order and Acquisition services.

The eventual reconciliation query is:

```text
currentCycle = Watch.currentInventoryCycleId
currentOrderItems = OrderItem where inventoryCycleId = currentCycle
effect = highest-priority non-terminal effect from currentOrderItems
apply canonical state atomically
```

Priority applies only inside the same cycle. Historical `SOLD` must never beat
a current-cycle `HOLD`.

## Implementation Sequence

1. Add lifecycle tables/columns and additive indexes without changing runtime
   behavior.
2. Backfill one cycle for never-sold inventory and multiple ordered cycles for
   products with sale plus buy-back/trade-in history.
3. Audit ambiguous histories and stop deployment if a product cannot be mapped
   deterministically.
4. Add the transition service and dual-write cycle IDs from Acquisition and
   Order commands.
5. Change order locking and `order-watch-sync` to scope by current cycle.
6. Run shadow reconciliation and compare old/new decisions without mutation.
7. Cut reads and state transitions over to the cycle model.
8. Repair mismatched production rows through the transition service, never
   through ad-hoc field updates.
9. Remove timestamp compatibility logic after coverage and audit gates pass.

## Required Test Matrix

Use database-backed integration tests in addition to pure unit tests:

| Scenario | Required final state |
| --- | --- |
| purchase -> active order | HOLD |
| purchase -> active order -> cancel | original cycle snapshot |
| purchase -> completed order | SOLD |
| sale -> posted buy-back | new cycle, AVAILABLE |
| sale -> buy-back -> active order | new cycle, HOLD |
| sale -> buy-back -> completed second order | new cycle, SOLD |
| sale -> buy-back -> cancel second order | new cycle, AVAILABLE |
| two Watches in one active order | both HOLD |
| two Watches in one completed order | both SOLD |
| old completed order plus current active order | current HOLD wins |
| repeated reconciliation | no state or event change |
| concurrent order creation | exactly one succeeds per cycle |
| failed transaction midway | no partial Product/Watch/cycle state |

Every test must assert all three persisted inventory fields, the active-cycle
identity, active-order ownership, and emitted business/projection events.

## Production Gates

Before rollout:

- back up the database;
- run a read-only lifecycle audit for every Watch;
- report divergent `Product`/`Watch` triples and multiple active orders;
- verify all existing Order and Acquisition integration suites;
- run the state matrix against a production-shaped database;
- deploy additive schema before cycle-aware code;
- rebuild affected Watch and Order projections;
- re-run the audit and require zero unexplained differences;
- retain an immutable rollback image and the pre-migration backup.

## Definition Of Done

This hardening is complete only when historical transactions cannot influence a
later cycle, every inventory mutation enters through the state machine, database
constraints prevent double ownership, and the full multi-cycle matrix passes in
CI and against a production-shaped database.
