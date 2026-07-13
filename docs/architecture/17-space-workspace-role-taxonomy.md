# Space And Workspace Role Taxonomy

This document audits the current Space/Workspace model and sets the direction
for making Workspace roles and Space view modes explicit.

It is a planning and architecture document. It does not require a Prisma schema
change by itself.

## Problem

`Workspace` is currently flexible enough to support real operations, but that
flexibility is implicit.

In the current product, a Workspace can be:

- an independent collaboration room;
- a step in an ordered business flow;
- a case container whose identity is a business object such as a ServiceRequest;
- a bench or queue that holds items by operational stage.

That is useful, but if the role is not declared, Space views become hard to
reason about. A Space page can quietly render workspace rows, case rows,
business item rows, or stage buckets without a shared contract.

## Stable Definitions

### Space

A Space is a business operation area or cycle. It groups Workspaces and defines
which operation modes are visible to users.

A Space does not own business truth. Business domains remain the source of
truth and emit events.

### Workspace

A Workspace is the collaboration surface inside a Space.

Persistently, this is still backed by `TaskItem` in this codebase. Product and
server vocabulary should prefer Workspace.

### Item

An Item is a business object placed inside a Workspace for processing. The
current persistence compatibility layer is still `TaskExecution`, spoken of in
new server code as BusinessBinding or Item runtime.

An Item is not the same thing as a Workspace.

### Identity Binding

An identity binding means a Workspace represents a business object without
turning that business object into Workspace-owned truth.

Example: an SR case Workspace has identity binding to `SERVICE_REQUEST`.

## Workspace Kinds

Every Workspace should declare one kind.

```ts
type WorkspaceKind =
  | "STANDALONE_WORKSPACE"
  | "FLOW_STAGE_WORKSPACE"
  | "CASE_WORKSPACE"
  | "BENCH_WORKSPACE";
```

### STANDALONE_WORKSPACE

A Workspace that can stand alone.

It does not need a core flow and does not require an Item. It can still have
items or activity, but they are not part of its identity.

Examples:

- general planning workspace;
- manual coordination workspace;
- ad hoc operational room.

### FLOW_STAGE_WORKSPACE

A Workspace that represents one step in a core flow.

Items move through these Workspaces in an ordered path. The Workspace is stage
capacity, not the item itself.

Example:

```text
Photoshoot -> Processing -> Publishing
```

### CASE_WORKSPACE

A Workspace whose identity is one business object.

This should be described as "Workspace for ServiceRequest" rather than
"Workspace is ServiceRequest".

Example:

- SR case Workspace identity-bound to `SERVICE_REQUEST`.

### BENCH_WORKSPACE

A Workspace that represents operational capacity or a workbench. It may show
or process many Items by stage.

Use this only when the Workspace is not itself a required step in an ordered
core flow. If items must pass through the Workspace as part of the business
path, use `FLOW_STAGE_WORKSPACE` instead. A UI label can still say "Bench";
the kind should describe the runtime role.

Examples:

- ad hoc support bench;
- exception/follow-up pool;
- manual triage area that is not part of the required path.

## Space View Modes

Every Space view mode should declare what its rows represent.

```ts
type SpaceViewRowModel =
  | "WORKSPACE"
  | "FLOW_STAGE_WORKSPACE"
  | "CASE_WORKSPACE"
  | "BUSINESS_ITEM"
  | "BENCH_WORKSPACE"
  | "STAGE_BUCKET";

type SpaceViewMode = {
  key: string;
  label: string;
  rowModel: SpaceViewRowModel;
  primaryTarget: "workspace" | "businessObject" | "stage";
  coreFlowKey?: string;
  allowedWorkspaceKinds: WorkspaceKind[];
  columns: SpaceViewColumn[];
  actions: SpaceViewAction[];
  carryoverPolicy?: CarryoverPolicy;
};
```

Rules:

- Space view modes are not Workspace detail tabs.
- A Space can have multiple view modes.
- A view mode must say what row clicks target.
- A view mode that renders ordered stages must declare its `coreFlowKey`.
- A view mode must say whether carryover is allowed.
- A view mode can hydrate business-domain read models, but business truth stays
  in the business domain.
- A `FLOW_STAGE_WORKSPACE` must be represented by at least one flow-stage Space
  view mode. Do not collapse it into a generic `WORKSPACE` view when the
  business meaning is ordered stage capacity.

### Flow Stage View Mode

Most business Spaces are expected to contain Workspaces that belong to a core
flow. For those Spaces, the default operational view should usually be a
flow-stage view.

