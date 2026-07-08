# Event-Driven Domain Boundary

This is the implementation north star for new Space Management work.

Business domains create business truth and emit events. Space Management,
Workflow, Timeline, Notification, Projection, and other collaboration concerns
react to those events through explicit consumers.

This document turns the current Watch Media event work into a reusable
architecture rule for future domains such as Order, Service, Shipment,
Inventory, and Marketing.

Watch Media is only the first concrete example. The rule in this document is
global: every domain, Workspace, workflow, projection, and consumer should use
the same ownership boundaries unless a later architecture decision explicitly
replaces them.

## Canonical Flow

```text
Business Domain action
-> mutate or confirm business truth if needed
-> emit Business Event
-> validate event contract
-> persist BusinessEventLog
-> dispatch event
-> resolve consumer registry
-> run allowed event consumers
-> apply Workspace/Workflow/Timeline/Notification/Projection side effects
```

Current implementation shape:

```text
recordBusinessEvent()
-> validateBusinessEventInput()
-> businessEventLog.upsert()
-> dispatchBusinessEvent()
-> listBusinessEventConsumers()
-> workflow / coordination / notification / timeline
```

## Core Rule

Business Domain code must not directly orchestrate Space Management side
effects.

A Business Domain may:

- own and mutate its own aggregate;
- validate domain-specific commands;
- emit a Business Event after a meaningful business fact exists;
- include lightweight event payload data needed by downstream consumers;
- expose domain pages, APIs, and domain-specific reports.

A Business Domain must not directly:

- choose or create Workspace records;
- write Timeline or Activity projection records;
- send Notification dispatches;
- update Projection read models;
- coordinate cross-domain handoff flows;
- pass Workspace ids through domain APIs as routing state.

If a domain action needs collaboration behavior, it emits an event. Consumers
decide what collaboration behavior follows.

## Universal Domain / Workspace / Workflow Rule

Every feature should classify a user action before choosing the implementation
path.

### Domain Data Write

Use this path when the user changes business truth owned by one domain.

Examples:

- editing Watch specs, content, images, or status;
- creating an Order;
- updating Service diagnosis;
- changing Shipment tracking data;
- editing Inventory quantity.

Path:

```text
UI / Workspace / List
-> Application command
-> Owning Business Domain service
-> Domain validation
-> Domain write
-> optional Business Event if the change is a meaningful business fact
```

Rules:

- This may call the owning domain service directly.
- Do not force every field edit through an event.
- Emit an event only when other collaboration concerns need to react.
- Workspace context may pass actor/note/source metadata, but it does not own
  the domain write.

### Business Milestone

Use this path when a meaningful fact should be visible to Space Management or
other consumers.

Examples:

- Watch media is ready for publish;
- Photoshoot is completed;
- Order is created;
- Service request is accepted;
- Shipment is delayed.

Path:

```text
Owning Business Domain command/service
-> Domain write if needed
-> Business Event
-> Dispatcher
-> Consumer Registry
-> allowed consumers
```

Rules:

- The event announces the fact; it does not replace the domain write.
- The event payload should be lightweight and contractual.
- Consumers react; the producer does not call their side effects directly.

### Workspace Workflow Transition

Use this path when the user changes the collaboration state of an Item inside a
Workspace.

Examples:

- mark Photoshoot item done;
- approve Media Processing item;
- recall Publish item;
- move an Order follow-up from waiting to done;
- return a Service task for feedback.

Path:

```text
UI / Workspace action
-> apply Workspace workflow transition
-> Workspace Workflow Processor
-> focused domain/effect services when needed
-> Business Event if the transition creates a meaningful business fact
```

Rules:

- Workspace Workflow Processor owns orchestration decisions only.
- It may call focused services, but it should not absorb their CRUD.
- If the transition changes business truth, the focused service must belong to
  the owning Business Domain.
- If the transition only changes collaboration state, it stays in the
  Workspace/Item workflow layer.

### Read Model / Projection

Use this path when the system needs fast list/search/filter/dashboard reads.

Examples:

- Watch list projection;
- Media queue projection;
- Order work queue projection;
- Service dashboard projection.

Path:

```text
Source data / Business Event
-> Projection builder or Projection consumer
-> Projection read model
-> UI list/search/filter
```

Rules:

- Projection is a read model, not a write model.
- UI may start commands from projection rows.
- Commands must validate current truth in the owning Business Domain before
  writing.

## Decision Matrix

```text
Question                                      Owner / Path
--------------------------------------------  -------------------------------
Does this edit business truth?                Owning Business Domain service
Should other concerns react to this fact?     Business Event
Does this change Workspace Item state?        Workspace Workflow Processor
Is this only list/search/filter data?         Projection
Is this Activity/Timeline display?            Timeline/Activity consumer
Is this notification delivery?                Notification consumer/service
Is this Space/Workspace/Item binding?         Coordination consumer/service
```

