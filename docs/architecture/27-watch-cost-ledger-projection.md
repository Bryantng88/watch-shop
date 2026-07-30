# Watch Cost Ledger Projection

`watch-cost-ledger` is the canonical per-Watch financial read model used by
Watch Detail.

## Flow

```text
Acquisition / Service / Technical Issue / Shipment / Order / Payment command
-> owning domain writes business truth
-> catalogued Business Event
-> Projection consumer
-> watch-cost-ledger builder
-> ProjectionRecord (rowKey = productId)
-> Watch Detail reads ProjectionRecord only
```

The Watch page must not query Payment, Technical Issue, Service Request,
Shipment, Order, or Acquisition tables to assemble costs during rendering. A
missing projection is repaired by the projection maintenance/backfill path,
not by an unbounded source query hidden in the page request.

## Attribution rules

- Acquisition cost is the Watch's `AcquisitionItem.unitCost`. A payment for the
  whole acquisition must never be assigned in full to each Watch.
- Service cost is rolled up per Technical Issue. `actualCost` takes precedence
  over `estimatedCost`.
- A Technical Issue or Service Request payment replaces the matching unpaid
  source fee in the rollup; it must not be counted a second time.
- Shipment and Order-level OUT payments are allocated across the Order items.
- A Shipment fee already represented by a linked Shipment payment is not
  counted again from `Shipment.shippingAmount`.
- Other linked OUT payments remain visible as a separate cost group.
- Projection builders may query source-domain facts while building. UI reads
  and UI commands may not write or locally patch this projection.

## Consistency

The builder subscribes to catalogued Acquisition, Order, Shipment, Service
Request, Technical Issue, and Payment events. Each event resolves the affected
`productId` values and rebuilds only those rows. Full rebuild is reserved for
initial backfill and explicit projection repair.

Projection delivery remains durable and retryable through the shared
BusinessEvent projection consumer. The command response must not wait for a
full projection rebuild.
