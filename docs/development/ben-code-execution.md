# Ben reviewed code jobs, merge and staging release

Based on PR49. New capabilities default off and are not deployed by this PR.
The conversation worker remains read-only. A fresh repository.file lookup plus a
complete codePlan yields a compact review. Only verified active ADMIN Long can
approve the exact revision. The app queues a durable JSON codeJob in the existing
conversation table; no migration. Pending jobs are independent of model/chat
leases and messages. Repeated approval returns the same job. Private job leases
are stripped from DTOs; job plans/results redact with repository access.

## State and authority

Code: QUEUED → RUNNING → PR_OPEN, with separate named install/generate/typecheck/
lint/tests/build checks. Files are edited in a dedicated worktree. Model output is
not test evidence. The parent freezes the staged Git tree, creates a sibling verification checkout
inaccessible to model processes, reinstalls dependencies and executes fixed
checks with source/tooling read-only. It commits exactly that frozen snapshot.
The verifier prepares generated next-env declarations, disables incremental
root-cache writes for the standalone TypeScript check, and temporarily sets
cleanDistDir=false in the verifier only (to preserve sandbox-protected output
markers). Original config/generated files are restored before the snapshot check.
Both sandbox modes must pass a native Node output probe before any checks count; no staging DB credentials are provided.

Merge: Long reviews the linked diff and explicitly chooses Merge PR #n @ SHA.
Worker rechecks repository/head/branch/base and CI, marks draft ready, and calls
GitHub merge with the exact approved head. It never approves reviews, forces a
merge, relaxes protections, creates production tags or dispatches production.

Release: Long explicitly chooses Deploy staging @ SHA (PR head before merge or
verified merged commit afterwards). A SEPARATE trusted NAS executor handles the
release; the coding worker has no Docker/NAS socket, SSH identity or release token.
The backend serializes staging releases. A fixed, operator-installed, hash-pinned
script takes only repository, commit and request ID, runs the existing reviewed
staging deployment procedure, and returns a preservation/health receipt.

A cancellation stops queued/code work best-effort; a remote push may already have
completed. It does not undo Git writes. Active merge/deploy cannot be cancelled
with a false rollback promise. Expired/uncertain remote operations become
RECONCILE_REQUIRED and block retries (and further staging releases for an uncertain
release). Operator must inspect GitHub/NAS receipts before a controlled recovery.
No automatic replay of an uncertain deployment or branch reset is supported.

## App settings (private environment; never paste secrets into chat)

Retain PR49's read-only token/commit/Long settings and all current staging flags.
Add BEN_CODE_ENABLED=1, BEN_CODE_BASE_REF=<operator-verified source branch>,
BEN_CODE_PR_BASE=main (or reviewed target), BEN_CODE_WORKER_TOKEN=<new random secret>.
The source SHA comes from the reviewed repository snapshot; approve rejects a
changed configuration and worker fetch rejects an advanced source branch.

Merge additionally requires BEN_CODE_MERGE_ENABLED=1.
Release additionally requires BEN_CODE_RELEASE_ENABLED=1,
BEN_CODE_RELEASE_TOKEN=<different new random secret>, and
BEN_CODE_RELEASE_HANDLER_SHA256=<SHA256 of the installed NAS handler>.
Tokens must be at least 32 characters and different from each other and the
existing personal/customer worker token. Configure flags only after executors
are installed and accepted. No model/user text can choose a repo, shell command,
merge target, credential, production environment or deployment handler.

## Separate coding worker

Use the existing pinned worker Dockerfile/image and reviewed confinement settings,
but launch `node /opt/worker/ben-code-worker.mjs` in a dedicated container. Keep
PERSONAL_CODEX_ENVIRONMENT=staging, BEN_CODE_WORKER_ENABLED=1 and the private
PERSONAL_CODEX_APP_URL. Only HTTPS or the exact existing private admin service/
loopback HTTP is accepted. No public/internal-ingress exception is allowed.

Provision a NEW dedicated clone at /work/ben-repo with the fixed watch-shop HTTPS
origin and marker .git/ben-code-worker; /work/ben-code is a separate private volume.
Do not mount someone else's checkout or credentials. Retain worktrees for review.
Mount the dedicated new API token at /run/worker/ben-code-api-token and a dedicated
GitHub credential at /run/worker/ben-code-gh-token. Scope the latter to this repo:
Contents write, Pull requests write, Checks/Commit statuses read; no workflow or
administration permission. Do not reuse the read-only PR49 token. Reuse dedicated
ChatGPT CLI auth in the established auth volume; model/test processes deny auth,
/proc, secrets, other /work paths and network. Only dependency installation and
Prisma client preparation have network access, still under filesystem confinement.

Dependency/config/AGENTS/workflow/deployment/prisma changes require the existing
manual development workflow in this version. The worker rejects those changes,
symlinks and Git-identity changes. It restores only generated next-env/build-info
files in its OWN checkout. It never resets another checkout. Relevant domain unit
tests run when found; SKIPPED is displayed honestly, never a claimed passing test.
Every job has a 30-minute cap; commands have individual caps and heartbeats.

## Trusted staging executor: explicit operator integration prerequisite

