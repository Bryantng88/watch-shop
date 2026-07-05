# SM Sprint 39: Watch Business Event Producer Contract V1

Date: 2026-07-04

Status: Implemented

## Mission

Standardize how the Watch domain emits Business Events before changing
consumer binding, auto-binding scope, or Blueprint Event Binding.

M2 north star:

```text
Watch -> Business Event -> Space/Workspace -> Item Workflow -> Timeline -> Blueprint ownership.
```

Sprint 39 covers only:

```text
Watch -> Business Event
```

## Implemented

- Added a Watch Business Event Contract.
- Added a typed Watch Business Event Emitter.
- Refactored Watch review emit points to use the emitter.
- Refactored Watch content modified emit point to use the emitter.
- Connected Watch event definitions to the global Business Event Catalog.
- Added read-only diagnostic fields to the existing BusinessEvent catalog view.

## Watch Event Contract

Each Watch event now carries:

- `eventKey`
- `status`
- `businessMeaning`
- `producer`
- `emitPoint`
- `targetIdPolicy`
- `targetAliasPolicy`
- `payloadContract`
- `knownConsumers`
- `autoBindingScope`

## Active Producer Events

Active Watch events with producer coverage:

- `watch.content.submitted`
- `watch.content.approved`
- `watch.content.rejected`
- `watch.content.unapproved`
- `watch.image.submitted`
- `watch.image.approved`
- `watch.image.rejected`
- `watch.image.unapproved`
- `watch.content.modified`

Draft Watch events kept for future producer work:

- `watch.ready`
- `watch.saleStage.posted`
- `watch.sold`

## Target Policy

Review events:

```text
targetType = WATCH
targetId = watch.id
targetAliasIds = [watch.id, productId, sourceId]
```

Content modified event:

```text
targetType = WATCH
targetId = watch.id
targetAliasIds = [productId]
```

## Payload Contract

Review events use `WatchReviewEventPayload`.

Common fields:

- `watchId`
- `productId`
- `reviewTargetType`
- `sourceAction`
- `fromStatus`
- `toStatus`
- `sourceId`
- `eventInstanceId`
- `feedbackId`
- `feedbackMessage`
- `feedbackCreatedAt`
- `title`
- `sku`
- `preview`
- `businessStatus`

Content modified uses `WatchContentModifiedPayload`.

## Auto-Binding Scope Note

Sprint 39 does not change auto-binding behavior.

Current documented scope for Watch review events:

```text
current active media weekly workspace / publish item
```

This remains a contract note only. Sprint 40 and Sprint 41 will make consumer
binding and scope enforcement explicit.

## Files Changed

- `src/domains/watch/server/events/watch-business-event.contract.ts`
- `src/domains/watch/server/events/watch-business-event.emitter.ts`
- `src/domains/watch/server/events/index.ts`
- `src/domains/watch/server/review/watch-review.service.ts`
- `src/domains/watch/server/content/watch-content.service.ts`
- `src/domains/event/registry/business-event-registry.ts`
- `src/domains/event/server/business-event-catalog.service.ts`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`

## Validation

Targeted ESLint passed:

```text
src/domains/watch/server/events/watch-business-event.contract.ts
src/domains/watch/server/events/watch-business-event.emitter.ts
src/domains/watch/server/events/index.ts
src/domains/watch/server/review/watch-review.service.ts
src/domains/watch/server/content/watch-content.service.ts
src/domains/event/registry/business-event-registry.ts
src/domains/event/server/business-event-catalog.service.ts
src/domains/workflow-definition/client/WorkflowAdminClient.tsx
```

## Out Of Scope

- Order events.
- Service events.
- Blueprint Event Binding.
- Coordination Router redesign.
- Auto-binding runtime scope changes.
- Blueprint publish/versioning.
- Admin UI for creating events.

## Next Sprint

Sprint 40 should handle:

```text
Watch event consumer binding.
```

Questions for Sprint 40:

- Which Watch events are allowed to trigger timeline?
- Which Watch events are allowed to trigger coordination auto-binding?
- Which Watch events are allowed to trigger workflow transition?
- What skip reasons should be surfaced when a consumer does not run?
