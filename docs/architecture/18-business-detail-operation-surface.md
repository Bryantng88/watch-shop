# Business Detail Operation Surface

This document sets the UI and architecture rule for rebuilding business detail
screens such as Watch detail, ServiceRequest detail, Shipment detail, Order
detail, or future operational workbenches.

The goal is to let each business object have a strong, unified detail surface
without coupling it to Workspace modal lifecycle, TaskItem execution, or a
single domain-specific edit page.

## Core Principle

A business detail page may be an operational workbench, but it must not become
the only owner of an operation flow.

Operation UI should be split into:

- a reusable operation block;
- one or more containers that own data loading, save behavior, events,
  projection refresh, and lifecycle.

The block is shared. The container is surface-specific.

## Operation Block

An operation block is UI for one business capability.

Examples:

- `PriceBlock`;
- `SpecBlock`;
- `ContentBlock`;
- `ImageBlock`;
- `ServiceBlock`;
- `TradeHistoryBlock`.

An operation block should:

- render fields, statuses, warnings, preview data, and local interaction state;
- expose callbacks such as save, submit, approve, open media, or reset;
- stay usable in page, modal, or workspace contexts;
- avoid reading routes, Workspace ids, TaskItem ids, or global workflow state
  directly;
- avoid deciding whether an action is a direct domain write, a Workspace action,
  a review action, or a projection repair.

The block may know the language of the operation. It should not own the
business surface lifecycle.

## Container

A container owns the operational context.

Examples:

```text
PriceBlock
  <- WatchPriceContainer
  <- WorkspacePriceContainer
  <- ServiceRequestPriceContainer
```

The container decides:

- where data is loaded from;
- which business object is being edited;
- whether the save is a direct domain mutation or a Workspace/TaskItem action;
- which events are emitted;
- which projection/read model must refresh;
- whether the UI is a full page, drawer, modal, workspace panel, or review flow;
- how dirty state, optimistic state, app loading, toasts, and navigation are
  handled.

Containers must be allowed to differ even when they render the same block.

## Watch Workbench Rule

The Watch detail replacement should be treated as a Watch Workbench.

It can combine the main Watch operations into one page:

- price;
- spec;
- content;
- images;
- transaction history;
- service history.

However, this page must not replace or break existing Workspace flows.

Watch Workbench must not expose Workspace review actions.

Do not put these actions on the Watch Workbench:

- submit for review;
- approve;
- reject;
- request changes;
- complete Workspace step;
- advance workflow stage.

Those actions belong only to Workspace-aware containers because they require
TaskItem execution, review state, workflow ownership, workspace snapshot, and
event binding context.

Watch Workbench actions should be direct Watch operation actions only, such as:

- save price;
- save spec;
- save content draft;
- save images;
- open related Workspace;
- open storefront;
- refresh projection status.

### Price Permission Rule

The Price operation has field-level permission requirements.

Only Admin users may see or edit sensitive commercial fields:

- acquisition purchase price;
- purchase cost / landed cost internals;
- payment OUT cost ledger amounts;
- margin;
- sale price input/editing;
- min price or pricing guardrails if they reveal cost strategy.

Non-Admin users may still use the Workbench and see the rest of the Watch
surface:

- identity and spec;
- content;
- images;
- media readiness;
- service status;
- transaction/service history with sensitive amounts hidden;
- projection health/status without cost values.

Do not hide the entire Watch Workbench from non-Admin users. Gate the sensitive
price fields and price write actions instead.

Containers own this permission filtering. Operation blocks may receive
`canViewSensitivePrice` / `canEditPrice` style props, but they should not query
auth/session state directly.

## Maintainable Implementation Rule

Do not implement a Workbench as one large file.

The Workbench should be split so each concern can be tested, debugged, and
reused independently.

Recommended shape:

```text
src/domains/watch/client/workbench/
  WatchWorkbenchClient.tsx
  WatchWorkbenchHeader.tsx
  WatchWorkbenchNav.tsx
  WatchWorkbenchDirtyBar.tsx
  types.ts

src/domains/watch/ui/operations/
  price/
    PriceBlock.tsx
    PriceLedgerTable.tsx
    PricePermissionNotice.tsx
    price-block.types.ts
  spec/
    SpecBlock.tsx
    SpecFieldGrid.tsx
  content/
    ContentBlock.tsx
    ContentEventStrip.tsx
  images/
    ImageBlock.tsx
    ImageAssetTable.tsx

src/domains/watch/server/workbench/
  watch-workbench.service.ts
  watch-financial-rollup.service.ts
  watch-workbench.permissions.ts
```