The flow-stage view renders Workspaces as ordered stages in a business process.
It may show the stages as rows, lanes, or grouped cards, but the row model must
still be explicit:

```ts
rowModel: "FLOW_STAGE_WORKSPACE"
primaryTarget: "workspace"
allowedWorkspaceKinds: ["FLOW_STAGE_WORKSPACE"]
```

Rules:

- Stage order comes from the declared core flow, not from UI sorting.
- Stage Workspaces are process capacity. They are not the business item.
- Items can be counted, grouped, or previewed inside a stage, but clicking the
  stage opens the Workspace detail unless the view explicitly declares an item
  drill-down.
- If a Space contains mostly flow-stage Workspaces, a flow-stage mode should be
  the default Space view.

### Multiple Core Flows In One Space

A Space may contain more than one core flow. This is allowed, but it must be
visible in the Space view contract.

Rules:

- Each core flow should have its own flow-stage Space view mode.
- A flow-stage view mode must declare exactly one `coreFlowKey`.
- Workspace rows in that view must come only from roles in that core flow.
- If a Workspace participates in more than one flow, the view must explain that
  explicitly through role metadata; do not infer it from labels.
- The Space UI should present core flow selection as a first-class control when
  more than one flow exists.
- The default view should be explicit. Do not rely on whichever flow appears
  first in registry order.

Recommended view structure:

```text
Space
  View mode: Flow
    Flow selector: Media Pipeline / Publish / ...
    Rows: FLOW_STAGE_WORKSPACE ordered by selected core flow
  View mode: Items
    Rows: BUSINESS_ITEM, filtered by selected flow or stage
  View mode: Workspaces
    Rows: WORKSPACE, only for standalone/manual rooms
```

## Binding Roles

Business bindings should become explicit about why a business object is linked
to a Workspace.

Proposed runtime roles:

```ts
type WorkspaceBindingRole =
  | "IDENTITY"
  | "ITEM"
  | "REFERENCE";
```

### IDENTITY

The binding defines Workspace identity.

Example: SR case Workspace identity-bound to `SERVICE_REQUEST`.

### ITEM

The binding means a business object is being processed inside a Workspace.

Example: `TECHNICAL_ISSUE` item in Inspect or Processing.

### REFERENCE

The binding is display context only and should not drive workflow ownership.

## Current Audit

### Media

Current shape:

- Space: media operation cycle.
- Workspace role: flow stages.
- Workspace kind: `FLOW_STAGE_WORKSPACE`.
- View mode row model: `FLOW_STAGE_WORKSPACE`.
- Items: Watch/media work items move through stage Workspaces.

Recommended core flow:

```text
coreFlowKey: media-production-flow
Photography -> Media Processing -> Publish
```

Workspace role mapping:

| Workspace role | Existing key | Workspace kind | Notes |
| --- | --- | --- | --- |
| Photography | `photography` | `FLOW_STAGE_WORKSPACE` | receives `watch.media.photoshoot.requested` |
| Media Processing | `media-processing` | `FLOW_STAGE_WORKSPACE` | receives photoshoot/media asset events and owns media review states |
| Publish | `publish` | `FLOW_STAGE_WORKSPACE` | receives `watch.media.ready_for_publish` |

Important distinction:

- `photography`, `media-processing`, and `publish` are Space flow stages.
- Workflow states inside those Workspaces are not Space stages. For example,
  `NEW`, `REVIEW`, `FEEDBACK`, `DONE`, `WAITING_CONTENT`, `IMAGE_REVIEW`, and
  `READY_TO_POST` are item/workflow states inside a Workspace.

What is already right:

- The flow-stage model matches the business process.
- Core flow navigation is appropriate.

Needs clarification:

- Workspace snapshots should declare `workspaceKind`.
- Space view config should declare a flow-stage mode, not a generic Workspace
  list.
- The default Media Space view should be ordered by the core flow.

### Technical / Service Operation

Current shape:

- Space: technical/service operation.
- SR Cases mode: one row is one SR case Workspace.
- Technical Bench mode: Inspect, Processing, Done/Follow-up Workspaces show TI
  items by stage.

Recommended taxonomy:

- `SR_CASE` -> `CASE_WORKSPACE`, identity target `SERVICE_REQUEST`.
- `INSPECT` -> `FLOW_STAGE_WORKSPACE`, accepts `TECHNICAL_ISSUE`.
- `PROCESSING` -> `FLOW_STAGE_WORKSPACE`, accepts `TECHNICAL_ISSUE`.
- `DONE` -> `FLOW_STAGE_WORKSPACE`, accepts `TECHNICAL_ISSUE` and payment
  follow-up items.

