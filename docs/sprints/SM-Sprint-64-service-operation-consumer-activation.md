# SM Sprint 64 - Service Operation Consumer Activation

## Status

Implemented first slice.

Sprint 64 activates the minimal Service Operation event consumer path for
TechnicalIssue workflow events.

The activation follows the M2 architecture:

```text
Service Domain action
-> Business Event
-> Dispatcher
-> Coordination Consumer
-> Blueprint receiver / workspace binding
-> Queue item workflow event transition
```

This sprint does not start ProjectionRecord Service Operation reads.

## Scope

Activate only TechnicalIssue events that already have producers and workflow
transitions:

- `technical_issue.created`
- `technical_issue.confirmed`
- `technical_issue.started`
- `technical_issue.completed`

Keep these out of scope:

- `service_request.created`
- `service_request.status_changed`
- `technical_issue.reopened`
- `payment.created`
- `payment.status_updated`

Those events remain timeline-only or draft until their ownership and receiver
behavior are validated explicitly.

## Implemented

### 1. Event catalog consumer allow-list

Changed:

- `src/domains/event/catalog/legacy-business-events.catalog.ts`

The four activated TechnicalIssue events now allow:

```text
timeline
coordination
```

`technical_issue.created` also declares the current active weekly technical
Service Operation auto-binding scope.

The standalone `workflow` consumer is intentionally not allowed for this first
slice because the coordination consumer already applies the queue-item workflow
event transition after binding.

### 2. Blueprint event binding activation

Changed:

- `src/domains/blueprint/shared/event-bindings.ts`

The Service Operation bindings for the four activated TechnicalIssue events are
now `ACTIVE`.

All other Service Operation bindings stay `DRAFT`.

### 3. Coordination route activation

Changed:

- `src/domains/coordination/server/coordination-router.registry.ts`

Registered TechnicalIssue routes to the current technical weekly Service
Operation work type:

```text
TECHNICAL_ISSUE + technical_issue.created   -> technical/service-operation
TECHNICAL_ISSUE + technical_issue.confirmed -> technical/service-operation
TECHNICAL_ISSUE + technical_issue.started   -> technical/service-operation
TECHNICAL_ISSUE + technical_issue.completed -> technical/service-operation
```

The route metadata keeps the receiver scope as:

```text
CURRENT_ACTIVE_WEEKLY_SPACE / TECHNICAL
```

## Expected Runtime Behavior

When a TechnicalIssue is created:

- Service domain writes business truth;
- Service domain records `technical_issue.created`;
- dispatcher allows the coordination consumer;
- coordination resolves the current technical weekly cycle;
- coordination resolves the Service Operation receiver from Blueprint snapshot;
- a `TECHNICAL_ISSUE` queue binding is ensured idempotently;
- the queue item remains in `INSPECT`;
- activity/timeline are written from the event path.

When a TechnicalIssue is confirmed, started, or completed:

- coordination finds the existing `TECHNICAL_ISSUE` binding;
- the item workflow moves respectively:
  - `INSPECT -> READY`;
  - `READY -> IN_PROGRESS`;
  - `IN_PROGRESS -> DONE`.

## Guardrails

- Workspace capacity remains Blueprint/event-consumer led.
- Workspace detail UI does not create bindings.
- Technical Bench remains a Space Management view.
- ProjectionRecord reads remain deferred.
- SR/payment/reopened event activation remains explicit future work.

## Validation

Passed:

```bash
cmd /c npx eslint src/domains/event/catalog/legacy-business-events.catalog.ts src/domains/blueprint/shared/event-bindings.ts src/domains/coordination/server/coordination-router.registry.ts --quiet
cmd /c npx tsx -e "import { getBusinessEventContract } from './src/domains/event/catalog/business-event-catalog'; import { eventBindingsForWorkType } from './src/domains/blueprint/shared/event-bindings'; import { getCoordinationRoute } from './src/domains/coordination/server/coordination-router.registry'; const events=['technical_issue.created','technical_issue.confirmed','technical_issue.started','technical_issue.completed']; for (const eventKey of events) { const contract=getBusinessEventContract(eventKey); const route=getCoordinationRoute({eventKey,targetType:'TECHNICAL_ISSUE'}); const binding=eventBindingsForWorkType({workTypeKey:'service-operation',coordinationContext:'TECHNICAL'}).find((item)=>item.eventKey===eventKey); console.log(eventKey, contract?.knownConsumers?.join(','), route?.workTypeKey, binding?.status, binding?.mode); }"
git diff --check
```

Smoke output:

```text
technical_issue.created timeline,coordination service-operation ACTIVE INTAKE
technical_issue.confirmed timeline,coordination service-operation ACTIVE PROGRESS
technical_issue.started timeline,coordination service-operation ACTIVE PROGRESS
technical_issue.completed timeline,coordination service-operation ACTIVE PROGRESS
```

## Follow-Up

- Add an end-to-end smoke with a seeded current technical cycle and Service
  Operation receiver workspace.
- Decide whether `technical_issue.reopened` should be produced and activated.
- Decide whether SR and Payment events should bind into the same Service
  Operation workspace or stay activity-only.
- Revisit Inspect/Processing/Done workspace split once capacity rules are
  blueprint-explicit.
