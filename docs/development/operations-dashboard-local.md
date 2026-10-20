# Operations dashboard local handoff

## Scope

Branch: `feat/business-operations-dashboard`

The operational home is `/admin/dashboard`. It is intentionally separate from
historical reporting under `/admin/reports/*`.

Implemented behavior:

- the admin root redirects to the operational dashboard;
- the hero promotes the highest-priority actionable exception;
- canonical counters cover Orders, Purchase Requests, Media, and Technical;
- receivable comes from remaining Order balances;
- payable comes from unpaid outgoing Acquisition payments;
- queue cards link to the exact stage or warning filter;
- Media highlights not-started work and items quiet for 7/30 days;
- the backlog panel is an intervention strip, not a cross-domain percentage;
- a non-interactive Personal Work / Google Calendar roadmap strip is present;
- shared domain icons and stage/status colors are used by the dashboard and
  Coordination surfaces;
- admin navigation remembers the previous admin URL, including query filters.

## Local setup

Use a local PostgreSQL database only. Copy the normal local environment files
through the team's secure channel; never commit them.

```powershell
npm ci
npx prisma generate
npx prisma migrate deploy
npm run local:seed-admin
npm run local:seed-operations-dashboard
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000/admin/dashboard` and sign in with the local admin
created by `local:seed-admin`. The script output/local operator flow is the
source of truth for credentials; credentials are deliberately not documented
in Git.

## Test data

`npm run local:seed-operations-dashboard` is idempotent and refuses to run
unless `DATABASE_URL` points to a loopback host and a database name containing
`test`, `local`, or `storefront`.

It guarantees these Purchase Request scenarios:

| Reference | Status | Follow-up | Dashboard purpose |
| --- | --- | --- | --- |
| `LOCAL-PR-WAITING-001` | `WAITING` | none | waiting and unassigned work |
| `LOCAL-PR-PROCESSING-002` | `PROCESSING` | two days overdue | hero priority and overdue follow-up |
| `LOCAL-PR-COMPLETED-003` | `COMPLETED` | none | completed request fixture |

The dashboard reads Orders, Media, and Technical from their canonical
projections. To exercise those areas on another machine, restore or seed the
normal local business dataset, then make sure the following scenarios exist:

- an Order with a positive `remainingAmount`;
- an Order waiting for shipment;
- a Media item in `MEDIA_PROCESSING` with no completed work;
- Media items last updated more than 7 and 30 days ago;
- a Technical item with `overdueDays > 0`.

Projection readiness is checked when the page loads. Do not add dashboard-only
copies of Order, Media, or Technical records merely to populate the UI.

## Verification

```powershell
cmd /c npx eslint "src/domains/admin-home" --max-warnings=0
cmd /c npx tsc --noEmit
cmd /c npm run build
```

Also verify manually:

1. the hero opens the exact priority queue;
2. each warning opens its intended filtered operational view;
3. zero-count stages remain available but visually quiet;
4. browser Back and the admin back control restore the prior query/filter;
5. responsive layouts remain readable at laptop and wide desktop widths.

## Known gaps and next decisions

- `Của tôi` is disabled because assignee ownership is not normalized across
  Media and Technical. Do not enable a partial or cosmetic filter.
- Payments do not yet have a canonical due date, so receivable/payable cards
  cannot honestly split overdue, due-today, and future balances.
- Media insight counts currently consume canonical projection rows; if the
  board grows beyond the query window, add a projection-level aggregate rather
  than increasing UI pagination indefinitely.
- Personal Work and Google Calendar are roadmap-only; no OAuth, task storage,
  sync, or background jobs are included.
- The intervention strip currently shows one highest-severity warning per
  domain. Continue UI iteration from this state rather than reintroducing
  percentages across unlike work units.

## Git hygiene

Generated Zod files and `tsconfig.tsbuildinfo` may appear modified after local
generation/checks. They are not part of this dashboard change and must not be
staged unless the Prisma schema itself intentionally changes.
