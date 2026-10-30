import test from "node:test";
import assert from "node:assert/strict";
import { buildWatchPreviewImages, buildWatchMediaReviewImages } from "./watch-preview-images";

test("preview shows cover and gallery from both sources, deduplicated in display order", () => {
  const images = buildWatchPreviewImages({ title: "Watch", cover: "cover.jpg", images: [{ fileKey: "one.jpg", role: "GALLERY", alt: "Dial" }, { fileKey: "cover.jpg", role: "COVER" }, { fileKey: "inline.jpg", role: "INLINE" }], bindings: [{ role: "GALLERY", mediaObject: { storageKey: "one.jpg", availability: "AVAILABLE" } }, { role: "GALLERY", mediaObject: { storageKey: "two.jpg", availability: "AVAILABLE" } }] });
  assert.deepEqual(images.map(i => i.id), ["cover.jpg", "one.jpg", "two.jpg"]);
  assert.equal(images[0].label, "Cover");
  assert.equal(images[1].alt, "Dial");
  assert.equal(images[1].url, "/api/media/sign?key=one.jpg");
});

test("pool membership is distinct from final selection and counts intersect by key", () => {
  const photos = buildWatchMediaReviewImages({ title: "Watch", cover: "cover.jpg",
    images: [{ fileKey: "gallery.jpg", role: "GALLERY" }, { fileKey: "bad.jpg", role: "GALLERY" }],
    pool: [
      { fileKey: "draft.jpg", name: "Draft", lifecycle: "SELECTED", availability: "AVAILABLE" },
      { fileKey: "gallery.jpg", name: "Gallery", lifecycle: "SELECTED", availability: "AVAILABLE" },
      { fileKey: "attached.jpg", name: "Attached", lifecycle: "ATTACHED", availability: "AVAILABLE" },
      { fileKey: "bad.jpg", name: "Missing", lifecycle: "ATTACHED", availability: "MISSING" },
    ] });
  assert.deepEqual(photos.selected.map(image => image.id), ["cover.jpg", "gallery.jpg", "attached.jpg"]);
  assert.deepEqual(photos.pool.map(image => [image.id, image.selected]), [["gallery.jpg", true], ["draft.jpg", false], ["attached.jpg", true]]);
  assert.equal(photos.unselectedCount, 1);
});

test("unavailable bound assets cannot leak back through legacy product rows or fallback", () => {
  const bindings = ["MISSING", "QUARANTINED", "DELETED"].map(availability => ({ role: "GALLERY", mediaObject: { storageKey: `${availability}.jpg`, availability } }));
  assert.deepEqual(buildWatchPreviewImages({ title: "Watch", fallback: "MISSING.jpg", images: bindings.map(b => ({ fileKey: b.mediaObject.storageKey, role: "GALLERY" })), bindings }), []);
  assert.equal(buildWatchPreviewImages({ title: "Watch", fallback: "https://example.test/old.jpg", images: [], bindings: [] })[0].label, "Đại diện");
});
