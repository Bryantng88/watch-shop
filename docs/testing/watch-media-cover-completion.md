# Cover completion must not save other tabs

The Cover picker persists through the storefront-image API before notifying the
Watch form. Completing Cover used to call submitWatchForm again, writing the
entire profile, pricing, content and gallery snapshot. That second write could
invalidate earlier completion flags even though the user only changed Cover.

Cover completion/draft acknowledgement now updates only the local saved Cover
baseline and the server's Cover progress field. Other tab drafts remain dirty;
their values are not written by this operation. The server still validates that
a persisted Cover exists before allowing completion. Partial/lost progress
receipts use the existing authoritative progress recheck.

The Watch detail mapper also read hashtags from the wrong database field:
WatchContent.hashTags was written by the form, but the mapper read hashtags.
The corrected read preserves the existing DTO field and legacy fallback. The
round-trip test checks real database-shaped data through both production mappers.

Regression verification:

- The browser test completes profile, content and gallery, chooses a new Cover
  through a separate mocked persistence endpoint, and completes Cover.
- It asserts no full-form request occurs, preserves all prior completion flags,
  reloads persisted state and checks all four tabs again.
- The same assertion failed before the fix (six saves instead of five).
- Existing tests continue covering edits, save/confirmation failures, retry,
  stale responses, unchanged Cover and mobile layout.

Run the acquisition/media browser workflow and
`node --import tsx --test src/domains/watch/server/shared/watch.mapper.test.ts src/domains/watch/shared/media-work-state.test.ts src/domains/watch/shared/media-part-values.test.ts`.

No production records are modified by these tests. Flags invalidated by an older
version are not automatically asserted complete; users must review them again.
