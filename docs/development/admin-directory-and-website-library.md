# Contact directory and website image library

Routes: `/admin/directory` selects the first permitted destination among
`/admin/users`, `/admin/customers` and `/admin/vendors`. The original URLs,
search parameters and user APIs remain intact. The sidebar has one Danh bạ
link (including active state for all those routes), with Người dùng / Khách hàng /
Nhà cung cấp in its left workspace menu. There is no duplicate Users in System.
The right pane owns the list heading, create action, search and flat rows.
Users retain existing USER_VIEW/MANAGE read and CREATE/UPDATE/MANAGE write
capabilities; write-only grants do not imply permission to open the list.

Shared AdminSplitWorkspace uses the exact geometry/hook introduced in open
PR #124: 280px sidebar including 16px inset, 28px gap, no containment, native
selector below 960px available width. Only the small foundation property and
shared adapter are reused; Operations/Home changes from #124 are not copied.
Wide links and native selection follow the same route/draft guard. Unsaved
contact and user edits require discard confirmation and pending saves block
conflicting navigation. User-list shell/rows migrate here; its existing role
editor/drawer presentation remains legacy and is not claimed as fully v2.

Website images stay under Storefront at `/admin/storefront/media`. Pages use the shared, opt-in AdminManagement adapter backed by the
v2 foundation and the existing canvas/header; unrelated admin pages keep their styles.
Directory rows are flat, forms expand inline, and small screens stack the fields.
The new adapter narrowly overrides the legacy `.admin-ui form` control reset;
it does not remove or change that reset for existing forms.

Contacts reuse the current Customer/Vendor models. Search covers name, phone and
email before pagination. Creating/updating only accepts name/phone/email/address;
updates fence on the last-read updatedAt inside a serializable transaction.
Unrelated geography/user/bank/role/activation fields remain untouched. Customer
creates and changed phone numbers reject duplicates; historical shared phone
numbers do not block unrelated edits. Email/vendor-name database uniqueness is
retained. No delete, merge, migration or historical backfill is performed.

Customer read/create/update use CUSTOMER_VIEW/CREATE/UPDATE. Vendor reads use the
same existing grants as the vendor dropdown. No vendor-management grant exists;
only ADMIN may create/update canonical vendors through this new directory. A
product/acquisition/service read grant is never promoted into vendor write access.
Page policy, server page gates, endpoint gates and UI capabilities agree. The
contact endpoint exposes only contact fields; user associations and banking data
are not returned. Existing quick customer/vendor flows remain unchanged.

Website images use only the existing `storefront/editorial/` and
`storefront/hero/` prefixes, labeled as content and Hero folders. The library
paginates storage using its real continuation cursor, separately from the old
editor's 300-image selection window. Uploads keep the existing 20 MB MIME/decode/
resize/WebP pipeline and PRODUCT_UPDATE gate; folder is an allowlisted optional
form field, defaulting to editorial for existing callers. Storage keys cannot be
supplied by the uploader. The new lookup/list route rejects non-website keys.

“Dùng trên Home” opens the saved home editor with one validated library image
available in its selectors, including images older than the initial 300. It does
not select an arbitrary destination, save, publish, change a public snapshot or
replace an unsaved editor in another tab. The editor also links to the library
and reloads only its image choices on window focus, preserving all text/draft state.
Existing image keys are not renamed, moved or deleted, so stored references stay
valid. Private signed previews can be renewed with Làm mới.

## Verification

- `node scripts/check-admin-management-api.mjs`: actual route/service logic with
  synthetic auth/database/storage, including permission denials, strict fields,
  stale version checks, folder/key isolation, pagination and real Sharp conversion.
- `node scripts/check-contact-directory-db.mjs`: actual Prisma/PostgreSQL queries
  and concurrent mutations inside a newly owned disposable schema. Refuses any
  database except loopback `admin_management_test`; never uses production data.
- `node scripts/check-admin-management-ui.mjs`: actual clients/shared components
  and current global CSS with synthetic HTTP/provider ports. Covers paging/search,
  dirty cancel, save failure/retry, readonly, upload failure/retry, folder paging,
  older-image Home handoff and focus without saves. Also covers unified directory
  navigation, read permissions, user-list layouts, dirty native selection and user
  draft close cancellation. Checks 320/390/768/1280/1440px.
  Optional PLAYWRIGHT_MODULE_PATH, BEN_PWA_CHROMIUM and MANAGEMENT_SCREENSHOT_DIR
  select local tooling/captures. Screenshots contain only synthetic fixture data.
- `.github/workflows/admin-management.yml` runs scoped lint, full TypeScript,
  both API and PostgreSQL fixtures, browser acceptance and production build.

The fixtures do not establish live object-store, authenticated end-to-end or
production publication acceptance. No deployment or publication is part of this PR.


## Website media by section (2026-11-20)

Uploads from the editor and library use the NAS S3 storage port, not a File Station
filesystem mount. Allowlisted sibling folders are `storefront/hero/`, `about/`,
`collections/`, `journal/`, `branding/` and the existing `editorial/` (each under
`storefront/`). Desktop/mobile share Hero; About uses about; collection images use
collections; article covers/body images use journal; logo uses branding. Featured
watches retain catalog images; Closing has no image slot. Existing objects and
published references are not moved, renamed or deleted.

The editor expands an inline thumbnail picker in the current field, starting in
its section folder. Its folder selector can reuse existing images, and real
continuation cursors allow browsing beyond the initial page. Choosing/clearing
only changes the draft; uploads keep the existing image validation/20MB/Sharp
pipeline and never publish. Image previews stream through a PRODUCT_UPDATE-gated,
same-origin route; only allowlisted website keys are accepted. Public image URLs
still resolve document/slot from published snapshots, not arbitrary keys.

Folders exist automatically on first upload. For pre-creating visible empty S3
folders on staging, run `node --import tsx scripts/ensure-website-image-folders.ts`
for a read-only check, then add `--apply`. It checks the staging APP_URL and a
staging/test bucket name, creates only missing zero-byte folder markers, and
never touches existing images. It refuses production. Production provisioning
remains part of the separately authorized release; first upload creates its
section prefix without a filesystem mount or a bucket access-policy change.
