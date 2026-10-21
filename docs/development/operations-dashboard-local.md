# Operations dashboard local handoff

## Scope

Branch: `feat/business-operations-dashboard`

The operational home is `/admin/dashboard`. It is intentionally separate from
historical reporting under `/admin/reports/*`.

Implemented behavior:

- the admin root redirects to the operational dashboard;
- the light priority banner promotes the highest-priority actionable exception
  and labels it as the first priority for today;
- canonical counters cover Orders, Purchase Requests, Media, and Technical;
- the four operational queue cards sit directly below the priority banner and
  link to the exact stage or warning filter;
- Media highlights not-started work and items quiet for 7/30 days;
- stale Media attention is ordered oldest-first and uses `Kiểm tra tiến độ`
  rather than implying image processing has already started;
- Purchase Request attention uses `TASK_MANAGE` to choose between assignment
  and intake-oriented calls to action;
- the open-work map provides graphical context plus the strongest warning per
  domain; percentages are item shares, not effort estimates;
- the Personal Work strip links to `/admin/personal-work`;
- Personal Work reuses the existing `Task` / `TaskItem` core with `TaskKind.PERSONAL`, supports operational domain tags, due dates, priorities and completion;
- Google Calendar OAuth tokens are encrypted server-side and each personal task keeps one stable event link to prevent duplicate events;
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
npm run local:seed-personal-work
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

## Google Calendar local configuration

Create a Google OAuth web application and configure this exact callback:

```text
http://localhost:3000/api/admin/personal-work/google/callback
```

Provide these values only through the local/production secret channel:

```text
GOOGLE_CALENDAR_CLIENT_ID
GOOGLE_CALENDAR_CLIENT_SECRET
GOOGLE_CALENDAR_TOKEN_KEY
APP_URL=http://localhost:3000
```

`GOOGLE_CALENDAR_TOKEN_KEY` must remain stable after deployment because stored
access and refresh tokens are encrypted with it. Never commit these values.

The initial sync contract is deliberate: the admin is the source of truth and
explicitly creates or updates one Google event per personal task. Importing
arbitrary Google events and background reconciliation are deferred until event
ownership and conflict rules are approved.

## Known gaps and next decisions

- `Của tôi` is disabled because assignee ownership is not normalized across
  Media and Technical. Do not enable a partial or cosmetic filter.
- Financial summary cards were deliberately removed from this operational
  screen. Financial insight belongs in a dedicated view with canonical due-date
  semantics rather than competing with daily operational actions.
- Media insight counts currently consume canonical projection rows; if the
  board grows beyond the query window, add a projection-level aggregate rather
  than increasing UI pagination indefinitely.
- Google Calendar is explicit outbound sync in this first slice. Background
  reconciliation and inbound import are not included yet.
- The open-work map currently shows one highest-severity warning per domain.
  Its percentage is only the share of open items; do not interpret it as work
  effort or staffing capacity.

## Git hygiene

Generated Zod files and `tsconfig.tsbuildinfo` may appear modified after local
generation/checks. They are not part of this dashboard change and must not be
staged unless the Prisma schema itself intentionally changes.
