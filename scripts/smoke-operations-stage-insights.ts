import assert from "node:assert/strict";
import { Prisma, PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";
import { queryProjectionStageStatistics, queryStageThroughput, queryOpenOperationStageStatistics } from "../src/domains/projection/server/operation-stage-statistics.query";

loadEnvConfig(process.cwd());

const url = new URL(process.env.DATABASE_URL ?? "");
if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) || !/(test|local|storefront)/i.test(url.pathname)) {
  throw new Error("Stage insight smoke requires a loopback local/test database");
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$transaction(async tx => {
      // Session-private fixtures shadow public tables only for this transaction.
      await tx.$executeRawUnsafe("SET LOCAL TIME ZONE 'UTC'");
      await tx.$executeRawUnsafe('CREATE TEMP TABLE "TaskItem" (id text, note text, "taskId" text, status text, "dueAt" timestamp, "updatedAt" timestamp) ON COMMIT DROP');
      await tx.$executeRawUnsafe('CREATE TEMP TABLE "TaskExecution" ("taskItemId" text, "targetType" text, "actionType" text, "metadataJson" jsonb) ON COMMIT DROP');
      await tx.$executeRawUnsafe('CREATE TEMP TABLE "PurchaseRequest" ("createdAt" timestamp, "processingStartedAt" timestamptz, "completedAt" timestamptz, outcome text, status text, "updatedAt" timestamptz) ON COMMIT DROP');
      await tx.$executeRawUnsafe('CREATE TEMP TABLE "ProjectionRecord" ("entityId" text, status text, "dataJson" jsonb, "projectionKey" text, "projectionVersion" int, "updatedAt" timestamptz) ON COMMIT DROP');
      await tx.$executeRawUnsafe('CREATE TEMP TABLE "Task" (id text, kind text, "createdByUserId" text, "assignedToUserId" text) ON COMMIT DROP');
      await tx.$executeRawUnsafe('CREATE TEMP TABLE "PersonalTaskShare" ("taskItemId" text, "userId" text) ON COMMIT DROP');
      await tx.$executeRawUnsafe('CREATE TEMP TABLE "Payment" (status text, direction text, "updatedAt" timestamp) ON COMMIT DROP');
      const now = new Date("2026-10-29T05:00:00Z");
      const at = (days: number) => new Date(now.getTime() - days * 86400000);
      await tx.$executeRaw`INSERT INTO "TaskItem" (id, note) VALUES ('item', 'workTypeKey: media-processing')`;
      const runs = [
        { start: 9, end: 1, state: "DONE" }, // Completes in window, starts outside cohort.
        { start: 2, end: 1, state: "DONE" },
        { start: 1, end: null, state: "NEW" },
        { start: 1, end: 0, state: "CANCELLED" },
        { start: -1, end: null, state: "NEW" }, // Future start is excluded.
        { start: 1, end: 2, state: "DONE" }, // Invalid negative interval is excluded.
      ];
      for (const run of runs) {
        const metadata = JSON.stringify({ workflowRuntime: { startedAt: at(run.start).toISOString(), completedAt: run.end === null ? null : at(run.end).toISOString(), currentState: run.state } });
        await tx.$executeRaw`INSERT INTO "TaskExecution" VALUES ('item', 'WATCH', 'CREATED', ${metadata}::jsonb)`;
      }
      await tx.$executeRaw`INSERT INTO "PurchaseRequest" ("createdAt", "processingStartedAt", "completedAt", outcome) VALUES
        (${at(2)}, ${at(1)}, NULL, NULL), (${at(1)}, NULL, NULL, NULL),
        (${at(1)}, ${at(0.5)}, ${now}, 'CANCELLED')`;
      const throughput = await queryStageThroughput(tx, now);
      const media = throughput.find(row => row.queueKey === "media")!;
      assert.equal(Number(media.completedCount), 2);
      assert.equal(Number(media.averageHandlingHours), 108);
      assert.equal(Number(media.cohortCount), 2);
      assert.equal(Number(media.cohortCompletedCount), 1);
      const waiting = throughput.find(row => row.queueKey === "purchase-requests" && row.stageKey === "waiting")!;
      assert.equal(Number(waiting.cohortCount), 2);
      assert.equal(Number(waiting.cohortCompletedCount), 1);
      await tx.$executeRawUnsafe("SET LOCAL TIME ZONE 'Asia/Bangkok'");
      const alternateTimezone = (await queryStageThroughput(tx, now)).find(row => row.queueKey === "purchase-requests" && row.stageKey === "waiting")!;
      assert.equal(Number(alternateTimezone.averageHandlingHours), Number(waiting.averageHandlingHours));
      await tx.$executeRawUnsafe("SET LOCAL TIME ZONE 'UTC'");

      const records = Array.from({ length: 105 }, (_, index) => Prisma.sql`(
        ${String(index)}, 'MEDIA_PROCESSING',
        ${JSON.stringify({ updatedAt: at(10).toISOString(), mediaWorkProgress: { completed: index < 100 ? 4 : 0 } })}::jsonb,
        'fixture', 1, ${at(10)}
      )`);
      await tx.$executeRaw(Prisma.sql`INSERT INTO "ProjectionRecord" VALUES ${Prisma.join(records)}`);
      await tx.$executeRaw`INSERT INTO "ProjectionRecord" VALUES (
        '0', 'MEDIA_PROCESSING', ${JSON.stringify({ updatedAt: now.toISOString(), mediaWorkProgress: { completed: 0 } })}::jsonb,
        'fixture', 1, ${now}
      )`;
      const stats = (await queryProjectionStageStatistics(tx, "fixture", 1, now))[0];
      assert.equal(Number(stats.count), 105);
      assert.equal(Number(stats.staleCount), 104);
      assert.equal(Number(stats.stepsDone), 396);
      assert.equal(Number(stats.stepsTotal), 420);

      await tx.$executeRaw`INSERT INTO "Task" VALUES ('owned', 'PERSONAL', 'owner', NULL), ('other', 'PERSONAL', 'other', NULL)`;
      await tx.$executeRaw`INSERT INTO "TaskItem" (id, "taskId", status, "dueAt", "updatedAt") VALUES
        ('mine', 'owned', 'TODO', ${now}, ${at(1)}),
        ('private', 'other', 'TODO', ${now}, ${at(20)}),
        ('shared', 'other', 'TODO', ${now}, ${at(2)}),
        ('done', 'owned', 'DONE', ${now}, ${at(20)})`;
      await tx.$executeRaw`INSERT INTO "PersonalTaskShare" VALUES ('shared', 'owner')`;
      await tx.$executeRawUnsafe("SET LOCAL TIME ZONE 'Asia/Bangkok'");
      const input = { now, todayStart: new Date("2026-10-28T17:00:00Z"), todayEnd: new Date("2026-10-29T17:00:00Z"), userId: "owner" };
      const visible = await queryOpenOperationStageStatistics(tx, input);
      assert.equal(Number(visible.find(row => row.stageKey === "personal-today")?.count), 2);
      assert.equal(Number(visible.find(row => row.stageKey === "personal-today")?.averageIdleHours), 36);
      assert.equal((await queryOpenOperationStageStatistics(tx, { ...input, userId: null })).some(row => row.queueKey === "personal-work"), false);
      console.log("PASS: >100-row full aggregates, latest-entity deduplication, real checklist progress, independent throughput/cohort windows, waiting-stage exit, cancellation/future/invalid interval guards, personal owner/share scope and anonymous isolation; session-private fixtures only");
    }, { timeout: 30000 });
  } finally {
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Stage insight smoke failed"); process.exitCode = 1; });
