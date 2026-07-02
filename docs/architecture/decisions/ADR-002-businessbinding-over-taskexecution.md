# ADR-002: Item Over TaskExecution

Status: Superseded by Sprint 27 language migration.

## Context

The existing persisted model is `TaskExecution`.

Its role is relationship mapping between Workspace and business objects.

The previous application-layer name was `BusinessBinding`. New code should use
Item vocabulary.

## Decision

Keep Prisma `TaskExecution` unchanged for now.

Introduce `Item` as the application-layer abstraction over `TaskExecution`.

`Item` maps:

`Workspace <-> Business Object`

## Consequences

New server code should use Item names.

Activity and Timeline projection can resolve related Workspaces through Items.

No Prisma rename is required.

ExecutionContext through URL/API is rejected/deferred for routing.
