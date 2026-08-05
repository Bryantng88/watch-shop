# Storefront Phase 5: PWA, Security And NAS Exposure

Date: 2026-08-05

## Outcome

The storefront now has a PWA shell, an explicit offline/read-only state,
scoped browser security headers and a public-host reverse-proxy allow-list.
These are source/configuration deliverables only: no NAS proxy was changed and
no public DNS/HTTPS exposure was enabled.

## PWA Boundary

- `/manifest.webmanifest` defines standalone display, storefront start URL,
  theme/background colors and regular/maskable vector icons.
- The production public layout registers `/sw.js`; development does not.
- The service worker precaches only `/offline` and the two storefront icons.
- Runtime caching is limited to same-origin immutable `/_next/static/*` assets
  whose referrer is an allow-listed public document.
- It never handles non-GET requests, any `/api/*`, `/admin`, `/login` or
  `/profile` request. Catalog HTML, signed Watch media and order/customer data
  are not cached.
- Navigation is network-first and falls back only to `/offline`.
- A live offline banner and disabled request submit make the read-only state
  explicit; no stale price/availability is presented as confirmed.

## Application Security Headers

Public pages, public APIs and Zalo integration routes receive scoped headers:

- CSP with same-origin defaults and no frames/objects;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- strict-origin referrer policy;
- camera, microphone, geolocation and payment permissions disabled;
- `Cache-Control: no-store` on public and integration APIs.

The service worker itself is `no-cache, no-store` so rollout can replace cache
policy immediately.

## NAS Public Host Contract

`ops/deployment/nginx-storefront-public.conf.example` is a deny-by-default
public virtual host. It allows only:

- public pages and PWA shell assets;
- public catalog/order/image routes;
- the exact authenticated Zalo events route;
- required Next static/image delivery.

The fallback returns 404. It deliberately has no public location for `/admin`,
`/api/admin`, `/api/media`, `/api/internal`, `/login`, `/profile` or operations
health routes. The application container should be bound to loopback for this
deployment (`APP_BIND_ADDRESS=127.0.0.1`), while the existing LAN/VPN admin host
remains separate.

The example requires HTTPS, a 64 KiB body limit and bounded proxy timeouts. NAS
certificate paths, hostname and the platform-specific `proxy_params` include
must be filled and reviewed during deployment.

## Verification

- `npm run storefront:smoke-pwa`: pass; 13 cache/proxy/header assertions.
- Scoped ESLint: pass.
- TypeScript `--noEmit`: pass.
- Production build: pass; 127/127 pages generated and the manifest, offline
  page and Zalo integration route are present in the route table.

## Remaining Acceptance

- Validate installability on an HTTPS test hostname. Some target browsers may
  require raster 192/512 icons in addition to the vector icons; add them if the
  device acceptance test requires them.
- Apply the Phase 3/4 migration to an isolated database and complete public
  order/Zalo concurrency tests.
- Test the Nginx/Synology equivalent from an external network: allowed routes
  succeed and every private route is unreachable.
- Verify CSP against real pages, image redirects and any future analytics/chat
  origins before adding those origins to policy.
- Complete 360/390/430 visual acceptance and offline/reconnect tests.
- Do not expose production until these gates and rollback checks pass.
