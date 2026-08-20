import assert from "node:assert/strict";
import test from "node:test";

import { publicWatchEligibilityWhere } from "./public-catalog.repo";

test("fast storefront eligibility does not require content or gallery approval", () => {
  const where = JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: true }));

  assert.equal(where.includes("reviewStates"), false);
  assert.equal(where.includes("CONTENT"), false);
  assert.equal(where.includes("IMAGE"), false);
  assert.equal(where.includes("READY"), false);
  assert.match(where, /"title":\{"not":""\}/);
  assert.match(where, /"watchSpecV2":\{"isNot":null\}/);
  assert.match(where, /"role":"COVER"/);
  assert.match(where, /"audienceSegment":"WOMEN"/);
  assert.match(where, /"role":"GALLERY"/);
  assert.match(where, /"isForStorefront":true/);
});

test("only women watches may use a storefront gallery image without a cover", () => {
  const where = JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: true }));

  assert.match(
    where,
    /"OR":\[\{"productImage":\{"some":\{"isForStorefront":true,"fileKey":\{"not":""\},"role":"COVER"\}\}\},\{"AND":\[\{"watch":\{"is":\{"audienceSegment":"WOMEN"\}\}\},\{"productImage":\{"some":\{"isForStorefront":true,"fileKey":\{"not":""\},"role":"GALLERY"\}\}\}\]\}\]/,
  );
});

test("sold watches remain visible even when their service stage is not complete", () => {
  const where = JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: true }));

  assert.match(
    where,
    /"OR":\[\{"serviceStage":\{"in":\["NOT_REQUIRED","DONE"\]\}\},\{"saleStage":"SOLD"\}\]/,
  );
});

test("quick-published watches can bypass a stale product status", () => {
  const where = JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: true }));

  assert.match(where, /"publishedAt":\{"not":null\}/);
  assert.match(where, /"status":\{"in":\["AVAILABLE","HOLD","SOLD"\]\}/);
});
