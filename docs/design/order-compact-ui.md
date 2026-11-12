# Compact order create/edit forms

Scope: **create/edit forms only**. The order list and detail page retain their
existing presentation and are deferred to a separate rework.

Uses the accepted admin UI contract and the acquisition/personal-work reference:
white canvas, shared typography and domain tones, flat sections/item rows,
readable labels, tabular amounts, and a single save context.

Customer and payment controls share a compact grid. Delivery is a header
checkbox; address fields appear when enabled. Product search and service
selection share a row on desktop. One flat footer carries totals, draft/save/post
and cancel; duplicate header/sidebar save controls are removed. Service
identification remains visible and required. Multiple identical service rows
keep separate controlled notes after deletion. Trade-in retains its existing
data/validation and has a bounded dialog with keyboard focus return.

Stored amounts (full VND), timestamps, submit endpoints, stock effects,
payment/shipment logic and service intake are unchanged. This UI work does
not add thousand-unit conversion to orders.

`scripts/smoke-order-compact-ui.cjs` renders actual create/edit forms with
synthetic records and mocked external network/notification boundaries. It
verifies draft/post confirmation, payload amounts, required service
identification, multiple service notes, shipping and COD, trade-in,
locked-order guard, draft-only modal and responsive overflow. No real order,
payment, shipment or technical issue is created by the fixture.
