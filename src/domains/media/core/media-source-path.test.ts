import assert from "node:assert/strict";
import test from "node:test";

import { isLegacyWatchMediaSource } from "./media-source-path";

test("legacy Watch inbox and chosen paths are consumable sources", () => {
  assert.equal(isLegacyWatchMediaSource("products/edit/active/batch/image.jpg"), true);
  assert.equal(isLegacyWatchMediaSource("products/inline/active/image.jpg"), true);
  assert.equal(isLegacyWatchMediaSource("products/cover/active/image.jpg"), true);
  assert.equal(isLegacyWatchMediaSource("products/edit/chosen/watch/id/pool/image.jpg"), true);
  assert.equal(isLegacyWatchMediaSource("products/inline/chosen/watch/id/inline/image.jpg"), true);
});

test("canonical, derivative, export and unrelated keys are not legacy sources", () => {
  assert.equal(isLegacyWatchMediaSource("media/objects/id/original/image.jpg"), false);
  assert.equal(isLegacyWatchMediaSource("media/objects/id/derivatives/gallery.jpg"), false);
  assert.equal(isLegacyWatchMediaSource("exports/men/watch/image.jpg"), false);
  assert.equal(isLegacyWatchMediaSource("products/edit/archive/image.jpg"), false);
});
