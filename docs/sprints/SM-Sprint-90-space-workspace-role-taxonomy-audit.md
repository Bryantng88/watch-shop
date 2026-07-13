# Sprint 90 - Space / Workspace Role Taxonomy Audit

## Status

Planning and audit.

No implementation should proceed before this taxonomy is reviewed.

## Why

Space/Workspace has become flexible enough for real operations, but the
flexibility is not explicit enough.

Current examples:

- Media Workspaces act as ordered flow stages.
- Technical SR Workspaces act as case Workspaces identity-bound to a
  ServiceRequest.
- Technical Inspect/Processing/Done Workspaces act as ordered flow stages for
  TechnicalIssue items, even when the UI label says Technical Bench.
- Generic Sales/General Workspaces currently render as plain Workspace rows.

This is not wrong, but it needs a shared contract so each Space view does not
invent its own rendering rules.

## Reference Doc

Read first:

- `docs/architecture/17-space-workspace-role-taxonomy.md`
- `docs/architecture/16-operational-blueprint-contract.md`
- `docs/architecture/06-item-runtime-contract.md`

## Proposed Workspace Kinds

- `STANDALONE_WORKSPACE`
- `FLOW_STAGE_WORKSPACE`
- `CASE_WORKSPACE`
- `BENCH_WORKSPACE`

## Proposed Binding Roles

- `IDENTITY`
- `ITEM`
- `REFERENCE`

## Proposed Space View Row Models

- `WORKSPACE`
- `FLOW_STAGE_WORKSPACE`
- `CASE_WORKSPACE`
- `BUSINESS_ITEM`
- `BENCH_WORKSPACE`
- `STAGE_BUCKET`

`FLOW_STAGE_WORKSPACE` is required as a first-class row model. Most business
Spaces will have Workspaces that belong to a core flow, so the Space view must
be able to render those Workspaces as ordered stages instead of treating them as
a generic Workspace list.

Each flow-stage view mode must also declare the `coreFlowKey` it renders. A
Space can contain multiple core flows, but the UI must not mix their stages into
one generic Workspace dropdown.

## Audit Table

| Space | Current shape | Proposed kind/view | Needs clarification |
| --- | --- | --- | --- |
| Media | ordered workspaces for media process | `FLOW_STAGE_WORKSPACE`, Space row model `FLOW_STAGE_WORKSPACE` | declare kind in snapshot and default flow-stage view |
| Technical - SR Cases | one SR workspace per SR | `CASE_WORKSPACE`, identity target `SERVICE_REQUEST` | make identity binding explicit |
| Technical - Bench | Inspect/Processing/Done workspaces with TI items | `FLOW_STAGE_WORKSPACE`, row model `FLOW_STAGE_WORKSPACE`; UI label may remain Technical Bench | decide whether SR Case appears inside the same flow-stage view or stays in separate SR Cases mode |
| Sales | generic workspace rows; quotation/pricing/negotiation definitions exist but no approved Operation contract | keep `STANDALONE_WORKSPACE` until Sales flow is modeled; promote to `FLOW_STAGE_WORKSPACE` only if quote -> pricing -> negotiation is mandatory | create/audit Sales Operation Blueprint before changing runtime view |
| Payment | Payment Collection contract has Inbox -> Review -> Settled / Exception core flow | `FLOW_STAGE_WORKSPACE`, row model `FLOW_STAGE_WORKSPACE`; `PAYMENT` remains Item | connect published Payment runtime Spaces to Payment Space index; Payment adapter execution remains separate |
| General | generic workspace rows | `STANDALONE_WORKSPACE` | keep default until real process appears |

## Audit Findings

### Media

Decision: flow-stage Space.

Media Workspaces are ordered process stages for Watch/media items. The Space
view should default to `rowModel: FLOW_STAGE_WORKSPACE` and order stages from
the core flow, not from display sorting.

Media should be the first Space used to prove multi-flow clarity inside Space
Management. The current media core flow should be surfaced directly in the
operation Space view, with:

- a default flow-stage view mode for the current Media core flow;
- explicit `coreFlowKey` on the view mode;
- stage rows limited to Workspace roles that belong to that flow;
- item counts/previews inside each stage, without turning the item into the row
  identity;
- room for additional Media-related core flows later without mixing stages.

If later Media has multiple flows, for example content/media preparation and
publish/follow-up, each should appear as a separate selectable flow-stage view
mode or a flow selector inside the same flow view.

