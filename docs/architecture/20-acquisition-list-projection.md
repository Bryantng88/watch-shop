# Acquisition List Projection

## Purpose

The Admin Acquisition List is a read surface. It renders one projection row per
acquisition and must not use business-status tabs as separate list modes.

## Projection contract

`AcquisitionListProjectionRow` is the list contract. It exposes:

- acquisition identity and vendor;
- approval status;
- payment status and amounts;
- acquisition type;
- item/watch linkage summary;
- total value, invoice presence, and update timestamps.

The projection query owns database filtering, sorting, and pagination. The UI
must not load the full acquisition set and filter it in memory.

## List interaction

- Status is a filter and a visible column, not a top-level tab.
- Vendor and status are primary filters.
- Acquisition type is an advanced filter.
- Search, sort, active-filter chips, and result totals use the shared business
  list filter surface used by Watch List.
- Existing row actions remain commands against the Acquisition domain; they are
  not part of the projection contract.

## Boundaries

- No Prisma schema change.
- No Order changes.
- No Space or Workspace binding in this phase.
- Dashboard data remains a separate Acquisition read query and shares only the
  Admin dashboard widget UI primitives.
