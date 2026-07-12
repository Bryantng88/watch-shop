# Sprint 87 - Create Space From Published Blueprint

Status: closed.

## Goal

Create runtime Space/Workspace records from a published Blueprint version rather
than from a mutable draft or live registry definition.

Sprint 86 completed the first admin publish loop. Sprint 87 makes the published
snapshot useful by allowing an admin to create a Task-backed Space and initial
TaskItem-backed Workspaces from the persisted `creationPlan`.

## Scope

- Add a server service to create a Space from `BlueprintPublishedVersion`.
- Add an API route for creating a Space from a published version.
- Add a Create Space action to published version history in the Operation
  publish panel.
- Use the published `creationPlan.initialWorkspaces` only.
- Preserve deferred business-object Workspaces for future event/runtime creation.
- Guard against duplicate Space creation for the same published version.
- Keep existing Workspace snapshots immutable.

## Files Touched

- `src/domains/blueprint/server/blueprint-space-creation.service.ts`
- `src/domains/blueprint/server/blueprint-published-version.store.ts`
- `src/domains/blueprint/server/index.ts`
- `src/app/api/admin/system/blueprints/published-versions/[id]/create-space/route.ts`
- `src/domains/workflow-definition/client/OperationPublishPlan.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `scripts/verify-sprint-87-create-space-from-published-blueprint.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `createSpaceFromPublishedBlueprintVersion`.
- Added `getBlueprintPublishedVersionRecord` for id-based published version
  lookup.
- Added `POST /api/admin/system/blueprints/published-versions/[id]/create-space`.
- Updated the route to await dynamic `params` before reading `id`, matching the
  current Next.js route handler contract.
- The create service:
  - loads the immutable published version snapshot;
  - rejects missing or blocked creation plans;
  - creates one `Task` as the Space;
  - creates one `TaskItem` for each initial Workspace plan item;
  - copies each published Workspace `snapshotNote` into the TaskItem note;
  - stamps Space and Workspace records with `publishedBlueprintVersionId`;
  - returns the existing Space if the same published version was already used.
- Operation publish panel now shows a Create Space action beside published
  versions.
- Client displays whether a Space was newly created or already existed.
- Operation authoring now labels this as `Tạo Space runtime` to clarify that it
  creates a Task-backed Space plus initial TaskItem-backed Workspaces from the
  published snapshot.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-87-create-space-from-published-blueprint.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-84-publish-version-snapshot-ux.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-86-blueprint-publish-action.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-85-blueprint-publish-persistence.ts` passed.
- `cmd /c npx eslint src/app/api/admin/system/blueprints/published-versions/[id]/create-space/route.ts src/domains/workflow-definition/client/OperationModelWizard.tsx src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationPublishPlan.tsx --quiet` passed.
- `cmd /c npx eslint "src/app/api/admin/system/blueprints/published-versions/[id]/create-space/route.ts" src/domains/blueprint/server/blueprint-space-creation.service.ts src/domains/blueprint/server/blueprint-published-version.store.ts src/domains/blueprint/server/index.ts src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationPublishPlan.tsx scripts/verify-sprint-87-create-space-from-published-blueprint.ts --quiet` passed.

## Out Of Scope

- Creating deferred business-object Workspaces from events.
- Creating manual-capacity Workspaces.
- Rollback/archive for published versions.
- Migrating existing Workspaces to a newer published version.
- Dedicated database table for published versions.
- Dedicated publish/create permissions.

## Result

Blueprint authoring now has the first end-to-end admin flow:

1. choose/edit an Operation Model draft;
2. publish an immutable Blueprint version;
3. create a runtime Space from that published version;
4. create initial Workspaces from the published creation plan;
5. keep existing Workspace snapshots untouched.
