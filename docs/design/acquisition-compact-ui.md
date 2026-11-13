# Compact acquisitions and checklist sharing

Follows `admin-ui-language-contract.md`: white canvas, compact header metrics,
flat sections and rows, one primary save action. The acquisition chooser uses
simple linked rows. List filters and permission-scoped actions are retained;
the redundant list title is removed. The create form exposes vendor, receipt
time and type, with notes/default audience/currency disclosed on demand.
Watch rows and accessory sections no longer stack bordered cards. The edit
modal retains posted-receipt restrictions and its existing save confirmation.

## Amount entry

Acquisition VND cost and suggested sale inputs use **nghìn ₫**: `2500` means
2,500,000 VND. A comma or period is a decimal separator (`2,5` means 2,500 VND),
not a grouping separator. The unit is always visible; focusing reveals the full
amount in a small tooltip. Receipt totals remain in full currency units.
Create/edit/accessory forms share this control. Domain state and payloads
remain full amounts; existing values divide only for display. USD is unscaled.
Blank fields retain their existing optional/zero semantics. Negative values,
scientific notation, grouping strings and unsafe amounts are rejected.

## Checklist sharing

A small add-person control and one row per recipient replace the separate title,
help text and save footer. Adding, changing permission and removing save
immediately. New recipients default to VIEWER. Pending controls are disabled;
failed saves restore the previous list and display the error. Escape returns
focus to the trigger; outside pointer closes the panel. Server authorization
and checklist-only projection remain unchanged.

## Validation

`scripts/smoke-acquisition-compact-ui.cjs` renders actual create/edit/share
components with synthetic vendors and intercepted HTTP. It checks VND payloads,
unchanged edit amounts, decimal/blank/invalid/unsafe inputs, unscaled USD,
viewer default, role changes, revoke failure rollback, revoke success, keyboard
close and mobile/tablet overflow. It does not approve receipts, send real pushes
or mutate application data.

## Responsive quick entry and image name suggestions

Watch rows and the NAS picker are memoized with stable ID/patch callbacks. Editing
one name/hint/amount updates controlled domain state immediately, without delaying
values or re-rendering every NAS dialog. Vendor selection is memoized separately.
All submitted values still use the current state and existing money/trade-in rules.

The optional **Codex gợi ý tên** action processes up to 12 current NAS inline images
per click through the existing authenticated customer Codex worker. It returns only
bounded name facts and uncertainty notes. The full watch editor and quick intake
share title ordering: year (when known), brand, model, reference, nickname, movement.
Quick input permits missing year/research facts; it does not relax storefront
publication criteria. The AI cannot set price, assert authenticity, publish, create
an acquisition/watch or approve anything. The user can edit the suggested name and
save normally. Missing facts remain absent, not invented placeholders.

Preview records reuse the existing leased queue but have an isolated purpose and
never appear in Ben history or accept Ben conversation approvals/lookups. The worker
must advertise the new capability; older workers leave previews queued. Account and
WATCH_ACQUISITION_CREATE authority are rechecked at request/read/claim/heartbeat/
finish. NAS paths, format, size, pixels, lease and media version are bounded and
checked. Images are stripped on finish/expiry and excluded from status polling SQL.
Request-key retries reuse the same batch; changed payloads cannot reuse a key.
Replies bind to the original line ID/image/name/hint/audience and cannot overwrite
new edits, changed prices, replacement photos, customer-purchase trade-ins or deleted
rows. Stop waiting/unmount aborts polling; it never executes a business mutation.

App and customer worker must be released together. A missing/offline worker leaves
manual entry available. Synthetic browser/database/protocol checks do not establish
recognition accuracy; validate representative NAS photos with the actual worker
before enabling this workflow for staff. No production deployment is part of this PR.
