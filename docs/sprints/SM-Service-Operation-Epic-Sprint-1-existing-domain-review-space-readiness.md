# Service Operation Epic - Sprint 1: Existing Service Domain Review & Space Readiness

## Status

Planned.

This is the current continuation point for Service Operation work.

When opening this repo on another machine, do not restart the architecture
discussion. Start Sprint 1 by auditing the existing Service domain
implementation and producing the readiness/refactor proposal described below.

## Intent

Review the existing Service Request and Technical Issue implementation against
the new Space / Workspace / Blueprint operating model.

Service Request and Technical Issue already exist in schema, services,
repositories, actions, and UI. Sprint 1 must not design them from zero. The
goal is to identify which current logic remains valid business truth, which
logic is only legacy UI/workflow glue, and which parts must be adjusted before
Service Operation Space is implemented as a first-class operational surface.

## Why This Sprint Exists

Service was implemented before the current Space / Workspace model was clear.
Because of that, some existing logic may be correct for old service screens but
misaligned with the newer operating model:

- Service Operation Space has mode-specific surfaces.
- SR is a case aggregate.
- TI is the technical execution unit.
- Stage boards can represent many TIs in the same stage.
- Blueprint capabilities should drive what a space/page can do.
- Payment will become centralized through Payment Space.
- Business domains own truth and emit events; TaskItem/Workspace remain
  collaboration/runtime surfaces.

Sprint 1 is a senior-dev audit sprint: read the existing code, map the gaps,
and propose scoped changes before building.

## Existing Implementation Areas To Audit

Start with these files and folders:

- `prisma/schema.prisma`
  - `ServiceRequest`
  - `TechnicalAssessment`
  - `TechnicalIssue`
  - `MaintenanceRecord`
  - `Payment`
  - `TaskItem`
  - `TaskExecution`
  - related service/payment/task indexes and relations
- `src/domains/service/actions/`
- `src/domains/service/application/`
- `src/domains/service/server/repository/service-request.repo.ts`
- `src/domains/service/server/detail/service-request-detail.service.ts`
- `src/domains/service/server/list/service-request-list.service.ts`
- `src/domains/service/server/list/service-request-search-params.ts`
- `src/domains/service/server/issue-board/service-issue-board.service.ts`
- `src/domains/service/server/technical/technical-assessment.service.ts`
- `src/domains/service/server/technical/technical-assessment.repo.ts`
- `src/domains/service/server/watch-quick/watch-active-service.service.ts`
- `src/domains/service/server/service-task/service-request-from-task.service.ts`
- `src/domains/service/server/shared/service-request.rules.ts`
- `src/domains/service/ui/list/`
- `src/domains/service/ui/detail/`
- `src/domains/service/ui/issue-board/`
- `src/domains/service/ui/technical/`
- `docs/prototypes/service-operation-space-modes.html`

Use the prototype only as the current UI direction, not as source of truth.

## Scope

### 1. Review Existing Service Domain

Audit the current SR/TI model, service, repo, action, and UI behavior.

Classify current behavior into:

- **Keep**: already correct domain behavior.
- **Fix**: incorrect or brittle logic.
- **Move**: UI/projection/workflow glue that should leave Service domain.
- **Add**: minimum missing binding/event/capability support.
- **Defer**: belongs to Payment Space, Blueprint Standardization, or a later
  implementation sprint.

Pay special attention to:

- SR status vs TI execution status.
- Cost/payment fields mixed into service lifecycle.
- Query shapes that combine SR case view and TI bench view.
- Technical board logic that may be hard-coded instead of flow/capability
  driven.
- Task/TaskItem coupling that should be expressed through BusinessBinding
  vocabulary.
- Current active-service constraints for a watch.
- Whether legacy UI fields are real business truth or screen-only aggregates.

### 2. Map SR Case View vs TI Bench View

Produce a contract for how existing code supports, or fails to support, the two
Service Operation modes:

- **SR Cases**
  - case aggregate list;
  - customer/watch/commercial summary;
  - technical progress aggregate;
  - approval/payment/close readiness;
  - creator/system/user ownership signal.
- **Technical Bench**
  - TI stage board/list;
  - inspect/ready/in-progress/done grouping;
  - owner/vendor/parts responsibility;
  - estimate/actual/result;
  - batch or stage-level operations.

This sprint should identify whether those views can be served from current
Service queries or need a projection/read model.

### 3. Space / Blueprint Readiness Gap

Review what is missing for Service Operation to work as a Space:

