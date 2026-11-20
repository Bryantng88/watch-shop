import assert from "node:assert/strict";
import test from "node:test";

import sharp from "sharp";

import {
  nasBrowserThumbnailCacheKey,
  nasBrowserThumbnailUrl,
  renderNasMediaThumbnail,
  selectNasMediaThumbnailPrewarmCandidates,
} from "./nas-media-thumbnail.service";

test("NAS browser thumbnail cache key is stable and versioned", () => {
  const sourceKey = ["products", "edit", "active", "watch.jpg"].join("/");
  const first = nasBrowserThumbnailCacheKey({
    key: sourceKey,
    version: "etag-1",
  });
  const repeated = nasBrowserThumbnailCacheKey({
    key: "/products\\edit/active/watch.jpg/",
    version: "etag-1",
  });
  const changed = nasBrowserThumbnailCacheKey({
    key: sourceKey,
    version: "etag-2",
  });

  assert.equal(first, repeated);
  assert.notEqual(first, changed);
  assert.match(first, /^media\/cache\/nas-browser\/v1\/[a-f0-9]{2}\/[a-f0-9]{64}\.webp$/);
  assert.equal(first.includes("watch.jpg"), false);
});

test("NAS browser thumbnail renderer emits a bounded WebP image", async () => {
  const source = await sharp({
    create: {
      width: 640,
      height: 480,
      channels: 3,
      background: { r: 20, g: 80, b: 140 },
    },
  }).png().toBuffer();

  const thumbnail = await renderNasMediaThumbnail(source);
  const metadata = await sharp(thumbnail).metadata();

  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 256);
  assert.equal(metadata.height, 256);
  assert.ok(thumbnail.byteLength < source.byteLength);
});

test("NAS browser thumbnail prewarm is deduplicated and bounded", () => {
  const items = Array.from({ length: 30 }, (_, index) => ({
    key: `products/edit/active/watch-${index}.jpg`,
    version: `etag-${index}`,
  }));
  items.splice(2, 0, items[0]);
  items.splice(3, 0, { key: "products/edit/active/readme.txt", version: "text" });

  const selected = selectNasMediaThumbnailPrewarmCandidates(items);

  assert.equal(selected.length, 24);
  assert.equal(new Set(selected.map((item) => item.key)).size, 24);
  assert.equal(selected.some((item) => item.key.endsWith(".txt")), false);
});

test("NAS browser thumbnail URL preserves the source key and cache version", () => {
  const sourceKey = ["products", "edit", "active", "watch one.jpg"].join("/");
  const url = nasBrowserThumbnailUrl({
    key: sourceKey,
    version: "etag/value",
  });
  const parsed = new URL(url, "https://admin.example.test");

  assert.equal(parsed.pathname, "/api/media/thumbnail");
  assert.equal(parsed.searchParams.get("key"), sourceKey);
  assert.equal(parsed.searchParams.get("v"), "etag/value");
});
