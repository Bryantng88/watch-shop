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
