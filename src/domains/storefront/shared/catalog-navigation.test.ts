import assert from "node:assert/strict";
import test from "node:test";
import { catalogRefinementHref } from "./catalog-navigation";

test("refining a late catalog page keeps other filters and resets pagination", () => {
  const result = new URL(
    catalogRefinementHref("page=6&cursor=old&brand=seiko&audience=WOMEN&sort=PRICE_ASC", {
      style: "DRESS",
    }),
    "https://vintic.example",
  );
  assert.equal(result.searchParams.get("brand"), "seiko");
  assert.equal(result.searchParams.get("audience"), "WOMEN");
  assert.equal(result.searchParams.get("sort"), "PRICE_ASC");
  assert.equal(result.searchParams.get("style"), "DRESS");
  assert.equal(result.searchParams.has("page"), false);
  assert.equal(result.searchParams.has("cursor"), false);
});
test("removing one active chip preserves search and other refinements", () => {
  const result = new URL(
    catalogRefinementHref("brand=seiko&style=DRESS&q=King+Seiko&page=3", { brand: undefined }),
    "https://vintic.example",
  );
  assert.equal(result.searchParams.has("brand"), false);
  assert.equal(result.searchParams.get("style"), "DRESS");
  assert.equal(result.searchParams.get("q"), "King Seiko");
  assert.equal(result.searchParams.has("page"), false);
});
test("sort and search refinements encode text safely and support clearing the last value", () => {
  const result = new URL(
    catalogRefinementHref("page=2&style=SPORT", { q: "King & Seiko", sort: "PRICE_DESC" }),
    "https://vintic.example",
  );
  assert.equal(result.searchParams.get("q"), "King & Seiko");
  assert.equal(result.searchParams.get("style"), "SPORT");
  assert.equal(result.searchParams.get("sort"), "PRICE_DESC");
  assert.equal(catalogRefinementHref("q=Seiko&page=2", { q: undefined }), "/products");
});
