# Admin private domain on NAS

Last verified: 2026-08-10

## Outcome

- Canonical URL: `https://admin.vinticwatches.vn`
- Admin remains private: reachable only from the `192.168.1.0/24` LAN or through the NAS VPN.
- No admin port is forwarded on the Internet router.
- The application still listens on NAS port `3000`; users never need to include that port.
- The app root redirects to `/admin`; unauthenticated users continue to `/login?next=/admin`.

## Request path

```text
LAN/VPN client
  -> admin.vinticwatches.vn (192.168.1.253)
  -> dedicated Nginx TLS proxy on NAS :443
  -> http://127.0.0.1:3000
  -> watch-shop-app-1
```

## DNS

Cloudflare authoritative DNS contains this private, non-proxied record:

```text
Type: A
Name: admin
Content: 192.168.1.253
Proxy status: DNS only (reserved IP)
TTL: Auto
```

Do not enable the orange-cloud proxy for this record. DNS resolution is public, but the RFC1918 destination has no route from the public Internet.

## TLS proxy

- Container: `watch-shop-admin-internal-proxy`
- Image: `nginx:1.28.0-alpine`
- Network mode: `host`
- Restart policy: `unless-stopped`
- Repository config: `ops/nginx-admin-internal.conf`
- NAS config: `/share/WatchShop/admin-internal-proxy/nginx.conf`
- NAS certificate directory: `/share/WatchShop/admin-internal-proxy/tls`
- Private key mode: `0600`

The proxy sends the original host and HTTPS forwarding headers to the app. HSTS is enabled after a valid HTTPS response.

The former QNAP reverse-proxy rule `watch-shop-admin-internal` is **Disabled**, not removed, as a short-term rollback path. The storefront staging rule on port `8443` was not changed.

## Certificate

- Issuer: Let's Encrypt
- SAN: `admin.vinticwatches.vn`
- Issued with ACME DNS-01 through a Cloudflare API token scoped only to:
  - `Zone / DNS / Edit`
  - `Zone / Zone / Read`
  - zone `vinticwatches.vn`
- Current certificate expiry: 2026-11-08 UTC

Local ACME state and exported files are outside the repository:

```text
%USERPROFILE%\watch-shop-cert\admin.vinticwatches.vn
%USERPROFILE%\watch-shop-cert\admin.vinticwatches.vn\export\fullchain.pem
%USERPROFILE%\watch-shop-cert\admin.vinticwatches.vn\export\private-key.pem
```

Never commit the ACME state, Cloudflare token, or private key. Automatic renewal and proxy reload are still pending operational work.

The QNAP global server certificate was deliberately not replaced. It remains assigned to `longnd.myqnapcloud.com`, which is also used by existing NAS/media endpoints.

## Verification

From a LAN or VPN client:

```powershell
Resolve-DnsName admin.vinticwatches.vn -Type A -Server 1.1.1.1
curl.exe -I https://admin.vinticwatches.vn/admin
```

Expected:

```text
DNS address: 192.168.1.253
HTTP: 307
Location: /login?next=%2Fadmin
No TLS warning
```

On the NAS:

```sh
/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker ps \
  --filter name=watch-shop-admin-internal-proxy

/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker exec \
  watch-shop-admin-internal-proxy nginx -t
```

## Browser note

Before the dedicated proxy existed, QNAP redirected HTTP port 80 to `https://admin.vinticwatches.vn:8081`. A browser may retain that URL in autocomplete. Delete the `:8081` suggestion with `Shift+Delete`, then visit `https://admin.vinticwatches.vn` once so HSTS is recorded.

## Rollback

If the dedicated proxy fails:

1. Stop `watch-shop-admin-internal-proxy`.
2. Re-enable the QNAP reverse-proxy rule `watch-shop-admin-internal`.
3. Use the previous QNAP-managed HTTPS route while diagnosing.

Do not enable both listeners on port `443` simultaneously.
