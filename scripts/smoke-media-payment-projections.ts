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
  const workspace = await prisma.projectionRecord.findFirst({
    where: { projectionKey: "media-operation-board", workspaceId: { not: null } },
    select: { workspaceId: true },
  });
  const startedAt = performance.now();
  const [payments, unpaidPayments, media, paymentCompare] = await Promise.all([
    queryPaymentListProjection(prisma, { page: 1, pageSize: 20, sort: "createdDesc" }),
    queryPaymentListProjection(prisma, {
      status: "UNPAID",
      page: 1,
      pageSize: 10,
      sort: "amountDesc",
    }),
    workspace?.workspaceId
      ? queryMediaOperationBoardProjection(prisma, {
          workspaceId: workspace.workspaceId,
          page: 1,
          pageSize: 20,
        })
      : Promise.resolve(null),
    comparePaymentListProjection(prisma),
  ]);
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
      workspaceId: workspace?.workspaceId ?? null,
      loaded: media?.rows.length ?? 0,
      total: media ? [...media.totals.values()].reduce((sum, count) => sum + count, 0) : 0,
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
