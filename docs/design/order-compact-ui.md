# Compact order UI

Uses the accepted admin UI contract and the acquisition/personal-work reference:
white canvas, shared typography and domain tones, flat sections and item rows,
readable 12px labels, tabular amounts, and a single save context.

- List: seven columns instead of nine, smaller thumbnails, quiet status and
  source metadata. A note icon exposes the full note on hover/focus via its
  accessible label/title. The update time is visible; full date is in the
  tooltip. Long customer names truncate with their full text in the title.
  Horizontal scrolling stays inside the table on small screens. Existing
  filter, pagination, selection and row actions remain intact.
- Create/edit: customer and payment controls share a compact grid. Delivery is
  a header checkbox; address fields appear when enabled. Product search and
  service selection share a row on desktop. One flat footer carries totals,
  draft/save/post and cancel; the duplicate header/sidebar save controls are
  removed. Service identification remains visible and required. Multiple
  identical service rows keep separate controlled notes after deletion.
- Detail: compact header, flat items/customer/financial sections, no decorative
  summary cards or repeated dark total tile. History and secondary status
  details expand on demand. Action confirmations and disabled states remain.
- Trade-in: existing data/validation is unchanged. The editor has a bounded
  scroll area, named dialog, Escape/backdrop close and keyboard focus return.
- Display dates use Asia/Ho_Chi_Minh. Stored timestamps, amounts (full VND),
  submit endpoints, stock effects, payment/shipment logic and service intake
  are unchanged. This UI work does not add thousand-unit conversion to orders.

`scripts/smoke-order-compact-ui.cjs` renders actual list/create/edit/detail
components with synthetic records and mocked external network/notification
boundaries. It verifies draft/post confirmation, payload amounts, required
service identification, multiple service notes, shipping and COD, trade-in,
locked/cancelled guards, draft-only modal and responsive overflow. No real
order, payment, shipment or technical issue is created by the fixture.
