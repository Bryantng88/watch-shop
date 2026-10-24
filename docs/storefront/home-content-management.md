# Vintic Home and editorial management

## Scope and entry points

- `/`: the approved clean Vintic gallery direction: white, charcoal, restrained
  oxblood accents, asymmetrical image-led hero, live catalog cards, editorial
  introduction, collections, featured story and closing CTA.
- `/admin/settings/storefront`: Settings → Quản lý Storefront. Uses the existing
  `PRODUCT_UPDATE` permission, matching the existing catalog Hero manager.
- `/stories` and `/stories/[slug]`: published editorial articles and associated
  public catalog watches.
- `/storefront-preview`: authenticated saved-draft preview, desktop/mobile widths
  in the editor. It is intentionally not added to the public-host proxy allowlist.
- `/products` now shares the clean gallery header and card styling with Home.
  Order ingress, media approval rules and catalog eligibility are preserved.
  Existing catalog Hero settings remain separate.

## Editorial workflow

1. Open Settings → Quản lý Storefront.
2. Choose/upload images (JPEG/PNG/WebP, up to 20 MB). Sources in the existing
   `storefront/hero/` library are reusable; new optimized WebP editorial assets live
   under `storefront/editorial/` through the existing `mediaStorage` adapter.
3. Set desktop/mobile hero images and independent focal points. Mobile uses desktop
   if no separate image is selected. Images in other sections use the same crop
   control. Uploading/selecting an image does not publish it.
4. Choose featured watches from the existing public catalog. Move them into order.
   If none are selected, four recently updated public AVAILABLE products are used.
   Facts and prices are never copied into CMS data; ineligible watches are filtered
   again on every public read, and publishing rejects stale selections.
5. Edit the fixed section types. Drag or use keyboard-accessible up/down buttons to
   order the six blocks; toggle blocks independently. Configure collection links
   using supported filters, e.g. `/products?style=DRESS`.
6. Add stories in the separate Chuyện đồng hồ tab. Enter title, stable slug, summary,
   cover image, plain-text paragraphs, up to ten gallery images and related watches.
   Gallery images follow the article body; HTML is escaped, not executed.
7. Save draft, then preview. Publishing replaces the public snapshot atomically.
   An article needs body text and a cover; enabled Home Hero needs a selected image.
   Publish an article before choosing it for Home. Its unpublished edits stay private.
8. General settings include a raster logo (empty = Vintic wordmark), footer copy,
   contact information and policy/social links. These publish with Home.
9. Unpublish keeps the draft. Home falls back to neutral default copy; unpublished
   stories return 404 and disappear from the Home feature and stories listing.

No CMS images or claims are seeded into production. Configure real editorial images
before publishing Home. Until then, Home can use the current public catalog image
for its hero and neutral placeholders for editorial slots.

## Persistence and boundaries

`StorefrontDocument` is an additive table containing draft/published JSON snapshots,
revision, publisher/editor identity and timestamps. `home` is the singleton Home
record; articles use UUIDs. Slugs remain inside the published snapshot so changing
a draft slug cannot break the existing public URL. A PostgreSQL partial unique
expression index prevents two published articles sharing a slug.

Writes serialize per document with a transaction advisory lock and compare the
editor's revision. Stale writes return 409, preserving both the editor's unsaved
form and the current public snapshot. The editor explicitly reloads after conflict.
Image existence, article references and catalog eligibility are checked on publish.

Public image URLs contain document/slot identifiers, never arbitrary storage keys.
The route resolves slots from the published snapshot only, returns 404 for drafts,
missing slots or withdrawn content, and uses `no-store` with fixed image MIME types.
Saved-draft previews require `PRODUCT_UPDATE` and use short-lived signed images.
No cost, internal thumbnail or private product fields are exposed by product pickers.

## Deployment / validation

Follow `AGENTS.md`: review PR, merge separately, then authorize the exact production
release. This feature does not deploy, update production data or modify NAS settings.

- Apply the additive migration
  `prisma/migrations/20261023030000_storefront_content/migration.sql` through the
  normal deployment migration step, then generate Prisma Client as usual.
- The public-host nginx example includes only `/stories` and `/stories/` in addition
  to its existing routes. Ensure the deployed public proxy permits these story paths
  when releasing this feature. Do not expose the admin editor, private preview or
  admin APIs on the storefront host.
- Stories inherit the existing public CSP/security headers. No public security
  policy is relaxed. The service worker remains network-first for documents and
  does not cache admin content or public APIs.

Checks:

```sh
npm run storefront:smoke-content
node --import tsx --test src/domains/storefront/server/public-catalog.repo.test.ts src/domains/storefront/contracts/public-catalog.contract.test.ts
npx tsc --noEmit
npm run build
npm run lint
```

`node --import tsx` avoids the tsx CLI IPC socket on restricted executors. The content
suite stubs persistence/storage to exercise lifecycle and public-media boundaries;
it does not replace a real PostgreSQL/S3/browser acceptance run. Before release,
verify authenticated upload → draft → mobile/desktop preview → publish on a staging
instance, plus publication conflicts, withdrawn watches and unpublished stories.

## Catalog gallery refresh

The catalog uses a short heading and description with an optional selected Hero
photograph on the right. CSS masks fade its outer background into the white page;
the image stays sharp without blur or an all-over white overlay. The compact
responsive header keeps products near the top. No Hero produces a text-only header.
The existing Hero manager controls the image and focal point, served through
`/api/public/storefront/catalog-hero` without exposing NAS/S3 paths or signed URLs.

Filters, search, sort and pagination retain their catalog contracts. Active filter
chips can be removed independently. Refining a query resets `page` and `cursor`
while preserving other filters; ordinary page navigation preserves the query.
Product-card prices, contact pricing and HOLD/SOLD status still come from the same
public DTO. A cover-only card remains visible on hover.

Home, stories and product listing/detail pages share the white header; its catalog
dropdown retains the existing men/women collections, services and consignment links.
Mobile uses collapsible filters and two product columns.

Additional checks:

```sh
node --import tsx --test src/domains/storefront/shared/catalog-navigation.test.ts src/domains/storefront/server/storefront-hero.service.test.ts
```