- Does Service need direct `spaceId` / `workspaceId`, or should relation happen
  through BusinessBinding / projection?
- Which fields are domain truth and which are operational-space metadata?
- Which capability flags are needed for Service Operation?
- Which capabilities are currently hard-coded in UI or services?
- What must be snapshot from Blueprint at creation time?

Minimum capability candidates:

- `service.sr_case_view`
- `service.technical_bench`
- `service.stage_board`
- `service.approval`
- `service.payment_request`
- `service.receive_previous_week`
- `service.auto_binding`
- `service.shared_participants`
- `service.activity`

Do not implement a full Blueprint Platform refactor in Sprint 1.

### 4. Event And Payment Boundary Review

Document the minimum event contract needed by Service Operation:

- `service_request.created`
- `service_request.updated`
- `service_request.status_changed`
- `technical_issue.created`
- `technical_issue.stage_changed`
- `technical_issue.completed`
- `payment.created`
- `payment.status_updated`

Payment direction:

- Service can request/create payment through the Payment boundary.
- Payment Space receives payment items and manages payment operations.
- Payment updates emit events back to downstream consumers.
- Service should show payment status and gate SR readiness, but should not own
  the full payment lifecycle.

Sprint 1 should decide whether current Service code already creates Payment
records directly and whether that behavior should be kept temporarily,
wrapped, or moved behind a Payment service boundary.

### 5. Implementation Proposal For Sprint 2

End Sprint 1 with a concrete Sprint 2 recommendation.

The proposal must include:

- files to change;
- whether schema changes are required;
- if schema changes can be avoided initially through service abstractions or
  projections;
- safest first implementation slice;
- risks and rollback plan;
- validation commands.

Do not leave Sprint 2 as a broad idea.

## Out Of Scope

- Do not build Service Operation Space runtime UI yet.
- Do not build Payment Space.
- Do not refactor all Blueprint management.
- Do not migrate Media Space naming.
- Do not rewrite SR/TI from scratch.
- Do not introduce large schema changes without an explicit proposal.
- Do not make TaskItem the business source of truth.
- Do not move payment lifecycle ownership into Service.

## Required Deliverables

Sprint 1 is complete only when there is a written review/proposal that includes:

1. Existing Service domain inventory.
2. SR/TI status and workflow analysis.
3. Current query/UI contract analysis.
4. Space readiness gap list.
5. Blueprint capability minimum contract for Service Operation.
6. Payment/event boundary recommendation.
7. Proposed Sprint 2 implementation slice.
8. Open questions, if any, with clear stop points.

## Acceptance Criteria

After Sprint 1, another developer should be able to answer:

- Which existing SR/TI logic is correct and should stay?
- Which logic is misaligned with Space/Workspace?
- Which Service screens are case views vs technical bench views?
- How should Service Operation bind to Space/Blueprint without making Workspace
  the business truth?
- How should Payment Space interact with Service?
- What is the smallest safe Sprint 2 implementation?

## Stop And Discuss If Unclear

Pause implementation and ask the user before deciding any of these:

- Whether a watch can have more than one active SR.
- Whether TI can exist outside SR.
- Whether Service stores direct space/workspace IDs or uses BusinessBinding /
  projection only.
- Whether Blueprint capability overrides are allowed after a page/space has
  been created.
- Whether Service should create Payment records directly or call/emit through a
  Payment boundary.
- Whether the current TI board stage model is global or blueprint-specific.
- Whether schema changes are required in Sprint 2.

## Recommended First Actions

1. Read this document completely.
2. Read `docs/architecture/15-event-driven-domain-boundary.md`.
3. Read `docs/architecture/14-blueprint-snapshot-semantics.md`.
4. Inspect `ServiceRequest`, `TechnicalIssue`, and `Payment` in
   `prisma/schema.prisma`.
5. Inspect the Service domain files listed above.
6. Produce the Sprint 1 review/proposal before editing runtime code.

## Current UI Reference

The current prototype is:

- `docs/prototypes/service-operation-space-modes.html`

Prototype decisions already accepted:

- Service Operation Space has two modes: SR Cases and Technical Bench.
- Each mode has its own mini dashboard and filters.
- Open SR renders a separate SR Case page.
- Opening a TI/stage renders a Technical Stage Board page containing many TIs
  in the same stage.
- User-facing UI should avoid the word "Workspace/WP" for these pages.
- Main space UI should include receive-previous-week and lightweight flow config.
- Creator/system/user signal should be visible.

