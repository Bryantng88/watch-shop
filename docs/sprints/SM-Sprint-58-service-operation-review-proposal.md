# SM Sprint 58 - Service Operation Review Proposal

## Status

Completed.

This is the Sprint 58 output. It audits the existing Service Request and
Technical Issue implementation against the Space / Workspace / Blueprint model
and defines the smallest safe Sprint 59 implementation slice.

Do not re-open the architecture discussion when continuing on another machine.
Start Sprint 59 from the recommendation in this document.

## Sprint Planning Rules

Use these rules for Sprint 59 and all Service Operation follow-up sprints:

- Stay inside the accepted sprint scope.
- Produce concrete, executable proposals: target files, runtime boundary,
  expected behavior, validation, and rollback path.
- Apply senior-dev judgment: preserve domain ownership, keep current screens
  compatible, prefer adapters before rewrites, and avoid schema changes unless
  the sprint explicitly requires them.
- Treat SR/TI as Service truth. Space/Workspace wraps operations; Workflow
  routes state; Event bridges side effects; Activity/Timeline is the operational
  log; Projection/read facade serves lists and dashboards.
- Stop and discuss before changing SR/TI cardinality, required assessment
  coupling, direct Service-to-Space references, Payment ownership,
  MaintenanceRecord role, or Blueprint snapshot semantics.

## Executive Decision

Service Request and Technical Issue should be kept as existing business-domain
truth. They should not be rewritten from zero.

The current Service domain can support the first Service Operation Space, but
only if Sprint 59 adds a thin Service Operation read/application boundary over
the existing service tables and normalizes event/payment/binding behavior. Do
not add direct `spaceId` or `workspaceId` fields to ServiceRequest or
TechnicalIssue in the first implementation slice.

Recommended Sprint 59 direction:

```text
Existing Service truth
-> Service Operation read contract / projection-ready facade
-> SR case view and TI bench view
-> Business events and payment boundary cleanup
-> later projection and Space UI
```

## Foundation Model For Sprint 59

Sprint 59 must start from this model, not from individual legacy screens:

```text
Service domain
  SR / TI = business truth

Space / Workspace
  operational wrapper around SR / TI

Workflow
  flexible operational routing/state over wrapped SR / TI items

Event
  bridge from Service truth changes to Workspace, Workflow, Activity, and
  Projection consumers

Activity / Timeline
  shared operational log for WP/Space context

Projection / Read Facade
  read contract for dashboards, SR case mode, and TI bench mode
```

Core implications:

- SR/TI are not replaced by Workspace items.
- Space/Workspace does not own Service business truth.
- Service should not call Workspace/Timeline/Notification directly.
- Workflow state can wrap or map SR/TI state, but should not force every
  operational state into SR/TI schema.
- Events are the bridge between domain facts and collaboration/runtime side
  effects.
- Activity/Timeline is the common operational log. MaintenanceRecord must not
  become a second activity system.
- Service Operation UI should read through a facade/projection contract instead
  of copying old admin query shapes.

## Existing Inventory

Schema and current domain shape:

- `ServiceRequest` is the SR case aggregate.
  - Key fields: `status`, `scope`, `type`, `billable`, product/watch snapshots,
    vendor/technician snapshots, priority fields.
  - Relations: `technicalAssessment`, `technicalIssue[]`, `maintenanceRecord[]`,
    `Payment` through payments on technical issues, `Task[]`, `TaskExecution[]`,
    legacy `workCaseId`.
  - `maintenanceRecord[]` is legacy Service history/report data. It should not
    become the operational log for Service Operation Space.
- `TechnicalAssessment` is currently one-to-one with ServiceRequest.
  - It stores diagnostic status, movement/case/crystal/crown section status,
    payload data, conclusion, image, vendor, and evaluator snapshots.
- `TechnicalIssue` is the technical execution unit.
  - It is required to have both `serviceRequestId` and `assessmentId`.
  - It has execution fields: `executionStatus`, `openedAt`, `startedAt`,
    `completedAt`, `canceledAt`, `isConfirmed`, costs, catalog references,
    vendor/technician ownership, and resolution fields.
