# SM Sprint 44: Watch Media Workspace Pipeline Blueprint V1

Date: 2026-07-04

Status: Implemented

## Mission

Reframe Watch Media work so Workspace becomes the operating layer without
replacing Watch domain.

Core principle:

```text
Watch owns data.
Workspace owns work.
Business Event is the contract.
Domain command is the write-back path.
Blueprint owns workspace routing/workflow.
```

Sprint 44 does not remove Watch actions and does not build the full Media UI.
It prepares the Blueprint/runtime contract for the Media pipeline.

## Pipeline

The Media Space pipeline is:

```text
Watch domain
-> Photoshoot Workspace
-> Media Processing Workspace
-> Publish Workspace
-> Watch domain state/download/posting signals
```

### Photoshoot Workspace

Purpose:

- Receive Watches that need photoshoot.
- Give the photoshoot user a work list.
- Let photoshoot complete the work through workflow.

Intake event:

```text
watch.media.photoshoot.requested
```

Next event:

```text
watch.media.photoshoot.completed
```

### Media Processing Workspace

Purpose:

- Receive Watches after photoshoot.
- Host actions for attaching assets from NAS.
- Handle content/image submission, approval, rejection, feedback, and discussion.

Important boundary:

```text
Workspace UI may host "attach from NAS".
Watch domain must execute the attach command and update Watch data.
Workspace only records work state/timeline from the resulting event.
```

Intake event:

```text
watch.media.photoshoot.completed
```

Progress events:

```text
watch.media.asset.attached
watch.content.submitted
watch.content.approved
watch.content.rejected
watch.image.submitted
watch.image.approved
watch.image.rejected
```

Next event:

```text
watch.media.ready_for_publish
```

### Publish Workspace

Purpose:

- Receive Watches whose media/content are ready.
- Track download/posting preparation.
- React to Watch domain signals such as assets downloaded.

Intake event:

```text
watch.media.ready_for_publish
```

Progress event:

```text
watch.publish.assets.downloaded
```

## Intake vs Progress

Sprint 44 adds event binding mode:

```text
INTAKE
PROGRESS
```

Rules:

- `INTAKE` may create/bind a Watch into the target Workspace item.
- `PROGRESS` may only update a Watch that is already bound to that Workspace item.
- If a `PROGRESS` event arrives without an existing Workspace binding, runtime skips
  with `NO_EXISTING_WORKSPACE_ITEM`.

This prevents late events such as approve/reject/download from silently pulling
a Watch into the wrong Workspace.

## Runtime Changes

- Blueprint event bindings now include `mode`.
- Blueprint Workspace Definition now includes provisioning policy.
- Event binding diagnostics show `INTAKE` or `PROGRESS`.
- Coordination runtime checks existing business binding before processing
  `PROGRESS` bindings.
- Watch review events are remapped from `publish` to `media-processing`.
- `publish` is no longer the first destination for Watch content/image review.

## Workspace Provisioning

Blueprint owns whether a Workspace/work ticket is created automatically.

Provisioning policy:

```text
mode: AUTO | MANUAL
scope: CURRENT_ACTIVE_WEEKLY_SPACE
trigger: SPACE_OPENED | FIRST_INTAKE_EVENT
```

Current weekly auto-create behavior is represented as:

```text
mode: AUTO
scope: CURRENT_ACTIVE_WEEKLY_SPACE
trigger: SPACE_OPENED
```

Disabled/draft Blueprint definitions default to manual provisioning.

This means `enabled` no longer has to be interpreted as the product decision for
auto-create. Runtime can now read an explicit Blueprint provisioning policy.

## Migration Strategy

This is Workspace-first, not Watch-replacement yet.

Phases:

```text
Phase 1: Watch + Workspace coexist.
Phase 2: Workspace becomes the default Media operating path.
Phase 3: Watch domain remains source-of-record and heavy query/list surface.
Phase 4: Direct Media operations on Watch UI may be reduced or disabled later.
```

Sprint 44 explicitly does not remove current Watch domain actions.

## Files Changed

- `src/domains/blueprint/shared/event-bindings.ts`
- `src/domains/blueprint/shared/workspace-provisioning.ts`
- `src/domains/blueprint/shared/workspace-capabilities.ts`
- `src/domains/blueprint/server/blueprint.types.ts`
- `src/domains/blueprint/server/blueprint-library.service.ts`
- `src/domains/blueprint/server/blueprint-event-binding-audit.service.ts`
- `src/domains/coordination/server/coordination-event-consumer.ts`
- `src/domains/coordination/server/coordination-router.registry.ts`
- `src/domains/event/server/business-event.service.ts`
- `src/domains/task/server/business-binding.service.ts`
- `src/domains/task/server/work-type.registry.ts`
- `src/domains/watch/server/events/watch-business-event.contract.ts`
- `src/domains/workflow-definition/client/WorkflowAdminClient.tsx`
- `src/domains/workflow-definition/server/workflow-definition.registry.ts`
- `docs/sprints/CURRENT.md`

## Out Of Scope

- Full UI action to send selected Watches to Photoshoot.
- NAS picker implementation.
- Watch command implementation for attach-from-NAS.
- Removing existing Watch media actions.
- Cross-domain pipeline implementation for Order, Service, Payment.

## Next Sprint

Sprint 45 should implement:

```text
Watch list action -> send selected Watches to Photoshoot Workspace
```

The action should:

- live in Watch domain UI,
- validate that selected Watches need photoshoot,
- call Watch domain service,
- emit `watch.media.photoshoot.requested`,
- let Workspace receive work through Blueprint binding.

## Acceptance

Sprint 44 passes if:

- Media pipeline is represented by work types and event bindings.
- Blueprint event bindings distinguish `INTAKE` from `PROGRESS`.
- Runtime prevents progress events from creating new Workspace bindings.
- Watch remains source-of-record.
- Workspace remains source-of-work.

Status: PASS.
