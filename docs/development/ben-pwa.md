# Ben PWA release readiness

Canonical production entry: https://admin.vinticwatches.vn/admin/ben.
PWA uses the same authenticated Ben and server-owned conversation history as the
web panel. Production readiness and business tools follow their own configuration;
installation never grants extra permissions. This PWA change includes PR63 daily-business reads and production badge fixes,
so deploy the resulting combined revision and its customer worker together.

- Avatar source is the user-approved cartoon of Ben. Assets are bundled under
  public/ben, with 192/512 PNG icons, an Apple touch icon and a padded maskable icon.
- /admin/ben opens the same chat component in a full-page mobile layout without
  the admin navigation. The normal panel offers a “Mở riêng” link. Both use the
  existing server-owned account history and APIs; no duplicate conversation store.
- Install manifest /ben.webmanifest is public and contains branding only. It is
  distinct from storefront's existing manifest. Start URL stays authenticated.
- Ben service worker has scope /admin/ben and does not write caches. It handles
  only navigation failures with a static offline message. No authenticated page,
  chat, API, model reply, or image is persisted by the service worker.
- Ben remains online-only and follows the configured environment readiness guard. If
  disabled, the dedicated page reports unavailable instead of showing simulation.
- Push notifications, subscriptions, reminder scheduling and background model
  runs are not part of this starter. No notification permission prompt is added.

## Device acceptance after an authorized staging deploy

1. Open HTTPS staging /admin/ben and sign in with an existing account.
2. Verify history matches the web panel; test a new reply and switching history.
3. On Android choose the browser's Install/Add to Home screen action. On iOS use
   Safari Share → Add to Home Screen. Expect Ben icon/name and standalone chat.
4. Verify safe areas, keyboard, narrow screens and tablet sizing. Check that the
   close/Escape action cannot leave an empty installed app.
5. Disconnect network and reload: static offline notice, no stored business data.
6. Reconnect; reopen Ben. Sign out and verify chats remain inaccessible.
7. Confirm storefront installation and its worker continue to operate separately.

Automated checks cover manifest/icon references and network-only worker behavior.
Actual installation, OS UI and WebKit/Android keyboard behavior require devices.

## Navigation from chat

Users can ask “Ben mở danh sách đồng hồ”, “vào công việc của tôi”, or “mở bảng
kỹ thuật”. The worker receives only the authorized screen registry and selects
an exact key through navigation.open. The server checks the canonical page policy,
the latest user's navigation intent and permissions again when finishing/loading.
Only fixed view pages are supported; no external/model URL, form submission,
creation action or business write is a navigation destination. Ambiguous targets
must be clarified in chat. Product-detail navigation is not part of this registry.

The active browser follows a successful navigation once, matched to the message
request key submitted in that browser. Reloading/history do not automatically
replay navigation; a normal link remains for reopening. Cancel, new conversation
and history selection clear the pending automatic navigation. PWA manifest scope
covers /admin/ so authorized admin destinations can remain in the installed app;
the service worker still only handles /admin/ben and caches no business data.

Deploy the updated web and customer worker/schema together for navigation. No
migration or new credentials are required. Device acceptance: try a permitted
screen, a forbidden screen, an ambiguous request, cancellation, reload/history,
and a return to Ben; verify no task/order is created by navigation.

### Structured navigation contract v2

Navigation no longer depends on server natural-language regexes. The claim payload
advertises interactionContractVersion=2 and currentUserMessage. The worker emits
navigationIntent={type:OPEN_SCREEN,sourceMessageId} only for a clear current request,
and sends it as lookup.intent with an exact registered screen key. Both worker and
server reject stale/missing source binding. App and worker must deploy together;
there is no legacy fallback that silently restores phrase matching.

The server owns navigation result codes and reply text, rechecks current rights at
finish, and rejects mixed navigation/business-review finishes. READY only prepares
navigation; it is not a browser completion claim. Browser request/conversation
binding and one-time consumption are tested separately from model interpretation.

