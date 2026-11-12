# Ben work notifications and compact creation

Assignment/share changes save an inbox notification and one durable delivery per
subscribed endpoint inside the business transaction. Approval replays and unchanged
share saves do not enqueue a second notification. Self actions do not notify the
actor. Delivery runs after commit; it rechecks current subscription version, active
account and item access. Removing sharing or signing out stops queued delivery.

Personal work and events support start-time reminders, 10/15/30/60 minutes before,
or no reminder. Only actual clock times trigger reminders; all-day/date-only items
are excluded. The default is start-time. Ben plans support the same setting and show
an explicitly requested setting in the compact review. UI edit can disable/change it.
Reminders use current schedule/advance time as identity; completion, cancellation,
rescheduling and disabling reminders invalidate pending reminders. Catch-up is 15
minutes to avoid flooding after downtime. Inbox and push have separate delivery:
users without granted push still receive inbox entries.

The notifications service polls the authenticated internal endpoint every 15 seconds.
A database lease prevents concurrent cycles from delivering the same endpoint row.
Transient failures retry up to five attempts; 404/410 remove only the matching
subscription version. Successful endpoints are not retried because another endpoint
fails. A process crash after provider acceptance can repeat delivery; the stable OS
notification tag replaces the existing notification. Web Push is not an alarm clock.
No conversation, task title or customer/financial content is sent to the push service
or cached in the service worker. Push copy is generic; the inbox carries the title.
Click routes are allowlisted; target pages retain login and data access checks.

## Release configuration

Keep the existing VAPID pair between releases. Set server-only
`BEN_PUSH_PUBLIC_KEY`, `BEN_PUSH_PRIVATE_KEY`, `BEN_PUSH_SUBJECT` and a strong
`INTERNAL_JOB_SECRET` in the NAS runtime environment. Never commit their values.
The public VAPID key is returned by the authenticated subscription endpoint.
Generate a pair once with `npx web-push generate-vapid-keys --json`. Allow outbound
HTTPS to the device's push provider (FCM, Mozilla, Apple). Existing provider allowlist
is retained. Do not bypass Cloudflare Access or change application permissions.

The additive migration adds an optional notification dedupe key, a reminder setting
and the delivery table. The previous application remains compatible. The deployment
runner starts the notification service only after application health succeeds.
Rollback of an app image does not reverse this migration. When rolling back to an
image predating `ops/notifications/worker.mjs`, stop the notifications service too.
Staging operators start `notifications` with the same image and env file as app;
never reuse production deployment scripts for staging.

## Acceptance

Run `node --import tsx scripts/smoke-work-push.ts` only against an isolated local
`work_push_test` PostgreSQL database. It refuses other hosts/database names and
stubs Web Push so no real notification escapes. CI covers transaction rollback,
dedupe, concurrent claims, self actions, reminders, cancellation, revoked sharing,
transient retry and expired endpoints. Run worker/route tests and normal lint,
TypeScript and production build. On physical devices verify Android Chrome and
an installed iOS 16.4+ Safari PWA: grant permission, use Gửi thử, assign/share from
another account, close PWA, receive notification, open correct work, sign out and
confirm no further delivery. Permission is requested only after a user click.
