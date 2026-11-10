# Ben latency changes

This change removes scheduling overhead without changing model instructions,
business tools, approval requirements, server lease fencing or write retries.

## Worker

The customer worker continues to claim and execute one leased run at a time.
Successful runs no longer impose a five-second cooldown before the next claim.
Empty claims back off through 1, 2, 4 and 5 seconds, then remain at five seconds;
failures retain the five-second delay. Stop is checked before another claim.
Heartbeat, cancellation, deadlines and temporary-file cleanup finish before the
next run. The worker image includes the new queue helper.

## Browser

Pending replies are checked at most once per two seconds after the previous
read completes, with a one-second local timer granularity. Tracking dispatched
work retains a five-second interval. Idle, hidden and offline tabs do not poll.
Failed reads back off through 5, 10, 20 and 30 seconds. A GET has a 20-second
deadline. This does not replay any POST or automatically approve work.

Only one background read may be active. Explicit refresh/selection supersedes
the previous read; stale results and errors cannot update the selected chat.
New chats, submissions, session expiry, offline/hidden transitions and unmount
invalidate reads. Returning online or to a visible tab refreshes authoritative
state. Existing request keys, source-message navigation checks and one-click
approvals remain in place. No private conversation data is persisted locally.

History serialization reuses the current authenticated actor within one owned
list request instead of reading that same actor again for every conversation.
Each request still loads current account permissions. Ownership, per-message
redaction, linked-task visibility and image authorization still run. Actor state
is not cached between requests, accounts or permission changes.

## Verification

- Run the Ben contract commands from `.github/workflows/ben-contract.yml`.
  The queue tests cover serial claims, immediate draining, bounded idle/error
  backoff, stopping and lifecycle failure. Browser read tests cover replacement,
  cancellation, timeouts and retry bounds.
- With local Playwright, Chromium and esbuild available, run
  `node scripts/smoke-ben-performance-browser.cjs` from the repository root.
  `BEN_PERFORMANCE_CHROMIUM` may select a Chromium executable. The fixture uses
  the actual AiAssistant component with synthetic API data; Next routing,
  image rendering and Markdown rendering are adapters. It covers response
  delivery, slow-read coalescing, idle/hidden/offline behavior, new chat/history
  selection, expired sessions and absence of automatic write replay. It does
  not test actual model speed, the database or production infrastructure.

In the local fixture, an answer completed at 150 ms became visible at about
2.9 seconds. This measures polling behavior only, not live model latency.
Idle/error intervals have deterministic tests; no production speedup is claimed.

Local full validation is limited by a missing existing `react-markdown`
dependency: package installation returned proxy HTTP 503, TypeScript reported
that missing module and its consequent type errors, and the production build
failed. Other contract tests passed (92); BenMessage's renderer test could not
load that dependency. Worker/PWA tests passed (46), including the new queue
tests. Lint for changed files passed; repository-wide lint still reports
pre-existing errors. CI must validate the normal installed dependency set.

Persistent Codex sessions, model changes, streamed model output and splitting
the history API are deferred. They need measurements and a separate review of
conversation isolation and authorization. Deployment is a separate action.
