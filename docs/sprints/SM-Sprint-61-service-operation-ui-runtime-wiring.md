# SM Sprint 61 - Service Operation UI and Runtime Wiring

## Status

Implemented first production slice.

Sprint 61 wires the Sprint 59 Service Operation read facade and Sprint 60
Blueprint/workflow contract into a usable production surface. It intentionally
does not activate Service Operation event bindings yet because Service event
producers/catalog keys still need a separate alignment pass.

## Scope Rules

Do:

- expose Service Operation through a production admin surface;
- read SR cases, Technical Bench items, and counters through the Sprint 59 read
  facade;
- add honest `ALL_ACTIVE` / `CURRENT_WEEK` scope handling;
- keep TechnicalIssue workflow actions grounded in Service commands;
- keep event bindings as `DRAFT` until event producers/catalog keys align.

Do not:

- add Space workflow;
- add SR workflow;
- add Service `spaceId` or `workspaceId`;
- add Service schema migrations;
- make MaintenanceRecord the Activity source;
- build ProjectionRecord-backed Service Operation reads in this first slice.

## Implemented

### 1. Service Operation scope/range support

Changed:

- `src/domains/service/server/operation/service-operation.types.ts`
- `src/domains/service/server/operation/service-operation-read.service.ts`

Added:

- `ServiceOperationRange`
- `ServiceOperationScope`
- `resolveServiceOperationScope`

Supported ranges:

```text
ALL_ACTIVE
CURRENT_WEEK
```

`CURRENT_WEEK` resolves from `anchorDate` to ISO week boundaries and applies a
date scope to SR/TI reads. `ALL_ACTIVE` remains the default and is explicitly
labelled that way.

### 2. Production admin UI surface

Added:

- `src/app/(admin)/admin/services/operation/page.tsx`

Changed:

- `src/app/(admin)/admin/coordination/technical/page.tsx`

Route:

```text
/admin/coordination/technical
/admin/services/operation
```

`/admin/coordination/technical` is the primary Space Management > Technical
entry. It now renders the Service Operation surface instead of the older generic
technical coordination workspace. `/admin/services/operation` remains a direct
alias for the same surface.

This means the sidebar Technical entry should no longer show the old generic
Workspace list for this slice. It should show Service Operation directly:
Service Operation header, SR/TI mode switch, flow setup, SR cases, and
Technical Bench.

The page reads through:

- `listServiceOperationSrCases`
- `listServiceOperationTiStageItems`
- `getServiceOperationCounters`

The production page now follows the
`docs/prototypes/service-operation-space-modes.html` structure: topbar, SR/TI
mode switch, flow setup strip, SR case table, and Technical Bench board.

It exposes:

- range filter;
- anchor date filter;
- search filter;
- SR/TI mode switch;
- Service Operation flow setup strip;
- TI stage filter;
- SR case table;
- Technical Bench board grouped by TI stage;
- counters.

### 3. Production JSON API surface

Added:

- `src/app/api/admin/service-operation/route.ts`

Route:

```text
GET /api/admin/service-operation
```

Query params:

```text
q
range
anchorDate
stage
srPage
srPageSize
tiPage
tiPageSize
```

The route returns:

- `scope`
- `counters`
- `srCases`
- `tiItems`

### 4. Event/runtime decision

Service Operation event bindings remain `DRAFT`.

Reason:

- Sprint 60 event keys include `service_request.created`,
  `technical_issue.confirmed`, `payment.created`, and `payment.status_updated`;
- current legacy catalog only clearly includes keys such as `payment.paid`,
  `service_request.completed`, and `technical_issue.done`;
- activating consumers before key alignment would create misleading runtime
  behavior.

## Validation

Passed:

```bash
cmd /c npx eslint src/domains/service/server/operation "src/app/(admin)/admin/services/operation/page.tsx" src/app/api/admin/service-operation/route.ts --max-warnings=0
cmd /c npx tsc --project tsconfig.sprint61.tmp.json --pretty false
cmd /c npx eslint "src/app/(admin)/admin/services/operation/page.tsx" "src/app/(admin)/admin/coordination/technical/page.tsx" src/app/api/admin/service-operation/route.ts src/domains/service/server/operation --max-warnings=0
```

The temporary `tsconfig.sprint61.tmp.json` was removed after validation.

## Acceptance

Sprint 61 first slice passes because:

- production UI route exists and uses the read facade;
- production JSON route exists and uses the read facade;
- scope/range is explicit and not mislabeled as weekly when reading all active;
- no Service schema change was introduced;
- event bindings are not activated prematurely;
- Space remains scope/context only;
- SR remains Service case truth;
- TI remains the Technical Bench workflow item.

## Remaining Follow-Ups

Recommended next sprint:

```text
Sprint 62 - Service Operation Action Adapter and Event Key Alignment
```

Scope:

- add a Service Operation action adapter that maps workflow/manual action
  metadata to existing Service commands;
- keep the adapter thin: no new domain truth, no schema change, no direct UI
  mutation of TI state;
- align Service/Payment business event keys, catalog entries, and producers
  before activating any Service Operation event binding;
- wire Activity/Timeline from domain events where the event contract is stable;
- leave ProjectionRecord-backed Service Operation reads deferred unless there
  is measured performance pressure.

Concrete action mapping to review/implement:

- `confirm-issue` -> `confirmTechnicalIssue`;
- `start-work` -> `startTechnicalIssue`;
- `mark-done` -> `completeTechnicalIssue`;
- reopen/block/update actions only if existing Service commands already support
  them cleanly.

Event key alignment to settle:

- final TI event keys: whether to keep legacy `technical_issue.done` or add
  explicit `technical_issue.confirmed`, `technical_issue.started`,
  `technical_issue.completed`, and `technical_issue.reopened`;
- final Payment event keys and targets: existing `payment.paid` versus draft
  `payment.created` / `payment.status_updated`;
- Service Request completion event semantics: SR may be considered done when all
  TI are done, but SR still should not get a separate workflow engine in this
  slice.

Optional only:

- add Service Operation navigation entry if desired;
- only then consider moving selected Service Operation reads to ProjectionRecord
  with compare/fallback.

Stop and discuss before:

- making event bindings `ACTIVE`;
- adding Service-to-Space foreign keys;
- adding an SR workflow runtime;
- turning MaintenanceRecord into Activity;
- creating Payment Workspace.
