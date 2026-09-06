import assert from "node:assert/strict";
import test from "node:test";

import { resolveMediaPreviewSrc } from "./media-profile";

test("resolveMediaPreviewSrc signs a normalized storage key", () => {
  assert.equal(
    resolveMediaPreviewSrc("  media/objects/watch.jpg  "),
    "/api/media/sign?key=media%2Fobjects%2Fwatch.jpg",
  );
});

test("resolveMediaPreviewSrc preserves already-resolvable URLs", () => {
  for (const value of [
    "https://cdn.example/watch.jpg",
    "//cdn.example/watch.jpg",
    "/api/media/sign?key=watch.jpg",
    "blob:watch-preview",
    "data:image/png;base64,abc",
  ]) {
    assert.equal(resolveMediaPreviewSrc(value), value);
  }
});

test("resolveMediaPreviewSrc returns null for an empty value", () => {
  assert.equal(resolveMediaPreviewSrc("   "), null);
  assert.equal(resolveMediaPreviewSrc(null), null);
});