Install `ben-staging-release.mjs` as a dedicated NAS service/container with only
its private app URL, release token and the approved local deployment handler. Do
NOT add it to the coding container or provide the coding worker a Docker socket.
This repository does not contain the private, live NAS deployment procedure; an
operator MUST install/review that procedure as the handler before enabling release.
The adapter is implemented; it must not be called a working NAS deployment until
this real integration and acceptance are complete.

Settings: PERSONAL_CODEX_ENVIRONMENT=staging, BEN_CODE_RELEASE_EXECUTOR=1,
BEN_CODE_RELEASE_APP_URL=<private admin URL>, BEN_CODE_RELEASE_TOKEN_FILE=<private
path>, BEN_CODE_RELEASE_SCRIPT=<absolute operator script path outside /work>, and
BEN_CODE_RELEASE_JOURNAL=<private persistent journal directory>. Script must be a
regular non-group/world-writable file matching the app's SHA256.

The handler accepts `--repository Bryantng88/watch-shop --commit <SHA>
--request-id <UUID>` without a shell expression. It must recheck current staging,
serialize its own host cutover, preserve env/OAuth/Calendar, existing worker mounts/
security and ingress, verify backup/rollback and build/deploy exactly the approved
SHA using the staging runbook. Never invoke production tag/workflow scripts.
Its final stdout line must be JSON:

    {"deployedSha":"<approved SHA>","adminHealthy":true,"workerPreserved":true,
     "environmentPreserved":true,"privateIngress":true,"storefrontUnchanged":true,
     "backupVerified":true}

Do not emit secret environment or whole docker inspect. Executor writes the
bounded receipt to its private journal. If the lease disappears during cutover,
the trusted handler must finish or rollback safely; it is not interrupted just
because the chat closes. An uncertain result requires operator reconciliation.

## Activation / validation

Read all staging runbooks; recheck live source and outstanding queues. Deploy app
and updated chat worker/schema, then provision the separate code worker. Protect
ALL /api/internal/ben-code/* paths at ingress as well as with their dedicated
bearers. Public /api/admin/ben-code is same-origin authenticated and Long-only.
No DB, production or existing-worker access is added to the model.

Tests use synthetic GitHub/executors and a loopback DB. Verify configuration, real
sandbox confinement, a harmless source change, independent actual checks, one
remote draft PR, a separately approved merge under GitHub rules, and a separately
approved staging release with the REAL reviewed handler/backup/health receipt.
These real NAS/GitHub/model/device steps have not been performed in Cloud.
Disable code/merge/release flags to stop new work; preserve receipts/history and
reconcile any in-flight remote mutation before replacing executors.
## Production release approval

The production button is available for a completed Ben job with a recorded merge
into main. The active account must be the configured Long and have ADMIN.
The confirmation displays the full merge SHA. The server verifies the same
conversation owner and job, checks the current main SHA and the configured
required GitHub Actions checks, then creates an annotated production tag.
The tag is deterministic for the SHA. Repeating the request returns the
existing tag when it points to that commit. A conflicting tag requires
operator reconciliation.

Configure the app privately after reviewing the production Environment and
tag rules:

- `BEN_PRODUCTION_RELEASE_ENABLED=1`
- `BEN_PRODUCTION_GITHUB_TOKEN` with repository-scoped Contents write and
  Checks read access. Use a dedicated release credential in the server only.
- `BEN_PRODUCTION_REQUIRED_CHECKS` as a comma-separated list of the exact
  required GitHub Actions check names for the merge commit on main.

The tag starts the existing deployment workflow. Open the returned GitHub
Actions link to see the actual run state. Long approves the production
Environment there. The NAS runner checks the event SHA, release tag and
current main again before deployment. The response confirms tag creation.
GitHub reports whether a run has started and reached environment approval.

Live acceptance requires the release integration on main, the operator-approved
exact SHA, configured checks, and the existing protected production Environment.
Stop acceptance at the pending Environment approval. The normal chat runtime
still requires its separately configured staging environment.
## Long-only production pilot

Set `BEN_CUSTOMER_ENVIRONMENT=production`, `CUSTOMER_AI_ENABLED=1`, and
`CUSTOMER_AI_PERMISSION_CONTACT_USER_ID` to the verified active Long ADMIN
in the production database. Set `BEN_PRODUCTION_DATABASE_USER` to the
production database URL's decoded username using the protected config.
The app checks that user and the known production database host and admin origin.

Create a dedicated `BEN_CUSTOMER_WORKER_TOKEN` and mount the matching secret
read-only at `/run/worker/ben-customer-production-token` in a separate customer
worker. Start that worker with `node /opt/worker/customer-assistant-worker.mjs`
and `BEN_CUSTOMER_ENVIRONMENT=production`. It expects the app at
`http://127.0.0.1:3000` in a shared network namespace. Reattach the worker
after app replacement. Provision its own auth and work volumes. Keep the
reviewed sandbox profile, no published ports, and block internal routes at
ingress. Verify this topology before enabling the app flags.

For the production release token, also grant Actions read. The production
panel displays the current main SHA for an explicit review. The server
rejects a SHA with a successful or active production workflow and rechecks
main and required checks before tagging. Test with a fresh approved SHA
and stop at the GitHub Environment approval.
