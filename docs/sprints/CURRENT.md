# Current Sprint

## Status

Blueprint Milestone M1 is closed.

Completed:

- Product Bible for Business Collaboration Platform.
- Coordination Router Framework.
- Coordination Event Consumer V1.
- Coordination Cycle Resolver.
- Fixed Work Type registry.
- Auto-create fixed Work Tickets per Coordination Cycle.
- Operation Coordination Workspace.
- Queue Summary for Operation Work Tickets.
- Sprint 27 language migration to Space Management vocabulary.
- Sprint 28 Manual Workflow Engine V1 groundwork.
- Sprint 34 Blueprint Authoring V1.
- Sprint 35 Workspace Definition Apply V1.
- Sprint 36 Workspace Capability Enforcement V1.
- Sprint 37 Blueprint Workflow Integration V1.
- Sprint 38 Blueprint Source of Truth Audit.
- Sprint 38A Blueprint Presentation Completion.
- Blueprint Milestone M1 acceptance: PASS.
- Sprint 39 Watch Business Event Producer Contract V1.
- Sprint 40 Watch Event Consumer Binding V1.
- Sprint 41 Watch Auto-Binding Runtime Scope V1.
- Sprint 42 Watch Blueprint Event Binding V1.
- Sprint 43 Watch Timeline Activity Consolidation V1.
- Sprint 44 Watch Media Workspace Pipeline Blueprint V1.
- Sprint 45 Watch Photoshoot Intake Action V1.
- Sprint 45A Workspace Creation Guardrails.
- Sprint 45B Blueprint Auto-Binding Receiver.
- Sprint 46 Watch Photoshoot Completion Handoff V1.
- Sprint 47 Watch Media Processing Workspace V1.
- Sprint 48 Watch Media Processing Review Flow V1.
- Sprint 49 Watch Publish Workspace V1.
- Sprint 50 Watch Media Weekly Rollover and Intake Hardening.
- Sprint 51 Event Architecture and Workspace Flow Handoff.
- Sprint 52 Workspace Workflow Processor Boundary.
- Sprint 53 First Projection Framework.
- Sprint 54 Watch Queue / Media Projection.
- Sprint 55 Watch List Projection.
- Sprint 56 Projection Observability & Repair.
- Sprint 57 Watch List Projection Cutover Contract Review draft.
- Sprint 58 Service Operation existing domain review and proposal.
- Sprint 59 Service Operation read facade and boundary cleanup.
- Sprint 60 Service Operation Blueprint and Workflow Contract.
- Sprint 61 Service Operation UI and Runtime Wiring first slice.
- Sprint 62 Service Operation Action Adapter and Event Key Alignment first
  slice.
- Sprint 63 Service Operation Workflow and Consumer Hardening first slice.
- Sprint 64 Service Operation Consumer Activation first slice.
- Sprint 65 Service Operation Smoke and Workspace UX Hardening first slice.
- Sprint 66 Service Operation Receiver Repair and Apply Smoke first slice.
- Sprint 67 Service Operation Workspace Cardinality first slice.
- Sprint 68 Service Operation Business Flow Realignment first slice.
- Sprint 69 Watch List Service Operation Intake first slice.
- Sprint 70 SR Workspace TechnicalIssue Creation first slice.
- Sprint 71 Operational Blueprint Core closed.

Current handoff:

