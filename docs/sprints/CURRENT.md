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

Current handoff:

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

Next recommended sprint:

- Sprint 57 Watch List Projection Cutover Contract Review.

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
6. Read `docs/sprints/SM-Sprint-56-projection-observability-repair.md`
7. Continue with Sprint 57 Watch List Projection Cutover Contract Review.

Sprint 57 must start by reviewing the Watch List UI contract before any full
projection cutover:

- fields the list really needs;
- client-side business logic that should be removed;
- actions that should remain available from the list;
- projection columns required for search/filter/sort.

Older M1 context remains available in:

- `docs/sprints/SM-M1-blueprint-completion-handoff.md`
- `docs/architecture/14-blueprint-snapshot-semantics.md`
- `docs/architecture/13-workspace-capability-enforcement.md`
