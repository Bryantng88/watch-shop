import assert from "node:assert/strict";
import test from "node:test";
import type { DB } from "@/server/db/client";
import { lookupPersonalWork } from "./personal-work-update";
test("CV25, CV-25 and spaced codes resolve the same scoped numbered task, not a title", async () => {
  for (const query of ["CV25", "CV-25", "CV 25", "cv - 25"]) {
    let args: unknown;
    const db = {
      taskItem: {
        findMany: async (input: unknown) => {
          args = input;
          return [
            {
              id: "task",
              personalWorkNumber: 25,
              title: "BCPA: Bảo trì website",
              status: "TODO",
              workTypeId: null,
            },
          ];
        },
      },
    } as unknown as DB;
    const result = await lookupPersonalWork(
      db,
      "viewer",
      "personalWork.search",
      query,
    );
    const where = (args as { where: { AND: unknown[] } }).where;
    assert.ok(JSON.stringify(where).includes('"personalWorkNumber":25'));
    assert.ok(JSON.stringify(where).includes('"viewer"'));
    assert.ok(!JSON.stringify(where).includes('"contains"'));
    assert.equal(result.matches![0].code, "CV-25");
  }
});
test("EV codes retain event scope and detail accepts an unhyphenated code without bypassing access", async () => {
  let args: unknown;
  const db = {
    taskItem: {
      findFirst: async (input: unknown) => {
        args = input;
        return null;
      },
    },
  } as unknown as DB;
  const result = await lookupPersonalWork(
    db,
    "viewer",
    "personalWork.detail",
    "ev9",
  );
  assert.equal(result.item, null);
  const where = JSON.stringify((args as { where: unknown }).where);
  assert.ok(where.includes('"personalWorkNumber":9'));
  assert.ok(where.includes('"EVENT"'));
  assert.ok(where.includes('"viewer"'));
});
