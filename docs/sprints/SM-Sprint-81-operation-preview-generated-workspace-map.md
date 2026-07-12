# Sprint 81 - Operation Preview / Generated Workspace Map

Status: closed.

## Goal

Let an author see what an Operation Model would generate before any real Space
or Workspace creation exists.

Sprint 80 made the Operation Model editable through structured controls.
Sprint 81 adds a generated preview map from the current contract so authors can
inspect workspace roles, flow order, inbound events, actions, workflow
ownership, and projection effects.

## Scope

- Generate a preview map from `OperationalBlueprintContract`.
- Render core flows as ordered workspace role paths.
- Render workspace role nodes with:
  - cardinality;
  - identity/item target types;
  - inbound event routes;
  - available actions;
  - workflow ownership.
- Render projection subscriptions as downstream read-model effects.
- Surface unplaced routes/actions when they reference missing workspace roles.
- Keep preview read-only.

## Files Touched

- `src/domains/blueprint/shared/operation-preview.ts`
- `src/domains/workflow-definition/client/OperationWorkspaceMap.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `scripts/verify-sprint-81-operation-preview-map.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `generateOperationPreviewMap`.
- Added `OperationWorkspaceMap` client component.
- Operation Model tab now shows the generated workspace map above the existing
  structured contract preview.
- Service Operation preview shows the SR Case -> Inspect -> Processing ->
  Done/Follow-up core flow and per-role event/action/workflow details.
- Preview exposes unplaced routes/actions as a warning condition without
  blocking rendering.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-81-operation-preview-map.ts` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationWorkspaceMap.tsx src/domains/blueprint/shared/operation-preview.ts scripts/verify-sprint-81-operation-preview-map.ts --quiet` passed.

## Out Of Scope

- Creating real Spaces.
- Persisting generated workspace plans.
- Publish/versioning.
- Domain adapter binding.
- Workspace snapshot migration.

Those remain later roadmap work.

## Next

Continue to Sprint 82 - Create Space From Operation Blueprint.
