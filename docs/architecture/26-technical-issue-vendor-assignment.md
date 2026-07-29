# Technical Issue Vendor Assignment Contract

## Invariant

Vendor selection while a Technical Issue moves into processing is an initial
assignment, not a vendor change. It must not require a change reason or emit a
vendor-changed event.

A vendor change exists only when:

- the Technical Issue is already processing (`IN_PROGRESS`; `PROCESSING` is
  accepted as a compatible projection value); and
- the normalized next vendor differs from the currently persisted vendor.

This includes assigning, replacing, or removing a vendor after processing has
already begun. A real vendor change requires a non-empty reason.

## Enforcement

- The Service domain server is authoritative for the invariant.
- Operational UIs use the same shared policy for field visibility and
  client-side validation.
- `TECHNICAL_ISSUE_VENDOR_CHANGED` and its reason are recorded only for a real
  vendor change.
- Entry points and adapters may pass `vendorChangeNote`, but must not implement
  their own interpretation of initial assignment versus change.

The shared policy lives in
`src/domains/service/shared/technical-issue-vendor-policy.ts`.