If one action includes several rows in the matrix, split the operation by
ownership instead of putting all logic in UI, a consumer, or a single service.

## Ownership Boundaries

### Business Domain

Owns business truth.

Examples:

- Watch fields, media readiness, sale status, product content.
- Order payment, fulfillment, and customer state.
- Service intake, diagnosis, and resolution.

Business Domain actions may write domain data before emitting an event. The
event does not replace the business write. It announces that a meaningful
business fact happened.

### Business Event Contract

Owns the public event shape.

The contract defines:

- event key;
- target type;
- target id;
- payload shape;
- stable aliases;
- allowed consumers;
- versioning expectations.

New event keys should come from the event catalog or registry APIs, not ad hoc
strings added in business logic.

### BusinessEventLog

Persists the latest recorded event state for dispatch and traceability.

Rules:

- The log is not a replacement for a full event store yet.
- `eventInstanceId` / `sourceId` identify a concrete occurrence where repeated
  events must be distinguishable.
- `idempotencyKey` is part of the dispatch contract so consumers can avoid
  duplicate side effects.
- Do not add append-only event-store semantics without an explicit migration
  plan.

### Dispatcher

Owns generic dispatch mechanics only.

The dispatcher may:

- build and pass dispatch context;
- run ordered consumers before parallel consumers;
- apply timeout policy;
- apply retry policy when explicitly configured;
- normalize consumer result status;
- log skipped, failed, and timed-out consumers.

The dispatcher must not:

- know Watch, Order, Task, Notification, or Workspace business rules;
- decide domain-specific meaning;
- create Workspace items by itself;
- send notifications by itself;
- build projections by itself.

Generic result statuses are:

```text
success
skipped
failed
timeout
```

### Consumer Registry

Owns concrete consumer wiring.

The registry is the only event layer that imports concrete consumers such as
Workflow, Coordination, Notification, Timeline, and Projection consumers.

Adding or removing a consumer should not require changing dispatcher logic.

### Event Consumers

Own side effects for one collaboration concern.

Consumer examples:

- `coordination`: ensure Space/Workspace and create or update Items.
- `workflow`: apply Workspace workflow transitions.
- `timeline`: project Activity and Timeline entries.
- `notification`: create notification dispatches.
- `projection`: build or update read models.

Consumer rules:

- Consumers react to events; they do not own the source business aggregate.
- Consumers should be idempotent for repeated event instances.
- Consumers should return clear `success`, `skipped`, `failed`, or `timeout`
  results.
- Consumer-specific side effects stay inside the consumer or the service it
  owns.
- A consumer failure must not hide the status of other consumers.

## Workflow Boundary

Workflow belongs to Workspace, not to Business Domain.

Business Events are triggers. They are not the whole workflow model.

```text
Business Event
-> Workspace Workflow Processor
-> workflow transition / next state / side effect plan
```

The Workspace Workflow Processor may orchestrate collaboration behavior, but it
must not become a God service. It should call focused services and return a
clear result.

Recommended result shape:

```ts
type WorkspaceWorkflowProcessorResult = {
  status: "applied" | "skipped" | "failed";
  reason?: string;
  nextState?: string;
  effects?: Array<{
    type: "workspace" | "timeline" | "notification" | "projection";
    status: "applied" | "skipped" | "failed";
    reason?: string;
  }>;
  warnings?: string[];
};
```

Rules:

- Domain does not execute Workspace workflow transitions directly.
- Workflow orchestration should not contain heavy CRUD implementation details.
- Workflow state belongs to Item runtime inside a Workspace.
- Workflow definitions belong to Workspace Template or Blueprint-owned
  configuration.
- Manual, event, and time triggers may all activate workflow, but the trigger
  does not own the workflow.

## Projection Boundary

Projection is a read model only.

Projection may:

- denormalize fields for list, search, filter, or dashboard reads;
- be rebuilt from source domain data and events;
- carry version/build metadata;
- be compared with old query paths during rollout.

Projection must not:

- become a second write model;
- mutate business truth;
- dispatch notifications;
- apply workflow transitions;
- copy entire domain aggregates without a read use case.

Projection updates should happen through projection builders or projection
consumers, not directly inside Business Domain actions.

Projection observability and repair are operational tools for the read model
only. A repair may rebuild `ProjectionRecord` rows from source data, but it must
not replay notifications, apply workflow transitions, or mutate business truth.

Current framework:

- `src/domains/projection/server/projection.types.ts`
- `src/domains/projection/server/projection-record.repo.ts`
- `src/domains/projection/server/projection.registry.ts`
- `src/domains/projection/server/projection.runner.ts`
- `src/domains/projection/server/projection-event-consumer.ts`
- `src/domains/projection/server/projection-observability.service.ts`
- `src/app/api/admin/system/projections/route.ts`
- `src/domains/projection/server/watch-media-queue.projection.ts`
- `src/domains/projection/server/watch-list/`