- Read `docs/sprints/SM-Sprint-58-service-operation-existing-domain-review-space-readiness.md`.
- Read `docs/sprints/SM-Sprint-58-service-operation-review-proposal.md`.
- Read `docs/sprints/SM-Sprint-59-service-operation-read-facade-boundary-cleanup.md`.
- Read `docs/sprints/SM-Sprint-60-service-operation-blueprint-workflow-contract.md`.
- Read `docs/sprints/SM-Sprint-61-service-operation-ui-runtime-wiring.md`.
- Read `docs/sprints/SM-Sprint-62-service-operation-action-adapter-event-key-alignment.md`.
- Read `docs/sprints/SM-Sprint-63-service-operation-workflow-consumer-hardening.md`.
- Read `docs/sprints/SM-Sprint-64-service-operation-consumer-activation.md`.
- Read `docs/sprints/SM-Sprint-65-service-operation-smoke-and-workspace-ux-hardening.md`.
- Read `docs/sprints/SM-Sprint-66-service-operation-receiver-repair-apply-smoke.md`.
- Read `docs/sprints/SM-Sprint-67-service-operation-workspace-cardinality.md`.
- Read `docs/sprints/SM-Sprint-68-service-operation-business-flow-realignment.md`.
- Read `docs/sprints/SM-Sprint-69-watch-list-service-operation-intake.md`.
- Read `docs/sprints/SM-Sprint-70-sr-workspace-technical-issue-creation.md`.
- Read `docs/sprints/SM-Service-Operation-retrospective-corrections-and-current-contract.md`.
- Read `docs/sprints/SM-Operational-Blueprint-roadmap.md`.
- Read `docs/architecture/16-operational-blueprint-contract.md`.
- Read `docs/sprints/SM-Sprint-71-operational-blueprint-core.md`.
- Read `docs/sprints/SM-Sprint-72-workspace-action-contract-runtime.md`.
- Read `docs/sprints/SM-Sprint-73-watch-intake-with-required-suspicion.md`.
- Read `docs/sprints/SM-Sprint-74-inspect-processing-action-adapters.md`.
- Read `docs/sprints/SM-Sprint-75-operation-projection-subscription-runtime.md`.
- Read `docs/sprints/SM-Sprint-76-operational-blueprint-validation.md`.
- Read `docs/sprints/SM-Sprint-77-blueprint-authoring-ui-operation-model.md`.
- Read `docs/sprints/SM-Sprint-78-payment-operation-proof.md`.
- Read `docs/sprints/SM-Sprint-79-operation-template-picker.md`.
- Sprint 61 is complete as a first production UI/API slice. Space Management
  Service Operation is a space/workspace index with SR and Technical views;
  workspace operation happens in the TaskItem workspace shell and must use
  Blueprint/event-consumer produced queue items.
- Sprint 62 first slice wires Service Operation action adapters and aligns
  Service/Payment event producers/catalog keys. Event bindings remain `DRAFT`.
  Space has no workflow engine. Do not restart the SR/TI architecture
  discussion.
- Sprint 63 first slice moves Service Operation manual actions to a preflight
  path before workflow runtime transition, keeps event bindings `DRAFT`, and
  cleans up Technical Bench/workspace boundaries.
- Sprint 64 first slice activates only TechnicalIssue created/confirmed/started/
  completed events for the coordination consumer. SR, Payment, and reopened
  events remain outside active binding scope.
- Sprint 65 first slice adds Service Operation consumer diagnostics/smoke,
  receiver marker support, and workspace action error UX. Current DB dry-run
  found duplicate Service Operation receiver candidates; runtime correctly
  skips until a receiver is selected explicitly.
- Sprint 66 selected the current Service Operation receiver, reran dry-run
  smoke successfully, applied `technical_issue.created` safely, and fixed
  legacy binding workflow backfill from receiver TaskItem note.
- Sprint 67 exposed the SR/TI workspace cardinality problem and added the first
  SR workspace route. Its four-technical-stage-workspace model was corrected in
  Sprint 68.
- Sprint 68 locks the current Service Operation business flow: SR Cases index
  one workspace per SR case; Technical Bench indexes three technical operation
  workspaces: Inspect, Processing, and Done/Follow-up. Ready, In Progress, and
  Done are workflow states inside Processing, not separate workspace capacity.
- Service Operation workspace UX rule: Space Management renders workspace rows,
  not raw business-domain rows. In `SR Cases`, each row represents one SR
  workspace while preserving the current SR columns: service request, watch,
  creator, attention, technical progress, commercial, and updated time. In
  `Technical Bench`, the view represents technical operation workspaces.
  Workspace detail is hybrid by context: an SR workspace shows TI items for
  that SR; a TI/technical workspace shows TI operation items with
  stage/workflow actions. `SR Cases` and `Technical Bench` remain Space
  Management modes/views, not tabs inside a workspace.
