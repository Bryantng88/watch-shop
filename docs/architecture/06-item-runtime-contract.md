# Item Runtime Contract

Sprint 26 defines the Item Runtime contract.

This is an architecture and runtime boundary document. It does not introduce a
new feature, UI, workflow engine, Prisma model, or business-domain behavior.

## Definition

Item Runtime is the read/runtime aggregation around one `Item`.

In product language:

`Item` = runtime persistence that links a Workspace to a business object.

`Item` = one business object currently placed inside one `Workspace`.

The Item Runtime answers:

- Which business object is in this Workspace?
- What lightweight business preview can be shown?
- What intake note explains why it was placed here?
- What workflow runtime state is currently attached to this Item?
- What activity feed belongs to this Item?
- What metadata is needed for routing, audit, and runtime coordination?

The Item Runtime does not own those concepts. It aggregates them.

## Runtime Model

```ts
type ItemRuntimeAggregate = {
  item: ItemRuntime;
  businessPreview: BusinessPreview | null;
  intakeNote: IntakeNote | null;
  workflowRuntime: WorkflowRuntimeState | null;
  activityFeed: ActivityFeedSummary;
  metadata: ItemRuntimeMetadata;
};
```

### ItemRuntime

The canonical runtime identity of an Item.

```ts
type ItemRuntime = {
  id: string;
  workspaceId: string;
  targetType: string;
  targetId: string;
  source: "AUTO" | "MANUAL";
  status: "WAITING" | "IN_PROGRESS" | "FEEDBACK" | "DONE";
  createdAt: Date;
  updatedAt: Date;
};
```

Rules:

- `targetId` must be the canonical business object id.
- Event occurrence ids, feedback ids, review log ids, or composite ids are not
  Item identity.
- One `Workspace` should not have multiple Items for the same canonical
  `targetType + targetId`.

### Business Preview

Lightweight display data copied from the event payload or resolved by a cheap
projection.

```ts
type BusinessPreview = {
  title?: string | null;
  ref?: string | null;
  subtitle?: string | null;
  status?: string | null;
  imageUrl?: string | null;
  imageUrls?: string[];
  href?: string | null;
};
```

Rules:

- Preview must be lightweight.
- Preview should avoid hydrating the full business aggregate.
- For Watch, preview may include SKU/ref and one image.
- For Order, preview may include stacked item images where the first watch is
  the lead image.
- Missing preview must not block Item Runtime.

### Intake Note

The intake note explains why or how the business object entered the Workspace.

```ts
type IntakeNote = {
  source: "AUTO" | "MANUAL";
  note?: string | null;
  createdByUserId?: string | null;
  businessEventLogId?: string | null;
  sourceId?: string | null;
  createdAt: Date;
};
```

Rules:

- AUTO intake is created from BusinessEvent/Space Management routing.
- MANUAL intake is created by a user adding a business object to a `Workspace`.
- Intake note does not replace Activity.
- Intake note should be short and structured enough to audit intake source.

### Workflow Runtime

Workflow runtime is the current workflow state attached to the Item.

```ts
type WorkflowRuntimeState = {
  workflowKey: string;
  currentState: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
};
```

Rules:

- Workflow Definition belongs to WorkspaceTemplate.
- Workflow Runtime belongs to Item.
- Item Runtime may expose workflow runtime, but does not own workflow
  definitions or transition rules.
- Event/manual/time transitions are workflow runtime concerns, not business
  domain concerns.

### Activity Feed

Activity Feed is the conversation context around the Item.

```ts
type ActivityFeedSummary = {
  latestActivityTitle?: string | null;
  activityCount: number;
  feedbackCount: number;
  hasUnread?: boolean;
};
```

Detailed read:

```ts
type ActivityFeed = {
  activities: WorkspaceActivity[];
};
```

Rules:

- Item Runtime may summarize Activity.
- Item Runtime does not own Activity.
- Discussion belong to Activity.
- Item summary APIs must not load Discussion unless explicitly requested.

### Metadata

Item metadata stores runtime glue only.

```ts
type ItemRuntimeMetadata = {
  aliasIds?: string[];
  lastBusinessEventLogId?: string;
  lastTriggerType?: "EVENT" | "MANUAL" | "TIME" | "CONDITION" | "WEBHOOK" | "CUSTOM";
  lastTriggerValue?: string;
  sourceAction?: string;
  sourceId?: string;
  workflowRuntime?: WorkflowRuntimeState;
  [key: string]: unknown;
};
```

Rules:

- Metadata may store event ids, alias ids, source ids, preview hints, and
  workflow runtime.
- Metadata must not become a hidden business object.
- Metadata must not duplicate full business domain state.

