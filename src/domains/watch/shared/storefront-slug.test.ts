import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWatchStorefrontSlug,
  resolveWatchStorefrontSlug,
  syncStorefrontProductUrl,
} from "./storefront-slug";

const productId = "cmxyz12345678";

test("draft watch slug follows the latest title", () => {
  assert.equal(
    resolveWatchStorefrontSlug({
      title: '1970s Seiko King 5855-5000 "Frosted Dial" Quartz',
      productId,
      currentSlug: "seiko-king-quart-mat-tuyet-345678",
      publishedAt: null,
    }),
    buildWatchStorefrontSlug(
      '1970s Seiko King 5855-5000 "Frosted Dial" Quartz',
      productId,
    ),
  );
});

test("published watch keeps its existing storefront slug", () => {
  assert.equal(
    resolveWatchStorefrontSlug({
      title: "A completely new title",
      productId,
      currentSlug: "stable-published-url-345678",
      publishedAt: new Date("2026-08-26T00:00:00.000Z"),
    }),
    "stable-published-url-345678",
  );
});

test("saved hook follows the resolved draft slug", () => {
  assert.equal(
    syncStorefrontProductUrl(
      "Xem chi tiết tại: https://vinticwatches.vn/products/temporary-title-345678\n\nLiên hệ Vintic.",
      "1970s-seiko-king-frosted-dial-345678",
    ),
    "Xem chi tiết tại: https://vinticwatches.vn/products/1970s-seiko-king-frosted-dial-345678\n\nLiên hệ Vintic.",
  );
});