Guidelines:

- page files load data and render the top-level container only;
- the Workbench container coordinates state, dirty tracking, and save commands;
- operation blocks render one operation and stay below roughly one screen of
  responsibility;
- tables, strips, field grids, and permission notices become child components;
- financial rollup, history loading, and permission decisions stay in server
  services/facades, not inside React components;
- event emission is handled by domain application/server actions, not UI
  children;
- shared blocks must accept explicit props instead of importing route/session/
  Workspace state directly.

If a component starts mixing two operation concerns, split it before adding more
behavior.

Direct does not mean silent.

When a Workbench action changes business truth, it must emit the proper
Business Event so downstream consumers can react through the normal event
pipeline.

Examples:

- saving price should emit the approved Watch price/pricing event;
- saving spec should emit the approved Watch spec event;
- saving content draft or published content should emit the approved Watch
  content event;
- saving images should emit the approved Watch media/image event;
- creating a Watch from acquisition must emit `watch.created`.

The Workbench should not directly call projection builders, create Workspace
items, advance workflow, or write Timeline/Notification state. It should mutate
the owning domain, emit the canonical event, and let consumers update
Projection, Workspace, Timeline, Notification, and other downstream read models.

In particular, Media Workspace currently owns modalized handling for its
operation actions. Watch Workbench may use similar visual language, but it must
not take over Media Workspace modal state, review actions, TaskItem execution,
or workflow close behavior.

Safe first shape:

```text
/admin/watches/[id]
  WatchWorkbenchContainer
    PriceBlock
    SpecBlock
    ContentBlock
    ImageBlock
    TradeHistoryBlock
    ServiceBlock

Media Workspace modal
  Existing media container and modal lifecycle
    Existing media operation UI
```

If shared components are extracted later, extract the block first and keep the
containers separate.

## Future Workspace Rule

If a future Price Workspace exists, it should not reuse `WatchPriceContainer`.
It should introduce its own Workspace-aware container.

Example:

```text
PriceBlock
  WatchPriceContainer
    direct Watch operation surface

  PriceWorkspaceContainer
    Workspace/TaskItem execution surface
    review, approve, workflow, snapshot, and event binding lifecycle
```

This keeps the operation vocabulary consistent while preserving Workspace as a
collaboration surface.

## Projection And Read Model Rule

Operation blocks may display projection status, but they should not silently
invent projection truth.

When a block depends on derived data, the container must define the read-model
contract explicitly.

For example, Watch price work should distinguish:

- direct Watch price fields;
- acquisition cost;
- service payment out;
- shipment payment out;
- other watch-linked payment out;
- computed landed cost;
- sale price and margin;
- projection sync state.

If Watch List projection does not contain the needed rollup, the Workbench
container may load a dedicated financial rollup first. The list projection can
then be extended deliberately once the contract is stable.

Projection updates must come from events/consumers, not from UI blocks. If a
projection row needs to change after a Workbench save, verify that:

- the domain action emits the canonical Business Event;
- the event payload contains enough target identity for consumers to resolve the
  affected business object;
- the relevant consumer subscribes to that event;
- replay/repair can rebuild the same projection state without UI involvement.

## Anti-Patterns

Avoid:

- making one detail page the global owner of every operation flow;
- putting Workspace review actions such as submit, approve, reject, or complete
  on a business Workbench;
- reusing a page container inside a Workspace modal;
- letting a shared block read Workspace, TaskItem, route, or workflow state
  directly;
- changing Media Workspace modal lifecycle while rebuilding Watch detail;
- mixing projection repair behavior into a visual block;
- updating projection/read models directly from Workbench UI save handlers
  instead of emitting a Business Event;
- creating domain changes that have no event for downstream consumers;
- adding hidden cross-domain writes from a business detail page.

## Decision

For future business detail rebuilds, keep this split:

```text
Business detail or Workspace surface
-> surface-specific container
-> reusable operation block
-> explicit domain write / event / projection contract
```

The UI can look unified. The lifecycle must remain owned by the correct
surface.