## What Item Runtime Includes

Item Runtime includes:

- Item identity and status.
- Canonical business target reference.
- Lightweight business preview.
- Intake note/source context.
- Workflow runtime pointer/state.
- Activity summary and optional activity feed.
- Runtime metadata needed for idempotency, routing, and display.

## What Item Runtime Does Not Include

Item Runtime does not include:

- Full Watch, Order, Service, or other business aggregates.
- Business-domain write behavior.
- Workflow Definition ownership.
- Workflow Engine ownership.
- Activity ownership.
- Notification ownership.
- Permission model ownership.
- UI layout concerns.

## Runtime API

The Item Runtime API is layered.

```text
Item Runtime
  -> Business Preview
  -> Workflow Runtime
  -> Activity Feed
  -> Discussion
```

### Summary API

Used by coordination dashboards and task item lists.

```ts
summarizeWorkspaceItems(workspaceId): {
  WAITING: number;
  IN_PROGRESS: number;
  FEEDBACK: number;
  DONE: number;
  total: number;
}
```

Rules:

- Aggregation only.
- No business hydration.
- No Discussion.
- No heavy includes.

### List API

Used by the Items tab.

```ts
listWorkspaceItems(workspaceId): ItemViewModel[]
```

Rules:

- Return Item runtime state.
- Include lightweight preview if available.
- Include workflow runtime labels if already resolvable.
- Include activity counts and latest activity title.
- Do not load activity Discussion.
- Do not hydrate full business aggregates.

### Detail API

Used only when a user opens one Item detail in the future.

```ts
getItemRuntime(itemId): ItemRuntimeAggregate
```

Rules:

- May include activity feed.
- Discussion remain a separate nested read.
- Business detail must be loaded through the business domain route/page, not
  owned by Item Runtime.

### Discussion API

Used only inside an Activity conversation.

```ts
listActivityDiscussion(activityId): WorkspaceActivityDiscussion[]
```

Rules:

- Discussion are Activity-owned.
- Item Runtime may link to them through Activity.
- Item summary/list must not fetch Discussion.

## Ownership

```text
Business Domain
  owns business aggregate and emits BusinessEvent

Workflow Definition
  owns workflow definition for a WorkspaceTemplate

Workflow Runtime
  owns current workflow state on an Item

Activity
  owns conversation units and Discussion

Item Runtime
  aggregates Business Preview, Workflow Runtime, Activity Summary, and Metadata
```

Item Runtime does not own Business.

Item Runtime does not own Workflow Definition.

Item Runtime does not own Activity.

Item Runtime only aggregates.

## Diagram

```text
Business Domain
  |
  | emits BusinessEvent
  v
Space Management Router
  |
  | resolves Space + WorkspaceTemplate
  v
Workspace
  |
  | has many
  v
Item
  |
  | aggregates at runtime
  +--> Business Preview
  |
  +--> Intake Note
  |
  +--> Workflow Runtime
  |      |
  |      +--> Workflow Definition by workflowKey
  |
  +--> Activity Feed
  |      |
  |      +--> Discussion
  |
  +--> Metadata
```

## Status Rules

Item `status` is a read/runtime summary.

Recommended V1 derivation:

- `DONE`: workflow runtime is terminal.
- `FEEDBACK`: workflow runtime or latest business event indicates feedback or
  rejection.
- `IN_PROGRESS`: there is activity, a submitted/review state, or partial
  workflow progress.
- `WAITING`: fallback when no work has started.

Rules:

- `approved` does not always mean `DONE`.
- Domain-specific completion, such as Publish requiring both content and image
  approved, must be derived by workflow runtime rules.
- Item status must remain a summary, not a separate source of truth.

## Performance Contract

Summary:

- Use aggregation.
- Avoid includes.
- Do not load Discussion.
- Do not hydrate business aggregates.

List:

- Use projection.
- Load preview only through event payload, Item metadata, or cheap target
  projection.
- Batch preview lookups by target type when needed.
- Avoid N+1.

Detail:

- Load only the selected Item.
- Activity feed is allowed.
- Discussion are explicit nested reads.

## Future Extension

Possible future extensions:

- Persisted `Item` Prisma model if `TaskExecution` is eventually renamed.
- Dedicated `ItemIntake` record if manual intake grows beyond metadata.
- Business preview cache maintained from BusinessEvent payload.
- Item permission layer for owner/share visibility.
- Item Runtime detail page.
- Activity unread markers by participant.
- Workflow history model.
- Item metrics by WorkspaceTemplate and Space context.

These extensions must keep the same boundary:

Item Runtime aggregates. It does not become Business, Workflow Definition, or
Activity.
