# Sprint 77 - Blueprint Authoring UI For Operation Model

Status: closed.

## Goal

Expose Operational Blueprint contracts in the Blueprint Library UI so admins can
inspect the operation model and start editing it in draft form without changing
source code.

## Scope

- Add an Operation Model tab to Blueprint Library.
- Show operation validation status from Sprint 76.
- Render the operation model in structured sections:
  - workspace roles;
  - event routes;
  - action definitions and fields;
  - workflow ownership;
  - projection subscriptions.
- Allow draft operation editing through raw Operation JSON.
- Keep publish/versioning out of scope.

## Files Touched

- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `src/domains/workflow-definition/server/workflow-definition-draft.types.ts`
- `src/domains/workflow-definition/server/workflow-definition-draft.service.ts`
- `scripts/verify-sprint-77-operation-authoring-ui.ts`

## Implemented

- Added `operation?: OperationalBlueprintContract | null` to draft
  `blueprintJson`.
- Draft blueprint JSON normalization now preserves the operation contract.
- Blueprint Library registry list now shows whether a registry Blueprint has a
  valid operation model.
- Blueprint detail now has an `Operation Model` tab.
- The Operation tab renders:
  - operation summary and validation result;
  - workspace role cards with cardinality and target mapping;
  - event route cards with event key, target type, workspace role, and effect;
  - action cards with command, field shapes, and emitted events;
  - workflow ownership and transitions;
  - projection subscription event sets.
- Registry operation contracts are read-only.
- Drafts can copy the source operation model and edit it as raw JSON.
- Edited draft operation JSON is validated immediately through
  `validateOperationalBlueprintContract`.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-77-operation-authoring-ui.ts` passed.
- `cmd /c npx eslint scripts/verify-sprint-77-operation-authoring-ui.ts src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/server/workflow-definition-draft.types.ts src/domains/workflow-definition/server/workflow-definition-draft.service.ts --quiet --rule "@typescript-eslint/no-explicit-any: off"` passed.

## Notes

- The edit surface is intentionally JSON-first for this sprint. It gives
  admins a non-source-code path to modify the operation contract while avoiding
  premature publish/version semantics.
- Field-level authoring widgets can be layered on top of the same draft
  `blueprintJson.operation` in a later sprint.
- A scoped `tsc` command using CLI `--paths` was rejected by TypeScript because
  `paths` must live in `tsconfig.json`; scoped ESLint and the Sprint 77 verify
  script were used for validation.

## Next

Sprint 78 should prove the Operational Blueprint runtime with a second
operation, using the same validation and authoring surfaces instead of adding
Service Operation-specific branches.
