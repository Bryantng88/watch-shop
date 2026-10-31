# Personal-work staging rollout

Status: **live staging applications updated; operator-authenticated acceptance confirmed**.
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

## Live rollout evidence

After reviewing the demonstrated rollback failure, the operator explicitly
authorized the staging rollout with forward fixes if needed and no automatic
database restore.

- Both live application database targets and the migration target were
  independently rechecked as staging before writes.
- Both staging application writers were stopped and a new consistent database
  backup was created, checked for archive readability, and checksum-verified.
- All 27 pending migrations applied successfully. Prisma reports all 80
  committed migrations up to date; no migration errors were skipped.
- The live permission catalog audit passes without missing or forbidden grants.
- The Watch List projection rebuild was first tested on the migrated clone and
  then completed successfully on live staging. It refreshes the read model;
  authoritative inventory states were not repaired.
- Both necessary staging application containers were replaced with the tested
  runtime image. Old containers/images are retained stopped under rollback names.
- Configuration comparison confirms that environment values, launch settings,
  restart policies, port bindings and network membership are preserved. Secrets
  were handled in memory and were not printed or committed.
- The NAS Docker API requires additional networks to be connected separately
  after container creation. The rollout followed that sequence; it did not
  change the intended network configuration.
- Both applications are Docker-healthy and internal health/readiness return 200.
- Both existing admin ingress proxies remain running with the original readonly
  configuration and bindings. Existing staging proxies were syntax-checked and
  reloaded to resolve the replacement application addresses; none was replaced.
- Over both admin ingress paths, login returns 200, invalid login returns 401,
  and unauthenticated personal work redirects to login.
- Health/readiness return 404 through admin ingress by the existing allowlist
  policy; internal health/readiness return 200. Access rules were not widened.
- The existing storefront product listing returns 200 after the rollout.
- The operator confirmed successful login with an existing live staging account
  and successful opening of the personal-work page. The confirmation did not
  specify which ingress path was used; automated ingress checks passed on both.
  Authenticated acceptance also passed on the isolated clone, as described above.
- The isolated validation application and database were stopped after testing;
  no live volume was deleted or live database restored/reset.

Full local lint still reports errors on unchanged upstream/generated code. An
initial Windows build encountered an outside-workspace permission error; the
subsequent NAS build succeeded. A Go-template formatting error in the build
wrapper's final metadata-reporting command did not affect the images; separate
inspection successfully recorded their immutable IDs privately.

Inventory auditing also reports pre-existing data inconsistencies. Read-only
comparison against live staging confirms that those invalid inventory pairs
predate the migration rehearsal. No inventory state was repaired or reset.

## Accepted rollback limitation

The previous admin image was tested against the migrated clone and cannot read
the new `WatchServiceStage` value:

```text
Value 'NOT_ASSESSED' not found in enum 'WatchServiceStage'
```

The committed backfill migration changes existing rows to that new value.
Standalone personal work also permits new records without a parent `Task`,
which older application code may not support. Retaining an old image is
therefore insufficient to promise a complete application rollback.

The operator explicitly accepted forward fixes for this staging rollout. Do not
automatically revert to the incompatible old image or restore a backup over live
data. A restore remains a separate data-loss decision and is not authorized.
Previous images/containers and the verified backup remain retained for reviewed
recovery work. Production has not been changed.

## Codex-tagged work remains an integration gap

Personal work supports arbitrary tags and ownership/sharing. No Codex dispatcher
or executor was found in the searched task/personal-work services, admin APIs or
workflows. A `codex` tag does not itself execute a job.

The missing implementation includes eligibility/dispatch rules, durable run
records and atomic claiming, an authenticated executor with scoped repository
access, retries/timeouts/cancellation, status/log/result/PR links written back to
the item, approval boundaries, and end-to-end staging verification. This release
preparation neither implements nor simulates those capabilities.


## Follow-up implementation in this PR

The original rollout above did not contain a Codex executor. This PR now also
prepares a staging-only execution queue, an isolated Codex CLI worker, run
status/result history, and explicit Google Calendar OAuth callback readiness.
See [the follow-up staging handoff](personal-work-codex-calendar-staging.md).
The follow-up source has been tested locally but has not been applied to the
live NAS. Real Codex execution from the current Cloud environment is blocked by
its HTTP destination policy; NAS SSH access and real Google OAuth configuration
are not yet available in that environment. No real Codex run or Google consent
is claimed by the mocked/unit/database/HTTP validation.