- `Payment` already links to `technical_issue_id` and has legacy
  `service_request_id`.
  - The active service payment path now mostly derives service payments from
    TI payments.
- `TaskExecution` is used as the legacy binding/activity bridge.
  - It has direct optional `serviceRequestId`, `technicalIssueId`, and
    `taskItemId`.

Important service files audited:

- `src/domains/service/server/repository/service-request.repo.ts`
- `src/domains/service/server/list/service-request-list.service.ts`
- `src/domains/service/server/detail/service-request-detail.service.ts`
- `src/domains/service/server/issue-board/service-issue-board.service.ts`
- `src/domains/service/server/technical/technical-assessment.service.ts`
- `src/domains/service/server/service-task/service-request-from-task.service.ts`
- `src/domains/service/application/complete-service-request.application.ts`
- `src/domains/service/application/create-maintenance-record.application.ts`
- `src/domains/payment/server/service-issue-payment.service.ts`
- `src/domains/task/server/task-technical-issue-sync.service.ts`

## What To Keep

Keep these as domain behavior:

- `ServiceRequest` remains the business case aggregate.
- `TechnicalIssue` remains the execution unit for bench work.
- Current active service constraint by product/watch should stay for now.
  - `service-request-from-task.service.ts` prevents creating a new active SR
    when one already exists for the same product.
  - Treat this as current product policy until a later sprint explicitly changes
    multi-SR behavior.
- TI payment should be attached to `TechnicalIssue`, not primarily to
  `ServiceRequest`.
  - `ensureServiceRequestPaymentTx` is already a legacy alias that iterates done
    TIs.
- Completion gating should remain in Service domain.
  - `complete-service-request.application.ts` checks unfinished issues, missing
    conclusion/catalog/cost/resolution, and mechanical image requirements before
    closing SR.
- Technical assessment can continue to create/sync initial TIs.
  - This is valid for intake/diagnosis.
- Activity/Timeline should be the operational log surface for WP/Space context.
  - Use it for who did what, when, note, stage movement, activity feed, and
    collaboration history.

## What To Fix

These issues are concrete Sprint 59 or near-term fixes.

### 1. ServiceRequest status sync currently writes invalid enum value

`syncServiceRequestStatusFromIssues` in
`src/domains/service/server/issue-board/service-issue-board.service.ts` sets
`nextStatus = "DONE"` when all active issues are done.

`ServiceRequestStatus` does not contain `DONE`; it contains `COMPLETED` and
`DELIVERED`. This is a real bug risk.

The product decision for Sprint 59 is:

- SR workflow is mostly derived from TI workflow.
- If any active TI is open/confirmed/in progress, SR is `IN_PROGRESS`.
- If all active TIs are done, SR domain status should become `COMPLETED`.
- Payment, pickup, and customer-facing follow-up are commercial/delivery
  attention states, not reasons to keep the SR technical workflow in progress.

Sprint 59 should centralize SR status derivation in a small policy module:

- `src/domains/service/server/shared/service-request-status.policy.ts`

Minimum mapping:

- no active TI: keep existing status unless draft/intake rule applies;
- open/confirmed/in-progress TI: `IN_PROGRESS`;
- all active TI done: `COMPLETED`;
- explicit delivery/pickup completion remains responsible for `DELIVERED`;
- canceled SR remains terminal and should not be revived by TI sync.

The Service Operation read facade can still expose derived attention fields:

- `waitingPayment`;
- `waitingPickup`;
- `costApproval`;
- `vendorHolding`;
- `overdue`.

Those fields should not replace `ServiceRequest.status`.

### 2. TI board columns are hard-coded and not blueprint/capability aware

Current board mapping:

```text
OPEN + not confirmed -> PENDING_CONFIRM
OPEN + confirmed / CONFIRMED -> READY
IN_PROGRESS -> IN_PROGRESS
DONE / COMPLETED -> DONE
```

This is acceptable as legacy domain mapping, but Service Operation Space needs a
stage contract:

```text
Inspect
Ready
In Progress
Done
```

