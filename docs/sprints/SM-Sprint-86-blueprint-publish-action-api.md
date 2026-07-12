# Sprint 86 - Blueprint Publish Action API

Status: closed.

## Goal

Wire the Sprint 85 publish persistence contract into the admin Blueprint UI with
a server API and a safe Publish action.

Sprint 85 made published Blueprint versions persistable. Sprint 86 lets an
admin publish a draft from the Operation Model screen while preserving immutable
Workspace snapshot semantics.

## Scope

- Add a publish API route for workflow Blueprint drafts.
- Pass published versions into the admin Blueprint client.
- Show latest published version and recent publish history in the publish panel.
- Add a Publish button for draft Blueprints.
- Save and validate the current draft before publishing so local authoring
  changes are not skipped.
- Keep existing Workspace snapshots unchanged.

## Files Touched

- `src/app/api/admin/system/workflows/drafts/[id]/publish-blueprint/route.ts`
- `src/app/(admin)/admin/system/workflows/page.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `src/domains/workflow-definition/client/OperationPublishPlan.tsx`
- `scripts/verify-sprint-86-blueprint-publish-action.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `POST /api/admin/system/workflows/drafts/[id]/publish-blueprint`.
- The route calls `publishWorkflowDefinitionDraftBlueprint`, returns the
  published version snapshot on success, and returns readiness failures on
  blocked publish attempts.
- System Workflow Admin page now loads published Blueprint versions.
- Workflow admin client keeps published versions in state and updates them after
  successful publish.
- Publish action saves the current draft first, then calls the publish API.
- `OperationPublishPlan` now shows:
  - latest published version;
  - proposed next version from persisted history;
  - validation issue count;
  - pending adapter count;
  - publish button for drafts;
  - recent published versions.
- Registry Blueprints remain read-only in this screen.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-86-blueprint-publish-action.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-85-blueprint-publish-persistence.ts` passed.
- `cmd /c npx eslint "src/app/api/admin/system/workflows/drafts/[id]/publish-blueprint/route.ts" "src/app/(admin)/admin/system/workflows/page.tsx" src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationPublishPlan.tsx scripts/verify-sprint-86-blueprint-publish-action.ts --quiet` passed.

## Out Of Scope

- Runtime Space creation from published versions.
- Rollback/archive UI for published versions.
- Workspace snapshot migration.
- Dedicated publish permission.
- Database-backed published version table.

## Result

Blueprint Operation authoring now has a complete first publish loop:

1. author or edit an Operation Model draft;
2. inspect readiness and persisted version history;
3. click Publish;
4. server saves/validates the current draft;
5. server appends a new immutable published Blueprint version.

The next sprint can choose between runtime Space creation from published
versions, rollback/archive UX, or moving published version storage to a durable
database table.
