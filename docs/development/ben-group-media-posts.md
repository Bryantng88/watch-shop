# Ben: group Media drafts and stock receipt reads

Example: “Ben, tạo cho mình post 10 chiếc Seiko diver tầm giá ngang ngang nhau.”

1. Worker interprets the current request, calls `media.watches.select` with a
   JSON-string query, and receives a bounded, fresh catalog selection.
2. Server filters exact brand, all requested keyword terms, stock/sale state,
   positive sale prices, optional price bounds and Gallery availability.
   “Similar” means max/min <= 1.25. It chooses the fullest group up to the
   requested count, then the smallest relative spread. A scan over 1,000 matches
   reports truncation and cannot become a post proposal until narrowed.
3. Worker drafts copy grounded in the returned records, calls `media.posts.draft`
   with this message UUID and selected watch IDs, and finishes with no other
   plan. This writes only the leased conversation's evidence/review state.
4. User reviews actual count/range, selected identities, shortage and full copy.
   Corrections happen in chat and require fresh selection evidence. One explicit
   button creates one Media Post DRAFT, associates all selected watches and copies
   one Gallery image per watch via the existing canonical Media command.
5. Approval locks the conversation and source records, rechecks current actor,
   revision/read scope and stock/price/title/image snapshot. Receipt is committed
   atomically with the post. Repeated approvals return the prior result; rollback
   cleans copied files. Post-commit outbox failure cannot cause another post.

Permissions: selection PRODUCT_VIEW + MEDIA_VIEW; prepare/create additionally
PRODUCT_UPDATE, matching the existing Media create action. Current permissions
are rechecked for restored drafts/receipts. No schema migration, new credentials,
social dispatch, schedule or implicit publishing is added. Existing single-watch
`media.draft`/`media.inspect` remains unchanged.

`stock.receipts` reads latest receipt references/creation timestamps and watch
identities under WATCH_ACQUISITION_VIEW + PRODUCT_VIEW. Shop convention explicitly
uses Acquisition.createdAt as stock-in time. Watch-only viewers exclude mixed
receipts; ACQUISITION_VIEW_ALL can include their watch subset. No cost, vendor,
customer, payment or note fields leave this projection. Receipt and child-watch
limits are independent and disclosed. Results are receipt-level, not a global
watch ranking; do not claim a limited child list contains every watch.

Deploy the app with the updated customer worker protocol/schema. An existing
worker image does not learn these tools from an app-only deployment. This coding
change does not authorize staging or production deployment.

## Acceptance on an authorized test environment

- Ask for 10 Seiko diver at similar prices. Verify every selected watch satisfies
  actual catalog data, has the shown sale price and Gallery; shortage stays clear.
  “Diver” matches title/model/reference/tag text; do not substitute SPORT or claim
  verified water resistance from this match.
- Change the brand, requested count or price range in chat. Only the latest review
  is actionable; no post exists before its button is clicked.
- Click once and replay/concurrently submit the same approval: one post, its
  watch/image order, one durable receipt. Reload and open its Media editor.
- Change price/stock/Gallery after review, revoke permission, use another owner,
  approve an old revision, or cancel a queued turn: no unauthorized creation.
- Simulate Gallery copy failure and outbox delivery failure separately; rollback
  leaves no records/copied files, while post-commit delivery failure retains the
  receipt and does not repeat the committed creation.
- Ask for latest Seiko stock receipts: sort by receipt createdAt, not product
  timestamps, preserve permission scope and disclose truncation.

Automated coverage includes price-group selection, strict contracts, permission
gates, scope/query projections, partial scans, turn/evidence binding, stale price/
missing stock rejection, protocol envelope and existing Media helpers. These
isolated tests do not establish live model, database concurrency, NAS storage or
social-account acceptance; run the cases above before enabling for users.
