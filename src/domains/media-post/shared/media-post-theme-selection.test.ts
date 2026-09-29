import assert from "node:assert/strict";
import test from "node:test";

import {
  selectMediaPostGalleryImage,
  toggleMediaPostWatchSelection,
} from "./media-post-theme-selection";
import type { MediaPostThemeWatchCandidate } from "./media-post-theme.types";

const watch: MediaPostThemeWatchCandidate = {
  watchId: "watch-a",
  productId: "product-a",
  title: "Watch A",
  sku: null,
  brandId: null,
  brandName: null,
  price: null,
  movementType: null,
  caseShape: null,
  style: null,
  gallery: [
    { key: "gallery/first.jpg", url: "/first", sortOrder: 0 },
    { key: "gallery/second.jpg", url: "/second", sortOrder: 1 },
  ],
};

test("selecting a watch defaults to its first Gallery image", () => {
  assert.deepEqual(toggleMediaPostWatchSelection({}, watch), {
    "watch-a": "gallery/first.jpg",
  });
});

test("click and drop selection share the same image-selection transition", () => {
  const selected = selectMediaPostGalleryImage(
    { "watch-a": "gallery/first.jpg" },
    "watch-a",
    "gallery/second.jpg",
  );
  assert.equal(selected["watch-a"], "gallery/second.jpg");
});
