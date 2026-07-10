# Operational Blueprint Upgrade Roadmap

## Why This Roadmap Exists

Service Operation exposed that Blueprint is not yet strong enough to generate a
complete business workspace flow by itself. The risk is continuing to patch
feature-specific UI, consumers, and workflow rules until every new operation
needs the same custom work again.

This roadmap upgrades Blueprint M2 so a new business operation can be declared
from a contract and then run through shared Space/Workspace runtime pieces.

## Target Outcome

By the end of this upgrade, a business operation Blueprint can define:

- business objects and their roles;
- workspace roles and cardinality;
- core flows that group related workspace roles into ordered navigation;
- event routes into workspaces;
- workspace actions and action forms;
- domain command adapters;
- workflow ownership;
- projection subscriptions;
- validation rules;
- an executable reference flow proven by Service Operation.

Business truth stays in the owning domain. Blueprint defines how that truth is
operated inside Space/Workspace.

## Sprint Plan

### Sprint 71 - Operational Blueprint Core

Status: closed.

Purpose:

- Add the operational contract model.
- Make Service Operation the first reference contract.
- Start replacing Service Operation hardcoding with contract-driven runtime.

Completed:

- `OperationalBlueprintContract` shared type.
- Service Operation contract V2 with `SR_CASE`, `INSPECT`, `PROCESSING`, and
  `DONE` roles.
- Service Operation core flow:
  `SR_CASE -> INSPECT -> PROCESSING -> DONE`.
- Blueprint library, Workspace snapshot, coordination DTO, and create-workspace
  UI now expose the operation contract.
- Coordination consumer resolves Service Operation TechnicalIssue workspace
  roles from contract event routes.

Acceptance:

- Blueprint can describe Service Operation's operation model without moving
  SR/TI/Payment truth into Blueprint.
- Runtime can read at least one important behavior from the contract instead of
  hardcoding it locally.

### Sprint 72 - Workspace Action Contract Runtime

Status: closed.

Purpose:

- Render workspace actions from `OperationalBlueprint.actions`.
- Show action availability by workspace role and target type.
- Use `OperationalBlueprint.coreFlows` to expose same-flow workspace navigation
  context in the Workspace header/shell.
- Keep domain-specific behavior behind adapters.

Primary files:

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `src/domains/task/ui/detail/TaskExecutionPanel.tsx`
- `src/domains/task/ui/execution/*`
- Service Operation action adapter files under `src/domains/service`.

Acceptance:

- A workspace can discover declared actions from its Blueprint snapshot.
- Service Operation actions are not introduced as one-off buttons detached from
  the operation contract.
- Action UI can render text, textarea, select, money, boolean, and date fields
  from the contract.
- Workspace shell can discover the core flow containing the current workspace
  role and prepare navigation links for related Workspaces in that flow.

### Sprint 73 - Watch Intake With Required Suspicion

Status: closed.

Purpose:

- Replace the current Watch List `watch_intake` path with
  `watch_intake_with_suspicion`.
- Ensure a newly created SR is never empty: the first user suspicion creates
  the first TechnicalIssue through the Service domain command and event path.

Primary files:

- `src/domains/watch/client/WatchListClient.tsx`
- `src/app/api/admin/service-operation/route.ts`
- `src/domains/service/server/watch-quick/*`
- `src/domains/service/server/issue-board/*`

Acceptance:

- New Watch service intake requires a technical suspicion.
- If an active SR exists, the user is prompted to open the SR workspace rather
  than silently creating duplicates.
- TechnicalIssue creation emits `technical_issue.created` and routes to
  `INSPECT` through the coordination consumer.
- Service Operation POST uses API auth and returns 401/403 at the route
  boundary.

### Sprint 74 - Inspect And Processing Action Adapters

Status: closed.

Purpose:

- Make Inspect and Processing actions execute real Service domain commands
  using data from contract-rendered forms.
- Support classification, vendor, estimate, start, actual cost, completion,
  payment creation, and follow-up TechnicalIssue creation.

Primary files:

- Service Operation action adapter files.
- Service issue board command services.
- Payment producer/command boundary where payment follow-up is needed.
- `scripts/verify-sprint-74-operational-actions.ts`

Acceptance:

- `classify_technical_issue` emits `technical_issue.confirmed`.
- `start_processing` emits `technical_issue.started`.
- `complete_processing` emits `technical_issue.completed` and can raise payment
  follow-up when requested.
- `complete_processing` emits `payment.created` when it creates a new unpaid
  technical-issue payment.
- `raise_follow_up_issue` emits `technical_issue.created`.

### Sprint 75 - Operation Projection Subscription Runtime

Status: closed.

Purpose:

- Connect Service Operation events to Watch List projection through
  `projectionSubscriptions` declared by the operation contract.

Primary files:

