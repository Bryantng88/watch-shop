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

Save draft and preview (desktop/mobile) do not publish. Publication validates configured media against storage and requires a usable
hero source for an enabled opening section. An empty hero slot preserves the
existing automatic catalogue-watch fallback; the server checks an eligible
source exists. About/collection photos are optional: missing slots use the
existing compact text/link rendering and do not block unrelated theme edits. A failed publish or stale revision retains the existing public snapshot.
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
existing loopback personal_codex_test DB and synthetic AUTH_SECRET. Create a two-account
fixture with scripts/seed-storefront-home-browser.ts (using BEN_PWA_FIXTURE_FILE to choose
its private JSON), then run `node --import tsx scripts/smoke-storefront-home-browser.cjs`
with that fixture path and Playwright/Chromium available. The browser runner only
connects to loopback; editor API replies, media thumbnails and preview iframe are
fixtures. It checks real authenticated routing/menu/rendering, home-only fields,
focused section switching without losing edits, optional-image guidance, scope=home
requests, image/theme choice, save/preview/publish controls, mobile width and Reports
menu grouping (rail/expanded/mobile, Escape and per-report permission filtering). It does not prove real object-store upload or production
publication. Deactivate the synthetic account and remove its token fixture after
checking. Never use production credentials for this script.


The editor follows docs/design/admin-ui-language-contract.md and the shared
mutation-feedback contract: white flat canvas/header/toolbar, section list on the
left and one active editor on the right, natural stacking on mobile, compact image
notes with direct section actions, low-frequency link/focal controls collapsed,
keyed pending states and accessible async buttons. Expanded navigation pushes the
workspace rather than covering its controls. Reports is one menu with the same
three authorized destination links; child permissions and direct route policies
remain unchanged. No content, assets or production publication is changed merely
by deploying these presentation improvements.


Verified locally for this revision: 27 content/catalog/shared tests, scoped ESLint,
TypeScript and production build passed. Real Chromium exercised both synthetic
accounts, section edits surviving switching, keyboard file chooser with a fixture
upload response, failed-save preservation/retry, desktop/mobile private preview,
explicit fixture publication, mobile section selection and no horizontal overflow,
Reports submenu keyboard/Escape behavior and per-report visibility. Local editor
API/media/preview replies are fixtures; unit tests cover server publication rules.
No live object-storage or production mutation was performed. Cleanup accounts with
`node --import tsx scripts/seed-storefront-home-browser.ts --cleanup` against the
same loopback test database, then stop the temporary app/database.
