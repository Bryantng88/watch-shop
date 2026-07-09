# SM Sprint 65 - Service Operation Smoke and Workspace UX Hardening

## Status

Implemented first slice.

Sprint 65 verifies the Service Operation consumer activation from Sprint 64 and
hardens the workspace action UX.

## Scope

Do:

- add a Service Operation consumer smoke/diagnostic path;
- expose receiver/binding reasons when event binding cannot proceed;
- keep runtime from guessing when duplicate receivers exist;
- make manual action failures visible in the workspace UI.

Do not:

- activate SR, Payment, or reopened events;
- add ProjectionRecord Service Operation reads;
- split Inspect/Processing/Done workspaces;
- mutate Service schema.

## Implemented

### 1. Coordination diagnostic helper

Changed:

- `src/domains/coordination/server/coordination-event-consumer.ts`
- `src/domains/coordination/server/index.ts`

Added:

```text
diagnoseBusinessEventForCoordination
```

The diagnostic follows the same route/scope/work-ticket resolution as the real
coordination consumer but does not create bindings, apply workflow transitions,
or write activity.

It reports:

- route;
- scope;
- receiver task item;
- binding mode;
- binding existence;
- skip reason.

### 2. Service Operation smoke script

Added:

- `scripts/smoke-service-operation-consumer.ts`

Default dry-run:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts
```

Receiver diagnostics:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --receivers
```

Apply mode, intentionally explicit:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --issue <technicalIssueId> --apply
```

Repair duplicate receiver marker, intentionally explicit:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --select-receiver <taskItemId>
```

### 3. Receiver marker for new work tickets

Changed:

- `src/domains/coordination/server/coordination-cycle.service.ts`

New work tickets with Blueprint event bindings now include:

```text
blueprintAutoBindingReceiver: true
```

This gives the coordination consumer an explicit receiver signal when multiple
candidate work tickets exist.

### 4. Workspace action error UX

Changed:

- `src/domains/task/ui/task-work/QueueWorkQueue.tsx`

Manual workflow action failures now render an inline error banner instead of
only logging to the console. This is especially important for Service Operation
actions where Service domain validation can reject `mark-done` until actual
cost/resolution detail is present.

## Smoke Result

Dry-run against the current DB connected successfully with network access.

Result:

```text
technical_issue.created diagnostic skipped:DUPLICATE_BLUEPRINT_EVENT_BINDING
technical_issue.confirmed diagnostic skipped:DUPLICATE_BLUEPRINT_EVENT_BINDING
technical_issue.started diagnostic skipped:DUPLICATE_BLUEPRINT_EVENT_BINDING
technical_issue.completed diagnostic skipped:DUPLICATE_BLUEPRINT_EVENT_BINDING
```

Receiver diagnostics found three current technical-cycle Service Operation
candidate work tickets and none had `blueprintAutoBindingReceiver:true`.

The runtime skip is correct. The consumer must not guess a receiver when there
are duplicates. Use the explicit `--select-receiver` repair command after a
human chooses the intended current Service Operation work ticket.

## Validation

Passed:

```bash
cmd /c npx eslint src/domains/coordination/server/coordination-cycle.service.ts src/domains/coordination/server/coordination-event-consumer.ts src/domains/coordination/server/index.ts scripts/smoke-service-operation-consumer.ts --quiet
cmd /c npx eslint src/domains/task/ui/task-work/QueueWorkQueue.tsx --quiet
```

Attempted:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --receivers
```

The first local attempt without network escalation could not reach the Supabase
pooler. After network approval, dry-run and receiver diagnostics completed.

## Follow-Up

- Select the intended current Service Operation receiver, then rerun dry-run.
- Run `--apply` against a safe TechnicalIssue to verify idempotent binding and
  workflow movement.
- Decide whether duplicate historical Service Operation tickets should be
  archived or left as non-receivers.
- Design the `start-work` and `mark-done` modals once the event binding smoke is
  green.

