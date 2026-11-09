# Storefront home management

Entry: Admin → Storefront → Trang chủ website, /admin/storefront/home.
Uses existing PRODUCT_UPDATE and existing StorefrontDocument HOME draft/published
snapshots, media library/upload, optimistic revision checks and private preview.
No schema migration, new permission or external CMS. The existing full Storefront
settings/editor remains available; the dedicated route only exposes home fields,
not article creation/editing or global header/footer controls. Home-scoped saves
preserve the existing general draft; home-scoped publication preserves the existing
public header/footer even if another editor has unreviewed general draft changes.
It does not offer unpublish, which would also reset shared general content.

Manage hero desktop/mobile photos, alt/focal point, title/description/button/link,
featured product selection/order, About photo/copy, collection photos/copy/links,
existing featured article, closing CTA, and enabled/order of home sections.
Uploads use the existing validated image conversion and storefront-only media
keys. Public stock/price/eligibility still come from the catalogue. No product,
order, storefront inventory or price is edited by the home editor.

Save draft and preview (desktop/mobile) do not publish. Publication requires
photos for each enabled hero/About/collection slot and checks storage existence.
Choose the missing photos, remove a collection or hide its section; drafts remain
saveable. A failed publish or stale revision retains the existing public snapshot.
Previously published content without About/collection images displays compact
text and links rather than large branded placeholders. Actual photos take their
normal image layout once configured. Other pages and article placeholders retain
their existing rendering.

The approved warm-charcoal hero is selectable in the hero theme field, with ivory
headline and cream button. Existing/missing-theme content remains light until an
editor selects charcoal, reviews and publishes it. Use an actual transparent
PNG/WebP cutout or an appropriately dark photograph for the hero: selecting a dark
theme does not remove a white photographic background. No fabricated watch photo
or generated mockup is automatically put into production.

Rollout: deploy the reviewed app revision through the existing release process;
no production publication or migration is performed by this coding change. Confirm
the admin role can see the menu and a PRODUCT_VIEW-only account cannot open it.
Upload approved images privately, review desktop/mobile, choose charcoal if wanted
and explicitly publish. Check the public home, image MIME/access routes, links and
product eligibility. Draft media must remain unpublished. Keep prior public data
and images; do not delete assets or reset the HOME document to enable the editor.

Validation: npm run storefront:smoke-content, scoped ESLint, TypeScript and build.
Browser acceptance should cover missing-image warnings, filling slots, draft save,
private preview, publication errors, mobile layout and the public home fallback.

Isolated browser regression: run a built app on http://127.0.0.1:3016 with the
existing loopback personal_codex_test DB and synthetic AUTH_SECRET. Create a
fixture with scripts/seed-ben-pwa-smoke.ts (using BEN_PWA_FIXTURE_FILE to choose
its private JSON), then run `node --import tsx scripts/smoke-storefront-home-browser.cjs`
with that fixture path and Playwright/Chromium available. The browser runner only
connects to loopback; editor API replies, media thumbnails and preview iframe are
fixtures. It checks real authenticated routing/menu/rendering, home-only fields,
readiness, scope=home requests, image/theme choice, save/preview/publish controls
and mobile width. It does not prove real object-store upload or production
publication. Deactivate the synthetic account and remove its token fixture after
checking. Never use production credentials for this script.