Sprint 59 should add a read-layer adapter that maps current TI statuses to
Service Operation stages without changing the enum yet.

### 3. TechnicalIssue is too tightly coupled to TechnicalAssessment for future bench intake

Schema requires `assessmentId` for every TI. `createTechnicalIssue` works around
this by creating a draft TechnicalAssessment when missing.

Keep this temporarily. Do not make `assessmentId` nullable in Sprint 59.

But Sprint 59 should document and enforce this as an adapter rule:

- bench-created TI must still belong to an SR;
- if no assessment exists, create a draft assessment internally;
- UI and Space code should not need to know this technical-assessment coupling.

### 4. Payment creation is partially behind Payment boundary, partially direct

Good path:

- `complete-service-request.application.ts` calls
  `ensureServiceRequestPaymentApplicationTx`.
- `completeTechnicalIssue` calls `ensureTechnicalIssuePaymentTx`.

Legacy path:

- `create-maintenance-record.application.ts` has local `createPaymentTx` and
  directly calls `tx.payment.create`.

Sprint 59 should remove direct payment creation from Service application code by
calling Payment application/server boundary. No schema migration is required.

### 5. MaintenanceRecord overlaps with Activity and should not be expanded

MaintenanceRecord currently acts like a second service log in several flows:

- notes and service updates;
- vendor/cost updates;
- approval/rejection notes;
- technical issue maintenance logs.

That overlaps with the WP Activity/Timeline model. Activity is the more general,
reusable, and trustworthy log abstraction for Space/Workspace context.

Sprint 59 should not build new Service Operation behavior on MaintenanceRecord.
Instead:

- stop expanding MaintenanceRecord as a log mechanism;
- route operational notes/stage/history to Activity/Timeline through events or
  the existing collaboration layer;
- keep MaintenanceRecord only as legacy read data until a follow-up audit
  decides whether any structured report fields are still worth preserving;
- do not use MaintenanceRecord to drive TI stage, SR readiness, payment state,
  or Service Operation dashboard counters.

Candidate fields to migrate away from MaintenanceRecord over time:

- generic notes/history -> Activity/Timeline;
- cost/payment facts -> Payment;
- vendor/owner/status movement -> TechnicalIssue or Activity;
- final technical result/evidence -> TechnicalIssue, TechnicalAssessment, or a
  future Service Report if a true structured report is needed.

### 6. Service list query mixes case-list projection logic into repository

`service-request.repo.ts` builds list rows, joins technical issues, then performs
a second query for payments by technical issue. It computes:

- issue counts;
- open issue counts;
- actual/estimated cost totals;
- paid/collected/unpaid/canceled totals;
- remaining amount;
- source labels.

This is useful data, but it is already projection-shaped. Sprint 59 should move
this into a Service Operation read facade instead of expanding the repository
further.

### 7. Detail service mixes SR detail and TI board concerns

`service-request-detail.service.ts` loads SR detail and then calls
`getTechnicalIssueBoardData({ serviceRequestId })`.

That is fine for the existing detail page, but Service Operation Space needs
two separate read contracts:

- SR case detail;
- TI stage board or TI list, optionally filtered by SR.

Sprint 59 should introduce explicit DTOs for these contracts.

### 8. Task/TaskExecution sync is still legacy binding glue

`syncTechnicalIssueToTasks` writes TaskExecution rows and updates tasks directly.
That can stay for compatibility, but new Service Operation code should not use
TaskItem/TaskExecution as the business truth.

Sprint 59 should add comments/adapter naming so new Service Operation code talks
in business vocabulary first:

- SR case;
- TI stage item;
- service operation event;
- downstream binding/projection.

## What To Move

Move out of the core Service domain path over time:

- list/dashboard aggregation into read facade/projection;
- board column labels and stage titles into Service Operation read/UI contract;
- payment lifecycle operations into Payment boundary;
- operational log/history into Activity/Timeline, not MaintenanceRecord;
- task/workspace side effects into event consumers or binding services;
- UI-only labels like source, attention chip, and mode-specific counters into
  read model/projection.

## What To Add

Add in Sprint 59:

