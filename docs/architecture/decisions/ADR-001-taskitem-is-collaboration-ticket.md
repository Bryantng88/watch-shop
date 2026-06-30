# ADR-001: TaskItem Is Collaboration Ticket

Status: Accepted

## Context

The system has Tasks, TaskItems, business domains, BusinessEvents, Workflow, Notification, BusinessFeedback, and Timeline.

TaskItem needs to evolve into a lightweight Jira issue.

## Decision

`Task` is a container, epic, or case.

`TaskItem` is the primary collaboration ticket, work unit, and aggregate root for collaboration.

Business domains must not depend on TaskItem. They emit `BusinessEvent` only.

## Consequences

TaskItem can render a timeline of comments, feedback, events, workflow actions, and notifications.

Business domains stay independent and reusable.

Timeline and Workflow react to events instead of being called directly by business domain code.

