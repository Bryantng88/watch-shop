# Sprint 72 - Workspace Action Contract Runtime

Status: closed.

## Goal

Make Workspace UI discover and render actions from
`OperationalBlueprint.actions` instead of adding Service Operation buttons one
surface at a time.

Sprint 72 is the bridge from "Blueprint can declare operation actions" to
"Workspace can show those actions in a reusable runtime surface."

It also introduces core-flow awareness in the Workspace shell: Blueprint decides
which Workspaces belong to the same core flow, and the shell can use that to
render related Workspace navigation in the header.

## Why This Sprint Matters

Sprint 71 gave Blueprint an operation contract and made the coordination
consumer use event routes from that contract. That is not enough yet. If UI
actions are still hand-coded for each operation, the system will keep drifting
back to patchwork.

Sprint 72 starts the shared action runtime:

```text
Workspace snapshot
-> Operational Blueprint actions
-> Operational Blueprint core flow
-> workspace role / target type filtering
-> same-flow workspace navigation
-> action buttons
-> contract-rendered fields
-> adapter boundary
```

Domain commands still remain behind adapters. Sprint 72 should not move Service
truth into Blueprint.

## Scope

Build read/discovery and rendering first:

- read `operation.actions` from the Workspace snapshot;
- read `operation.coreFlows` from the Workspace snapshot;
- determine current workspace role from snapshot/receiver metadata;
- determine which core flow contains the current workspace role;
- expose same-flow Workspace navigation context for the Workspace header;
- filter actions by workspace role and target type;
- render available action controls in the Workspace detail shell;
- render action field shapes for:
  - `text`;
  - `textarea`;
  - `select`;
  - `money`;
  - `boolean`;
  - `date`;
- keep action submission behind an adapter contract rather than embedding
  Service Operation command logic directly into the UI component.

## Primary Files

Expected touch points:

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `src/domains/blueprint/shared/workspace-capabilities.ts`
- `src/domains/task/ui/detail/TaskExecutionPanel.tsx`
- `src/domains/task/ui/execution/*`
- Service Operation action adapter files under `src/domains/service`

The exact UI entry point should be confirmed by reading the current Workspace
detail implementation before editing.

## Acceptance Criteria

Sprint 72 is complete when:

- A Workspace can discover available actions from its Blueprint snapshot.
- A Workspace can discover its core flow from its Blueprint snapshot.
- Workspaces in the same core flow can be represented together for header
  navigation.
- Service Operation action buttons are derived from
  `OperationalBlueprint.actions`, not hand-added as feature-specific buttons.
- Actions are scoped by workspace role:
  - `SR_CASE` shows SR case actions such as `create_technical_issue`;
  - `INSPECT` shows inspection/classification actions;
  - `PROCESSING` shows processing actions;
  - `DONE` shows follow-up actions only when declared.
- Action form fields render from the contract shape.
- Empty/missing operation contracts degrade gracefully.
- No Service schema fields such as `spaceId` or `workspaceId` are added.
- No workspace capacity is created from UI/read paths.

## Initial Implementation Slice

First slice status:

1. Done: added shared action selection helpers near the Operational Blueprint
   contract.
2. Done: added core-flow selection helpers near the Operational Blueprint
   contract.
3. Done: added a read-only action/core-flow discovery surface to the Workspace
   detail UI.
4. Done: Service Operation Workspace header now reads the current role and
   renders the core-flow navigation steps from the snapshot operation contract.
5. Done: Service Operation Workspace sidebar now renders Blueprint-declared
   actions and field shapes for the current workspace role.
6. Done for first command: `create_technical_issue` can submit through an
   explicit Service Operation Blueprint action adapter.
7. Done for item-level first slice: Technical Issue queue rows can render
   Blueprint-declared item actions and submit supported commands with target
   context.
8. Done: `start_processing` now carries the required technical detail/catalog
   input in the Operational Blueprint contract and submits through the Blueprint
   action adapter.
