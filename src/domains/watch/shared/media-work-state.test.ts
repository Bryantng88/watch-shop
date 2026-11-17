import assert from "node:assert/strict";
import { test } from "node:test";
import { mapWatchDetailToFormValues } from "../client/form/watch-form.mapper";
import {
  confirmMediaParts,
  effectiveMediaParts,
  invalidateChangedMediaParts,
  mergeWatchSaveReceipt,
  mergeLoadedMediaPool,
  mediaPartSaveSnapshot,
} from "./media-work-state";
const base = () =>
  mapWatchDetailToFormValues({
    watchId: "w",
    productId: "p",
    title: "Bulova",
    sku: "BLV",
    watch: { specStatus: "READY" },
    review: { content: { status: "APPROVED" }, image: { status: "APPROVED" } },
    images: [{ role: "COVER", fileKey: "cover.jpg" }],
  });
const complete = { profile: true, content: true, image: true, cover: true };
test("only persisted explicit completion counts; editing each part removes its completed indicator", () => {
  const saved = base();
  assert.deepEqual(effectiveMediaParts(complete, saved, saved), complete);
  assert.deepEqual(
    effectiveMediaParts(
      { profile: false, content: false, image: false, cover: false },
      saved,
      saved,
    ),
    { profile: false, content: false, image: false, cover: false },
  );
  for (const part of ["profile", "content", "image", "cover"] as const) {
    const next = structuredClone(saved);
    if (part === "profile") next.basic.title = "Changed";
    if (part === "content") next.content.body = "WIP";
    if (part === "image")
      next.media.galleryImages = [{ key: "new.jpg", url: "/new.jpg" }];
    if (part === "cover") next.media.coverImage = null;
    assert.deepEqual(effectiveMediaParts(complete, next, saved), {
      ...complete,
      [part]: false,
    });
  }
});
test("late save receipts preserve newer edits and never call unsaved work saved", () => {
  const sent = base();
  sent.content.body = "Sent draft";
  const current = structuredClone(sent);
  current.content.body = "Still typing";
  current.pricing.salePrice = "123";
  current.media.galleryImages = [{ key: "new.jpg", url: "/new.jpg" }];
  const receipt = mergeWatchSaveReceipt(current, sent, {
    hookText: "server hook",
    media: { poolImages: [], galleryImages: [] },
  });
  assert.equal(receipt.saved.content.body, "Sent draft");
  assert.equal(receipt.current.content.body, "Still typing");
  assert.equal(receipt.current.pricing.salePrice, "123");
  assert.equal(receipt.current.media.galleryImages[0].key, "new.jpg");
  assert.equal(
    effectiveMediaParts(complete, receipt.current, receipt.saved).content,
    false,
  );
  assert.equal(
    effectiveMediaParts(complete, receipt.current, receipt.saved).image,
    false,
  );
});

test("refreshing the same chosen pool in another order preserves completion", () => {
  const saved = base();
  saved.media.poolImages = [{ key: "a.jpg" }, { key: "b.jpg" }];
  saved.media.galleryImages = [{ key: "a.jpg" }, { key: "b.jpg" }];
  const current = structuredClone(saved);
  current.media.poolImages.reverse();
  assert.deepEqual(effectiveMediaParts(complete, current, saved), complete);
  current.media.galleryImages.reverse();
  assert.equal(effectiveMediaParts(complete, current, saved).image, false);
});

test("persisted-value equality is shared across profile formatting, defaults, sets and generated metadata", () => {
  const saved = base();
  saved.spec.caseSizeMM = "39";
  saved.spec.thicknessMM = "11.125";
  saved.spec.goldKarat = "18";
  saved.spec.goldColors = ["YELLOW", "ROSE"];
  saved.spec.complicationNames = ["Date", "Moon"];
  saved.basic.postTargetIds = ["a", "b"];
  const current = structuredClone(saved);
  current.spec.caseSizeMM = "039.00";
  current.spec.thicknessMM = "11.13";
  current.spec.goldKarat = "018";
  current.spec.goldColors.reverse();
  current.spec.complicationNames.reverse();
  current.basic.postTargetIds.reverse();
  current.basic.slug = "regenerated";
  current.basic.brandName = "Display label";
  current.spec.specBrand = "Display brand";
  current.spec.primaryCaseMaterial = "STAINLESS_STEEL";
  assert.deepEqual(effectiveMediaParts(complete, current, saved), complete);
  current.spec.caseSizeMM = "39.01";
  assert.equal(effectiveMediaParts(complete, current, saved).profile, false);
});

