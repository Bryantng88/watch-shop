# Media production role

The `MEDIA` role grants `PRODUCT_VIEW`, `MEDIA_PRODUCTION_VIEW` and
`MEDIA_PRODUCTION_UPDATE`. Its business navigation contains Products and Media
Production. Account/profile functionality remains available. Roles are additive:
assigning another role to the same user can grant that role's additional access.

Media users can create/edit media posts, choose and process images, edit a
watch's media content and gallery through its dedicated media workspace, and
advance photography/media/publish workflows. They cannot edit product identity,
specifications, vendors, posting-target configuration, prices or costs, approve
product reviews, manage storefront publication settings, use other business
workflows or access media repair/reconciliation tools. Existing approved-content
and approved-image guards still apply. Images enter through the existing media
pool; this change does not introduce an upload service.

Product editors retain their existing media operations through one-way permission
implications. Media permissions never imply `PRODUCT_UPDATE` or `TASK_VIEW`.
Login now enters `/admin`, which selects an authorized landing page. Media-only
users land at `/admin/coordination/media`. The dedicated watch media route is
`/admin/watches/:productId/media`; full product editing remains separately gated.
The server ignores product/specification/target/price fields in a media-only save,
regardless of what the client submits. Financial values are removed from media
workspace payloads before serialization.

## Rollout

No deployment or account assignment is performed by this change. During a
separately authorized staging or production release, run the normal
`prisma migrate deploy` procedure. Migration
`20261031090000_media_production_role` creates the permission catalog entries,
adds the default role, and grants the new permissions to ADMIN. It does not alter
users or unrelated roles. It fails with `MEDIA_ROLE_PERMISSION_CONFLICT` if a
pre-existing MEDIA role has extra permissions; review that conflict before
retrying instead of silently deleting existing access.

Run `npm run auth:audit-permissions` against the authorized target after migration.
The audit rejects missing permissions and extra permissions on MEDIA. Assign the
role through user management, using a separate test account with only MEDIA for
acceptance. Confirm its two menu entries, media-post creation/editing, watch media
save, permitted workflow transitions, product read-only view, and denied direct
URLs/API requests for orders, finance, technical work and administration.

## Local checks

- `node --import tsx src/server/auth/media-production-policy.test.ts`
- `node --import tsx scripts/audit-admin-permission-policy.ts`
- `npx tsc --noEmit`
- `npm run build`

`scripts/integration-media-role-boundary.ts` additionally tests forged form
fields against a disposable PostgreSQL database. It requires both DATABASE_URL
and DIRECT_URL to identify a loopback database named
`media_role_integration_test`, with the current Prisma schema already applied.
It creates synthetic fixtures and must never be pointed at staging or production.
