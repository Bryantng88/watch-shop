import assert from "node:assert/strict";
import test from "node:test";
import type { DB } from "@/server/db/client";
import { buildMediaOperationBoardRow } from "@/domains/projection/server/media-operation-board.projection";
import { listProjectionBuildersForEvent } from "@/domains/projection/server/projection.registry";
import { applyManualTriggerToQueueItem, listAvailableManualTransitions } from "@/domains/task/server/business-binding-workflow.service";

test("withdrawal refreshes board, queue, Watch list and acquisition list", () => {
  const builders = listProjectionBuildersForEvent({ eventKey: "watch.media.withdrawn", targetType: "WATCH" }).map(builder => builder.key);
  for (const key of ["media-operation-board", "watch-media-queue", "watch-list", "acquisition-list"]) assert.ok(builders.includes(key), key);
});

test("withdrawn Watch is removed instead of becoming a legacy Done row", async () => {
  const writes: string[] = [];
  const db = {
    taskExecution: { findMany: async ({ where }: { where: { actionType: unknown } }) =>
      where.actionType === "CANCELLED" ? [{ metadataJson: { mediaWithdrawal: { withdrawnAt: "2026-11-25T00:00:00Z" } } }] : [] },
    watch: { findUnique: async () => ({ id: "watch", isContentDownloaded: true, isImageDownloaded: true }) },
    $executeRaw: async (sql: { sql: string }) => { writes.push(sql.sql); return 1; },
  } as unknown as DB;
  assert.equal(await buildMediaOperationBoardRow(db, { watchId: "watch" }), null);
  assert.equal(writes.length, 1);
  assert.match(writes[0], /DELETE FROM "ProjectionRecord"/);
});

test("stale manual workflow commands cannot mutate a retired media binding", async () => {
  const db = { taskExecution: { findUnique: async () => ({ id: "retired", actionType: "CANCELLED" }) } } as unknown as DB;
  const result = await applyManualTriggerToQueueItem(db, { bindingId: "retired", actionKey: "mark-done", actorUserId: "vi" });
  assert.equal(result.applied, false);
  assert.equal(result.reason, "BINDING_NOT_FOUND");
  assert.deepEqual(await listAvailableManualTransitions(db, "retired"), []);
});
