# Strap Domain, Inventory And Operation Contract

Status: accepted for implementation  
Accepted: 2026-08-02

## Decision

Strap is an owning business domain built on the existing Product aggregate.
Sellable straps use `Product(type = WATCH_STRAP)` and `ProductVariant`; Strap
does not create a second order catalog, pricing model, or image store.

```text
Strap command
-> Strap truth + Product/Variant inventory truth
-> catalogued strap.* Business Event in the owning transaction
-> durable consumer outbox
-> Coordination/workflow barriers
-> strap-list and affected Watch projections
```

## Existing contracts retained

| Concern | Owner reused by Strap |
| --- | --- |
| Sellable identity and SKU | Product + ProductVariant |
| Order sale | OrderItem |
| Product media | ProductImage and canonical Media ingest |
| Operation | WorkType registry + Coordination route + Workspace workflow |
| Event delivery | BusinessEventLog + durable consumer/projection outbox |
| List and board reads | ProjectionRecord builders |
| Activity | Timeline/Global Activity consumers |
| Attached cost | Service/Order/Watch cost-ledger sources |

Legacy `StrapVariantSpec` remains the specification extension of a
`ProductVariant`; it is expanded instead of replaced.

## Truth model

- `StrapVariantSpec` owns dimensions, material, origin, clasp defaults,
  OEM brand snapshot, leather type, surface, inventory policy, bracelet reference, stock thresholds and default link
  composition.
- Strap product titles are deterministic display names composed from these
  facts; intake does not accept a separate free-form title. OEM requires a
  brand, while leather type and `SMOOTH`/`GRAINED` apply only to leather.
- `WatchStrapInstallation` is the temporal source of truth for a strap attached
  to a Watch. Only one active installation per Watch and per serialized strap
  is allowed.
- `StrapInventoryMovement` is the audit ledger for receipt, sale, install,
  removal, adjustment, return and transfer. Existing `ProductVariant.stockQty`
  remains the current balance during the compatibility rollout; commands must
  update balance and movement atomically.
- `StrapCatalogOption` extends controlled catalog vocabulary without placing
  free-form catalog JSON in Product or Watch.

OEM is origin, not ownership. An OEM strap attached to a Watch uses
`inventoryPolicy = NON_STOCK` and `ownershipMode = WATCH_ATTACHED`. It does not
participate in replenishment. Aftermarket stock normally uses `STOCKED`.

## Bracelet links and clasp

Sellable clasps are independent `Product(type = WATCH_CLASP)` items with a
`ClaspVariantSpec`, their own ProductVariant stock, vendor, acquisition cost and
OrderItem identity. A strap acquisition must not embed a separately purchased
clasp or inherit its vendor/cost. Strap clasp fields remain compatibility
snapshots for an included/default clasp, not the owner of clasp inventory.

Per-Watch installed/spare
full links, half links, end links and wrist size belong to the active
installation. Link adjustments are inventory movements and business events;
they are not edits to a projection row.

## Projection contract

`strap-list` is the authoritative Admin list read. It contains sellable
identity, dimensions, origin, stock policy, available stock, active Watch
attachment, low-stock status and latest activity. Replenishment is derived
from the same projection generation and groups only `STOCKED` variants by
lug width, buckle width, color and material.

Projection rebuild reads Product/Variant, Strap truth and active installation.
It never changes stock, installations, orders or workflow.

## Coordination contract

`strap.intake.requested` routes target type `STRAP` to work type
`strap-processing` in OPERATION. Later `strap.*` milestones progress the same
binding. Coordination owns stage and collaboration; Strap commands own
classification, measurements, inventory and installation truth.

## Acquisition access boundary

- Watch acquisition uses `WATCH_ACQUISITION_{VIEW,CREATE,UPDATE,APPROVE,DELETE}`.
- Accessory acquisition uses
  `ACCESSORY_ACQUISITION_{VIEW,CREATE,UPDATE,APPROVE,DELETE}`.
- Mixed Watch/accessory documents require the matching
  `ACQUISITION_{VIEW,CREATE,UPDATE,APPROVE,DELETE}_ALL` permission. Holding both
  scoped permissions does not grant access to mixed documents.
- Sales users receive only `ACCESSORY_ACQUISITION_VIEW` and
  `ACCESSORY_ACQUISITION_CREATE`. Watch and mixed acquisitions require their
  own scoped permission (or the corresponding `ACQUISITION_*_ALL` permission).
- Acquisition scope is derived on the server from persisted item product
  types. Images/media assets are not part of this permission decision.
- An accessory-scoped acquisition must contain at least one item and every item
  must have `productType` in `WATCH_STRAP | WATCH_CLASP`. A Watch-scoped
  acquisition must contain only `WATCH` items. Empty, unknown and mixed item
  sets are classified as `ALL` (fail closed) and are not exposed to Sales.
- The scope is enforced in source reads, list projection queries, dashboard
  aggregation, page authorization, and create API authorization. UI visibility
  is not treated as an authorization boundary.
- `SALE` is an exact acquisition allowlist: only
  `ACCESSORY_ACQUISITION_VIEW` and `ACCESSORY_ACQUISITION_CREATE`. It must not
  receive Watch, accessory update/approve/delete, or any `*_ALL` acquisition
  permission. The permission catalog audit rejects this forbidden-role drift.

## Compatibility migration

Older Watch strap attachments encoded in ProductVariant metadata remain
readable during rollout. New writes use `WatchStrapInstallation`. A scoped
backfill must create canonical installation rows before the legacy metadata is
removed. No list or detail UI may add new legacy attachment metadata.

## Production gates

- Product/Order behavior remains unchanged for non-strap types.
- Every strap event is catalogued and projection subscriptions are
  bidirectionally covered.
- Commands use `runBusinessEventTransaction()` and track the exact delivery.
- One active installation constraints hold under concurrency.
- Stock balance and movement commit atomically.
- OEM/NON_STOCK rows never enter replenishment.
- List/Board/Detail agree after delivery and after a projection rebuild.
