# Ben: scheduled personal Codex work

Example: “Tạo việc bổ sung quản lý vendor ngày mai, giao Codex bắt đầu lúc 08:00.”
Ben asks for missing execution time if only a date is supplied. Calendar dueAt
and Codex startAt are separate; a date-only task at end-of-day never implicitly
delays or starts execution. Explicit run-now uses startAt=null. The review shows
the actual Vietnam execution time, followed by one create-and-dispatch approval.

That approval uses the existing owner-scoped personal task command and queues a
PersonalCodexRun in the same transaction as tags/checklist/shares and conversation
receipt. Failures create neither a partial task nor an orphaned run; retries use
the existing receipt. Raw codex tags without execution intent are rejected. The
server canonicalizes the tag. Events and tasks assigned to another user cannot
be dispatched through this plan.

The existing execution boundary is preserved: active ADMIN, configured personal
worker, staging database/environment only. Production is still disabled. A worker
being unavailable is not a missing-user-permission ticket and must not silently
drop the user's dispatch request. This does not grant merge/deploy authority or
automatically mark a task complete.

## Queue semantics

- Nullable notBefore on PersonalCodexRun; old rows and existing manual dispatches
  stay immediately eligible. No reinterpretation of existing calendar dates.
- Server discovery and atomic QUEUED-to-RUNNING update both require no start gate
  or notBefore <= server time. Future jobs cannot block ready jobs.
- Claim rechecks owner, active ADMIN, active task, tag and non-event type. Prompt
  fingerprint includes title/note/checklist; editing it invalidates old approval.
  Heartbeat also rejects changed prompts. Existing cancel/lease/timeout controls
  remain. Execution starts after the gate when a worker is available, not at an
  exact promised second.
- View/cancel the queued run from the existing personal task Codex panel. Existing
  retry is a new explicit run-now request. Editing calendar dueAt does not edit
  a queued run's gate; cancel and approve a new run to change execution time.

## Deployment and acceptance

No deployment is part of this PR. For an authorized staging rollout, pause the
personal worker while applying the additive migration and updating app/API, then
update the customer worker's protocol/schema and resume workers. Avoid mixing
old claim API instances (which ignore notBefore) with new scheduled records.
Never change the production-environment gate to make a test pass.

Before enabling for users, test actual PostgreSQL/worker behavior: future job does
not claim; an immediate job behind it does claim; exact time boundary permits one
claim; concurrent claims cannot execute the same run twice; worker outage starts
late; changing task content/status/tag or revoking ADMIN prevents execution;
cancellation works before/after the gate; replaying Ben approval yields one task
and run; failure to enqueue rolls back creation; normal tasks/events remain as
before. Verify displayed times in Vietnam and run outcomes/PR links.

Automated coverage includes strict plan/protocol validation, time gate query,
fingerprint and preserved staging capability checks, plus existing Ben/worker
regressions. Schema validation/build do not apply migrations or establish live
database concurrency, clock behavior, worker readiness or natural-language
acceptance. Those cases need the staging checks above.
