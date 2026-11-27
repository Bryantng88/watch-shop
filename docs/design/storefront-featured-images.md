# Homepage featured watch images

The homepage editor can select an existing public COVER/GALLERY image for each explicitly selected featured watch. Store the image ID and framing (focal X/Y 0–100%, zoom 1–2×) in the existing home document, keyed by Product ID. Missing settings retain the current cover behavior and old home documents remain valid. Removing a selected watch also removes its homepage image settings. No new media files, media bindings or database schema are needed.

Use the existing PRODUCT_UPDATE protected storefront products endpoint for gallery choices. Only return images from currently public-eligible products and public productImage rows. Revalidate ownership, allowed role and visibility when publishing. The public image endpoint continues to enforce access; if an image later disappears from the eligible gallery, fall back to the cover. Do not expose INLINE or private media/storage keys.

Keep the editor inline under each selected watch, collapsed by default and loaded only when expanded. Show the 4:5 card preview, gallery thumbnails, X/Y position and zoom sliders, plus reset. Reuse existing admin controls. These settings affect only the homepage featured card; catalog cards, product details and automatic hero cover stay unchanged. Suppress gallery-hover replacement for customized homepage cards so framing remains visible. Retain the existing draft → preview → publish workflow.

The storefront header aligns the shop-link group and its chevron with adjacent navigation links. Mobile navigation retains its current structure.

Verification: content tests cover legacy defaults, bounds, publication ownership/visibility and orphan settings. scripts/check-featured-images.cjs renders the actual image editor, public card and header with synthetic catalog responses, checking selection, crop/zoom/reset, hover visibility, 320/390/1440px overflow and desktop link alignment. Storefront home CI also runs the existing full editor draft/preview/publish checks.