- Sprint 70 adds the SR workspace `Tao TI` modal. Watch List still only
  creates/opens an SR workspace. TI creation happens inside the SR workspace,
  uses the existing Service `createTechnicalIssue` command, records
  `technical_issue.created`, and then the coordination consumer binds the TI to
  the Inspect workspace. The bound ServiceRequest is workspace identity, not an
  item row.
- Sprint 71 started Blueprint M2 as Operational Blueprint. Blueprint now has an
  operation contract layer that can describe workspace roles, business object
  roles, event routes, action contracts, form fields, workflow ownership, and
  projection subscriptions. Service Operation is the first reference contract.
  Do not continue Service Operation by hardcoding more feature-specific routing
  or modal rules before checking the operation contract.
- The upgrade roadmap is `docs/sprints/SM-Operational-Blueprint-roadmap.md`.
  It breaks the work into Sprint 71 through Sprint 78: core contract, action
  runtime, Watch intake with suspicion, Service Operation adapters, projection
  subscription runtime, validation, authoring UI, and a second operation proof.
- Retrospective rule: do not repeat the earlier mistakes documented in
  `SM-Service-Operation-retrospective-corrections-and-current-contract.md`.

Service Operation sprint planning rules:

- Stay inside accepted scope.
- Make concrete, executable proposals with files, behavior, validation, and
  rollback path.
- Use senior-dev judgment: preserve domain ownership, avoid unnecessary schema
  changes, keep compatibility, and prefer adapters before rewrites.
- Stop and discuss before changing core assumptions around SR/TI cardinality,
  assessment coupling, Service-to-Space references, Payment ownership,
  MaintenanceRecord, or Blueprint snapshot semantics.

- Read `docs/sprints/SM-Sprint-39-watch-business-event-producer-contract.md`.
- Read `docs/sprints/SM-Sprint-40-watch-event-consumer-binding.md`.
- Read `docs/sprints/SM-Sprint-41-watch-auto-binding-runtime-scope.md`.
- Read `docs/sprints/SM-Sprint-42-watch-blueprint-event-binding.md`.
- Read `docs/sprints/SM-Sprint-43-watch-timeline-activity-consolidation.md`.
- Read `docs/sprints/SM-Sprint-44-watch-media-workspace-pipeline-blueprint.md`.
- Read `docs/sprints/SM-Sprint-45-watch-photoshoot-intake-action.md`.
- Read `docs/sprints/SM-Sprint-45A-workspace-creation-guardrails.md`.
- Read `docs/sprints/SM-Sprint-45B-blueprint-auto-binding-receiver.md`.
- Read `docs/sprints/SM-Sprint-46-watch-photoshoot-completion-handoff.md`.
- Read `docs/sprints/SM-Sprint-47-watch-media-processing-workspace.md`.
- Read `docs/sprints/SM-Sprint-48-watch-media-processing-review-flow.md`.
- Read `docs/sprints/SM-Sprint-49-watch-publish-workspace.md`.
- Read `docs/sprints/SM-Sprint-50-watch-media-weekly-rollover-and-intake-hardening.md`.
- Read `docs/sprints/SM-Sprint-51-event-architecture-and-workspace-flow-handoff.md`.
- Read `docs/sprints/SM-Sprint-52-workspace-workflow-processor-boundary.md`.
- Read `docs/sprints/SM-Sprint-53-first-projection-framework.md`.
- Read `docs/sprints/SM-Sprint-54-watch-queue-media-projection.md`.
- Read `docs/sprints/SM-Sprint-55-watch-list-projection.md`.
- Read `docs/sprints/SM-Sprint-56-projection-observability-repair.md`.
- Read `docs/sprints/SM-Sprint-57-watch-list-projection-cutover-contract-review.md`.
- Read `docs/architecture/15-event-driven-domain-boundary.md`.
- Read `docs/sprints/SM-M1-blueprint-completion-handoff.md`.
- Read `docs/architecture/14-blueprint-snapshot-semantics.md`.
- Read `docs/architecture/13-workspace-capability-enforcement.md`.
- Read `docs/architecture/12-workspace-definition-apply.md`.
- Read `docs/architecture/11-blueprint-authoring.md`.
- Read `docs/architecture/06-item-runtime-contract.md`.

## M1 Closed Contract

