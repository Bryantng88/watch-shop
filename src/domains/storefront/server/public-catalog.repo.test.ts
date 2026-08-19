import assert from "node:assert/strict";
import test from "node:test";

import { publicWatchEligibilityWhere } from "./public-catalog.repo";

test("fast storefront eligibility does not require content or gallery approval", () => {
  const where = JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: true }));

  assert.equal(where.includes("reviewStates"), false);
  assert.equal(where.includes("CONTENT"), false);
  assert.equal(where.includes("IMAGE"), false);
  assert.equal(where.includes("saleStage"), false);
  assert.match(where, /"title":\{"not":""\}/);
  assert.match(where, /"watchSpecV2":\{"isNot":null\}/);
  assert.match(where, /"role":"COVER"/);
  assert.match(where, /"isForStorefront":true/);
});

test("quick-published watches can bypass a stale product status", () => {
  const where = JSON.stringify(publicWatchEligibilityWhere({ requireCoverImage: true }));

  assert.match(where, /"publishedAt":\{"not":null\}/);
  assert.match(where, /"status":\{"in":\["AVAILABLE","HOLD","SOLD"\]\}/);
});
