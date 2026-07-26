import { Prisma } from "@prisma/client";

import { queryAdminDashboardSummary } from "@/domains/projection/server/admin-dashboard-summary.projection";
import { queryCoordinationWorkspaceSummary } from "@/domains/projection/server/coordination-workspace-summary.projection";
import { queryServiceRequestListProjection } from "@/domains/projection/server/service-request-list.projection";
import { prisma } from "@/server/db/client";

async function main() {
  const summaries = await prisma.$queryRaw<Array<{
    projectionKey: string;
    count: number;
  }>>(Prisma.sql`
    SELECT "projectionKey", COUNT(*)::int AS "count"
    FROM "ProjectionRecord"
    WHERE "projectionKey" IN (
      'coordination-workspace-summary',
      'admin-dashboard-summary',
      'service-request-list'
    )
    GROUP BY "projectionKey"
    ORDER BY "projectionKey"
  `);
  const workspace = await prisma.projectionRecord.findFirst({
    where: {
      projectionKey: "coordination-workspace-summary",
      workspaceId: { not: null },
    },
    select: { workspaceId: true },
  });
  const startedAt = performance.now();
  const [dashboard, services, coordination, serviceSourceTotal, taskItemSourceTotal] = await Promise.all([
    queryAdminDashboardSummary(prisma),
    queryServiceRequestListProjection(prisma, {
      page: 1,
      pageSize: 20,
      sort: "updatedDesc",
      view: "all",
    }),
    workspace?.workspaceId
      ? queryCoordinationWorkspaceSummary(prisma, workspace.workspaceId)
      : Promise.resolve([]),
    prisma.serviceRequest.count(),
    prisma.taskItem.count({ where: { status: { not: "CANCELLED" } } }),
  ]);
  console.log(JSON.stringify({
    summaries,
    readDurationMs: Math.round(performance.now() - startedAt),
    dashboardReady: Boolean(dashboard),
    serviceRequests: {
      loaded: services.items.length,
      total: services.total,
      sourceTotal: serviceSourceTotal,
      compareOk: services.counts.all === serviceSourceTotal,
      counts: services.counts,
    },
    coordination: {
      workspaceId: workspace?.workspaceId ?? null,
      loaded: coordination.length,
      sourceTotal: taskItemSourceTotal,
      projectedTotal: summaries.find(
        (item) => item.projectionKey === "coordination-workspace-summary",
      )?.count ?? 0,
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