### Technical / Service Operation

Decision: composite Space with two primary modes.

- `SR Cases` mode renders `CASE_WORKSPACE` rows. Each row is identity-bound to
  one `SERVICE_REQUEST`.
- `Technical Bench` mode renders `FLOW_STAGE_WORKSPACE` rows for `INSPECT`,
  `PROCESSING`, and `DONE`. The label can remain Bench, but the kind is
  flow-stage because `TECHNICAL_ISSUE` items move through those Workspaces in an
  ordered path.

The open UI decision is whether `SR_CASE` also appears as the first stage in a
full flow view, or whether it stays only in `SR Cases` mode with a link into the
technical flow.

### Payment

Decision: flow-stage Space.

The Payment Collection contract already declares:

- object type `PAYMENT` as `ITEM`;
- roles `PAYMENT_INBOX`, `PAYMENT_REVIEW`, `PAYMENT_SETTLED`;
- core flow Inbox -> Review -> Settled / Exception;
- event routes that bind/move Payment items through those roles.

Therefore Payment should not be treated as a case Workspace by default. The
main Payment Space view should render stage Workspaces; Payment records are
items inside those stages.

### Sales

Decision: not enough contract yet.

Sales has existing workflow definitions such as quotation, pricing, negotiation,
and marketing, but there is no approved Sales Operation contract proving that
these are mandatory ordered stages. Keep existing Sales Workspaces as
`STANDALONE_WORKSPACE` until a Sales Operation Blueprint declares either:

- a core flow, then use `FLOW_STAGE_WORKSPACE`; or
- independent rooms, then keep `STANDALONE_WORKSPACE`.

### General

Decision: standalone by default.

General should stay generic unless a real business process is declared.

## Blueprint / Workspace Config Direction

Blueprint Workspace config should eventually include:

- `workspaceKind`
- `identityTargetType`
- `acceptsItemTargetTypes`
- `coreFlowKey`
- `flowStageKey`
- `flowStageOrder`
- `spaceViewModes`
- `defaultSpaceViewMode`
- `defaultCoreFlowKey`
- `carryoverPolicy`

These should be introduced as server abstractions and snapshot metadata first.
Do not add a schema migration yet.

## Implementation Plan

1. Review and approve taxonomy.
2. Add server-only taxonomy helpers.
3. Add fallback inference for existing Workspace snapshots.
4. Extend Operational Blueprint workspace roles with `workspaceKind`.
5. Add flow-stage metadata for `FLOW_STAGE_WORKSPACE` roles:
   `coreFlowKey`, `flowStageKey`, and `flowStageOrder`.
6. Extend Blueprint validation with warnings for missing Workspace kind or
   missing flow-stage view mode when a core flow exists.
7. Add Space view registry/config driven by approved row models.
8. Ensure each core flow has at least one Space view mode with
   `rowModel: FLOW_STAGE_WORKSPACE`.
9. Put the current Media core flow into the operation Space view as the first
   proof of `coreFlowKey`-driven flow-stage rendering.
10. Move Service Operation SR Cases and Technical Bench views onto the shared
   contract:
   - SR Cases: `CASE_WORKSPACE`;
   - Technical Bench: `FLOW_STAGE_WORKSPACE`.
11. Add Payment Space index discovery using the Payment Collection flow-stage
    view.
12. Leave Sales on standalone view until a Sales Operation Blueprint is
    approved.

## Guardrails

- Business domains remain source of truth.
- Workspace is a collaboration surface, not a business data store.
- Case Workspace is identity-bound to a business object; it is not the business
  object itself.
- Carryover moves unfinished Items/bindings, not whole Workspaces.
- Existing Workspace snapshots remain immutable.

## Open Questions

1. Should `spaceViewModes` live directly inside Operational Blueprint, or first
   in a server-side registry?
2. Should the Service full-flow view include `SR_CASE` as the first visible
   stage, or should `SR_CASE` stay only in the separate SR Cases mode?
3. For Sales, is quote -> pricing -> negotiation a core flow, or just separate
   standalone Workspaces?
4. Should every core flow generate a default flow-stage Space view mode
   automatically at publish/create-space time, or should admins explicitly
   configure it in the Blueprint before publish?
5. For a Space with multiple core flows, should the UI expose them as separate
   view modes, or as a flow selector inside one `FLOW_STAGE_WORKSPACE` mode?
