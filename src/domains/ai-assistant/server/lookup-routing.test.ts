import assert from "node:assert/strict";
import test from "node:test";
import type { DB } from "@/server/db/client";
import { findCustomerRepairs } from "./customer-repairs";
import { searchPhotoCatalog } from "./photo-catalog-search";

test("customer repairs search customer-owned tickets without an opening-date filter", async () => {
  let args: any;
  const db = { serviceRequest: { findMany: async (input: unknown) => {
    args = input;
    return [{ id: "repair", refNo: "SC-1", status: "IN_PROGRESS", technicalIssue: [] }];
  } } } as unknown as DB;
  const result = await findCustomerRepairs(db, "Tissot");
  assert.equal(args.where.scope, "CUSTOMER_OWNED");
  assert.equal(args.where.createdAt, undefined);
  assert.deepEqual(args.where.AND[0].OR[0], { brandSnapshot: { contains: "Tissot", mode: "insensitive" } });
  assert.equal(result.matches[0].href, "/admin/services/issues-board?serviceRequestId=repair");
});

test("photo lookup prefers an exact SKU and only falls back to all identifying terms", async () => {
  const calls: any[] = [];
  const db = { product: { findMany: async (input: unknown) => {
    calls.push(input);
    return calls.length === 2 ? [{ id: "watch" }] : [];
  } } } as unknown as DB;
  const result = await searchPhotoCatalog(db, "Longines Ultra-Chron");
  assert.equal(calls[0].where.OR[1].sku.equals, "Longines Ultra-Chron");
  assert.equal(calls[1].where.AND.length, 3);
  assert.equal(result.matches[0].id, "watch");
});