9. Done: same-flow navigation avoids linking `ONE_PER_BUSINESS_OBJECT` roles to
   an arbitrary sibling Workspace when the current flow context is shared.

This avoids jumping straight into modals and domain commands before the shared
runtime contract is visible.

## Implemented First Slice

Files touched:

- `src/domains/blueprint/shared/operational-blueprint.ts`
- `src/domains/task/client/TaskItemDetailClient.tsx`

Runtime behavior:

- Workspace detail reads `snapshot.operation.coreFlows` and
  `snapshot.operation.actions`.
- Current Service Operation workspace role is read from
  `serviceOperationWorkspaceRole` in the Workspace note.
- Action filtering includes the workspace role's identity target type and item
  target types, then combines them with current queue/binding target types.
- Header core-flow navigation renders the ordered Blueprint steps for the
  current role. Steps with matching Workspace TaskItems link to those
  Workspaces; missing steps render as placeholders.
- Sidebar `Blueprint actions` panel filters action contracts by workspace role
  and current target types, then renders contract field shapes in read-only
  preview form.
- `create_technical_issue` on the SR Case role submits through
  `submitOperationalBlueprintActionAction`, which calls the Service Operation
  adapter instead of embedding Service command logic in the generic Workspace
  component.
- Technical Issue queue rows receive the same Operational Blueprint action
  contracts. Item-level forms are rendered beside the row's next-step area and
  submit target context (`targetType`, `targetId`) through the adapter.
- Each non-wired action still shows its adapter command as `Adapter pending` so
  Service domain command execution is not hidden inside generic Workspace UI.

Adapter boundary:

- `src/domains/service/server/operation/service-operation-action-adapter.ts`
  now has `runServiceOperationBlueprintAction`.
- `src/domains/task/actions/task.actions.ts` exposes
  `submitOperationalBlueprintActionAction`.
- Supported commands in this slice:
  - `service.createTechnicalIssue` for SR Case `create_technical_issue`;
  - `service.createTechnicalIssue` for Processing `raise_follow_up_issue`,
    resolving the parent SR from the target Technical Issue;
  - `service.confirmTechnicalIssue` for Inspect `classify_technical_issue`;
  - `service.startTechnicalIssue` for Processing `start_processing`, requiring
    `technicalDetailCatalogId` from the action contract;
  - `service.completeTechnicalIssue` for Processing `complete_processing`.
- `technical_issue.created`, `technical_issue.confirmed`,
  `technical_issue.started`, and `technical_issue.completed` events remain the
  handoff to Coordination.

Sprint 72 close notes:

- Core-flow navigation links shared stage Workspaces and the active current
  Workspace. Roles declared as `ONE_PER_BUSINESS_OBJECT` render as placeholders
  from shared flow boards unless there is a current unique Workspace context,
  avoiding accidental jumps to the first SR Case in the Space.
- `start_processing` is on the same contract-rendered action path as Inspect
  classification and Processing completion.
- Manual browser smoke remains useful before Sprint 73 UI modal work, but no
  Sprint 72 runtime blocker remains.

## Out Of Scope

- Watch List `watch_intake_with_suspicion` modal. That is Sprint 73.
- Extending Inspect/Processing beyond the Sprint 72 adapter command set. That
  is Sprint 74.
- Projection subscription runtime. That is Sprint 75.
- Blueprint authoring UI. That is Sprint 77.
- Blueprint persistence/versioning/rollback.

## Validation Plan

- Scoped ESLint for edited files.
- Manual UI review of a Workspace detail surface if the app can run.
- If TypeScript graph checks are attempted, record pre-existing unrelated type
  debt separately; do not hide new Sprint 72 issues inside old graph failures.

## Handoff Rule

Before implementing any new Service Operation button or modal, check whether
the action exists in `OperationalBlueprint.actions`. If it does not, update the
contract first or explicitly declare why the behavior is a domain adapter
rather than generic Workspace runtime.

Before implementing Workspace header navigation for an operation, check whether
the related Workspaces are declared in `OperationalBlueprint.coreFlows`.
