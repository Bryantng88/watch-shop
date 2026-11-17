import type { Prisma } from "@prisma/client";
import { queryDashboardAttention } from "../src/domains/admin-home/application/dashboard-attention.query";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/server/db/client";
import { queryDashboardExecutionCounts } from "../src/domains/admin-home/application/execution-summary.query";
import { MEDIA_OPERATION_BOARD_PROJECTION_KEY as MEDIA, MEDIA_OPERATION_BOARD_PROJECTION_VERSION as MV } from "../src/domains/projection/server/media-operation-board.projection";
import { TECHNICAL_ISSUE_BOARD_PROJECTION_KEY as TECH, TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION as TV } from "../src/domains/projection/server/technical-issue-board.projection";

async function main() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  assert.equal(process.env.OPERATIONS_FIXTURE_DB, "1");
  assert.ok(["127.0.0.1", "localhost"].includes(url.hostname));
  assert.equal(url.pathname, "/operations_ui_test", "Only the isolated synthetic CI database is permitted");
  const rollback = new Error("fixture rollback");
  try {
    await prisma.$transaction(async tx => {
      const row = (key: string, version: number, status: string, dataJson: Prisma.InputJsonObject, entityId = randomUUID(), updatedAt = new Date()) => ({ projectionKey: key, projectionVersion: version, rowKey: randomUUID(), entityId, status, dataJson, updatedAt });
      const same = randomUUID();
      await tx.projectionRecord.createMany({ data: [
        ...Array.from({ length: 101 }, () => row(MEDIA, MV, "MEDIA_PROCESSING", { workflowState: "NEW" })),
        row(MEDIA, MV, "MEDIA_PROCESSING", { workflowState: "REVIEW", mediaWorkProgress: { completed: 1, total: 4 } }),
        row(MEDIA, MV, "MEDIA_PROCESSING", { workflowState: "REVIEW", mediaWorkProgress: { completed: 4, total: 4 } }),
        row(MEDIA, MV, "PHOTOGRAPHY", {}),
        row(MEDIA, MV, "DONE", { workflowState: "NEW" }),
        row(MEDIA, MV + 1, "MEDIA_PROCESSING", { workflowState: "NEW" }),
        row(MEDIA, MV, "PUBLISH", { workflowState: "NEW" }, same, new Date("2026-01-01")),
        row(MEDIA, MV, "PUBLISH", { workflowState: "IN_PROGRESS" }, same, new Date("2026-01-02")),
        row(TECH, TV, "INSPECT", { executionStatus: "OPEN" }),
        row(TECH, TV, "PROCESSING", { executionStatus: "IN_PROGRESS" }),
        row(TECH, TV, "INSPECT", { executionStatus: "CANCELED" }),
        row(TECH, TV, "DONE", { executionStatus: "IN_PROGRESS" }),
      ] });
      const counts = await queryDashboardExecutionCounts(tx);
      assert.deepEqual(counts.media, { waiting: 102, inProgress: 2, unknown: 1 });
      assert.deepEqual(counts.technical, { waiting: 1, inProgress: 1, unknown: 1 });
      const now = new Date("2026-11-17T00:00:00Z");
      const staleId = randomUUID(), technicalId = randomUUID();
      await tx.projectionRecord.createMany({ data: [
        row(MEDIA, MV, "MEDIA_PROCESSING", { title: "Stale watch outside first page", sku: "STALE-001", productId: "product-fixture", imageUrl: "/fixture-image.jpg", updatedAt: "2026-09-01T00:00:00Z" }, staleId),
        row(MEDIA, MV, "DONE", { title: "Closed watch", updatedAt: "2020-01-01T00:00:00Z" }),
        row(TECH, TV, "PROCESSING", { summary: "Overdue technical", executionStatus: "IN_PROGRESS", serviceRequestId: "service-fixture", serviceRequest: { refNo: "SR-001", imageUrl: "/technical-image.jpg" }, expectedCompletionAt: "2026-11-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z" }, technicalId),
        row(TECH, TV, "INSPECT", { executionStatus: "CANCELED", expectedCompletionAt: "2020-01-01T00:00:00Z" }),
      ] });
      const request = await tx.purchaseRequest.create({ data: { reference: "PR-TEST-" + randomUUID(), channel: "FIXTURE", requestKey: randomUUID(), requestHash: "synthetic", fingerprintHash: "synthetic", customerName: "Synthetic customer", phone: "0000000000", normalizedPhone: "0000000000", followUpAt: new Date("2026-11-01"), updatedAt: new Date("2026-10-01") } });
      const attention = await queryDashboardAttention(tx, now);
      assert.ok(attention.some(item => item.id === `media-${staleId}` && item.imageUrl === "/fixture-image.jpg" && item.href.includes("product-fixture")));
      assert.ok(attention.some(item => item.id === `technical-${technicalId}` && item.href === "/admin/services/service-fixture"));
      assert.equal(attention.filter(item => item.id === `pr-${request.id}`).length, 1); // Overdue and unassigned is one item.
      assert.ok(attention.every(item => item.title !== "Closed watch"));
      assert.ok(attention.length <= 6);
      throw rollback;
    }, { timeout: 30000 });
  } catch (error) { if (error !== rollback) throw error; }
  console.log("Operations execution aggregates passed: >100 rows, current version, latest entity record, completed exclusion, real execution signals.");
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
