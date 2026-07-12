# Sprint 83 - Domain Adapter Binding UI

Status: closed.

## Goal

Make the boundary between declared Blueprint actions and executable domain
adapters visible in Operation authoring.

Sprint 82 added the creation dry-run. Sprint 83 shows whether each operation
action command is actually executable, externally handled, or still only
declared in the contract.

## Scope

- Add a domain adapter binding registry/summary for operation actions.
- Render adapter binding status in the Operation Model tab.
- Distinguish:
  - executable Workspace action adapters;
  - external entrypoints;
  - declared-only actions with no adapter yet.
- Keep the UI read-only.

## Files Touched

- `src/domains/blueprint/shared/operation-adapter-bindings.ts`
- `src/domains/workflow-definition/client/OperationAdapterBindings.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `scripts/verify-sprint-83-domain-adapter-binding-ui.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `listOperationAdapterBindings`.
- Added `summarizeOperationAdapterBindings`.
- Added `OperationAdapterBindings` client component.
- Operation Model tab now shows adapter binding status below the dry-run create
  plan.
- Service Operation actions are classified as:
  - executable through `service-operation-action-adapter` for
    `service.createTechnicalIssue`, `service.confirmTechnicalIssue`,
    `service.startTechnicalIssue`, and `service.completeTechnicalIssue`;
  - external entrypoint for `service.watchIntakeWithInitialIssue`.
- Payment Collection actions are shown as declared-only because Payment command
  adapter execution remains future work.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-83-domain-adapter-binding-ui.ts` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationAdapterBindings.tsx src/domains/blueprint/shared/operation-adapter-bindings.ts scripts/verify-sprint-83-domain-adapter-binding-ui.ts --quiet` passed.

## Out Of Scope

- Executing Payment commands.
- Adding new domain adapters.
- Persisting adapter binding configuration.
- Publish/versioning.
- Workspace snapshot migration.

Those remain later roadmap work.

## Next

Continue to Sprint 84 - Publish / Version / Snapshot UX.