test("each part owns its changes; content URL maintenance and same Cover are not new edits", () => {
  const saved = base();
  saved.content.hookText = "A watch https://vinticwatches.vn/products/old";
  const current = structuredClone(saved);
  current.content.hookText =
    "  A watch https://vinticwatches.vn/products/new  ";
  current.media.coverImage = {
    ...saved.media.coverImage!,
    url: "new-signed-url",
  };
  assert.deepEqual(effectiveMediaParts(complete, current, saved), complete);
  for (const part of ["profile", "content", "image", "cover"] as const) {
    const changed = structuredClone(current);
    if (part === "profile") changed.pricing.salePrice = "1000";
    if (part === "content") changed.content.body = "New content";
    if (part === "image") changed.media.galleryImages = [{ key: "new.jpg" }];
    if (part === "cover") changed.media.coverImage = { key: "new-cover.jpg" };
    assert.deepEqual(effectiveMediaParts(complete, changed, saved), {
      ...complete,
      [part]: false,
    });
  }
});

test("saving data does not move an explicit completion baseline or resurrect completion after a partial failure", () => {
  const completed = base(),
    edited = structuredClone(completed);
  edited.content.body = "Changed after completion";
  const receipt = mergeWatchSaveReceipt(edited, edited, {});
  const invalidated = invalidateChangedMediaParts(
    complete,
    completed,
    receipt.saved,
  );
  assert.equal(invalidated.content, false);
  assert.equal(
    effectiveMediaParts(complete, receipt.current, completed).content,
    false,
  );
  assert.equal(
    effectiveMediaParts(invalidated, completed, completed).content,
    false,
  );
  const confirmed = confirmMediaParts(completed, receipt.saved, {
    ...complete,
    content: true,
  });
  assert.equal(effectiveMediaParts(complete, edited, confirmed).content, true);
  const later = structuredClone(edited);
  later.content.body = "Typed during confirmation";
  assert.equal(effectiveMediaParts(complete, later, confirmed).content, false);
});

test("late initial pool reads preserve edits and hydrate untouched pool state", () => {
  const current = base(),
    serverPool = [{ key: "server.jpg" }];
  assert.deepEqual(
    mergeLoadedMediaPool(current, [], serverPool).media.poolImages,
    serverPool,
  );
  current.media.poolImages = [{ key: "typed.jpg" }];
  assert.equal(mergeLoadedMediaPool(current, [], serverPool), current);
});

test("Cover/pool reconciliation keeps Gallery complete while still tracking unsaved pool edits", () => {
  const saved = base();
  saved.media.galleryImages = [{ key: "gallery.jpg" }];
  const draft = structuredClone(saved);
  draft.media.poolImages = [{ key: "new-cover-source.jpg" }];
  draft.media.coverImage = { key: "cover-new.jpg" };
  assert.equal(effectiveMediaParts(complete, draft, saved).image, true);
  assert.equal(effectiveMediaParts(complete, draft, saved).cover, false);
  assert.notEqual(
    mediaPartSaveSnapshot(draft, "image"),
    mediaPartSaveSnapshot(saved, "image"),
  );
  const later = structuredClone(draft);
  later.media.poolImages.push({ key: "typed-while-saving.jpg" });
  const receipt = mergeWatchSaveReceipt(later, draft, {
    media: {
      poolImages: [{ key: "canonical.jpg" }],
      galleryImages: [{ key: "canonical-gallery.jpg" }],
    },
  });
  assert.equal(receipt.current.media.poolImages.length, 2);
  assert.equal(
    receipt.current.media.galleryImages[0].key,
    "canonical-gallery.jpg",
  );
  assert.equal(invalidateChangedMediaParts(complete, saved, draft).image, true);
});