- `src/domains/service/server/operation/service-operation.types.ts`
- `src/domains/service/server/operation/service-operation-read.service.ts`
- `src/domains/service/server/shared/service-request-status.policy.ts`
- optional `src/domains/service/server/shared/technical-issue-stage.policy.ts`

Suggested DTOs:

```ts
type ServiceOperationSrCaseRow = {
  id: string;
  refNo: string | null;
  status: string;
  attention: "NONE" | "COST_APPROVAL" | "VENDOR_HOLDING" | "PAYMENT" | "OVERDUE";
  watch: {
    productId: string | null;
    title: string | null;
    sku: string | null;
    imageUrl: string | null;
  };
  technicalProgress: {
    total: number;
    open: number;
    inProgress: number;
    done: number;
    completed: boolean;
  };
  commercial: {
    estimatedTotal: number;
    actualTotal: number;
    paid: number;
    unpaid: number;
    remaining: number;
  };
  updatedAt: Date;
};

type ServiceOperationTiStageItem = {
  id: string;
  serviceRequestId: string;
  stage: "INSPECT" | "READY" | "IN_PROGRESS" | "DONE";
  summary: string;
  area: string | null;
  ownerKind: "INTERNAL" | "VENDOR" | "PARTS" | "UNKNOWN";
  vendorName: string | null;
  estimatedCost: number | null;
  actualCost: number | null;
  priority: string | null;
  updatedAt: Date;
};
```

These DTOs can be backed by current queries first. Projection can come later
after the contract is accepted.

## SR Case View Contract

The existing Service list already supports most SR case data:

- SR identity and status;
- watch/product snapshot;
- owner/vendor/technician;
- issue counts and open issue count;
- estimated/actual cost totals;
- service payment totals;
- source label.

Gaps:

- no explicit Service Operation dashboard contract;
- no stable attention field;
- no `completed` technical-progress field separate from commercial/delivery
  attention;
- no creator/system signal;
- no Space range filter;
- no capability gating.

Sprint 59 should add a read facade that returns these fields explicitly without
forcing the old admin list UI to change immediately.

## TI Bench View Contract

The existing issue board already supports a global TI board:

- `getTechnicalIssueBoardData()` can run without `serviceRequestId`;
- it groups into columns;
- it includes SR/watch/product context;
- it includes vendor/catalog/legacy maintenance data.

Gaps:

- column names are legacy board concepts, not Service Operation stage concepts;
- stage mapping is not capability/blueprint driven;
- board query is heavy and UI-shaped;
- legacy maintenance approval fields have casing bugs risk:
  `maintenanceRecord` is selected, but later code checks `x.MaintenanceRecord`;
- maintenance data overlaps with Activity/Timeline and should not be expanded
  for new Service Operation behavior;
- no stage-level operation contract;
- no Space range/week filter.

Sprint 59 should keep the existing board for current screens and add a lighter
`listServiceOperationTiStageItems` facade for the new space surface.

## Space / Blueprint Readiness

Do not add Service `spaceId` / `workspaceId` in Sprint 59.

Reason:

- Service owns SR/TI truth.
- Space/Workspace owns collaboration context.
- Projection owns dashboard/list read models.
- BusinessBinding/TaskExecution-style linking is the bridge, not the source of
  Service truth.

Minimum capability contract for Service Operation:

- `service.sr_case_view`
- `service.technical_bench`
- `service.stage_board`
- `service.approval`
- `service.payment_request`
- `service.receive_previous_week`
- `service.auto_binding`
- `service.shared_participants`
- `service.activity`

Sprint 59 should not implement the full capability engine. It should make the
Service Operation read facade accept a capability context shape so the UI can be
gated later without rewriting query code.

## Event Boundary Recommendation

Service should eventually emit these business events:

- `service_request.created`
- `service_request.updated`
- `service_request.status_changed`
- `technical_issue.created`
- `technical_issue.stage_changed`
- `technical_issue.completed`

Payment should own:

- `payment.created`
- `payment.status_updated`

Sprint 59 should not wire every event consumer yet. The safe first step is:

