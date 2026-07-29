# Watch Media Canonical Ingest

## Decision

Audience segment changes media source browsing and pipeline metadata only. It
must never select a different persistence command.

All Watch media attachments use this invariant:

```text
segment source -> durable idempotent ingest -> media/objects -> MediaBinding
```

This applies equally to `MEN`, `WOMEN`, and `UNISEX`.

## Command boundary

`ingestSelectedMedia()` is the single canonicalization boundary. Commands that
attach existing NAS media must call it before creating a `MediaBinding`.

The canonical destination is deterministic from the normalized source key.
Retries therefore reuse the same `MediaOperation` and destination.

If `ProductImage` already references the source, ingest moves the physical
object first and then updates every matching `ProductImage.fileKey`. An existing
reference is not a reason to register source media in place.

## Reconciliation

Previously attached Watch media can be audited and repaired with:

```text
npm run media:reconcile -- watch-canonical-dry-run
npm run media:reconcile -- watch-canonical
npm run media:reconcile -- watch-canonical-all --take=25
```

An operator may scope a rollout with `--segment=WOMEN`; the command and
canonical destination remain identical across segments.

`watch-canonical-all` runs bounded sequential batches outside the HTTP request
path. One failed object is reported independently and cannot roll back an
already verified move.

The repair scans both ProductImage references and active Watch bindings. It uses
the same idempotent ingest command as live traffic and reports each source,
destination, Watch, segment, and failure independently.

## Invariants

- Business segment and role do not participate in canonical object paths.
- Active Watch bindings must not point to a segment source folder.
- ProductImage and MediaBinding must resolve to the same canonical storage key.
- No UI or form-save path may create a MediaObject directly from a source key.
- NAS mutation remains journaled by `MediaOperation`.
