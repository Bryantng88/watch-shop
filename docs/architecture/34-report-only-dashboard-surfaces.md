# Report-Only Dashboard Surfaces

Status: Accepted  
Date: 2026-10-01

## Decision

Dashboard/KPI/chart summaries are report concerns. They live under
`/admin/reports/*` and must not be embedded in operational list, board, Space,
or reconciliation screens.

Operational screens contain only the context and controls needed to perform
work: title, filters, commands, list or board rows, detail affordances, and
pagination. Counts required to operate a filter, stage, pagination control, or
reconciliation job are part of that operational read contract; decorative or
cross-domain summary cards are not.

## Request ownership

An operational route must not start a second dashboard request beside its
list/board request. In particular:

- Watch reads only the Watch list projection and scoped detail/action data;
- Acquisition reads only the Acquisition list projection and vendor options;
- Order reads only the Order list projection and command-specific data;
- Media Asset reads the asset page and reconciliation state, not asset-summary
  dashboard counters;
- Coordination bootstraps one authorized Workspace shell, while interactive
  rows use the canonical Board or Flow Query Gateway.

The legacy Watch and Coordination dashboard URLs return `410 Gone` for widget
requests. Coordination may temporarily accept old flow/board flags only as a
rolling-deploy adapter and must delegate directly to the canonical gateway.

## Report ownership

`/admin/reports/overview` is the consolidated summary surface. The historical
`/admin/dashboard` URL redirects there. `DASHBOARD_VIEW` remains the permission
for this report until a dedicated report permission migration is approved.

The `admin-dashboard-summary` projection and `src/domains/dashboard` are report
infrastructure and are intentionally retained. They must not be imported by an
operational screen.

## Forbidden patterns

- a `dashboard` prop on an operational page shell;
- dashboard customization controls or `admin-dashboard:*` local-storage keys
  on operational screens;
- `Promise.all([dashboardRequest, listRequest])` in an operational loader;
- computing trend, breakdown, recent-activity, or KPI cards from visible list
  rows;
- importing report/dashboard projections into operational clients;
- using a dashboard refresh as the post-command reconciliation mechanism.

## Legacy naming

`CoordinationDashboardDTO`, `getCoordinationDashboard`, and the matching file
names predate this decision. They currently represent a broader Workspace shell
and gateway composition contract, not an embedded dashboard request. Renaming
them requires a dedicated compatibility migration; their names do not permit a
dashboard widget surface to be reintroduced.

## Verification

Repository checks for this boundary should confirm:

- no operational client imports `BusinessListDashboard`,
  `AsyncBusinessListDashboard`, or `DashboardCustomizeButton`;
- no operational client fetches a dashboard endpoint;
- Watch, Acquisition, Order, Media Asset, and Coordination do not load a
  dashboard in parallel with their business list/board;
- only report routes consume `src/domains/dashboard` or
  `admin-dashboard-summary` at runtime.
