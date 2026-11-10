import assert from "node:assert/strict";
import { test } from "node:test";
import type { DB } from "@/server/db/client";
import { benCalendarTargets } from "./calendar-targets";

test("only the active connected creator and assignee become targets, in stable order", async () => {
  let query: unknown;
  const db = { googleCalendarConnection: { findMany: async (input: unknown) => {
    query = input;
    return [{ userId: "assignee", user: { name: "Vi" } }, { userId: "owner", user: { name: "Long" } }];
  } } } as unknown as DB;
  assert.deepEqual(await benCalendarTargets(db, "owner", "assignee", "2026-11-12T08:00:00+07:00"), [
    { userId: "owner", name: "Long" }, { userId: "assignee", name: "Vi" },
  ]);
  assert.deepEqual(query, {
    where: { userId: { in: ["owner", "assignee"] }, user: { isActive: true } },
    select: { userId: true, user: { select: { name: true } } },
  });
});

test("disconnected accounts are skipped and undated work never invents a calendar date", async () => {
  let calls = 0;
  const db = { googleCalendarConnection: { findMany: async () => {
    calls++; return [{ userId: "assignee", user: { name: "Vi" } }];
  } } } as unknown as DB;
  assert.deepEqual(await benCalendarTargets(db, "owner", "assignee", null), []);
  assert.equal(calls, 0);
  assert.deepEqual(await benCalendarTargets(db, "owner", "assignee", "2026-11-12T08:00:00+07:00"), [{ userId: "assignee", name: "Vi" }]);
});
