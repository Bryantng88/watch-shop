# Combined staging release: PR #18, #31 and #35

This is a staging release record, not authorization to merge or deploy production.

## Sources

- PR #18 (`8805769bd163fe32014c4a381f9b2c9336e92422`): storefront gallery Home/catalog and editorial CMS.
- PR #31 (`47899d0412d4fcb1d1524e347342aab7fc050cdc`): technical issue Board/List presentation.
- PR #35 (`db32a7e58a3ffe22c8d835b25497d37f497595f9`): Sales AI intake; includes the existing Calendar/Personal/Order Codex dependency chain.
- Integrated application source: `e9123ea1e8025f0dc0228c5f6cc07da9a19d78e9`. The Prisma schema conflict was resolved by retaining both Sales/Order/Personal models and StorefrontDocument.

Both staging applications use `watch-shop:staging-combined-e9123ea1`, image ID `sha256:829e4a087031ac6c39fa27fc400b2ae6131e08e81dbabfc8d73abdceed8d15b5`. Verify live revision labels before future releases; do not treat this snapshot as current indefinitely.

## Infrastructure and configuration

Read staging-deployment-runbook.md before changing anything. Runtime env was carried forward in memory with a staging DB guard. The only application flag added was `SALES_CODEX_ENABLED=1` to admin. Storefront flags were not enabled. Worker adds `SALES_CODEX_WORKER=1`; preserves dedicated auth/work/secrets volumes, ChatGPT login, UID, read-only filesystem, seccomp, cap-drop, no-new-privileges and resource limits. No Docker socket, DB credentials or NAS key is granted to the worker.

`AUTH_SECRET`, token-encryption keys, OAuth settings and existing Personal/Order configuration were preserved. Calendar configuration check reports ready with callback `https://admin-staging.vinticwatches.vn/api/admin/personal-work/google/callback`.

The public proxy source file `/share/WatchShop/staging/nginx-storefront-staging.conf` is root-owned and was not modified. An initial rollout could not write it and restored the previous applications and worker. The resumed rollout uses a user-owned, read-only config bind at:

`/share/CACHEDEV1_DATA/homes/user/.staging-deploy/pr18-pr31-pr35-20261104/nginx-public-combined.conf`

Only the two staging storefront proxy containers were replaced, preserving the exact nginx image digest, ports, networks, restart policy and other configuration. Added public routes are exact `/stories` and prefix `/stories/`. Admin proxy config retains all existing rules and adds only exact `/storefront-preview`; application authentication/PRODUCT_UPDATE remains required. Private `/api/internal/*` stays denied through both ingress families. No DNS, Cloudflare Access/Tunnel, production proxy or wildcard binding change was made.

## Database and rollback

An approved staging-only backup remains on NAS under the release directory: `backups/staging-before-combined.dump`, SHA256 `80c1620e9340d4ad332cecde5b553b0dc8c6cdeb22c8c3d9c64b92084745cd8c`. It was verified with pg_restore listing, not downloaded or restored into tests.

Applied additive migrations: `20261023030000_storefront_content` and `20261103180000_sales_codex_intake`. Staging migration status has 84 applied migrations. Synthetic tests used a separate network-isolated tmpfs database, built from the previous deployed schema plus these two SQL migrations; this does not claim that the historical migration chain bootstraps a blank database.

Original app, worker and public proxy containers are retained stopped with suffix `-rollback-combined-20261104`. Before rollback, check active jobs and stop the new worker. Stop and rename new apps/proxies, rename the retained original containers to their canonical names, and start them. Restore `backups/nginx-admin-before.conf` to the user-owned `/share/CACHEDEV1_DATA/homes/user/nginx-admin-staging-lan.conf`, run `nginx -t` then reload both admin proxies. Reload restored storefront proxies after application DNS changes. Do not write the root-owned public config. Retain additive DB tables; do not automatically restore/reset/drop data. Recheck all ingress deny rules, login, health and Calendar after rollback.

The original DB backup predates this release. Restoring it would discard subsequent staging writes and requires a separate explicit decision; image rollback does not require DB restore.

## Validation

Completed: updated worker tests 11/11 in Linux; domain tests 22/22; changed-file ESLint (zero errors, one pre-existing unused-variable warning); TypeScript; optimized runtime build; synthetic Sales transaction/evidence/idempotency/cancellation tests and Order workflow tests. Full repository lint was not claimed.

Live HTTP acceptance passed CMS image upload, draft isolation/authenticated preview, optimistic revision conflict, published snapshot isolation and unpublish; the temporary article was unpublished and only its own uploaded test image removed. Existing Home content was not overwritten. Authenticated TI HTML renders Board/List controls. Real Personal Codex regression succeeded; real Order Codex produced a draft without creating tasks, then explicit approval created five department-visible synthetic tasks idempotently. Test tasks were cancelled and test users deactivated; audit history retained.

Real Sales CLI acceptance passed after correcting the structured-output schema: run `fc80c750-29f6-4879-a148-7d2bf447382d` resolved three synthetic customer/watch pairs through 13 read-only lookups, created six internal tasks and six notifications, and replayed idempotently without creating orders or changing watch stock/sale stages. Test tasks were cancelled and test users deactivated. The first two attempts failed because CLI output accepted lead identifiers rejected by the server. Worker source `865ff64e2fc1cd8fda13bfec7174542a00e28a57` aligns lead-key pattern and plan bounds and adds allowlisted error codes without logging business text or secrets. Worker image is `watch-shop-codex-worker:staging-combined-865ff64e`; app source remains e9123ea1. Linux worker tests pass 11/11; Windows cannot run its POSIX integration fixtures (`which` and POSIX path assumptions), so Linux results are authoritative.

Interactive browser acceptance remains pending: the integrated browser still exposes a Google sign-in tab for Cloudflare Dashboard, not an authenticated admin-staging page. Automatic approval review rejected observing the unrelated Dashboard; no alternative browser or Dashboard access was used to bypass that restriction. Authenticated HTTP/server rendering, ingress and live CLI paths were verified, but no claim is made of clicking the TI Board/List controls or visual layout acceptance.

## Where to review

- Storefront: https://staging.vinticwatches.vn
- CMS: https://admin-staging.vinticwatches.vn/admin/settings/storefront
- Technical list: https://admin-staging.vinticwatches.vn/admin/coordination/operation?view=technical-issue-flow&tiLayout=list
- Sales AI: https://admin-staging.vinticwatches.vn/admin/coordination/sales

Sales intake differs from Order proposals: submitting a complete, unambiguous Sales request authorizes internal tasks and in-app notifications after server checks. It does not create orders, reserve stock, purchase, record payment or send customer messages. Dependencies/automatic progression are not implemented. Do not promise those behaviors during acceptance.


