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
| Payment | Payment Collection contract has Inbox -> Review -> Settled / Exception core flow | `FLOW_STAGE_WORKSPACE`, row model `FLOW_STAGE_WORKSPACE`; `PAYMENT` remains Item | published Payment runtime Spaces are connected; `mark_payment_paid` adapter is wired, while review/exception remain declared-only until domain truth exists |
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
4. Extend Operational Blueprint workspace roles with `workspaceKind`. Implemented
   as an optional contract/editor field; older contracts still derive it during
   snapshot creation.
5. Add flow-stage metadata for `FLOW_STAGE_WORKSPACE` roles:
   `coreFlowKey`, `flowStageKey`, and `flowStageOrder`. Implemented for new
   operation-created Workspace snapshots.
6. Extend Blueprint validation with warnings for missing Workspace kind,
   case-workspace identity gaps, flow-stage kind mismatches, and missing
   flow-stage Space view modes when a core flow has stage Workspaces.
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
- Media dashboard queue counts now use the flow-stage contract for the first
  runtime proof: Media Space rows count the current active `WATCH` binding only,
  exclude cancelled bindings, and exclude item-runtime terminal bindings while
  allowing final-stage DONE to remain in Publish. Terminal Watch targets are
  excluded using the configured `WATCH` terminal states except when that target
  is still owned by the final Publish workspace.
  Historical Media events remain in activity/timeline rows; flow-stage queue
  rows are current ownership, not cumulative milestone history.
  Media dashboard load also normalizes legacy duplicate `WATCH` bindings across
  Photography, Media Processing, and Publish: DONE/RETURNED/RECALLED states are
  treated as stage transition signals, while the remaining active binding is the
  stage ownership source of truth. Final-stage DONE remains in the final
  workspace because no later stage can own the item. Orphaned Publish DONE
  bindings from the previous cleanup rule are restored to Publish on dashboard
  load when the Watch is not already owned by another Media stage.
  The Media Processing projection and fallback read path exclude DONE queue
  items. RETURNED remains visible as IN_PROGRESS while the item still belongs to
  Media Processing, and is cleared only after ownership really moves back to
  Photoshoot.
- Payment dashboard queue counts follow the same flow-stage ownership contract:
  Payment Space rows count the current active `PAYMENT` binding only and exclude
  terminal payments using the configured `PAYMENT` terminal states.
- Payment Collection runtime intake is wired for the weekly Payment Space:
  the Space opens `PAYMENT_INBOX`, `PAYMENT_REVIEW`, and `PAYMENT_SETTLED`
  flow-stage Workspaces, `payment.created`, `payment.status_updated`, and
  `payment.paid` are active coordination routes, and progress events move the
  active `PAYMENT` binding between stage Workspaces. `payment.paid` is emitted
  after `payment.status_updated` when Payment is completed so the Settled stage
  has a dedicated event.
- Payment Collection action execution has a first adapter slice:
  `mark_payment_paid` dispatches through `payment-operation-action-adapter` and
  delegates to the Payment domain `completePayment` command. `review_payment`
  and `mark_payment_exception` stay declared-only because `PaymentStatus` does
  not currently model review/exception states.
- Technical dashboard queue counts now use the Service composite contract:
  - legacy `serviceOperationWorkspaceRole: SR_CASE` is treated as
    `CASE_WORKSPACE`;
  - SR Case rows remain identity-bound workspaces and show their Service
    Request/watch identity preview;
  - legacy `INSPECT`, `PROCESSING`, and `DONE` roles are treated as
    `FLOW_STAGE_WORKSPACE` rows with matching `flowStageKey`;
  - SR Case rows count active TechnicalIssues for the ServiceRequest plus
    service payment rows attached to those TechnicalIssues;
  - Technical Bench rows count active unfinished `TECHNICAL_ISSUE` bindings
    only, excluding cancelled bindings, item-runtime terminal bindings, and
    terminal TechnicalIssues using the configured `TECHNICAL_ISSUE` states.
- The Coordination Space UI now normalizes flow-stage keys and accepts both
  `stage.key` and `stage.workspaceKey` so new snapshot metadata and legacy
  `blueprint.key` rows can render in the same Media Production Flow.
- The Space view UI now presents the selected mode as a compact operator
  control with stage chips; render/carryover contract details are collapsed
  under `Rules` instead of occupying the main working surface.
- The Coordination Space screen now follows the operator-oriented layout proof:
  header actions are surfaced at the top, Blueprint/auto-binding/carryover are
  grouped into a summary card, and Workspace rows use stage icons, table
  headers, attention badges, activity cues, and item progress bars.

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
- Operation Model authoring now exposes `workspaceKind` on Workspace roles.
- Operational Blueprint validation now warns when:
  - a Workspace role has no explicit `workspaceKind`;
  - a single-cycle core-flow role is not `FLOW_STAGE_WORKSPACE`;
  - a one-business-object role is not `CASE_WORKSPACE`;
  - a `CASE_WORKSPACE` role lacks `identityTargetType`;
  - a core flow with stage Workspaces lacks a matching
    `FLOW_STAGE_WORKSPACE` Space view mode.
- Service Operation and Payment Collection registry templates now declare
  `workspaceKind` and `spaceViewModes` so they validate cleanly under the
  taxonomy guardrails.

Not implemented yet:

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
