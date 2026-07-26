import { getCoordinationBoard } from "@/domains/coordination/server/coordination-dashboard.service";
import { prisma } from "@/server/db/client";

async function main() {
  const cycle = await prisma.task.findFirst({
    where: {
      description: { startsWith: "Coordination cycle OPERATION " },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (!cycle) throw new Error("OPERATION_COORDINATION_CYCLE_NOT_FOUND");

  const startedAt = performance.now();
  const board = await getCoordinationBoard({
    db: prisma,
    boardKey: "technical-issue",
    taskId: cycle.id,
    page: 1,
    pageSize: 10,
  });
  console.log(JSON.stringify({
    durationMs: Math.round(performance.now() - startedAt),
    taskId: cycle.id,
    itemCount: board?.items.length ?? 0,
    columnPagination: board?.columnPagination ?? {},
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