Ben interaction contract CI runs unit, protocol, browser-boundary and PWA tests on
relevant PR changes, without credentials or DB access. Before releasing changed
intent behavior, also run scripts/smoke-ben-navigation.ts against the isolated
loopback personal_codex_test DB, plus scripts/smoke-ben-navigation-real.ts with
BEN_REAL_NAVIGATION_EVAL=1 and its private fixture worker. This uses the shared
paraphrase/negative fixture corpus and checks zero order/task writes. Never point
it at staging/production data or supply live business records to the model.

## Release review (2026-11-09)

Fixed in this change:
- Login, including an already signed-in visit to /login?next=..., returns to the
  requested validated admin path. External/encoded traversal redirects are rejected.
  Failed network login can be retried; no automatic auth/session lifetime changes.
- HTTP 401 from chat/code clears private in-memory chat and pending review state
  and offers a login link back to the current admin screen. Returning from the
  background or network loss refreshes history; hidden/offline tabs stop polling.
  Reconnect never replays a submitted write or sends an unsent draft.
- Standalone page has an explicit install control. Android uses the browser install
  event only after a click. iOS gets Safari/Add to Home Screen instructions. No
  install/notification prompt is opened automatically.
- Worker registration failures are visible with retry. Updates are checked on
  resume; reload is a separate user action warning about losing unsent text.
- Ben uses visual viewport height/offset and safe areas; mobile input is at least
  16px to avoid iOS focus zoom; header controls have 44px touch targets.
- SW and manifest revalidate; private admin/auth responses are no-store. Worker
  stays narrow, same-origin GET navigation only, with no Cache Storage writes.
  The offline screen is static and never disguises server HTTP errors as offline.

Release acceptance must be run on the actual production hostname after deployment:
1. Confirm /ben.webmanifest is JSON, /ben-sw.js is JavaScript, all Ben icons are
   images and each returns 200 rather than an HTML Access/login response. Proxy
   allowlists must allow these branding/worker files; never expose internal APIs.
2. Confirm Ben SW has Service-Worker-Allowed: /admin/ben and no-store/no-cache;
   private admin/chat/auth pages are no-store. Preserve HTTPS and auth protections.
3. Test first sign-in from /admin/ben, sign-out, expired-session login and relaunch
   from the installed icon. History must be scoped to the signed-in account.
4. Test real iPhone Safari installed mode and Android Chrome installed mode:
   icon/name, keyboard opening, long text, safe areas, scrolling, returning from
   another app, landscape and a narrow screen. Check sending one message once.
5. Confirm updates do not auto-reload a draft. Reload offline must show only the
   static notice. Reconnect must restore access without replaying writes.
6. Validate ordinary Ben chat and authorized order/technical list queries after
   deploying this combined revision; the PWA is a delivery surface, not a new AI tool.

Automated browser tests use a synthetic loopback account/API responses and Chromium.
They do not establish OS installation, actual WebKit keyboard behavior, live
Cloudflare routing, production data isolation between real accounts or push support.
Run the device checks with a small pilot group before general availability.
This change does not add push reminders, offline chat, file storage or background
AI execution. No production deployment is implied by completing these checks.

### Reproduce isolated Chromium acceptance

Requires the existing migrated loopback personal_codex_test fixture DB, an ADMIN
fixture role, a local production build/start on http://127.0.0.1:3015 with synthetic
AUTH_SECRET/worker flags, and Playwright plus a local Chromium executable. No
production credentials or data are used. Point DATABASE_URL only at that fixture,
then run `node --import tsx scripts/seed-ben-pwa-smoke.ts` followed by
`node scripts/smoke-ben-pwa-browser.cjs`. BEN_PWA_FIXTURE_FILE selects the private
fixture JSON (default /tmp/ben-pwa-fixture.json); BEN_PWA_CHROMIUM selects Chromium,
and BEN_PWA_SCREENSHOT selects the output image. Fixture secrets stay outside Git.
The seed rejects any other database target; the browser runner only connects to
loopback and rejects non-synthetic email addresses. API replies are mocked; login,
manifest/assets/headers, service worker activation and offline navigation are real.
Deactivate/delete the synthetic account and remove its fixture file after testing.
