# Sprint 80 - Structured Operation Authoring UI

Status: closed.

## Goal

Make Operation Model authoring usable after Sprint 79 template selection by
adding structured editing controls instead of relying only on raw JSON.

Sprint 79 let a user start from Service Operation, Payment Collection, or a
Blank Operation shell. Sprint 80 lets the user edit the selected contract
through form controls while keeping JSON as the developer escape hatch.

## Scope

- Extract Operation Model authoring UI out of `WorkflowAdminClient.tsx`.
- Add pure operation-authoring helpers for patching contract sections.
- Add structured controls for:
  - operation identity;
  - object types;
  - workspace roles;
  - core flows;
  - event routes;
  - actions and action fields;
  - workflow ownership;
  - projection subscriptions.
- Keep raw JSON editing available.
- Keep all edits inside draft `blueprintJson.operation`.

## Files Touched

- `src/domains/blueprint/shared/operation-authoring.ts`
- `src/domains/workflow-definition/client/OperationModelAuthoringPanel.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `scripts/verify-sprint-80-structured-operation-authoring.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added pure helper functions for cloning, root patching, list item add/update/
  remove, and action field add/update/remove.
- Added `OperationModelAuthoringPanel` as a dedicated client component.
- Moved Operation Template Picker and Developer JSON editing into the new
  authoring panel.
- Added structured form controls for the full current
  `OperationalBlueprintContract` surface.
- Structured edits and raw JSON edits both update the same draft operation JSON.
- Existing Sprint 76 validation and Sprint 77 preview continue to render from
  the current draft operation.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-80-structured-operation-authoring.ts` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationModelAuthoringPanel.tsx src/domains/blueprint/shared/operation-authoring.ts scripts/verify-sprint-80-structured-operation-authoring.ts --quiet` passed.

## Out Of Scope

- Publish/versioning.
- Creating real Spaces from Operation Blueprints.
- Payment command adapter execution.
- Domain adapter binding UI.
- Automatic migration of existing Workspace snapshots.

Those remain later roadmap work.

## Next

Continue to Sprint 81 - Operation Preview / Generated Workspace Map.
