import test from "node:test";
import assert from "node:assert/strict";
import { buildWatchPreviewImages } from "./watch-preview-images";

test("preview shows cover and gallery from both sources, deduplicated in display order", () => {
  const images = buildWatchPreviewImages({ title: "Watch", cover: "cover.jpg", images: [{ fileKey: "one.jpg", role: "GALLERY", alt: "Dial" }, { fileKey: "cover.jpg", role: "COVER" }, { fileKey: "inline.jpg", role: "INLINE" }], bindings: [{ role: "GALLERY", mediaObject: { storageKey: "one.jpg", availability: "AVAILABLE" } }, { role: "GALLERY", mediaObject: { storageKey: "two.jpg", availability: "AVAILABLE" } }] });
  assert.deepEqual(images.map(i => i.id), ["cover.jpg", "one.jpg", "two.jpg"]);
  assert.equal(images[0].label, "Cover");
  assert.equal(images[1].alt, "Dial");
  assert.equal(images[1].url, "/api/media/sign?key=one.jpg");
});

test("unavailable bound assets cannot leak back through legacy product rows or fallback", () => {
  const bindings = ["MISSING", "QUARANTINED", "DELETED"].map(availability => ({ role: "GALLERY", mediaObject: { storageKey: `${availability}.jpg`, availability } }));
  assert.deepEqual(buildWatchPreviewImages({ title: "Watch", fallback: "MISSING.jpg", images: bindings.map(b => ({ fileKey: b.mediaObject.storageKey, role: "GALLERY" })), bindings }), []);
  assert.equal(buildWatchPreviewImages({ title: "Watch", fallback: "https://example.test/old.jpg", images: [], bindings: [] })[0].label, "Đại diện");
});
