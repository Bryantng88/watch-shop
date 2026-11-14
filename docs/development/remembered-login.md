# Remember this device

The login form offers an unchecked “Ghi nhớ thiết bị này trong 30 ngày” option.
Without it, login remains valid for 12 hours. Checking it issues a signed token
and HttpOnly cookie with the same fixed 30-day lifetime. There is no automatic
renewal or password storage in localStorage. Existing signed tokens remain valid
until their original expiry; opt-in requires one fresh successful login.

Logout clears the cookie as before. Account-active checks and permission checks
still run on protected requests. This uses the existing stateless session model:
logout removes this browser's cookie, not copies of a token elsewhere. No device
registry, remote session revocation, passkey or refresh-token system is added.

Cloudflare Access has a separate session and can still request authentication;
this change does not modify its policies. A PWA and a different browser/profile
may have separate cookie stores. A deploy does not extend existing cookies.

Verification: `node --import tsx --test src/server/auth/*.test.ts`,
`node --test tests/auth/remember-device.test.cjs`, and
`node tests/auth/remember-device-ui.cjs` (Playwright).
The service fixture uses the actual signer and service with synthetic password,
user and cookie boundaries. Browser tests use the actual LoginForm and assert
both checkbox states, deep-link return and retry after failed login.

Device acceptance after deployment: sign in with the option checked, close and
reopen Ben, verify access the next day, then sign out and verify login is required.
Do this separately in the installed PWA and the browser users actually use.
