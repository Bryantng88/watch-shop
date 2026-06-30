# S001: Business Collaboration Engine

## Goal

Turn TaskItem into the collaboration ticket for business work while keeping business domains independent.

## Architecture

Task is the container, epic, or case.

TaskItem is the primary collaboration ticket and work unit.

Business domains emit `BusinessEvent` only.

BusinessBinding maps TaskItem to business objects using the existing `TaskExecution` persisted model.

Timeline is a projection/read model.

BusinessFeedback remains independent and can be projected into TaskItem Timeline.

Notification, Workflow, and Timeline are BusinessEvent consumers.

## Completed

- BusinessFeedback shared framework
- Timeline core models and service
- Timeline consumer skeleton
- BusinessBinding abstraction over TaskExecution

## In Progress

- Resolve TaskItems for Timeline projection through BusinessBinding.

## Next

- Define Timeline renderer contract.
- Build minimal TaskItem timeline UI.
- Add discussion/comment layer.

## Out Of Scope

- Passing `taskItemId` through Watch URL/API.
- Direct Watch -> Timeline calls.
- Prisma rename from `TaskExecution` to `BusinessBinding`.