- define event key constants/contract notes for Service;
- add event emission only to one or two high-value milestones if there is an
  existing event API pattern ready to reuse;
- otherwise leave event emission as Sprint 60 after the read facade is stable.

Do not make Service call Workspace/Timeline/Notification directly.

## Payment Boundary Recommendation

Keep current Payment schema for now.

Sprint 59 should:

- route maintenance-cost payment creation through
  `ensureTechnicalIssuePaymentTx` or a new Payment boundary function;
- remove local `createPaymentTx` from
  `create-maintenance-record.application.ts`;
- avoid adding any new MaintenanceRecord-based payment, approval, or activity
  behavior;
- keep `Payment.technical_issue_id` as the primary Service payment owner;
- treat `Payment.service_request_id` as legacy/backward-compatible unless a
  future migration says otherwise.

Payment Space can later consume Payment events or projection rows. Service
should display payment status and gate readiness, but Payment owns payment
operations.

## Proposed Sprint 59 Implementation Slice

### Goal

Create a Service Operation read/application boundary that makes SR Case and TI
Bench explicit without changing runtime UI yet.

### Files To Add

- `src/domains/service/server/operation/service-operation.types.ts`
- `src/domains/service/server/operation/service-operation-read.service.ts`
- `src/domains/service/server/operation/index.ts`
- `src/domains/service/server/shared/service-request-status.policy.ts`
- `src/domains/service/server/shared/technical-issue-stage.policy.ts`

### Files To Change

- `src/domains/service/server/issue-board/service-issue-board.service.ts`
  - replace invalid SR `DONE` write;
  - call shared status/stage policy;
  - keep existing board output stable.
- `src/domains/service/application/create-maintenance-record.application.ts`
  - move payment creation behind Payment boundary;
  - do not add new MaintenanceRecord behavior beyond compatibility.
- `src/domains/service/server/repository/service-request.repo.ts`
  - do not expand further; reuse from operation read facade or extract common
    aggregation helpers.
- `src/domains/service/server/index.ts`
  - export operation read boundary.
- `docs/sprints/CURRENT.md`
  - point to Sprint 59 after implementation plan is accepted.

### Schema Changes

No schema change in the first Sprint 59 slice.

Explicitly avoid:

- adding `spaceId` / `workspaceId` to ServiceRequest or TechnicalIssue;
- making `TechnicalIssue.assessmentId` nullable;
- changing enum values;
- deleting legacy payment/service request fields.

### Validation Commands

Use targeted validation first:

```bash
cmd /c npx eslint src/domains/service/server/operation src/domains/service/server/shared src/domains/service/server/issue-board/service-issue-board.service.ts src/domains/service/application/create-maintenance-record.application.ts --max-warnings=0
cmd /c npx tsc --noEmit
```

Whole-repo `tsc --noEmit` may surface unrelated checkout noise; if so, record
the unrelated errors and run targeted TypeScript checks where practical.

### Rollback Plan

- Keep old admin service list/detail/issue-board routes unchanged.
- Gate new Service Operation read facade behind new imports only.
- If facade output is wrong, revert facade files without touching SR/TI schema.
- Payment boundary cleanup can be reverted independently because schema remains
  unchanged.
- MaintenanceRecord de-emphasis is additive at first: keep legacy reads working,
  but do not create new dependencies on it from Service Operation.

## Open Questions

No blocking question is required before Sprint 59 if the implementation follows
this proposal.

Stop and ask before doing any of these:

- allowing more than one active SR for the same product/watch;
- allowing TI without SR;
- making `TechnicalIssue.assessmentId` nullable;
- storing direct `spaceId` / `workspaceId` on Service rows;
- making Blueprint capability overrides mutate existing created spaces;
- moving full payment lifecycle ownership into Service;
- changing current TI enum values.
- using MaintenanceRecord as the new WP/Space activity log.

## Sprint 59 One-Line Brief

Implement a Service Operation read facade plus status/stage/payment/activity
boundary cleanup, using existing SR/TI truth and no schema migration. Activity
is the operational log; MaintenanceRecord is legacy/structured-report candidate
only.