Blueprint defines.

Workspace snapshots.

Item Runtime executes.

Existing Workspaces do not read live Blueprint registry or draft values after
creation.

## M2 Current

M2 has started with the Watch business-event-to-workspace vertical slice.

Current M2 north star:

```text
Business Domain action -> Business Event -> Dispatcher -> Consumer Registry -> Event Consumers.
```

Watch Media remains the first reference vertical slice:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Notification.
```

Sprint 39 implemented Watch Business Event Producer Contract V1.

Sprint 40 implemented Watch Event Consumer Binding V1.

Sprint 41 implemented Watch Auto-Binding Runtime Scope V1.

Sprint 42 implemented Watch Blueprint Event Binding V1.

Sprint 43 implemented Watch Timeline Activity Consolidation V1.

Sprint 44 implemented Watch Media Workspace Pipeline Blueprint V1.

Sprint 45 implemented Watch Photoshoot Intake Action V1.

Sprint 45A implemented Workspace Creation Guardrails.

Sprint 45B implemented Blueprint Auto-Binding Receiver.

Sprint 46 implemented Watch Photoshoot Completion Handoff V1.

Sprint 47 implemented Watch Media Processing Workspace V1.

Sprint 48 implemented Watch Media Processing Review Flow V1.

Sprint 49 implemented Watch Publish Workspace V1.

Sprint 50 implemented Watch Media weekly rollover and intake hardening.

Sprint 51 implemented Event Architecture and Workspace Flow Handoff.

Sprint 52 implemented Workspace Workflow Processor Boundary.

Sprint 53 implemented First Projection Framework.

Sprint 54 implemented Watch Queue / Media Projection.

Sprint 55 implemented Watch List Projection.

Sprint 56 implemented Projection Observability & Repair.

Current sprint:

- Sprint 73 Watch Intake With Required Suspicion is closed.
- Sprint 74 Inspect And Processing Action Adapters is closed.
- Sprint 75 Operation Projection Subscription Runtime is closed.
- Sprint 76 Operational Blueprint Validation is closed.
- Sprint 77 Blueprint Authoring UI For Operation Model is closed.
- Sprint 78 Payment Operation Proof is closed.
- Sprint 79 Operation Template Picker is planned next.

Sprint 71 closed scope/status:

- Added `docs/architecture/16-operational-blueprint-contract.md`.
- Added `docs/sprints/SM-Operational-Blueprint-roadmap.md`.
- Added `docs/sprints/SM-Sprint-71-operational-blueprint-core.md`.
- Added `src/domains/blueprint/shared/operational-blueprint.ts`.
- Added `OperationalBlueprintContract` to Blueprint library items,
  instantiation options, and Workspace snapshot notes.
- Service Operation contract V2 defines `SR_CASE`, `INSPECT`, `PROCESSING`,
  and `DONE` (`Done/Follow-up` label) roles, its action contracts, event routes,
  workflow ownership, and Watch List projection subscription.
- Service Operation core flow is declared as:
  `SR_CASE -> INSPECT -> PROCESSING -> DONE`.
- Coordination Workspace UI now shows operation model summary when creating a
  Workspace from a Blueprint.
- Coordination consumer now resolves Service Operation TechnicalIssue
  workspace roles from the Operational Blueprint event routes instead of local
  stage-to-workspace rules. Existing receiver markers still scope the selected
  workspace, but the role target comes from the contract.

Sprint 72 scope/status:

- Closed.
- Goal: make Workspace UI discover and render core-flow navigation and actions
  from `OperationalBlueprint.coreFlows` and `OperationalBlueprint.actions`.
- First runtime discovery slice is implemented: Workspace detail reads
  operation core flows/actions from the Workspace snapshot, renders Service
  Operation core-flow navigation in the header, and renders Blueprint-declared
  action/field shapes in the sidebar.
- First submit path is implemented for `create_technical_issue` through
  `submitOperationalBlueprintActionAction` and the Service Operation Blueprint
  action adapter. Service command logic stays behind the adapter boundary.
- Item-level Blueprint action forms are now rendered in Technical Issue queue
  rows with target context. Adapter mappings exist for `classify_technical_issue`,
  `start_processing`, `complete_processing`, and `raise_follow_up_issue`.
- `start_processing` carries explicit technical detail/catalog input in the
  Operational Blueprint action contract before calling the Service domain
  command.
- Same-flow navigation no longer links `ONE_PER_BUSINESS_OBJECT` roles to an
  arbitrary sibling Workspace when a Space has multiple SR case Workspaces.
- Do not wire new Service Operation buttons or modals unless the action exists
  in the operation contract first.

Sprint 73 scope/status:

- Closed.
- Goal: replace Watch List `watch_intake` with
  `watch_intake_with_suspicion`.
- Runtime slice completed:
  - Watch List Service action opens a required-suspicion modal.
  - POST `/api/admin/service-operation` accepts
    `watch_intake_with_suspicion`.
  - Service quick path creates the initial TechnicalIssue through
    `createTechnicalIssue`, preserving `technical_issue.created` as the
    Coordination handoff.
  - Existing active SR workspace returns open-existing behavior instead of
    silently creating duplicates.
  - Service Operation POST now uses API auth (`requirePermissionApi`), returning
    401/403 at the API boundary.
- Validation:
  - Scoped ESLint passes for the route, quick service command, and Watch List
    client.
  - Local dev server returns HTTP 200 for Service Operation GET.
  - Unauthenticated Service Operation POST returns HTTP 401.
- Continue from
  `docs/sprints/SM-Sprint-73-watch-intake-with-required-suspicion.md`.

Sprint 74 scope/status:

- Closed.
- Goal: make Inspect and Processing Blueprint actions execute real Service
  domain commands through `service-operation-action-adapter`.
- Adapter hardening and payment event parity are implemented:
  - classify validates area/action mode/vendor/estimate before confirming TI;
  - start passes actor id and requires technical detail catalog id;
  - complete passes actor id, validates actual cost, and respects the
    `createPayment` action field;
  - complete emits `payment.created` when that action creates a new unpaid
    technical-issue payment;
  - follow-up issue creation uses the shared `service.createTechnicalIssue`
    branch.
- Continue from
  `docs/sprints/SM-Sprint-74-inspect-processing-action-adapters.md`.

Sprint 75 scope/status:

- Closed.
- Sprint 75 - Operation Projection Subscription Runtime.
- Goal: connect Service Operation events to Watch List projection through
  `projectionSubscriptions` declared by the operation contract.
- Runtime slice is implemented:
  - projection builder selection can read Operational Blueprint
    `projectionSubscriptions`;
  - Watch List projection can resolve Service Operation `SERVICE_REQUEST`,
    `TECHNICAL_ISSUE`, and `PAYMENT` event targets back to Watch rows.
  - projection status summaries expose native builder events plus
    operation-derived subscription events.
- Blueprint operation preview renders projection subscription target and event
  keys.
- Connected DB live event smoke is deferred until ServiceRequest/TechnicalIssue
  seed data exists.
- Continue to Sprint 76 Operational Blueprint Validation after reading
  `docs/sprints/SM-Sprint-75-operation-projection-subscription-runtime.md`.

Sprint 76 scope/status:

- Closed.
- Sprint 76 - Operational Blueprint Validation.
- Goal: add structural validation so bad operation contracts fail early before
  event routing, action rendering, workflow ownership, or projection
  subscriptions reach runtime.
- Implemented:
  - `validateOperationalBlueprintContract`;
  - validation result types and registry DTO exposure through
    `operationValidation`;
  - Operation Coordination Blueprint preview validation status;
  - verification fixtures for missing role references, missing workflow action,
    empty projection event sets, duplicate keys, and unrepresented object
    targets.
- Service Operation contract passes validation with zero issues.
- Continue to Sprint 77 Blueprint Authoring UI For Operation Model after
  reading `docs/sprints/SM-Sprint-76-operational-blueprint-validation.md`.

Sprint 77 scope/status:

- Closed.
- Sprint 77 - Blueprint Authoring UI For Operation Model.
- Goal: expose Operational Blueprint contracts in the Blueprint Library UI so
  admins can inspect the operation model and start editing it in draft form
  without changing source code.
- Implemented:
  - Operation Model tab in Blueprint Library;
  - structured read-only registry view for workspace roles, event routes,
    action definitions/fields, workflow ownership, and projection
    subscriptions;
  - `blueprintJson.operation` support for workflow/Blueprint drafts;
  - copy-source-operation and raw JSON editing for draft operation contracts;
  - immediate validation feedback using Sprint 76 validator.
- Publishing/versioning remains out of scope.
- Continue to Sprint 78 Second Operation Proof after reading
  `docs/sprints/SM-Sprint-77-blueprint-authoring-ui-operation-model.md`.

Sprint 78 scope/status:

- Closed.
- Sprint 78 - Payment Operation Proof.
- Goal: prove Operational Blueprint is not Service Operation-specific by
  modeling Payment Collection.
- Implemented:
  - Payment Collection operation contract for the `payment` work type in
    `PAYMENT` context;
  - roles `PAYMENT_INBOX`, `PAYMENT_REVIEW`, and `PAYMENT_SETTLED`;
  - routes `payment.created`, `payment.status_updated`, and `payment.paid`;
  - actions `review_payment`, `mark_payment_paid`, and
    `mark_payment_exception`;
  - validation and Blueprint Library Operation Model visibility.
- Payment command execution remains future Payment domain adapter work.
- Operational Blueprint upgrade Sprints 71-78 are complete.

Sprint 79 planned scope/status:

- Planned.
- Sprint 79 - Operation Template Picker.
- Goal: standardize the first Operation Model authoring UX after the 71-78
  core upgrade.
- User problem: a new Workflow Draft currently shows `operation: null` and
  expects manual JSON editing.
- Implement:
  - an empty-state template picker in the Operation Model tab;
  - Service Operation template choice;
  - Payment Collection template choice;
  - Blank Operation choice;
  - template summary with roles/events/actions/validation;
  - selection that copies a valid operation contract into draft
    `blueprintJson.operation`;
  - immediate Sprint 76 validation and Sprint 77 structured preview rendering.
- Keep raw JSON editing as a developer escape hatch.
- Out of scope: publish/versioning, real Space creation, Payment action
  adapter execution, and field-by-field structured editing.
- Start from `docs/sprints/SM-Sprint-79-operation-template-picker.md`.

Legacy Sprint 70 status:

- Activated `service_request.created` route/coordination binding so SR events
  can create one SR workspace per ServiceRequest.
- Technical Bench has three technical operation receiver workspaces:
  Inspect, Processing, and Done/Follow-up.
- TechnicalIssue event resolution uses current Service truth to select the
  operation workspace:
  - `INSPECT` -> Inspect workspace;
  - `READY` / `IN_PROGRESS` -> Processing workspace;
  - `DONE` -> Done/Follow-up workspace.
- Legacy TechnicalIssue bindings in the old receiver are adopted/moved into the
  correct technical operation workspace instead of duplicated.
- Workspace capacity and item binding remain blueprint/event-consumer led, not
  injected from workspace detail UI.
- SR, Payment, and reopened events remain inactive/draft for binding.
- Keep Activity/Timeline event-backed; do not introduce MaintenanceRecord as the
  Activity source.
- Keep ProjectionRecord Service Operation reads deferred unless measured UI/API
  pressure justifies compare/fallback work.
- Watch List now has a controlled Service Operation intake command:
  `watch_intake` creates/reuses an active ServiceRequest, emits
  `service_request.created`, and opens the SR workspace.
- The Watch List action does not create TechnicalIssue directly.
- SR workspace detail now has `Tao TI`, a compact modal in the
  `Technical Issue Operation` item tab.
- `Tao TI` creates a TechnicalIssue through the existing Service command and
  producer path. The resulting `technical_issue.created` event is the handoff to
  the coordination consumer / Inspect workspace.
- SR workspace items are TechnicalIssues belonging to that SR. The bound
  ServiceRequest identifies the workspace and must not render as a queue item.

Sprint 63 non-goals:

- no Service schema migration;
- no Service `spaceId` / `workspaceId`;
- no Space workflow engine;
- no SR workflow engine;
- no Payment Workspace;
- no MaintenanceRecord-as-Activity.
- no workspace capacity creation from UI/read paths; Blueprint capacity and
  consumer bindings must be explicit first.

## M2 Later

Recommended later M2 topics must stay outside Sprint 39 unless explicitly selected:

- Blueprint persistence.
- Blueprint publish/version/rollback.
- Dedicated Workspace Blueprint Snapshot persistence.
- Apply Blueprint Update / Workspace migration.
- Generic action form renderer from Operational Blueprint action contracts.
- Permission engine.
- Notification engine.
- Automation engine.
- Attachment runtime.

## How To Continue On Another Machine

1. `git pull`
2. `npm install` if needed
3. `npx prisma generate`
4. Read `docs/product/business-collaboration-platform.md`
5. Read `docs/architecture/15-event-driven-domain-boundary.md`
6. Read `docs/sprints/SM-Sprint-58-service-operation-existing-domain-review-space-readiness.md`
7. Read `docs/sprints/SM-Sprint-58-service-operation-review-proposal.md`
8. Read `docs/sprints/SM-Sprint-59-service-operation-read-facade-boundary-cleanup.md`
9. Read `docs/sprints/SM-Sprint-60-service-operation-blueprint-workflow-contract.md`
10. Read `docs/sprints/SM-Sprint-61-service-operation-ui-runtime-wiring.md`
11. Read `docs/sprints/SM-Sprint-62-service-operation-action-adapter-event-key-alignment.md`
12. Read `docs/sprints/SM-Sprint-63-service-operation-workflow-consumer-hardening.md`
13. Read `docs/sprints/SM-Sprint-64-service-operation-consumer-activation.md`
14. Read `docs/sprints/SM-Sprint-65-service-operation-smoke-and-workspace-ux-hardening.md`
15. Read `docs/sprints/SM-Sprint-66-service-operation-receiver-repair-apply-smoke.md`
16. Read `docs/sprints/SM-Sprint-67-service-operation-workspace-cardinality.md`
17. Read `docs/sprints/SM-Sprint-68-service-operation-business-flow-realignment.md`
18. Read `docs/sprints/SM-Sprint-69-watch-list-service-operation-intake.md`
19. Read `docs/sprints/SM-Sprint-70-sr-workspace-technical-issue-creation.md`
20. Read `docs/sprints/SM-Service-Operation-retrospective-corrections-and-current-contract.md`
21. Read `docs/sprints/SM-Operational-Blueprint-roadmap.md`
22. Read `docs/architecture/16-operational-blueprint-contract.md`
23. Read `docs/sprints/SM-Sprint-71-operational-blueprint-core.md`
24. Read `docs/sprints/SM-Sprint-72-workspace-action-contract-runtime.md`
25. Read `docs/sprints/SM-Sprint-73-watch-intake-with-required-suspicion.md`
26. Sprint 73 is closed.
27. Read `docs/sprints/SM-Sprint-74-inspect-processing-action-adapters.md`
28. Sprint 74 is closed.
29. Read `docs/sprints/SM-Sprint-75-operation-projection-subscription-runtime.md`
30. Sprint 75 is closed.
31. Read `docs/sprints/SM-Sprint-76-operational-blueprint-validation.md`
32. Sprint 76 is closed.
33. Read `docs/sprints/SM-Sprint-77-blueprint-authoring-ui-operation-model.md`
34. Sprint 77 is closed.
35. Read `docs/sprints/SM-Sprint-78-payment-operation-proof.md`
36. Sprint 78 is closed. Operational Blueprint upgrade Sprints 71-78 are complete.
37. Read `docs/sprints/SM-Sprint-79-operation-template-picker.md`
38. Implement Sprint 79 Operation Template Picker next.
   Space has no workflow engine.

Sprint 71 started Blueprint M2. SR, TI, Payment, Watch, and other business truth
remain domain-owned. Blueprint now declares how those objects operate inside
Space/Workspace through roles, actions, event routes, workflow ownership, and
projection subscriptions.

Older M1 context remains available in:

- `docs/sprints/SM-M1-blueprint-completion-handoff.md`
- `docs/architecture/14-blueprint-snapshot-semantics.md`
- `docs/architecture/13-workspace-capability-enforcement.md`
