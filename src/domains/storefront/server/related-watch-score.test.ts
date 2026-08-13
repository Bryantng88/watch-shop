import assert from "node:assert/strict";
import test from "node:test";
import { rankRelatedWatches, type RelatedWatchSignal } from "./related-watch-score";

const now = new Date("2026-08-13T00:00:00.000Z");
function watch(productId: string, overrides: Partial<RelatedWatchSignal> = {}): RelatedWatchSignal {
  return { productId, siteChannel: "AFFORDABLE", price: 10_000_000, audience: "MEN", style: "DRESS", brandId: "brand-a", caseSizeMm: 36, movement: "AUTOMATIC", yearText: "1972", updatedAt: now, ...overrides };
}

test("excludes selected watches and caps suggestions", () => {
  const selected = watch("selected");
  const result = rankRelatedWatches([selected, ...Array.from({ length: 7 }, (_, index) => watch(`candidate-${index}`))], [selected]);
  assert.equal(result.length, 4);
  assert.equal(result.some(({ item }) => item.productId === selected.productId), false);
});

test("prefers the closer price when all other signals match", () => {
  const result = rankRelatedWatches([watch("far", { price: 30_000_000 }), watch("near", { price: 11_000_000 })], [watch("selected")]);
  assert.equal(result[0]?.item.productId, "near");
});

test("applies brand diversity with deterministic ordering", () => {
  const selected = watch("selected", { brandId: "selected-brand" });
  const candidates = [watch("a-1", { brandId: "brand-a" }), watch("a-2", { brandId: "brand-a" }), watch("b-1", { brandId: "brand-b" })];
  const first = rankRelatedWatches(candidates, [selected], 3).map(({ item }) => item.productId);
  assert.deepEqual(first, rankRelatedWatches(candidates, [selected], 3).map(({ item }) => item.productId));
  assert.equal(first[1], "b-1");
});

test("handles missing optional matching data", () => {
  const sparse = watch("sparse", { siteChannel: null, price: null, audience: null, style: null, brandId: null, caseSizeMm: null, movement: null, yearText: null });
  assert.deepEqual(rankRelatedWatches([watch("candidate")], [sparse], 1).map(({ item }) => item.productId), ["candidate"]);
});
