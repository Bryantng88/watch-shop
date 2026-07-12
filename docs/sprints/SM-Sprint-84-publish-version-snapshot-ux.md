# Sprint 84 - Publish / Version / Snapshot UX

Status: closed.

## Goal

Expose publish/version readiness for Operation Models without introducing
premature persistence or mutating existing Workspace snapshots.

Sprint 83 made adapter binding status visible. Sprint 84 shows whether the
current Operation Model is a future publish candidate, what version would come
next, and what snapshot rule would apply.

## Scope

- Add a publish readiness plan for Operation Models.
- Render publish/version/snapshot status in the Operation Model tab.
- Show:
  - current operation version;
  - proposed next version;
  - validation issue count;
  - declared-only adapter count;
  - snapshot mode.
- Preserve the rule that existing Workspace snapshots do not change.
- Keep publish read-only.

## Files Touched

- `src/domains/blueprint/shared/operation-publish-plan.ts`
- `src/domains/workflow-definition/client/OperationPublishPlan.tsx`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `scripts/verify-sprint-84-publish-version-snapshot-ux.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `buildOperationPublishPlan`.
- Added `OperationPublishPlan` client component.
- Operation Model tab now shows publish/version readiness below adapter
  bindings.
- Publish readiness proposes the next operation version while keeping snapshot
  mode as `NEW_WORKSPACES_ONLY`.
- Missing operation or blocked create-space dry-run is treated as blocking.
- Declared-only adapters are warnings, not blocking errors, so Payment
  Collection remains visible as a publish candidate with adapter caveats.
- UI explicitly states that existing Workspace snapshots must not be mutated by
  future publish.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-84-publish-version-snapshot-ux.ts` passed.
- `cmd /c npx eslint src/domains/workflow-definition/client/WorkflowAdminClient.tsx src/domains/workflow-definition/client/OperationPublishPlan.tsx src/domains/blueprint/shared/operation-publish-plan.ts scripts/verify-sprint-84-publish-version-snapshot-ux.ts --quiet` passed.

## Out Of Scope

- Persisting published Blueprint versions.
- Publishing or rollback actions.
- Dedicated Workspace snapshot table.
- Migration of existing Workspaces.
- Runtime creation from published versions.

Those require a persistence/versioning contract beyond this UX/readiness slice.

## Result

The Operation authoring roadmap from Sprint 79 through Sprint 84 is complete as
a non-mutating authoring and readiness workflow:

1. choose an operation template;
2. edit the operation model structurally;
3. preview the generated workspace map;
4. preview the create-space plan;
5. inspect adapter bindings;
6. inspect publish/version/snapshot readiness.
