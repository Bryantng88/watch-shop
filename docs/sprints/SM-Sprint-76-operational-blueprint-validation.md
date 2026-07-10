# Sprint 76 - Operational Blueprint Validation

Status: closed.

## Goal

Add structural validation for `OperationalBlueprintContract` so bad operation
contracts fail early before event routing, action rendering, workflow ownership,
or projection subscriptions reach runtime.

## Scope

- Validate operation contract references and duplicate keys.
- Expose validation result from Blueprint registry DTOs.
- Show validation status in the Blueprint operation preview.
- Keep validation schema-free and read-only.

## Files Touched

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `src/domains/blueprint/server/blueprint.types.ts`
- `src/domains/blueprint/server/blueprint-library.service.ts`
- `src/domains/blueprint/server/index.ts`
- `src/domains/coordination/server/coordination-dashboard.types.ts`
- `src/domains/coordination/server/coordination-dashboard.service.ts`
- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `scripts/verify-sprint-76-operational-blueprint-validation.ts`

## Implemented

- Added `validateOperationalBlueprintContract`.
- Added validation result types:
  - `OperationalBlueprintValidationIssue`;
  - `OperationalBlueprintValidationResult`.
- Validator now catches:
  - duplicate object target types, workspace roles, core flows, event routes,
    actions, workflows, and projection subscriptions;
  - event routes referencing missing workspace roles;
  - event routes referencing unknown object target types;
  - core flow steps referencing missing workspace roles;
  - actions referencing missing workspace roles;
  - actions referencing unknown object target types;
  - duplicate action field keys;
  - workflows referencing missing workspace roles;
  - workflow transitions referencing missing states;
  - workflow transitions referencing missing action keys;
  - projection subscriptions without projection keys;
  - projection subscriptions with empty event sets;
  - object target types not represented by any workspace role.
- Blueprint registry items and workspace instantiation options now expose
  `operationValidation`.
- Operation Coordination Blueprint preview shows the contract validation status.
- Service Operation contract passes validation with zero issues.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-76-operational-blueprint-validation.ts`
  passed.
- `cmd /c npx eslint scripts/verify-sprint-76-operational-blueprint-validation.ts src/domains/blueprint/shared/operational-blueprint.ts src/domains/blueprint/server/blueprint-library.service.ts src/domains/blueprint/server/blueprint.types.ts src/domains/blueprint/server/index.ts src/domains/coordination/server/coordination-dashboard.types.ts src/domains/coordination/server/coordination-dashboard.service.ts src/domains/coordination/ui/OperationCoordinationWorkspace.tsx --quiet --rule "@typescript-eslint/no-explicit-any: off"`
  passed.

## Next

Sprint 77 can use this validation result as the guardrail for Operation Model
authoring UI. Editing/publishing remains out of scope until the authoring
surface has clear validation feedback.
