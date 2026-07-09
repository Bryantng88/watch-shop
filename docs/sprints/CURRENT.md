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
- Read `docs/sprints/SM-Service-Operation-retrospective-corrections-and-current-contract.md`.
- Sprint 61 is complete as a first production UI/API slice. Space Management
  Service Operation remains an overview/read surface with SR and TI views;
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
- Service Operation workspace UX rule: workspace detail is hybrid by context.
  An SR workspace shows TI items for that SR; a TI workspace shows TI operation
  items with stage/workflow actions. `SR Cases` and `Technical Bench` remain
  Space Management modes/views, not tabs inside a workspace.
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

- Sprint 65 Service Operation smoke and workspace UX hardening first slice.

Sprint 65 scope/status:

- Added dry-run diagnostics for Service Operation coordination event binding.
- Added `scripts/smoke-service-operation-consumer.ts`.
- Added `blueprintAutoBindingReceiver:true` marker for new event-bound work
  tickets.
- Workspace manual action failures now show an inline UI error.
- Current DB smoke reports `DUPLICATE_BLUEPRINT_EVENT_BINDING` for Service
  Operation until one current receiver is selected explicitly.
- Workspace capacity and TI item binding remain blueprint/event-consumer led,
  not injected from workspace detail UI.
- SR, Payment, and reopened events remain inactive/draft for binding.
- Keep Activity/Timeline event-backed; do not introduce MaintenanceRecord as the
  Activity source.
- Keep ProjectionRecord Service Operation reads deferred unless measured UI/API
  pressure justifies compare/fallback work.
- Document the possible future split into Inspect, Processing, and Done/follow-up
  workspaces as a design candidate only, not an implementation scope.

Sprint 63 non-goals:

- no Service schema migration;
- no Service `spaceId` / `workspaceId`;
- no Space workflow engine;
- no SR workflow engine;
- no Payment Workspace;
- no MaintenanceRecord-as-Activity.
- no separate Inspect/Processing/Done workspace implementation until Blueprint
  capacity and consumer bindings are explicit.

## M2 Later

Recommended later M2 topics must stay outside Sprint 39 unless explicitly selected:

- Blueprint persistence.
- Blueprint publish/version/rollback.
- Dedicated Workspace Blueprint Snapshot persistence.
- Apply Blueprint Update / Workspace migration.
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
15. Read `docs/sprints/SM-Service-Operation-retrospective-corrections-and-current-contract.md`
16. Continue after Sprint 65 by selecting the intended current Service Operation
   receiver, rerunning smoke, then running a safe `--apply` smoke for
   TechnicalIssue event binding. Space has no workflow engine.

Sprint 65 first slice is complete. SR and TI remain existing business truth.
Only TechnicalIssue created/confirmed/started/completed are active for Service
Operation coordination binding. Current DB has duplicate Service Operation
receiver candidates and needs explicit receiver selection before apply smoke.

Older M1 context remains available in:

- `docs/sprints/SM-M1-blueprint-completion-handoff.md`
- `docs/architecture/14-blueprint-snapshot-semantics.md`
- `docs/architecture/13-workspace-capability-enforcement.md`
