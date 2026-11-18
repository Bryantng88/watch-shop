# Google Calendar recovery

An existing connection row means the account was linked, not that Google still
accepts its credentials. The UI displays a separate synchronization failure
state after the calendar read.

- Expired access tokens refresh automatically. A Calendar API 401 retries once
  with a refreshed token.
- Missing refresh credentials, unreadable stored credentials, rejected refresh
  grants, and a remaining 401 require user consent again. The existing linked
  account remains stored; the button opens the standard OAuth consent flow.
- Invalid OAuth client configuration requires an administrator to check the
  existing Client ID/Secret configuration. Reconnecting is not offered as a
  cure for this case.
- Network, timeout, quota and server failures retain the retry action. Automatic
  background reads stop after a definitive reconnect-required response.
- API errors expose safe messages only. Google error payloads and token values
  are never sent to the client.

Tasks remain in the application if Google is unavailable. After reconnecting,
use the existing retry action on any task that was saved without a Google link.
Do not recreate or delete the task to repair its calendar synchronization.

If this recurs around seven days after consent, check the OAuth consent
screen's Publishing status in Google Cloud. External apps in Testing mode that
request Calendar scopes can receive refresh tokens limited to seven days.
Publishing status must be checked before attributing a production failure to
this setting; the generic screenshot alone does not identify the Google error.
Changes to Google Cloud settings and actual Google consent require the account
owner/administrator.

Verification:

- `node --import tsx --test src/domains/personal-work/server/google-calendar-error.test.ts src/domains/personal-work/server/google-event-edit.test.ts`
- `scripts/smoke-work-responsive-ui.cjs` exercises reconnect-required, temporary
  failure and successful retry states with mocked responses and real UI.

These tests never read production credentials or create Google events.
