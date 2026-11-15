# Work object thumbnails and media state

Use the shared WorkObjectThumbnail for a work row or checklist entry linked to a concrete object. Keep the existing compact row layout; a 28px square identifies the object without an extra text row. Resolve the current Product INLINE image first, then the primary image, and show a neutral fallback if absent or broken. Do not choose an arbitrary image for an aggregate such as an order.

Hydrate only after personal/checklist-only visibility projection. Resolve current authorized data on the server, never trust a stored image URL. Watch photos require product-view permission and service photos require service-view permission. Hidden checklist siblings must never become thumbnail sources.

Media counts are live counts of accessible unfinished WATCH_MEDIA_DAILY entries on open daily tasks. Show a small “N việc media” badge beside the object metadata and a link to the existing work in the Watch form. With existing work, label the creation action “Thêm yêu cầu khác”. This makes intentional additional requests possible; it is not a global duplicate ban. Idempotency still uses the existing request key.

Re-read authorized state on local creation, focus and visibility return, including the same-origin iframe parent. A failed verification keeps the last confirmed state and offers retry, rather than suggesting there is no existing work. No persistent Watch flag, schema migration or broad page reload is needed.
