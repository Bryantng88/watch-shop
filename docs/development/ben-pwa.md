# Ben avatar and PWA starter

This branch builds on PR40's authenticated Ben chat. Merge the dependency chain
before this PR; it does not enable Ben in production or change worker permissions.

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
- Ben remains online-only and retains the existing staging readiness guard. If
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
