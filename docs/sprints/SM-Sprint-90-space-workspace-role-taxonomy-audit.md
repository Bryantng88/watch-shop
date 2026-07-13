# Sprint 90 - Space / Workspace Role Taxonomy Audit

## Status

Audit plus first runtime view-config and Blueprint snapshot metadata slice.

The taxonomy has been reviewed enough to implement the first server-side Space
view config layer. Runtime behavior is still conservative: existing Workspace
snapshots are not migrated and old Workspaces continue through fallback
rendering.

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

Current Media core flow audit:

```text
coreFlowKey: media-production-flow
defaultSpaceViewMode: media-production-flow
rowModel: FLOW_STAGE_WORKSPACE
primaryTarget: workspace
itemTargetType: WATCH
```

Stage order:

| Stage label | Existing workspace key | Sort | Intake/progress evidence |
| --- | --- | ---: | --- |
| Photography | `photography` | 10 | `watch.media.photoshoot.requested` |
| Media Processing | `media-processing` | 20 | `watch.media.photoshoot.completed`, `watch.media.asset.attached`, content/image review events |
| Publish | `publish` | 30 | `watch.media.ready_for_publish`, `watch.publish.assets.downloaded` |

View naming:

- Space view mode label: `Media Production Flow`.
- Flow selector label: `Media Production`.
- Workspace row labels should use the stage labels above.
- Item preview/counts inside each stage should count unfinished `WATCH` items
  bound to that Workspace.

Do not promote internal workflow states to Space stages. Examples that must
remain inside Workspace detail: `NEW`, `REVIEW`, `FEEDBACK`, `DONE`,
`WAITING_CONTENT`, `CONTENT_REVIEW`, `IMAGE_REVIEW`, `READY_TO_POST`,
`RECALLED`.

Carryover rule for Media:

- Carry over unfinished `WATCH` items bound to flow-stage Workspaces.
- Do not carry over items whose media/publish work is already terminal.
- The terminal definition should come from the item workflow state, not from the
  Space row label.

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

1. Review and approve taxonomy. Done for the first slice.
2. Add server-only taxonomy helpers. Started through Space view config/types.
3. Add fallback inference for existing Workspace snapshots. Started through
   snapshot/note readers.
4. Extend Operational Blueprint workspace roles with `workspaceKind`. Pending
   editor/contract field; current slice derives it during snapshot creation.
5. Add flow-stage metadata for `FLOW_STAGE_WORKSPACE` roles:
   `coreFlowKey`, `flowStageKey`, and `flowStageOrder`. Implemented for new
   operation-created Workspace snapshots.
6. Extend Blueprint validation with warnings for missing Workspace kind or
   missing flow-stage view mode when a core flow exists.
7. Add Space view registry/config driven by approved row models. First slice
   implemented in `space-view.config.ts`.
8. Ensure each core flow has at least one Space view mode with
   `rowModel: FLOW_STAGE_WORKSPACE`. Started for Media, Technical, and Payment.
9. Put the current Media core flow into the operation Space view as the first
   proof of `coreFlowKey`-driven flow-stage rendering. Implemented as
   `media-production-flow`.
10. Move Service Operation SR Cases and Technical Bench views onto the shared
   contract. First config slice implemented:
   - SR Cases: `CASE_WORKSPACE`;
   - Technical Bench: `FLOW_STAGE_WORKSPACE`.
11. Add Payment Space index discovery using the Payment Collection flow-stage
    view. First config slice implemented as `payment-collection-flow`; adapter
    execution remains separate.
12. Leave Sales on standalone view until a Sales Operation Blueprint is
    approved.

## First Runtime Config Slice

Implemented in code:

- `SpaceViewModeConfig.allowedWorkspaceKinds`
- `SpaceViewCarryoverPolicy.terminalStatesByTargetType`
- Media `media-production-flow`
- Technical modes:
  - `sr-cases` with row model `CASE_WORKSPACE`
  - `technical-issue-flow` / Technical Bench with row model
    `FLOW_STAGE_WORKSPACE`
- Payment `payment-collection-flow`
- Space view mode selector in the Coordination Workspace UI
- Flow-stage row filtering and stage-order sorting for active flow modes
- Rollover/carryover server guard now reads
  `terminalStatesByTargetType` from the active Space view config and hydrates
  domain status for `SERVICE_REQUEST`, `TECHNICAL_ISSUE`, `WATCH`, and
  `PAYMENT` before moving bindings.

Carryover still moves bindings/items, not whole Workspaces. The current guard
prevents configured terminal domain objects from being moved into the current
cycle.

## Blueprint Snapshot Metadata Slice

Implemented in code:

- `WorkspaceKind` is now a shared runtime type.
- New operation-created Workspace snapshots include:
  - `workspaceKind`
  - `operationWorkspaceRole`
  - `coreFlowKey`
  - `flowStageKey`
  - `flowStageOrder`
- The creation plan exposes the same metadata for each planned Workspace.
- Existing Workspaces remain backward-compatible:
  - metadata is read from `blueprintSnapshot` when present;
  - plain note lines are used as fallback;
  - old rows can still fall back to `blueprint.key` for stage matching.
- The Coordination Space UI now filters/sorts active `FLOW_STAGE_WORKSPACE`
  mode rows by `flowStageKey` first, not only by `blueprint.key`.

Not implemented yet:

- The Operation Model editor does not yet expose `workspaceKind` as an explicit
  editable field on each role.
- Validation does not yet warn when a flow-stage role is missing matching Space
  view config.
- Existing Workspace snapshots are not migrated.

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
