# Staging Codex execution and real Google Calendar

This extends the personal-work staging rollout recorded in PR #29. Production,
its runner and its credentials are outside this change. The role Media work in
PR #30 is separate.

## Real Google Calendar

Use the proposed dedicated origin `https://admin-staging.vinticwatches.vn`.
Configure its DNS/TLS and a private staging ingress through the existing VPN or
Cloudflare Tunnel/Access arrangement. Route it to the existing **staging admin**
proxy, never the production admin app. Do not add router port forwarding or
widen the public storefront proxy. Keep existing admin allowlists intact.

In a Google Cloud project, enable Google Calendar API and create an OAuth web
client. Configure the consent screen and include the testing Google account as
a test user when the app is in Testing mode. Grant the application's current
`openid`, `email`, and `calendar.events` scopes. Register this exact redirect URI:

```text
https://admin-staging.vinticwatches.vn/api/admin/personal-work/google/callback
```

Supply only through the staging application's private secret configuration:

```text
APP_URL=https://admin-staging.vinticwatches.vn
GOOGLE_CALENDAR_REDIRECT_URI=https://admin-staging.vinticwatches.vn/api/admin/personal-work/google/callback
GOOGLE_CALENDAR_CLIENT_ID=<configured privately>
GOOGLE_CALENDAR_CLIENT_SECRET=<configured privately>
GOOGLE_CALENDAR_TOKEN_KEY=<stable encryption secret configured privately>
AUTH_SECRET=<preserve the existing staging signing secret>
```

Do not rotate an existing token-encryption key or AUTH_SECRET as part of setup.
If staging already contains encrypted connections, preserve their original key
or disconnect/reconnect those staging accounts explicitly. Never copy production
OAuth tokens or credentials to enable staging. Keep real env files outside Git.
The redirect must match APP_URL's origin. A LAN/Tailscale IP with plain HTTP is
not accepted by this setup; localhost is supported for a separate local tunnel.

Run `node --import tsx scripts/check-personal-calendar-configuration.ts` in a
process with the intended staging environment. It prints readiness and the
public callback, never secret values. OAuth readiness is configuration only,
not evidence of a completed user consent or successful Google API request.

Log in through the canonical staging HTTPS URL, then connect Google Calendar.
The user must complete Google's browser consent themselves. Use a test account
and a synthetic event: create a timed personal task, sync it, verify it in
Google, edit its time, confirm the same event ID is updated, reload to verify
persistence, then remove the synthetic event. Test all-day work separately and
verify another user's task/calendar cannot be accessed. OAuth apps in Google's
Testing mode can have limited refresh-token lifetimes; reconnect when needed.

## Codex worker

The web application now has durable queued/running/completed/failed/cancelled/
timeout records. Adding `codex` to a new personal task or to an existing task
can queue it when configured. Only an active ADMIN who owns the personal task
can dispatch; sharing editor access or being a different ADMIN is insufficient.
Existing tagged tasks are not bulk-dispatched on deployment. Their owner can
use **Gửi Codex thực hiện**. An explicit retry creates a new auditable run.

The worker claims one run atomically and renews a fenced lease. Duplicate
requests/claims do not execute the same run twice. Lost leases expire terminally;
the old worker cannot report success, and it must stop on failed heartbeats.
Cancellation, removed tags, inactive requesters and finished/cancelled tasks
stop execution. Review the old worker before explicitly retrying an expired run.
Success records a result for human review and does not mark the task DONE.

Apply migration `20261031100000_personal_codex_runs` after the normal staging
backup and migration rehearsal. The table is additive; no existing task is
rewritten. In the staging admin app, set privately:

```text
PERSONAL_CODEX_ENABLED=1
PERSONAL_CODEX_ENVIRONMENT=staging
PERSONAL_CODEX_WORKER_TOKEN=<random secret of at least 32 characters>
```

The app also checks the database name is `watch_shop_storefront_staging` (or a
specifically guarded loopback test database). An enabled flag cannot enable
this executor against the production database. Deploy remains separately scoped
to staging; do not use the production release workflow or a production tag.

Use a dedicated Linux user/host/container with an isolated clone, not the NAS
production runner or an application checkout. Install Node.js, Git and a pinned,
maintained Codex CLI version supporting `exec --sandbox workspace-write` and
`--ignore-user-config`. The runtime must support the Codex sandbox: do not use
`--dangerously-bypass-approvals-and-sandbox` to fix a failed startup.

Example service/environment templates are in `ops/codex-worker/`. QNAP setups
without systemd need an equivalent dedicated process/container supervisor; the
service file is a Linux example, not a command to apply to QNAP blindly. The
worker needs only its dedicated staging API, Codex authentication and a GitHub
credential scoped to this repository with branch push and PR creation rights.
It receives no NAS SSH key, database credentials, production files or Docker
socket. Do not persist GitHub credentials in Git config; the worker injects them
only into its own Git subprocesses and never into Codex tool subprocesses.

Initialize a dedicated clone of `https://github.com/Bryantng88/watch-shop.git`
under the worker's configured root and create the non-secret sentinel file
`.git/personal-codex-worker` there. Authenticate Codex as a dedicated authorized
account or supply its API key privately. Never copy the current chat executor's
auth directory or use a workstation key committed to Git.

The sample worker endpoint is the staging admin app on a private Docker network.
The `/api/internal/personal-codex/*` routes are **not** exposed by the existing
admin ingress. Keep them internal; do not widen admin/storefront proxy rules.
Private HTTP is an explicit worker opt-in; use HTTPS for a remote worker unless
the transport is already confined to the staging network/VPN.

The worker creates a new checkout per run from origin/main. Codex gets
workspace-write sandboxing and no inherited shell credentials. Production
workflow/deployment files, AGENTS.md, env files, credential paths and symlinks
require manual handling and cannot be automatically published by this worker.
After a successful leased run, the worker can commit to a unique
`codex/personal-work/<run-id>` branch and open a **draft** PR. It never pushes
main/tags, merges, deploys, sends customer messages or approves an Environment.
Failed worktrees remain private for inspection; manage retention deliberately.

## Acceptance and recovery

Check an unauthorized worker token returns 401, an unconfigured executor returns
503, another owner/editor cannot dispatch, simultaneous claims return only one
lease, cancellation stops the actual child process, and an expired worker's
completion is rejected. Then run one synthetic repository task with real Codex
credentials and confirm the returned draft PR, summary and run history in the
personal-work UI. Mocked/unit/database tests alone do not establish that real
Codex or Google Calendar is connected.

Disable PERSONAL_CODEX_ENABLED to stop new dispatch/worker API access. Stop the
isolated worker before inspecting/retrying a timed-out run. Keep completed PRs
and task history; do not reset staging or restore over new data automatically.


## Cloud execution prerequisites

For the ChatGPT-authenticated Codex CLI, the reviewed Cloud HTTP policy must
permit `chatgpt.com` (the actual API path is
`https://chatgpt.com/backend-api/codex/responses`, with WebSocket/HTTPS transport).
A successful `codex login status` is not proof that the model endpoint can be
reached. An HTTP CONNECT 403 requires a policy configuration change, not a proxy
bypass. An API-key-based dedicated worker instead needs its configured provider
endpoint, typically `api.openai.com`, and its own securely configured identity.

NAS deployment from Cloud separately needs an explicit TCP grant for the NAS
Tailscale destination and a securely configured SSH identity/verified host key.
The HTTP ingress grant does not grant SSH. Keep the worker API private; a Cloud
worker can reach the confirmed staging application through an authenticated
SSH forward after access is configured, without exposing internal API routes
on the public admin ingress. Do not forward the production application port.
