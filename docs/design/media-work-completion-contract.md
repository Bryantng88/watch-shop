# Media work completion contract

Applies to the four Watch media tabs. Compact existing toolbar and tab dots are retained.

| Tab | Completion compares | Does not invalidate |
| --- | --- | --- |
| Main information | Persisted identity/spec fields and editable pricing | Equivalent decimal formatting/rounding, default material, brand display labels, generated slug, unordered tags/complications |
| Content | Title override, hook copy, body, ordered bullets, hashtags | Trimmed whitespace, automatically maintained Watch storefront URL |
| Images | Final Gallery keys in order | Temporary-pool membership/reconciliation, pool read order, signed URLs, preview labels, opening/closing the pool |
| Cover | Canonical object key | Reconfirming the same key, refreshing a signed URL |

`media-part-values.ts` owns shared persisted-value equality. UI and server must use it rather than whole raw-form equality. Gallery ordering remains significant; chosen-pool order does not.

Completion baseline belongs to the last confirmed completion, separate from the latest saved values. An edit immediately removes only that tab’s completed appearance. Undoing an unsaved semantic edit restores the prior completion. After changed data has been saved, the tab remains incomplete until explicitly confirmed again. A save receipt alone cannot confirm it. Saving an untouched completed tab must not demote it.

The toolbar distinguishes unsaved changes, saved but incomplete, and explicitly completed. It adds no permanent activity rows. Save buttons are guarded against duplicate invocation. Tab switching does not save or invalidate anything. Initial pool hydration cannot overwrite later edits or save receipts; save/approval waits for required pool data.

On failure, retain the draft and recover the exact Watch/binding’s progress using existing product-update authorization. A lost response can be reconciled with committed server truth. When truth cannot be read, show an explicit unknown state and a compact retry action; block completion/approval until reconciled. Never guess green. Reconciliation must not replace newer edits with an older request snapshot.

Verification includes the pure four-part change matrix, decimal precision, default/metadata equivalence, completion-baseline ownership, late receipts/pool reads, actual-form browser scenarios for duplicate clicks, failed/lost responses, retry and reload, plus PostgreSQL fixtures for all four persisted flags and unchanged Cover confirmation. Browser fixtures stub section interiors/provider ports; PostgreSQL fixtures use synthetic objects and no real NAS/provider requests. No claim of testing every browser/device is implied.

Temporary-pool edits use a separate save snapshot: they enable draft saving and protect newer edits from late receipts, but do not invalidate Gallery completion or emit Gallery-change writes/events. Pool-only reconciliation must not recreate ProductImage rows or run Gallery ingestion.
