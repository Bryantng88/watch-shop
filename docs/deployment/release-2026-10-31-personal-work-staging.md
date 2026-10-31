# Personal-work staging release preparation

Status: **prepared and rehearsed; live rollout not performed**.
Source: `62d0fa51770ee585fa26e72beabc8727dbb1f2d8`.
PR #28 was reviewed but not merged or included. It adds preview tooling, not a
Codex executor. Production has not been changed.

This public record contains source-level verification and the release gate.
The operator's private deployment record retains host/container identities,
image IDs, backup location/checksum, configuration paths, and data findings.
No credentials, environment-file contents or session cookies are published.

## Completed verification

- Source was packaged from the exact Git commit, excluding env files,
  dependency/build directories, logs and archives. Generated local files were
  not packaged or committed.
- Source archive checksum was verified before extracting a separate release.
- Runtime and operations images were built on the NAS with explicit staging
  configuration. Runtime build succeeds and generates 147 pages.
- TypeScript and the personal-work boundary check pass on the NAS.
- The database backup passes checksum and archive-readability checks.
- A restore drill succeeded into a new isolated test database. The test
  database and application have no external network or host port publication.
- All 27 pending committed migrations apply successfully on the restored clone.
  No migration-history records were edited. Legacy baseline differences already
  exist at the previous source revision; other differences match line endings.
- Standalone, schedule, calendar and category smoke suites pass on the migrated
  clone. Google calls are mocked and no outside requests are sent.
- Permission catalog audit passes without missing, retired or forbidden grants.
- Actual HTTP/password-login acceptance passes on the new runtime image in
  isolation: health/readiness/login return 200, unauthenticated personal work
  redirects to login, invalid credentials return 401, valid synthetic credentials
  create a session, and authenticated personal work returns 200 with the fixture.
- Existing live login ingress remains available. This is not authenticated
  post-rollout acceptance.

Full local lint still reports errors on unchanged upstream/generated code. An
initial Windows build encountered an outside-workspace permission error; the
subsequent NAS build succeeded. A Go-template formatting error in the build
wrapper's final metadata-reporting command did not affect the images; separate
inspection successfully recorded their immutable IDs privately.

Inventory auditing also reports pre-existing data inconsistencies. Read-only
comparison against live staging confirms that those invalid inventory pairs
predate the migration rehearsal. No inventory state was repaired or reset.

## Blocking rollback finding

The previous admin image was tested against the migrated clone and cannot read
the new `WatchServiceStage` value:

```text
Value 'NOT_ASSESSED' not found in enum 'WatchServiceStage'
```

The committed backfill migration changes existing rows to that new value.
Standalone personal work also permits new records without a parent `Task`,
which older application code may not support. Retaining an old image is
therefore insufficient to promise a complete application rollback.

Live staging migrations and application replacement have not been performed.
Before live writes, prepare a compatible rollback strategy or obtain an explicit
operator decision to deploy staging with forward fixes rather than automatic
rollback to the old image. Restoring a backup over live data requires a separate
data-loss decision; it is not authorized by the current deployment request.

After that gate is resolved: take a fresh verified backup, recheck staging
database identity, apply committed migrations once, run relevant audits, replace
only necessary staging applications while preserving their settings, and verify
health, readiness, real login and personal work over both existing ingress paths.
Keep the previous images/containers and both proxies available.

## Codex-tagged work remains an integration gap

Personal work supports arbitrary tags and ownership/sharing. No Codex dispatcher
or executor was found in the searched task/personal-work services, admin APIs or
workflows. A `codex` tag does not itself execute a job.

The missing implementation includes eligibility/dispatch rules, durable run
records and atomic claiming, an authenticated executor with scoped repository
access, retries/timeouts/cancellation, status/log/result/PR links written back to
the item, approval boundaries, and end-to-end staging verification. This release
preparation neither implements nor simulates those capabilities.