Sprint 54 enabled the projection consumer in the default dispatcher after adding
the first accepted concrete builder: `watch-media-queue`.

Sprint 55 added the second concrete builder: `watch-list`.

Sprint 56 added internal projection status, compare, and repair entry points.

## List And Action Surface

Projection/List pages may be the place where a user starts work. They are not
the owner of business truth.

Example:

```text
User opens Watch List projection
-> selects a Watch
-> chooses an action such as request photoshoot or create order
-> application command validates source truth in the owning Business Domain
-> Business Domain writes business state if needed
-> Business Domain emits a Business Event
-> event consumers handle collaboration side effects
```

Rules:

- Projection can be the read source for list/search/filter UI.
- Projection must not be the write source of truth.
- A list action must call a command owned by the correct Business Domain or
  application boundary.
- Workspace Workflow Processor only handles collaboration workflow after a
  meaningful command/event exists.
- Creating an Order from Watch belongs to Order command/domain behavior first;
  Workspace workflow may react to the resulting Order event later.
- Before a legacy list UI fully cuts over to projection, review and reduce the
  UI contract. Do not copy old UI-only fields or client-side business logic
  into projection just because they existed in the previous query shape.

## Watch Media Reference Flow

Watch Media is the first reference implementation of the global rule above.
It is an example, not a special architecture.

```text
Watch action
-> emit watch.media.* Business Event
-> validate event contract
-> persist BusinessEventLog
-> dispatch
-> coordination creates/updates Workspace Item
-> workflow applies Workspace state
-> timeline projects Activity
-> notification dispatches if a rule exists
-> projection updates read model when projection exists
```

Rules proven by Watch Media:

- Watch owns Watch data.
- Space Management owns Workspace/Item collaboration context.
- Workflow owns Item workflow state and next action.
- Timeline owns Activity projection.
- Notification owns dispatch state.
- Projection owns read model performance.

Future domains should follow the same shape instead of calling Space
Management services directly from domain actions.

## Anti-Patterns

Avoid these patterns in new code:

- `Watch -> create Workspace item` directly from Watch domain code.
- `Order -> send Notification` directly from Order domain code.
- `Service -> write Timeline` directly from Service domain code.
- UI action mutates a domain and then manually updates several collaboration
  tables.
- Dispatcher contains `if eventKey startsWith("watch.")` business logic.
- Consumer registry becomes an orchestration service.
- Workflow Processor contains all CRUD and all domain rules.
- Projection becomes the source of truth for business state.
- Event payload copies an entire domain aggregate without a read reason.

If one of these appears necessary, first ask whether the missing concept is:

- a Business Event contract;
- a Workspace workflow rule;
- a consumer;
- a projection;
- an idempotency rule;
- a dedicated domain service that should remain inside the Business Domain.

## Current Code Pointers

Event architecture:

- `src/domains/event/contract`
- `src/domains/event/catalog`
- `src/domains/event/registry`
- `src/domains/event/validator`
- `src/domains/event/emitter`
- `src/domains/event/dispatcher`
- `src/domains/event/server`
- `src/domains/event/audit`

Current dispatch path:

- `src/domains/event/server/business-event.service.ts`
- `src/domains/event/dispatcher/business-event-dispatcher.ts`
- `src/domains/event/dispatcher/business-event-consumers.registry.ts`
- `src/domains/event/dispatcher/business-event-consumer.types.ts`

Current consumers:

- `src/domains/workflow/server/workflow-event-consumer.ts`
- `src/domains/coordination/server/coordination-event-consumer.ts`
- `src/domains/shared/timeline/server/timeline-event-consumer.ts`
- `src/domains/notification/server/notification-event-consumer.ts`

## Engineering Checklist

Before adding a new cross-domain behavior, answer:

1. What Business Domain owns the truth?
2. What exact Business Event announces the fact?
3. Is the event contract/catalog updated?
4. Which consumers are allowed to react?
5. Does each consumer own only one collaboration concern?
6. Is the behavior idempotent for repeated event instances?
7. Does the dispatcher remain consumer-agnostic?
8. Is workflow orchestration separate from domain CRUD?
9. Is projection read-only and rebuildable?
10. Is there a fallback or verification path if changing a hot flow?

If the answer is unclear, document the boundary before coding.

## Relationship To Other Docs

This doc refines the principles from:

- `docs/product/business-collaboration-platform.md`
- `docs/architecture/00-vision.md`
- `docs/architecture/03-business-event-consumers.md`
- `docs/architecture/06-item-runtime-contract.md`
- `docs/sprints/SM-Sprint-51-event-architecture-and-workspace-flow-handoff.md`

Those docs explain the product model and earlier sprint work. This document is
the architecture guardrail for new implementation.
