import assert from "node:assert/strict";
import test from "node:test";

import { publicCatalogQuerySchema } from "./public-catalog.contract";

test("catalog pagination defaults to the first page", () => {
  assert.equal(publicCatalogQuerySchema.parse({}).page, 1);
});

test("catalog pagination accepts a positive page and rejects zero", () => {
  assert.equal(publicCatalogQuerySchema.parse({ page: "3" }).page, 3);
  assert.equal(publicCatalogQuerySchema.safeParse({ page: "0" }).success, false);
});
