# Watch Cover Source And Storefront Contract

## Ownership

- NAS source purposes are `inline`, `edit`, and `cover`, partitioned by Watch audience segment.
- `media/{segment}/cover` is an operator input queue for separately photographed and processed Cover images.
- A source path is not business truth. Selecting an image ingests it into the canonical `media/objects/{id}` namespace.
- The active `MediaBinding` with owner `WATCH` and role `COVER` is canonical business ownership.
- `ProductImage(COVER)`, `Product.storefrontImageKey`, and `Product.primaryImageUrl` are compatibility read models maintained by the Cover command.

## Command contract

Selecting a Cover must:

1. require `PRODUCT_UPDATE`;
2. ingest the NAS source before committing database references;
3. serialize by Watch with a transaction advisory lock;
4. leave at most one non-removed Watch Cover binding;
5. replace the compatibility Cover row and pointers in the same database transaction;
6. remain independent from the social Publish workflow and IMAGE review state;
7. enqueue `watch.cover.updated` inside the owning transaction and return its projection delivery key.

An unbound canonical object left by a failed database transaction is recoverable media state. Database truth must never point to a source key that failed ingestion.

## Review and storefront gates

- Cover can be added or replaced at any time by an authorized operator and does not reset IMAGE review.
- Media Processing progress is `profile + content + image/gallery + cover = x/4`.
- Handoff from Media Processing to Publish requires profile, content, and gallery. Cover is visible but optional at that boundary; the operator is warned when it is missing.
- Publish exposes the same Watch Media modal so Cover can be managed without recalling the item to Media Processing.
- The server-side Publish `mark-posted` transition requires an active storefront `ProductImage(COVER)`. Cover therefore remains independent from content/image review while still being a hard gate for Publish completion.
- Cover alone does not publish a Watch. The public catalog continues to enforce slug, review, inventory, sale-state, service-state, price/contact, and Cover eligibility at query time.
- Storefront eligibility fails closed when Cover is absent.
