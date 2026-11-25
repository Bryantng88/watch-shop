# Website image upload ingress

The website editor accepts JPEG, PNG and WebP files up to 20 MB. Production
Nginx previously inherited its 1 MB default and rejected a 3,825,121-byte upload
with HTTP 413 before the application received it.

`ops/nginx-admin-internal.conf` now sets 21 MB only on the exact
`/api/admin/storefront/media` location, leaving all unrelated limits unchanged.
The extra allowance covers multipart framing; the application still enforces
20 MB per file.

## Release requirement

The application release runner does not install this proxy configuration.
During an authorized production release, install the reviewed configuration
in the existing admin proxy's mounted configuration, validate with `nginx -t`,
and reload Nginx only after validation succeeds. Keep a copy of the previous
configuration for rollback. Do not replace certificates, change upstreams,
or modify Cloudflare Access rules.

Verify an authenticated upload of a JPEG/PNG/WebP between 1 and 20 MB, confirm
that it appears in the chosen folder, then save the homepage draft. A file over
20 MB must be rejected by the editor. No production upload was performed as
part of diagnosis; evidence came from existing proxy logs.
