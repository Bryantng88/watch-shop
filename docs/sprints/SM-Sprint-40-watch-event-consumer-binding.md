# SM Sprint 40: Watch Event Consumer Binding V1

Date: 2026-07-04

Status: Implemented

## Mission

Make Watch Business Events consume through explicit contract instead of broad,
implicit fan-out.

M2 north star:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership.
```

Sprint 40 covers:

```text
Business Event -> allowed consumers
```

## Implemented

- Business Event fan-out now checks event contract before running a consumer.
- Watch events use `knownConsumers` from the Watch Business Event Contract.
- Consumers not listed in `knownConsumers` return a structured skip result.
- Legacy/non-Watch events without `knownConsumers` keep existing behavior.

## Consumer Gate

Consumer gate lives in:

```text
src/domains/event/server/business-event.service.ts
```

Rule:

```text
If an event has knownConsumers, only those consumers can run.
If an event has no knownConsumers field, preserve legacy behavior.
```

Skip result:

```text
CONSUMER_NOT_ALLOWED
```

## Watch Consumer Binding

Watch review events that currently auto-bind to Media publish item:

- `watch.content.submitted`
- `watch.content.approved`
- `watch.content.rejected`
- `watch.image.submitted`
- `watch.image.approved`
- `watch.image.rejected`

Allowed consumers:

```text
timeline
coordination
workflow
```

Watch revoke events:

- `watch.content.unapproved`
- `watch.image.unapproved`

Allowed consumers:

```text
workflow
timeline
```

Watch content modified:

- `watch.content.modified`

Allowed consumers:

```text
timeline
workflow
```

Draft Watch events currently have no active consumers:

- `watch.ready`
- `watch.saleStage.posted`
- `watch.sold`

## Explicitly Preserved

- Non-Watch events still use legacy fan-out until their domain gets a contract.
- Coordination Router remains in place.
- Blueprint Event Binding is not implemented in this sprint.
- Binding scope resolution is not changed in this sprint.

## Definition Of Done

- Watch events no longer run every global consumer by default.
- Watch event consumer behavior is controlled by contract.
- Disallowed consumers return `CONSUMER_NOT_ALLOWED`.
- Existing Watch auto-binding behavior still routes through Media publish.
- Order, Service, and other domains are not changed.

## Next Sprint

Sprint 41 should handle:

```text
Watch Auto-Binding Runtime Scope V1
```

Questions for Sprint 41:

- Which active Media weekly workspace receives a Watch event?
- How do old cycles stop receiving new events?
- What is the exact skip reason when no active Media cycle exists?
- How do we make idempotency and target item resolution visible?