- Watch List projection builder and event source resolver.
- Projection repair/status tooling.
- `src/domains/blueprint/shared/operational-blueprint.ts`

Acceptance:

- Service Operation events can resolve back to `WATCH`.
- Watch List rows can refresh when SR/TI/payment state changes through the
  operation subscription resolver and target resolver.
- Projection logic remains downstream read-model work and does not execute
  workflow, notifications, or domain commands.
- Projection status can explain operation-derived subscription events.
- Blueprint operation preview can show projection subscription target and event
  keys.

Deferred:

- Connected DB live event smoke still requires ServiceRequest/TechnicalIssue
  seed data.

### Sprint 76 - Operational Blueprint Validation

Status: closed.

Purpose:

- Add validation so bad operation contracts fail early.

Validation must catch:

- event routes referencing missing workspace roles;
- core flow steps referencing missing workspace roles;
- actions referencing missing workspace roles;
- workflow transitions referencing missing action keys;
- projection subscriptions with empty event sets;
- duplicate role keys, action keys, and event route keys;
- object target types not represented by declared roles.

Acceptance:

- Blueprint registry can report operation contract validation errors.
- Service Operation contract passes validation.
- Future operation contracts have a clear failure mode before runtime.

Completed:

- Added `validateOperationalBlueprintContract`.
- Registry DTOs expose `operationValidation`.
- Operation Coordination Blueprint preview shows validation status.
- Service Operation passes validation with zero issues.

### Sprint 77 - Blueprint Authoring UI For Operation Model

Status: closed.

Purpose:

- Move the operation contract from hidden code-only configuration toward an
  authorable Blueprint UI.

Scope:

- Read/edit workspace roles.
- Read/edit event routes.
- Read/edit action definitions and fields.
- Read workflow ownership and projection subscriptions.

Acceptance:

- A user can inspect and modify the operation model without editing source
  code.
- Publishing/versioning is still out of scope unless explicitly selected.

Completed:

- Blueprint Library has an Operation Model tab.
- Registry operation contracts render as structured read-only sections.
- Draft Blueprint JSON can carry `operation`.
- Drafts can copy source operation and edit it as raw JSON with validation.
- Sprint 76 validation result is shown in the authoring surface.

### Sprint 78 - Second Operation Proof

Status: closed.

Purpose:

- Prove the upgraded Blueprint is not Service Operation-specific by modeling a
  second business operation.

Candidate operations:

- Watch Media Pipeline.
- Sales Fulfillment.
- Payment Collection.

Acceptance:

- The second operation reuses the same action rendering, event routing,
  workflow ownership, and projection subscription runtime.
- Any new feature-specific branch must be justified as a domain adapter, not as
  generic runtime behavior.

Completed:

- Chose Payment Collection as the second operation proof.
- Added Payment operation contract for the `payment` work type in `PAYMENT`
  context.
- Payment operation declares Payment Inbox, Payment Review, and Settled /
  Exception workspace roles.
- Payment operation routes `payment.created`, `payment.status_updated`, and
  `payment.paid`.
- Payment operation passes Sprint 76 validation and appears in Sprint 77
  Operation Model authoring UI.
- Payment command execution remains a future Payment domain adapter, not a
  generic Blueprint runtime branch.

### Sprint 79 - Operation Template Picker

Status: planned.

Purpose:

- Turn the Operation Model `null` empty state into a usable authoring starting
  point.
- Let a user start from Service Operation, Payment Collection, or a blank
  operation shell without manually pasting JSON.

Primary files:

- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `src/domains/blueprint/shared/operational-blueprint.ts`
- `src/domains/blueprint/server/blueprint-library.service.ts`
- `scripts/verify-sprint-79-operation-template-picker.ts`

Acceptance:

- New drafts with no operation model show a template picker.
- Service Operation and Payment Collection templates are selectable.
- Selecting a template copies a valid operation contract into draft
  `blueprintJson.operation`.
- Sprint 76 validation runs after selection.
- Sprint 77 structured preview can render the selected operation.
- Raw JSON remains available as a developer escape hatch.
- Publish/versioning and real Space creation remain out of scope.

## Non-Goals For This Upgrade

- Do not move ServiceRequest, TechnicalIssue, Payment, Watch, Order, or Product
  truth into Blueprint.
- Do not add `spaceId` or `workspaceId` to Service tables.
- Do not make Space Management a workflow engine.
- Do not mutate existing Workspace snapshots automatically when Blueprint
  changes.
- Do not build publish/version/rollback until the contract and runtime prove
  themselves.

## Current Next Step

Operational Blueprint upgrade Sprints 71-78 are complete. Sprint 79 should
start the UI standardization phase with the Operation Template Picker. Read
`docs/sprints/SM-Sprint-79-operation-template-picker.md` before implementing.
