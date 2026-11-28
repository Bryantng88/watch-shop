# Watch intake identity

Codex quick naming extracts the existing brand/model/reference/nickname/movement
facts plus optional dial colour and case shape. Appearance is observable evidence,
not proof of model, material or authenticity. Ambiguous values stay null. The
server adds at most these two traits to the editable intake name (500 characters).
Older queued results without appearance fields remain valid.

Admin watch list and detail headers derive a separate display identity:
`IWC Automatic · mặt bạc · NHAT-PN281126-000001`.
Vendor codes remove accents/punctuation, uppercase and cap at 16 characters.
They are display hints, not unique vendor identifiers. The real receipt reference
provides the source lookup. The receipt sequence is never predicted in a draft;
the create form explains that it is assigned at approval.

Identity follows the current inventory cycle's posted source receipt. Legacy
watches without a cycle source fall back to Watch.acquisitionId. Cancelled/draft
receipts and manually created watches do not get a fabricated suffix. This is a
batch read, not an additional query per row. Returning inventory uses its new
source receipt rather than the original vendor.

Product.title, WatchContent.titleOverride, public URLs, SEO and title edit values
retain the clean watch name. Admin labels are computed on read and cannot be
saved back through the price action. Storefront content previews use the clean
title. No schema migration or production-data rewrite is required. Rebuild the
watch-list projection on release so existing cached rows acquire their labels.
Search text includes compact and original receipt references.

Deploy the Codex worker image as well as the app for new visual extraction.
An older worker continues to return valid names without the two new traits.
