# SM Sprint 66 - Service Operation Receiver Repair and Apply Smoke

## Status

Implemented first slice.

Sprint 66 selected the current Service Operation receiver, reran smoke, and
proved the first safe apply path for `technical_issue.created`.

## Scope

Do:

- select one explicit Service Operation receiver in the current technical cycle;
- rerun dry-run smoke after receiver selection;
- run a safe apply smoke only for a TechnicalIssue event that matches current
  Service truth;
- fix any runtime blocker discovered by the smoke.

Do not:

- apply `confirmed`, `started`, or `completed` events when the TechnicalIssue is
  still open/unconfirmed;
- activate SR, Payment, or reopened events;
- start ProjectionRecord Service Operation reads;
- split Inspect/Processing/Done workspaces;
- mutate Service schema.

## Receiver Selection

Receiver diagnostics found three Service Operation candidate work tickets in the
current technical cycle:

```text
task e3d9a9dc-38d8-40ac-afc7-4c424e65549e
```

The selected receiver is:

```text
taskItemId: 1e830a20-1874-4a67-a5c9-491dfecda585
```

Reason:

- it had `bindingCount: 20`;
- the other two candidates had `bindingCount: 0`;
- selecting the item already carrying real workload is the least disruptive
  current-cycle repair.

Command:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --select-receiver 1e830a20-1874-4a67-a5c9-491dfecda585
```

## Dry-Run Smoke After Repair

Command:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --issue 29c57c00-1a5b-42c0-8488-4ccd01c3f33a
```

Output:

```text
technical_issue.created diagnostic route=service-operation mode=INTAKE binding=d2a85489-3756-4a98-ac1a-7cad2c0f17b9 receiver=1e830a20-1874-4a67-a5c9-491dfecda585
technical_issue.confirmed diagnostic route=service-operation mode=PROGRESS binding=d2a85489-3756-4a98-ac1a-7cad2c0f17b9 receiver=1e830a20-1874-4a67-a5c9-491dfecda585
technical_issue.started diagnostic route=service-operation mode=PROGRESS binding=d2a85489-3756-4a98-ac1a-7cad2c0f17b9 receiver=1e830a20-1874-4a67-a5c9-491dfecda585
technical_issue.completed diagnostic route=service-operation mode=PROGRESS binding=d2a85489-3756-4a98-ac1a-7cad2c0f17b9 receiver=1e830a20-1874-4a67-a5c9-491dfecda585
```

## Apply Smoke

The selected TechnicalIssue was:

```text
technicalIssueId: 29c57c00-1a5b-42c0-8488-4ccd01c3f33a
summary: lau dau
executionStatus: OPEN
isConfirmed: false
```

Because the Service truth is still open/unconfirmed, only
`technical_issue.created` was safe to apply.

Command:

```bash
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --issue 29c57c00-1a5b-42c0-8488-4ccd01c3f33a --event technical_issue.created --apply
```

Output:

```text
technical_issue.created apply eventLog=e52db170-3d0b-497f-98be-6e11e796633e coordination=success timeline=success
```

Result:

```text
bindingId: d2a85489-3756-4a98-ac1a-7cad2c0f17b9
workflowKey: service-operation-technical-bench
currentState: INSPECT
lastTriggerValue: technical_issue.created
lastBusinessEventLogId: e52db170-3d0b-497f-98be-6e11e796633e
```

## Runtime Bug Found and Fixed

Bug:

- Existing legacy `TECHNICAL_ISSUE` bindings did not have workflow runtime.
- `ensureTaskItemBusinessBinding` attempted to backfill workflow state, but the
  binding metadata did not include `workflowKey` or an applied workflow snapshot.
- The receiver TaskItem note did include `workflowKey:
  service-operation-technical-bench`, but the existing binding branch was not
  merging that note-derived workflow context before initialization.

Fix:

- `src/domains/task/server/business-binding.service.ts` now merges
  `workflowKey` and `workTypeKey` from the receiver TaskItem note when no
  applied workflow snapshot is available.
- Existing bindings can now be backfilled into the workspace workflow runtime.

## Validation

Passed:

```bash
cmd /c npx eslint scripts/smoke-service-operation-consumer.ts --quiet
cmd /c npx eslint src/domains/task/server/business-binding.service.ts --quiet
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --issue 29c57c00-1a5b-42c0-8488-4ccd01c3f33a
cmd /c npx tsx scripts/smoke-service-operation-consumer.ts --issue 29c57c00-1a5b-42c0-8488-4ccd01c3f33a --event technical_issue.created --apply
```

## Follow-Up

- Run apply smoke for `technical_issue.confirmed` only after Service truth is
  confirmed.
- Run apply smoke for `technical_issue.started` only after Service truth is
  started.
- Run apply smoke for `technical_issue.completed` only after Service truth is
  completed.
- Decide whether the two empty duplicate Service Operation work tickets should
  be archived or left as non-receivers.
- Then design `start-work` and `mark-done` modals.

