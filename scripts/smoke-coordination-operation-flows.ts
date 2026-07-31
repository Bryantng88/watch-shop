import { getCoordinationFlowPage } from "@/domains/coordination/server/coordination-dashboard.service";
import { getSpaceViewConfig } from "@/domains/space-management/server/space-view.config";
import { prisma } from "@/server/db/client";

async function actorMismatches(
  items: Awaited<ReturnType<typeof getCoordinationFlowPage>>["items"],
) {
  if (!items.length) return [];
  const events = await prisma.businessEventLog.findMany({
    where: {
      OR: items.map((item) => ({
        targetType: String(item.targetType).toUpperCase(),
        targetId: item.targetId,
      })),
    },
    orderBy: { createdAt: "desc" },
    select: {
      targetType: true,
      targetId: true,
      actorUserId: true,
    },
  });
  const latestByTarget = new Map<string, (typeof events)[number]>();
  for (const event of events) {
    const key = `${event.targetType.toUpperCase()}:${event.targetId}`;
    if (!latestByTarget.has(key)) latestByTarget.set(key, event);
  }
  const actorIds = Array.from(
    new Set(
      [...latestByTarget.values()]
        .map((event) => event.actorUserId)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const actors = actorIds.length
    ? await prisma.user.findMany({
        where: { id: { in: actorIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const actorLabelById = new Map(
    actors.map((actor) => [actor.id, actor.name ?? actor.email ?? ""]),
  );

  return items.flatMap((item) => {
    const event = latestByTarget.get(
      `${String(item.targetType).toUpperCase()}:${item.targetId}`,
    );
    if (!event?.actorUserId) return [];
    const expected = actorLabelById.get(event.actorUserId);
    const actual = item.lastUpdatedBy;
    return !expected || actual?.isSystem || actual?.label !== expected
      ? [{
          itemId: item.id,
          targetId: item.targetId,
          expectedActor: expected ?? event.actorUserId,
          actualActor: actual?.label ?? null,
          actualIsSystem: actual?.isSystem ?? null,
        }]
      : [];
  });
}

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
      const mismatchedActors = await actorMismatches(flowPage.items);
      results.push({
        modeKey: mode.key,
        stage,
        durationMs: Math.round(performance.now() - startedAt),
        loaded: flowPage.items.length,
        total: flowPage.pagination.total,
        totalPages: flowPage.pagination.totalPages,
        stageCounts: flowPage.stageCounts,
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
        mismatchedActors,
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  const invalid = results.filter((result) => {
    const requestedStageCount = result.stageCounts[result.stage];
    return (
      result.duplicateIds !== 0 ||
      result.wrongStageItems.length !== 0 ||
      result.mismatchedActors.length !== 0 ||
      requestedStageCount !== result.total
    );
  });
  if (invalid.length) {
    throw new Error(
      `OPERATION_FLOW_RECONCILIATION_FAILED: ${JSON.stringify(invalid)}`,
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
