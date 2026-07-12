# Sprint 82 - Create Space From Operation Blueprint

Status: closed.

## Goal

Prepare the safe creation path from an Operation Blueprint to a real
Space/Workspace structure without violating snapshot semantics or workspace
cardinality.

Sprint 81 showed the generated workspace map. Sprint 82 turns that map into a
creation dry-run plan that separates initial receiver workspaces from
business-object-created workspaces.

## Scope

- Build a creation plan from `OperationalBlueprintContract` and Workspace
  Definition.
- Classify workspace roles by cardinality:
  - `SINGLE_PER_ACTIVE_CYCLE` -> initial receiver workspace;
  - `ONE_PER_BUSINESS_OBJECT` -> defer until event/business object exists;
  - `MANY_PER_ACTIVE_CYCLE` -> manual capacity decision.
- Generate per-workspace snapshot notes with operation role metadata.
- Render the dry-run plan in the Operation Model tab.
- Keep the plan read-only and non-mutating.

## Files Touched

- `src/domains/blueprint/shared/operation-space-plan.ts`
- `src/domains/workflow-definition/client/OperationSpaceCreationPlan.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `scripts/verify-sprint-82-operation-space-creation-plan.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `buildOperationSpaceCreationPlan`.
- Added `OperationSpaceCreationPlan` client component.
- Operation Model tab now shows a Create Space dry-run below the generated
  workspace map.
- Service Operation plan creates only Inspect, Processing, and Done/Follow-up
  as initial active-cycle receiver Workspaces.
- Service Operation `SR_CASE` is deferred until a `SERVICE_REQUEST` exists,
  preserving one-workspace-per-business-object cardinality.
- Payment Collection plan creates its three receiver Workspaces immediately.
- Snapshot notes include operation key and workspace role metadata for future
  creation execution.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-82-operation-space-creation-plan.ts` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationSpaceCreationPlan.tsx src/domains/blueprint/shared/operation-space-plan.ts scripts/verify-sprint-82-operation-space-creation-plan.ts --quiet` passed.

## Out Of Scope

- Calling `createTaskAction` or `createTaskItemAction`.
- Persisting generated plans.
- Bulk workspace creation.
- Domain adapter binding.
- Publish/versioning.
- Workspace snapshot migration.

Those should be handled after the dry-run plan is accepted.

## Next

Continue to Sprint 83 - Domain Adapter Binding UI.
