# Sprint 85 - Blueprint Publish Persistence Contract

Status: closed.

## Goal

Introduce the server-side persistence contract for published Blueprint versions
without wiring a UI publish action or mutating existing Workspace snapshots.

Sprint 84 exposed publish readiness. Sprint 85 makes that readiness actionable
on the server by adding an append-only published version store and service that
can persist immutable publish snapshots.

## Scope

- Add an append-only published Blueprint version record.
- Store workflow definition, workspace definition, operation snapshot,
  validation results, create-space plan, and publish plan together.
- Resolve the next published version from persisted history.
- Preserve `NEW_WORKSPACES_ONLY` snapshot semantics.
- Block publish persistence when operation readiness or workflow validation
  fails.
- Keep UI publish execution out of scope.

## Files Touched

- `src/domains/blueprint/server/blueprint-published-version.types.ts`
- `src/domains/blueprint/server/blueprint-published-version.store.ts`
- `src/domains/blueprint/server/blueprint-publish.service.ts`
- `src/domains/blueprint/server/index.ts`
- `src/domains/blueprint/shared/operation-publish-plan.ts`
- `scripts/verify-sprint-85-blueprint-publish-persistence.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `BlueprintPublishedVersion` snapshot type.
- Added file-backed published version store at
  `.data/blueprint-published-versions.json`, matching the existing draft store
  style.
- Store operations are append-only for published versions:
  - list all published versions;
  - list versions for a Blueprint;
  - get latest version for a Blueprint;
  - append a new immutable version.
- Added `publishBlueprintVersionCandidate` service.
- Added `publishWorkflowDefinitionDraftBlueprint` wrapper for future API/UI use.
- Added latest-version support to `buildOperationPublishPlan` while preserving
  the Sprint 84 fallback behavior.
- Published operation snapshots are stamped with the published version number.
- Existing Workspace snapshots remain untouched.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-85-blueprint-publish-persistence.ts` passed.
- `cmd /c npx eslint src/domains/blueprint/server/blueprint-published-version.types.ts src/domains/blueprint/server/blueprint-published-version.store.ts src/domains/blueprint/server/blueprint-publish.service.ts src/domains/blueprint/shared/operation-publish-plan.ts src/domains/blueprint/server/index.ts scripts/verify-sprint-85-blueprint-publish-persistence.ts --quiet` passed.
- `cmd /c npx tsx scripts/verify-sprint-84-publish-version-snapshot-ux.ts` passed.

## Out Of Scope

- UI publish button.
- API route for publishing.
- Rollback/archive UX.
- Dedicated database table or Prisma migration.
- Creating runtime Spaces from published versions.
- Migrating or rewriting existing Workspace snapshots.

## Result

Blueprint publish now has a server persistence contract:

1. readiness is computed server-side;
2. the next version comes from published history;
3. a published snapshot is appended immutably;
4. existing Workspaces continue to use their existing snapshots.

Sprint 86 can safely add the admin publish action/API on top of this contract.

