# ADR-002: BusinessBinding Over TaskExecution

Status: Accepted

## Context

The existing persisted model is `TaskExecution`.

Its role is expanding from execution history to relationship mapping between TaskItem and business objects.

## Decision

Keep Prisma `TaskExecution` unchanged for now.

Introduce `BusinessBinding` as the server-side domain abstraction over `TaskExecution`.

`BusinessBinding` maps:

`TaskItem <-> Business Object`

## Consequences

New server code should use BusinessBinding names.

Timeline projection can resolve related TaskItems through BusinessBinding.

No Prisma rename is required yet.

ExecutionContext through URL/API is rejected/deferred for Timeline routing.

