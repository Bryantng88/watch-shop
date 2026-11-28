import assert from "node:assert/strict";
import test from "node:test";
import type { DB } from "@/server/db/client";
import { loadAdminIntakeIdentities } from "./admin-watch-identity.query";

test("admin identity follows current inventory cycle, falls back only for legacy watches, ignores cancelled intake", async () => {
  let reads = 0;
  const db = {
    watch: { findMany: async () => [
      { productId: "returned", acquisitionId: "old", currentInventoryCycle: { sourceAcquisitionItem: { acquisition: { refNo: "PN-281126-000002", accquisitionStt: "POSTED", vendor: { name: "Đạt" } } } } },
      { productId: "legacy", acquisitionId: "old", currentInventoryCycle: null },
      { productId: "cancelled", acquisitionId: "old", currentInventoryCycle: { sourceAcquisitionItem: { acquisition: { refNo: "PN-281126-000003", accquisitionStt: "CANCELED", vendor: { name: "Nhật" } } } } },
      { productId: "manual", acquisitionId: null, currentInventoryCycle: null },
    ] },
    acquisition: { findMany: async (input: { where: { id: { in: string[] }; accquisitionStt: string } }) => {
      reads++;
      assert.deepEqual(input.where, { id: { in: ["old"] }, accquisitionStt: "POSTED" });
      return [{ id: "old", refNo: "PN-271126-000001", accquisitionStt: "POSTED", vendor: { name: "Nhật" } }];
    } },
  } as unknown as DB;
  assert.deepEqual([...await loadAdminIntakeIdentities(db, ["returned", "legacy", "cancelled", "manual"])], [
    ["returned", "DAT-PN281126-000002"], ["legacy", "NHAT-PN271126-000001"],
  ]);
  assert.equal(reads, 1);
  assert.equal((await loadAdminIntakeIdentities({} as DB, [])).size, 0);
});
