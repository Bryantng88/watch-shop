import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMediaPostThemeWatchWhere,
  cleanupCopiedMediaPostFiles,
  effectiveMediaPostPrice,
  mediaPostAutoTitle,
  normalizeMediaPostThemeSelections,
  validateMediaPostThemeFilters,
} from "./media-post.service";
import { MEDIA_POST_UNCLASSIFIED_FILTER } from "../shared/media-post-theme.types";
import { getBusinessEventContract } from "@/domains/event/catalog/business-event-catalog";

test("Media Post title uses Bangkok creation date and daily sequence", () => {
  assert.equal(
    mediaPostAutoTitle(1, new Date("2026-08-24T17:00:00.000Z")),
    "post_01 ngày 25/08/2026",
  );
  assert.equal(
    mediaPostAutoTitle(12, new Date("2026-08-25T16:59:59.000Z")),
    "post_12 ngày 25/08/2026",
  );
});

test("Media Post theme selections reject duplicate watches and images", () => {
  assert.throws(() => normalizeMediaPostThemeSelections([
    { watchId: "watch-a", sourceGalleryKey: "gallery/a.jpg" },
    { watchId: "watch-a", sourceGalleryKey: "gallery/b.jpg" },
  ]), /trùng watch/);
  assert.throws(() => normalizeMediaPostThemeSelections([
    { watchId: "watch-a", sourceGalleryKey: "gallery/shared.jpg" },
    { watchId: "watch-b", sourceGalleryKey: "gallery/shared.jpg" },
  ]), /trùng ảnh/);
});

test("Media Post theme filters accept supported schema values", () => {
  const filters = {
    movementType: "AUTOMATIC",
    caseShape: "TANK",
    style: "LUXURY",
    stockStage: "IN_STOCK",
    audienceSegment: "UNISEX",
    siteChannel: "LUXURY",
    priceMin: 5_000_000,
    priceMax: 10_000_000,
  };

  assert.equal(validateMediaPostThemeFilters(filters), filters);
});

test("Media Post theme filters reject invalid enums and price ranges", () => {
  assert.throws(
    () => validateMediaPostThemeFilters({ style: "PREMIUM" }),
    /style/,
  );
  assert.throws(
    () => validateMediaPostThemeFilters({ priceMin: -1 }),
    /priceMin/,
  );
  assert.throws(
    () => validateMediaPostThemeFilters({ priceMin: 20, priceMax: 10 }),
    /Giá từ/,
  );
});

test("Media Post theme query combines filters and keeps sale-price fallback explicit", () => {
  const where = buildMediaPostThemeWatchWhere({
    movementType: "AUTOMATIC",
    caseShape: "TANK",
    style: "LUXURY",
    priceMin: 5_000_000,
    priceMax: 10_000_000,
  });
  assert.equal(where.movementType, "AUTOMATIC");
  assert.deepEqual(where.watchSpecV2, { caseShape: "TANK" });
  assert.equal(where.style, "LUXURY");
  assert.deepEqual(where.AND, [{ OR: [
    { watchPrice: { salePrice: { gte: 5_000_000, lte: 10_000_000 } } },
    { watchPrice: { salePrice: null, listPrice: { gte: 5_000_000, lte: 10_000_000 } } },
  ] }]);
});

test("Media Post theme query only filters null classifications when requested", () => {
  const unrestricted = buildMediaPostThemeWatchWhere({});
  assert.equal("movementType" in unrestricted, false);
  assert.equal("style" in unrestricted, false);
  assert.equal("watchSpecV2" in unrestricted, false);

  const unclassified = buildMediaPostThemeWatchWhere({
    movementType: MEDIA_POST_UNCLASSIFIED_FILTER,
    caseShape: MEDIA_POST_UNCLASSIFIED_FILTER,
    style: MEDIA_POST_UNCLASSIFIED_FILTER,
  });
  assert.equal(unclassified.movementType, null);
  assert.equal(unclassified.style, null);
  assert.deepEqual(unclassified.watchSpecV2, { is: { caseShape: null } });
});

test("Media Post effective price prefers sale price then list price", () => {
  assert.equal(effectiveMediaPostPrice({ salePrice: 8, listPrice: 10 }), 8);
  assert.equal(effectiveMediaPostPrice({ salePrice: null, listPrice: 10 }), 10);
  assert.equal(effectiveMediaPostPrice({ salePrice: null, listPrice: null }), null);
});

test("Media Post gallery-copy event is registered in the business-event catalog", () => {
  const contract = getBusinessEventContract("media.post.watch.gallery.copied");
  assert.equal(contract?.key, "media.post.watch.gallery.copied");
});

test("Media Post rollback attempts cleanup for every copied storage object", async () => {
  const deleted: string[] = [];
  const failures = await cleanupCopiedMediaPostFiles(
    ["post/a.jpg", "post/b.jpg", "post/c.jpg"],
    async (key) => {
      deleted.push(key);
      if (key === "post/b.jpg") throw new Error("storage unavailable");
    },
  );
  assert.deepEqual(deleted, ["post/a.jpg", "post/b.jpg", "post/c.jpg"]);
  assert.equal(failures, 1);
});
