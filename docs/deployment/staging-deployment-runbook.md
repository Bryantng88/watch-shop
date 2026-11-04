# Staging deployment and Codex handoff

This is the entry point for a new Codex chat operating staging. Read AGENTS.md first. This runbook documents the NAS staging deployment; it does not authorize a production release. Snapshot last verified: 2026-11-03. Recheck live metadata before changing anything.

Latest combined release record (2026-11-04): [PR #18/#31/#35 staging release](staging-combined-pr18-pr31-pr35-20261104.md). It records the integrated app/worker sources, proxy mount change, migrations, backup, rollback and live acceptance. Recheck current metadata before using any historical container identifiers.

## Where this documentation lives

The staging Calendar/Codex design is in personal-work-codex-calendar-staging.md. Worker runtime details are in ../../ops/codex-worker/README.qnap.md. PR #32 contains the worker runtime and this handoff and depends on PR #29. Until those changes are merged, a chat on main will not automatically have them. Fetch/read PR #32's branch codex/staging-worker-chatgpt-20261103, including this file; do not assume local scratch files exist on another computer.

There is currently NO checked-in staging deployment workflow or one-command deploy script in this branch. .github/workflows/deploy-production.yml and scripts/deploy-production.ps1 are production paths and must not be reused blindly for staging. Existing deployments were controlled local SSH/Docker operations. The procedure below is the operating contract, not a claim that a portable deployment tool already exists.

## Targets and boundaries

| Purpose | Confirmed target |
| --- | --- |
| Admin UI | https://admin-staging.vinticwatches.vn/admin/personal-work |
| Storefront | https://staging.vinticwatches.vn (different application/ingress) |
| LAN admin proxy | http://192.168.1.253:18089 |
| NAS SSH | user@192.168.1.253 port 22253 |
| Docker CLI | /share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker |
| Admin container | watch-shop-storefront-staging-admin-app |
| Storefront container | watch-shop-storefront-staging-app-1 |
| Database guard | host watch-shop-staging-db, database watch_shop_storefront_staging |
| Worker | watch-shop-staging-codex-worker |
| Private network | watch-shop-staging |
| Admin proxies | watch-shop-staging-admin-proxy, watch-shop-staging-admin-tailscale-proxy |
| Storefront proxies | watch-shop-staging-lan-preview, watch-shop-staging-public-proxy |

Cloud previously lacked the required NAS path/identity. Local Windows SSH works with the dedicated custom identity; do not diagnose a missing default identity as a NAS outage. Use the key as an identity file, never read its contents or obtain STAGING_SSH_PRIVATE_KEY_B64 from Cloud.

```powershell
ssh -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes `
  -i "$env:USERPROFILE\.ssh\watchshop_nas_ed25519" `
  -p 22253 user@192.168.1.253 id
```

Expected uid=1000(user), administrators group. Verified ED25519 host fingerprint: SHA256:XqCsTAsAFLhvaW7c9Y9heW+0CkXsTxCu2T9RGTg/73k. If the client lacks a known-host entry, verify it through a trusted channel and use an explicit verified known-hosts file; never disable host checking. Do not assume passwords, ssh-agent or default id_ed25519. No sudo, SSH changes, Docker socket grants or production access are required for ordinary staging deployment.

## State verified on 2026-11-03

- Admin image: sha256:37e9ab3345c8081034197c5b4f0e95f5f71aa23a55aea76f293ec69283bac1ca. This is an image identity, NOT proof of its exact Git commit. Establish a revision label/build record before reporting a deployed commit.
- Worker image: watch-shop-codex-worker:chatgpt-20261103, sha256:8454f32a8906a79595324d11c80e1fb78dc1ae8800523abac7819f5a76a41666. Codex CLI pinned to 0.166.0. Runtime source/setup is in PR #32; the volume remount seccomp fix is commit 530732e.
- The worker's isolated origin/main baseline was 62d0fa51770ee585fa26e72beabc8727dbb1f2d8. It fetches main for each new run; it does not automatically work from PR #29's head.
- Admin healthy, worker running with restart count zero; /login returns 200 and /api/internal/personal-codex/claim returns 404 through admin ingress.
- Real acceptance run 08eab3e6-1247-4bf4-b193-69e92f2b9344 dispatched through createPersonalWorkAction, executed a real ChatGPT-authenticated Codex run, created draft PR #33 with exactly one synthetic Markdown line, and displayed the result URL/summary in authenticated Personal Work HTML. Task remained TODO. Synthetic user was deactivated; failed preliminary fixtures/history were retained. This was HTTP/server-action acceptance, not a claim of clicking through a browser.
- Production, SSH settings, existing proxy rules and OAuth credentials were not changed by worker activation.

## Preserve these settings on every deployment

Never reconstruct env from examples, print docker inspect wholesale or dump env files. Carry forward the CURRENT staging application's Env and HostConfig in memory, validate the staging DB target, and compare unchanged entries before starting the replacement. Authorization to handle staging configuration internally is not permission to copy production credentials.

Preserve APP_URL=https://admin-staging.vinticwatches.vn, its exact Google Calendar callback /api/admin/personal-work/google/callback, Google OAuth client settings, AUTH_SECRET, GOOGLE_CALENDAR_TOKEN_KEY and any existing token-encryption configuration. Preserve all unrelated configuration. Do not rotate or regenerate secrets to make a check pass.

The admin app now needs PERSONAL_CODEX_ENABLED=1, PERSONAL_CODEX_ENVIRONMENT=staging and the existing PERSONAL_CODEX_WORKER_TOKEN. Its token must match the file api-token in the worker's dedicated secrets volume. Do not generate a new token on each deployment. The worker launcher reads private api-token and gh-token files; values are never recorded here.

Worker volumes are watch-shop-staging-codex-auth at /var/lib/codex/auth, watch-shop-staging-codex-work at /work, and watch-shop-staging-codex-secrets at /run/worker (read-only in the worker). Preserve all three. No DB env, NAS key, Docker socket or published worker port. Keep cap-drop ALL, no-new-privileges, read-only rootfs, tmpfs, resource limits, restart policy and the reviewed worker-only seccomp profile. Do not replace it with Docker's builtin profile (sandbox fails), unconfined or SYS_ADMIN.

The seccomp profile needs real-volume acceptance: tmpfs-only smoke missed writable-volume remount flags. CLI sandbox test syntax is `codex sandbox -- COMMAND`; worker exec uses explicit default_permissions/profile overrides. Do not remove credential deny-read rules to fix helper errors. See worker README and tests.

## Controlled staging release sequence

1. Read these docs, refresh remote refs, record the exact requested source SHA and preserve unrelated local changes. Use a dedicated branch/checkout. A user must request deployment, not merely a review.
2. Read-only preflight: verify SSH identity, current staging container IDs/images/revision labels, filtered network/port metadata, app health and queued/running Codex counts. Validate database hostname AND name internally. Avoid production containers/env and never rely on container IP 172.29.4.8: IPs change on recreation.
3. Prepare a concrete change/rollback record, candidate image with immutable tag and source revision label, and appropriate source/domain checks. Do not claim the full repo lint/build passed unless it did. Review current scripts and image layout; historical scratch scripts are not a portable deployment API.
4. For schema changes: create a consistent staging DB backup, verify it, restore into an isolated rehearsal DB, and test migrations and previous-image compatibility there. Do not reset the live DB or reverse migrations automatically. Without schema changes, do not invent migration/reset work.
5. Allow active Codex work to finish or explicitly cancel and confirm process termination before stopping/recreating the worker. Stop the worker before changing worker API/env/schema; preserve queued runs and their history. Do not bulk-dispatch existing tagged tasks.
6. Create a stopped replacement for each changed staging app from current launch config, preserving all env/HostConfig/network memberships/aliases and pinning the candidate image. Check the candidate against the baseline without printing secrets. Retain original image and container for rollback; no premature deletion.
7. Stop/rename originals, give replacements canonical names and start them. Verify health/readiness/login. Docker-assigned IPs may change: validate then reload ONLY the proxies serving changed apps; never widen ingress rules or add public worker routes. If only admin changes, only its two proxies need reload.
8. Confirm Google Calendar configuration with `node --import tsx scripts/check-personal-calendar-configuration.ts` in an appropriate ops/build runtime carrying intended staging config internally. Runtime standalone may bundle dependencies and not contain tsx/source. Never print credentials to work around missing modules.
9. Start/verify the worker using its retained auth/work/secrets volumes and tested profile. Verify real model/tool connectivity, not merely login status or an open TCP port. Do not require a new ChatGPT login unless its dedicated auth is no longer valid.
10. Acceptance: login page/health/ready 200; unauthenticated Personal Work redirects to login; wrong worker token rejected privately; public internal API stays denied; authenticated UI can queue one isolated synthetic task, worker claims it once, returns a result and draft PR, UI history contains it, and task remains TODO. Validate only intended files in the draft PR. Retain an audit result and deactivate synthetic accounts. Never run this against a production DB.
11. Recheck all non-target configuration and image/environment preservation, health, ingress and worker restarts. Record source SHA, image identity, backup/rehearsal if applicable, old/new container IDs, evidence, limitations and exact rollback location. Keep durable scripts/docs in Git and non-secret live handoff accessible on NAS; another chat cannot see this chat's memory.

## Recovery and renewal

Stop the worker first (so its process groups cannot keep executing). Stop the failed replacement app, rename it away, restore the retained original's canonical name/start state, validate/reload only its existing proxies, and recheck login/health/internal-route denial. Keep task/run/PR history and auth volumes. No automatic DB restore. Original admin retained during worker activation under watch-shop-storefront-staging-admin-app-rollback-codex-20261103; verify live name/ID before use and do not confuse it with older PR29 rollback containers.

NAS non-secret build/diagnostic assets from this session are under /share/CACHEDEV1_DATA/homes/user/.staging-deploy/worker-runtime-20261103 and seccomp-probe-20261103. Live worker's seccomp config is embedded in its Docker HostConfig; its volumes hold credentials. Runtime Docker settings survive container restart, but there is no confirmed Compose env/source-of-truth path in container labels. A future redeployment that replaces Env from an old example can silently disable Codex; current-state preservation is mandatory until a checked-in staging deploy tool is implemented.

The owner's dedicated fine-grained GitHub token expires 2026-12-03. Renew privately with repository Contents write and Pull requests write, preserving the API token/auth/work volumes, and restart only the worker after validating the new token. Do not grant Workflows/admin rights or reuse the production runner's credential. Never paste tokens into chat.

Production promotion is separate: merge reviewed code through normal PRs, verify origin/main and checks, obtain explicit authorization for the exact annotated production tag, push that tag and let the user approve the production Environment. Do not turn the worker into a production executor by changing its staging guard.

## Order proposal extension (2026-11-03)

Read order-codex-workflow-staging.md for the order-detail prototype. Preserve ORDER_CODEX_ENABLED=1 on the staging admin and ORDER_CODEX_WORKER=1 on its worker in addition to the existing Personal Codex settings. The separate durable OrderCodexProposal queue must not be treated as a code-change job: it only returns a JSON plan, and a separate same-origin ADMIN approval creates tasks. No code PR is produced for order planning. Both queues must be idle before stopping the worker.

Feature source revision bed43cf4 adds migration 20261103110000_order_codex_proposals (82 migrations total), a reviewed task planner and operation ad-hoc routing. NAS release assets/approved backup are in /share/CACHEDEV1_DATA/homes/user/.staging-deploy/order-proposals-20261103. This backup remains on NAS and was not restored into the synthetic test database. The new admin image is watch-shop:order-proposals-bed43cf4; the worker image is watch-shop-codex-worker:order-proposals-20261103. Verify live image IDs/revision labels, not these mutable names alone.

The pre-feature admin and worker were retained stopped with suffix -rollback-order-20261103; an intermediate admin is retained with suffix -rollback-order-3bb26dc0. To disable the whole order feature, stop the upgraded worker, restore the pre-feature admin/worker canonical names, start them and validate/reload the two admin proxies. Keep the additive table, proposal/task audit history and dedicated auth/work/secrets volumes. Do not accidentally use the older rollback-codex snapshot which predates Personal Codex activation. No storefront/production release was performed.

## Prompt for a new chat

> Read AGENTS.md and docs/deployment/staging-deployment-runbook.md from PR #32 / branch codex/staging-worker-chatgpt-20261103 (if absent on main, fetch that branch first). Also read docs/deployment/personal-work-codex-calendar-staging.md and ops/codex-worker/README.qnap.md. Continue the requested staging deployment at commit <SHA>. First verify live state read-only; preserve existing staging OAuth/AUTH_SECRET/encryption keys, Codex flags/token and worker auth/work/secrets volumes. Use the existing Windows SSH identity without reading it. Do not change production, SSH or ingress. Propose the concrete release/rollback before activation; do not assume local scratch files from another chat exist.

