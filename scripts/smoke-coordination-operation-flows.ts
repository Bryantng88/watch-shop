import { getCoordinationFlowPage } from "@/domains/coordination/server/coordination-dashboard.service";
import { getSpaceViewConfig } from "@/domains/space-management/server/space-view.config";
import { prisma } from "@/server/db/client";

async function main() {
  const config = getSpaceViewConfig("OPERATION");
  const operationSpace = await prisma.task.findFirst({
    where: {
      description: "Coordination Space OPERATION",
      status: { not: "CANCELLED" },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (!operationSpace) throw new Error("OPERATION_COORDINATION_SPACE_NOT_FOUND");
  const auth = {
    id: "projection-smoke-admin",
    roles: ["admin"],
    permissions: ["TASK_VIEW_ALL"],
  };
  const results = [];

  for (const mode of config.modes.filter((item) => item.coreFlowKey)) {
    const flow = config.coreFlows?.find((item) => item.key === mode.coreFlowKey);
    const stages = [
      ...(flow?.stages.map((stage) => stage.key) ?? []),
      ...(flow?.key === "media-production-flow" ? ["done"] : []),
    ];
    for (const stage of stages) {
      const startedAt = performance.now();
      const flowPage = await getCoordinationFlowPage({
        context: "OPERATION",
        db: prisma,
        modeKey: mode.key,
        taskId: operationSpace.id,
        stage,
        page: 1,
        pageSize: 20,
        auth,
      });
      results.push({
        modeKey: mode.key,
        stage,
        durationMs: Math.round(performance.now() - startedAt),
        loaded: flowPage.items.length,
        total: flowPage.pagination.total,
        totalPages: flowPage.pagination.totalPages,
        duplicateIds:
          flowPage.items.length -
          new Set(flowPage.items.map((item) => item.id)).size,
        wrongStageItems: flowPage.items
          .filter((item) => {
            const itemStage = String(item.flowStageKey ?? "").toLowerCase();
            const requested = stage.toLowerCase();
            if (requested === "done") return itemStage !== "done";
            return itemStage !== requested;
          })
          .map((item) => item.id),
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
