# ADR-001: Workspace Is Collaboration Surface

Status: Superseded by Sprint 27 language migration.

## Context

The system has Spaces, Workspaces, Items, business domains, BusinessEvents,
Workflow, Notification, BusinessFeedback, Activity, and Timeline.

The previous language called these concepts Task and TaskItem. That vocabulary
is now legacy at the application/product layer.

## Decision

`Space` is a container, cycle, epic, or case.

`Workspace` is the primary collaboration surface and aggregate root for
collaboration UX.

Business domains must not depend on Workspace. They emit `BusinessEvent` only.

## Consequences

Workspace can render Activity, Discussion, feedback, events, workflow actions,
and notifications.

Business domains stay independent and reusable.

Activity, Timeline, and Workflow react to events instead of being called
directly by business domain code.

Implementation compatibility:

- Prisma `Task` still persists Space.
- Prisma `TaskItem` still persists Workspace.
