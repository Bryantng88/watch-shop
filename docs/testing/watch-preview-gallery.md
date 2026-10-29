# Watch quick-review photos

The WATCH business preview now includes a compact image strip before the
decision panel. It combines current product cover/gallery rows with active
watch-owned media bindings, deduplicates storage keys, and excludes keys known
to be missing, quarantined or deleted. Inline thumbnails are not substituted for
gallery originals. The representative product image is a fallback when no
gallery or cover is available.

Click a thumbnail to inspect the full image; previous/next buttons and arrow
keys move through the set. Escape closes only the image viewer and returns
focus to the thumbnail. Empty sets and image loading failures are explicit.
No photo quality assessment or photoshoot task is generated automatically;
existing Media workflow actions remain the route for that decision.

Verification:

- `tsx --test src/domains/shared/business/watch-preview-images.test.ts` checks
  ordering, deduplication, legacy fallback and unavailable-file exclusion.
- TypeScript and targeted ESLint passed.
- Chrome opened the real Media Processing watch preview. Its authenticated
  API response contained the gallery field. Eight image fixtures were substituted
  in that browser response to test thumbnails, large-image navigation, Escape,
  and a 390px viewport without relying on NAS images. No database writes or
  task creation were performed.
