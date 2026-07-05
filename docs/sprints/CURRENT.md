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
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership.
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

Next recommended sprint:

- Finish Watch Media operational cleanup, then simplify Watch list/search later.

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
5. Read `docs/sprints/SM-M1-blueprint-completion-handoff.md`
6. Read `docs/architecture/14-blueprint-snapshot-semantics.md`
7. Read `docs/architecture/13-workspace-capability-enforcement.md`
8. Continue from the selected M2 brief.
