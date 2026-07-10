# Sprint 75 - Operation Projection Subscription Runtime

Status: closed.

## Goal

Connect Service Operation events to Watch List projection through
`projectionSubscriptions` declared by the Operational Blueprint contract.

Sprint 74 made Inspect and Processing actions emit the right domain events.
Sprint 75 makes downstream projection selection read the Blueprint operation
contract instead of requiring each Service Operation event to be hardcoded into
the Watch List projection constants.

## Scope

- Projection builder selection can use Operational Blueprint
  `projectionSubscriptions`.
- Watch List projection can resolve Service Operation event targets back to
  Watch rows:
  - `SERVICE_REQUEST`;
  - `TECHNICAL_ISSUE`;
  - `PAYMENT`.
- Projection remains read-model work only. It must not execute workflow,
  notifications, or domain commands.

## Files Touched

- `src/domains/projection/server/operation-projection-subscriptions.ts`
- `src/domains/projection/server/projection.registry.ts`
- `src/domains/projection/server/projection-observability.service.ts`
- `src/domains/projection/server/projection-observability.types.ts`
- `src/domains/projection/server/watch-list/watch-list-projection.source.ts`
- `src/domains/projection/server/watch-list/watch-list-projection.builder.ts`
- `src/domains/projection/server/index.ts`
- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `scripts/verify-sprint-75-projection-subscriptions.ts`

## Implemented

- Added a projection subscription resolver that reads the Service Operation
  contract's `projectionSubscriptions`.
- `listProjectionBuildersForEvent` now selects a builder when either the
  builder's native source events match or an Operational Blueprint subscription
  matches.
- Watch List projection source resolution now maps:
  - `SERVICE_REQUEST -> ServiceRequest.productId -> Watch.productId`;
  - `TECHNICAL_ISSUE -> TechnicalIssue.serviceRequestId -> Watch`;
  - `PAYMENT -> service_request_id / technical_issue_id -> Watch`.
- Watch List event builder no longer rejects non-Watch/Product events before
  resolver logic can run.
- Projection status summaries now expose:
  - native builder `sourceEvents`;
  - operation-derived `operationSubscriptionEvents`;
  - operation keys that contributed those subscriptions.
- Blueprint operation preview now renders projection subscription detail:
  projection key, resolved target type, description, and event keys.

## Validation

- `cmd /c npx tsx scripts/verify-sprint-75-projection-subscriptions.ts` passed.
- `cmd /c npx eslint scripts/verify-sprint-75-projection-subscriptions.ts src/domains/projection/server/operation-projection-subscriptions.ts src/domains/projection/server/projection.registry.ts src/domains/projection/server/projection-observability.service.ts src/domains/projection/server/projection-observability.types.ts src/domains/projection/server/index.ts src/domains/projection/server/watch-list/watch-list-projection.builder.ts src/domains/projection/server/watch-list/watch-list-projection.source.ts src/domains/coordination/ui/OperationCoordinationWorkspace.tsx --quiet --rule "@typescript-eslint/no-explicit-any: off"` passed.
- Read-only projection status smoke against the connected database returned
  `watch-list.operationSubscriptionEvents` for the Service Operation events and
  `operationSubscriptionKeys: ["service-operation"]`.

## Deferred Live Smoke

- A live projection smoke is still blocked in the current connected database
  because there are no ServiceRequest/TechnicalIssue seed rows:
  - create or select a ServiceRequest linked to a Watch product;
  - emit or dry-run `technical_issue.completed`;
  - confirm `watch-list` projection rebuilds the matching Watch row.
- This is not a Sprint 75 runtime blocker. The subscription resolver,
  projection builder selection, target resolution, status payload, and Blueprint
  UI explanation are implemented and verified.
