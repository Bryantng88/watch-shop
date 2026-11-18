import assert from "node:assert/strict";
import test from "node:test";
import type { CustomerAssistantConversation } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { recoverStaleAssistantRun } from "./run-recovery";

test("a read recovers an abandoned run without a worker; late writes/new turns are fenced", async () => {
  const now = Date.parse("2026-11-18T00:10:00Z");
  const row = {
    id: "conversation", ownerId: "alice", revision: 7, status: "RUNNING",
    leaseToken: "old-lease", leaseExpiresAt: new Date(now - 1), approvedAt: null,
    updatedAt: new Date(now - 120_000),
    state: { turnTimes: [new Date(now - 240_000).toISOString()], pendingImage: "private-image", messages: [{ id: "user", role: "user", text: "Find watch" }] },
  } as unknown as CustomerAssistantConversation;
  let writes = 0;
  let result = row;
  let raced = false;
  const db = { customerAssistantConversation: {
    updateMany: async (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
      writes++;
      assert.equal(args.where.ownerId, "alice");
      assert.equal(args.where.revision, 7);
      assert.equal(args.where.leaseToken, "old-lease");
      assert.equal(args.where.updatedAt, row.updatedAt);
      if (raced) return { count: 0 };
      result = { ...row, ...args.data } as CustomerAssistantConversation;
      return { count: 1 };
    },
    findFirst: async ({ where }: { where: { ownerId: string } }) => { assert.equal(where.ownerId, "alice"); return result; },
  } } as unknown as DB;
  const recovered = await recoverStaleAssistantRun(db, row, now);
  assert.equal(recovered.status, "FAILED");
  assert.equal(recovered.leaseToken, null);
  assert.equal(recovered.leaseExpiresAt, null);
  assert.ok(!JSON.stringify(recovered.state).includes("private-image"));
  assert.ok(JSON.stringify(recovered.state).includes("được dừng"));
  raced = true;result = { ...row, status: "NEEDS_INFO", revision: 8 };
  assert.equal((await recoverStaleAssistantRun(db, row, now)).revision, 8);
  const count = writes;
  await recoverStaleAssistantRun(db, result, now);
  assert.equal(writes, count);
  raced = false;
  assert.equal((await recoverStaleAssistantRun(db, { ...row, approvedAt: new Date(now - 300_000) }, now)).status, "APPLIED");
});
