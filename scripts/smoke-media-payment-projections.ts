import { Prisma } from "@prisma/client";

import { queryMediaOperationBoardProjection } from "@/domains/projection/server/media-operation-board.projection";
import {
  comparePaymentListProjection,
  queryPaymentListProjection,
} from "@/domains/projection/server/payment-list.projection";
import { prisma } from "@/server/db/client";

async function main() {
  const summaries = await prisma.$queryRaw<Array<{
    projectionKey: string;
    count: number;
  }>>(Prisma.sql`
    SELECT "projectionKey", COUNT(*)::int AS "count"
    FROM "ProjectionRecord"
    WHERE "projectionKey" IN (
      'watch-media-queue',
      'media-operation-board',
      'payment-owner-summary',
      'payment-list'
    )
    GROUP BY "projectionKey"
    ORDER BY "projectionKey"
  `);
  const startedAt = performance.now();
  const [payments, unpaidPayments, media, paymentCompare] = await Promise.all([
    queryPaymentListProjection(prisma, { page: 1, pageSize: 20, sort: "createdDesc" }),
    queryPaymentListProjection(prisma, {
      status: "UNPAID",
      page: 1,
      pageSize: 10,
      sort: "amountDesc",
    }),
    queryMediaOperationBoardProjection(prisma, {
      page: 1,
      pageSize: 100,
    }),
    comparePaymentListProjection(prisma),
  ]);
  const sampleRows = media.rows.filter((row) =>
    row.title.includes("Omega Seamaster Chronometer Automatic Silver") ||
    row.title.includes("Seiko Grand Seiko Quartz Silver") ||
    row.title.includes("Longines 4210 993 SWISS 4210 Automatic White")
  );
  const sampleBindings = await prisma.taskExecution.findMany({
    where: { id: { in: sampleRows.map((row) => row.bindingId) } },
    select: {
      id: true,
      taskItem: { select: { note: true } },
    },
  });
  const sampleWatchBindings = await prisma.taskExecution.findMany({
    where: {
      targetType: "WATCH",
      targetId: { in: sampleRows.map((row) => row.id) },
      taskItemId: { not: null },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      targetId: true,
      metadataJson: true,
      taskItem: { select: { note: true } },
    },
  });
  const workTypeByBindingId = new Map(sampleBindings.map((binding) => [
    binding.id,
    String(binding.taskItem?.note ?? "").match(/workTypeKey:\s*([a-z0-9-]+)/i)?.[1] ?? null,
  ]));
  console.log(JSON.stringify({
    summaries,
    readDurationMs: Math.round(performance.now() - startedAt),
    payment: {
      loaded: payments.items.length,
      total: payments.total,
      sourceTotal: paymentCompare.sourceTotal,
      compareOk: paymentCompare.ok,
      differences: paymentCompare.differences,
      counts: payments.counts,
      unpaidLoaded: unpaidPayments.items.length,
      unpaidTotal: unpaidPayments.total,
    },
    media: {
      loaded: media.rows.length,
      total: [...media.totals.values()].reduce((sum, count) => sum + count, 0),
      stageCounts: Object.fromEntries(media.totals),
      publishStateCounts: Object.fromEntries(
        [...media.rows
          .filter((row) => row.stage === "PUBLISH")
          .reduce((counts, row) => {
            const state = row.workflowState ?? "NULL";
            counts.set(state, (counts.get(state) ?? 0) + 1);
            return counts;
          }, new Map<string, number>())],
      ),
      publishActions: media.rows
        .filter((row) => row.stage === "PUBLISH")
        .map((row) => ({
          title: row.title,
          state: row.workflowState,
          actions: row.manualTransitions.map((transition) => transition.actionKey),
        })),
      terminalStateOutsideDone: media.rows
        .filter((row) => row.stage !== "DONE" && row.workflowState === "DONE")
        .map((row) => ({ title: row.title, stage: row.stage })),
      completedProcessingSamples: media.rows
        .filter((row) =>
          row.title.includes("Omega Seamaster Chronometer Automatic Silver") ||
          row.title.includes("Seiko Grand Seiko Quartz Silver")
        )
        .map((row) => ({
          title: row.title,
          stage: row.stage,
          bindingWorkType: workTypeByBindingId.get(row.bindingId) ?? null,
          workflowState: row.workflowState,
        })),
      transitionedStageSamples: sampleRows.map((row) => ({
        title: row.title,
        stage: row.stage,
        bindingWorkType: workTypeByBindingId.get(row.bindingId) ?? null,
        workflowState: row.workflowState,
      })),
      sampleBindings: sampleRows.map((row) => ({
        title: row.title,
        bindings: sampleWatchBindings
          .filter((binding) => binding.targetId === row.id)
          .map((binding) => {
            const metadata = binding.metadataJson &&
              typeof binding.metadataJson === "object" &&
              !Array.isArray(binding.metadataJson)
              ? binding.metadataJson as Record<string, unknown>
              : {};
            const runtime = metadata.workflowRuntime &&
              typeof metadata.workflowRuntime === "object" &&
              !Array.isArray(metadata.workflowRuntime)
              ? metadata.workflowRuntime as Record<string, unknown>
              : {};
            return {
              workType: String(binding.taskItem?.note ?? "")
                .match(/workTypeKey:\s*([a-z0-9-]+)/i)?.[1] ?? null,
              currentState: runtime.currentState ?? null,
              updatedAt: runtime.updatedAt ?? null,
            };
          }),
      })),
    },
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
