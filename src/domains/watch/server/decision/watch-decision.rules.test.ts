import assert from "node:assert/strict";
import test from "node:test";

import { buildWatchDecision } from "./watch-decision.rules";

function readyParts(): Parameters<typeof buildWatchDecision>[0] {
  return {
    watchId: "watch-1",
    productId: "product-1",
    service: { stage: "DONE", requestId: null, requestRef: null, requestStatus: null, openIssueCount: 0, ready: true },
    pricing: { costPrice: 4_000_000, serviceCost: 500_000, landedCost: 4_500_000, listPrice: 8_000_000, salePrice: 7_000_000, minPrice: 6_000_000, effectiveCost: 4_500_000, marginAmount: 2_500_000, marginPercent: 35.7, maxDiscountAmount: 1_000_000, canDiscount: true, ready: true },
    media: { galleryCount: 6, availableCount: 6, missingCount: 0, hasCover: true, reviewStatus: "APPROVED" as const, ready: true },
    content: { hasContent: true, reviewStatus: "APPROVED" as const, ready: true },
    storefront: { published: false, priceVisible: true, ready: false },
  };
}

test("watch đủ điều kiện thì sẵn sàng đăng", () => {
  const result = buildWatchDecision(readyParts());
  assert.equal(result.progress, 100);
  assert.equal(result.decision.status, "READY_TO_PUBLISH");
  assert.equal(result.decision.recommendedAction?.key, "OPEN_STOREFRONT");
});

test("service chờ duyệt luôn chặn quyết định bán", () => {
  const parts = readyParts();
  parts.service = { ...parts.service, stage: "PENDING", requestId: "sr-1", requestStatus: "WAIT_APPROVAL", ready: false };
  const result = buildWatchDecision(parts);
  assert.equal(result.decision.status, "NEEDS_SERVICE_DECISION");
  assert.equal(result.decision.recommendedAction?.key, "OPEN_SERVICE");
});

test("watch chưa đưa vào service không bị coi là blocker", () => {
  const parts = readyParts();
  parts.service = { ...parts.service, stage: "NOT_ASSESSED", ready: true };
  const result = buildWatchDecision(parts);
  assert.equal(result.decision.status, "READY_TO_PUBLISH");
});

test("thiếu media được ưu tiên sau service và pricing", () => {
  const parts = readyParts();
  parts.media = { ...parts.media, galleryCount: 0, availableCount: 0, hasCover: false, reviewStatus: "DRAFT", ready: false };
  const result = buildWatchDecision(parts);
  assert.equal(result.decision.status, "NEEDS_MEDIA");
  assert.equal(result.decision.recommendedAction?.key, "OPEN_MEDIA");
});

test("đã publish không được che các blocker hiện tại", () => {
  const parts = readyParts();
  parts.storefront.published = true;
  parts.pricing = { ...parts.pricing, costPrice: null, landedCost: null, effectiveCost: null, minPrice: null, ready: false };
  const result = buildWatchDecision(parts);
  assert.equal(result.progress, 75);
  assert.equal(result.decision.status, "NEEDS_PRICING");
  assert.match(result.decision.warnings[0], /đang hiển thị trên storefront/);
});

test("decision links use current detail or the dedicated media mode, never the retired editor", () => {
  const parts = readyParts();
  parts.service.ready = false;
  parts.pricing.ready = false;
  parts.media.ready = false;
  parts.content.ready = false;
  const actions = buildWatchDecision(parts).decision.allowedActions;
  for (const action of actions) {
    const url = new URL(action.href, "https://example.test");
    if (action.key === "OPEN_MEDIA" || action.key === "OPEN_CONTENT") {
      assert.equal(url.searchParams.get("mode"), "media");
      assert.equal(url.searchParams.get("focus"), action.key === "OPEN_CONTENT" ? "content" : "image");
    } else {
      assert.equal(url.pathname, "/admin/watches/product-1");
    }
  }
});
