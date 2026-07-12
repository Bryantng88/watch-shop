# Sprint 88 - Deferred Workspace Runtime

Status: closed.

## Goal

Create `ONE_PER_BUSINESS_OBJECT` Workspaces from business events using the
immutable published Blueprint version snapshot.

Sprint 87 created initial Workspaces from a published version. Sprint 88 closes
the next gap by letting event runtime create deferred Workspaces, such as an
`SR_CASE` Workspace for `service_request.created`, inside a Space that was
created from a published Blueprint version.

## Scope

- Add generic deferred Workspace creation from published Operation event routes.
- Trigger deferred creation from the coordination business-event consumer before
  falling back to the legacy weekly coordination flow.
- Match events by:
  - published Operation key;
  - `eventRoutes.eventKey`;
  - `eventRoutes.targetType`;
  - workspace role cardinality `ONE_PER_BUSINESS_OBJECT`.
- Create a TaskItem-backed Workspace from the published
  `creationPlan.deferredWorkspaces` snapshot.
- Bind the business object to the newly created Workspace.
- Write business event activity to the created Workspace.
- Keep initial receiver Workspaces and manual-capacity Workspaces outside the
  deferred runtime path.

## Files Touched

- `src/domains/blueprint/server/blueprint-space-creation.service.ts`
- `src/domains/blueprint/server/index.ts`
- `src/domains/coordination/server/coordination-event-consumer.ts`
- `scripts/verify-sprint-88-deferred-workspace-runtime.ts`
- `docs/sprints/CURRENT.md`

## Implemented

- Added `ensureDeferredWorkspaceFromPublishedBlueprintEvent`.
- The service:
  - loads published Blueprint versions;
  - resolves matching operation event routes;
  - only handles workspace roles with `ONE_PER_BUSINESS_OBJECT`;
  - finds an active Space created from that published version;
  - reuses existing bindings/workspaces for the same target;
  - creates a deferred TaskItem Workspace with the published snapshot note.
- Coordination event consumer now attempts published deferred Workspace runtime
  before the legacy weekly coordination binding path.
- Consumer metadata marks the binding/activity source as
  `PUBLISHED_BLUEPRINT_VERSION`.
- Existing Service Operation weekly-cycle fallback remains in place when no
  published Space matches.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-88-deferred-workspace-runtime.ts` passed.
- `cmd /c npx tsx scripts/verify-sprint-87-create-space-from-published-blueprint.ts` passed.
- `cmd /c npx eslint src/domains/blueprint/server/blueprint-space-creation.service.ts src/domains/blueprint/server/index.ts src/domains/coordination/server/coordination-event-consumer.ts scripts/verify-sprint-88-deferred-workspace-runtime.ts --quiet` passed.

## Out Of Scope

- Manual-capacity Workspace creation.
- Dedicated runtime selector when multiple published Spaces exist for the same
  operation.
- Workspace migration to newer published versions.
- Published version rollback/archive.
- Database-backed published version store.
- Dedicated create/publish permissions.

## Result

The first published Blueprint runtime loop now covers both sides of the
creation plan:

1. `initialWorkspaces` are created by Sprint 87 when the Space is created.
2. `deferredWorkspaces` are created by Sprint 88 when matching business events
   arrive.

Legacy coordination behavior remains available as fallback when no published
Blueprint Space exists.