What is already right:

- One SR Workspace per ServiceRequest is a valid case model.
- Inspect, Processing, and Done/Follow-up are valid flow-stage Workspaces
  because TechnicalIssue items move through them in an ordered path.
- SR Cases and Technical Bench are Space view modes, not Workspace tabs.

Needs clarification:

- Do not say the Workspace is the SR. Say it is identity-bound to the SR.
- TI remains an Item/business object, not necessarily a Workspace.
- The Space page must declare whether it is rendering case Workspaces or
  flow-stage Workspaces.
- The UI label `Technical Bench` can remain, but the Workspace kind for
  `INSPECT`, `PROCESSING`, and `DONE` should be `FLOW_STAGE_WORKSPACE`.

### Sales

Current shape:

- Space: sales operation cycle.
- Current generic Space page renders Workspace rows.

Needs audit:

- Decide whether Sales Workspaces are standalone, flow stages, or benches.
- Decide whether quote/pricing/negotiation Workspaces form a core flow.
- If quote/pricing/negotiation are sequential business stages, Sales should use
  `FLOW_STAGE_WORKSPACE` plus a flow-stage Space view mode by default.
- Do not add custom Sales view rows until this is declared.

### Payment

Current shape:

- Payment operational Blueprint proof exists.
- Runtime Space/Workspace creation exists, but Payment Space index discovery is
  still incomplete.

Recommended taxonomy:

- payment inbox/review/settled are `FLOW_STAGE_WORKSPACE`;
- `PAYMENT` is an Item in the Payment domain, not Workspace identity.

Needs clarification:

- Payment view rows should be stage Workspaces in the main operational view.
- A secondary item list can show Payment records inside a selected stage.
- Connect runtime published Blueprint Spaces to the Payment Space index.

### General

Current shape:

- Generic Space with Workspace rows.

Recommended taxonomy:

- default `STANDALONE_WORKSPACE`.

Needs audit:

- Keep it generic unless a real business flow appears.

## Blueprint Contract Additions

Operational Blueprint already has object types, workspace roles, core flows,
event routes, actions, workflows, and projection subscriptions.

It should grow explicit Workspace and Space-view metadata:

```ts
type OperationalBlueprintWorkspaceRole = {
  key: string;
  label: string;
  description: string;
  workspaceKind: WorkspaceKind;
  cardinality: string;
  identityTargetType?: string;
  acceptsItemTargetTypes?: string[];
};

type OperationalBlueprintSpaceViewMode = {
  key: string;
  label: string;
  rowModel: SpaceViewRowModel;
  primaryTarget: "workspace" | "businessObject" | "stage";
  workspaceRoles: string[];
  columns: SpaceViewColumn[];
  actions: SpaceViewAction[];
};
```

These fields should start as server-side abstractions and snapshot metadata.
They do not require immediate database migration.

Current implementation slice:

- New operation-created Workspace snapshots derive and store `workspaceKind`,
  `operationWorkspaceRole`, `coreFlowKey`, `flowStageKey`, and
  `flowStageOrder`.
- Space list DTOs expose those fields to the Coordination UI.
- `FLOW_STAGE_WORKSPACE` Space modes filter and sort rows by `flowStageKey`
  when available.
- Existing snapshots are not migrated; legacy rows keep fallback rendering.

## Carryover Policy

Carryover means moving unfinished Items from a previous cycle to the current
cycle. It must not move completed business work.

Rules:

- Carryover moves Items/bindings, not entire Workspaces.
- Carryover only applies when the Space view config allows it.
- The target business domain decides whether an item is still processing.
- For ServiceRequest: do not carry over `COMPLETED`, `DELIVERED`, or
  `CANCELED`.
- For TechnicalIssue: do not carry over `DONE` or `CANCELED`.
- Other target types need explicit processing rules before carryover can be
  trusted.

## Migration Direction

No existing Workspace snapshots should be mutated automatically.

Recommended path:

1. Add server-only taxonomy helpers.
2. Infer Workspace kind for existing Workspaces from note/snapshot/bindings.
3. Add explicit fields to new Blueprint snapshots.
4. Add validation warnings for missing Workspace kind or ambiguous view rows.
5. Let old Workspaces continue through fallback inference.

## Decision

Keep Workspace flexible, but make the role explicit.

Keep Space views flexible, but make the row model explicit.

The guardrail:

```text
Workspace can play different roles, but every Workspace must declare its role.
Space views can render differently, but every view must declare its row model
and primary target.
```
