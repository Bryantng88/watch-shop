import { getCoordinationBoard } from "@/domains/coordination/server/coordination-dashboard.service";
import { prisma } from "@/server/db/client";

async function main() {
  const space = await prisma.task.findFirst({
    where: {
      description: "Coordination Space OPERATION",
      status: { not: "CANCELLED" },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (!space) throw new Error("OPERATION_COORDINATION_SPACE_NOT_FOUND");

  const startedAt = performance.now();
  const [board, allHistoryBoard] = await Promise.all([
    getCoordinationBoard({
      db: prisma,
      boardKey: "technical-issue",
      taskId: space.id,
      page: 1,
      pageSize: 10,
      doneRetentionDays: 14,
    }),
    getCoordinationBoard({
      db: prisma,
      boardKey: "technical-issue",
      taskId: space.id,
      stage: "DONE",
      page: 1,
      pageSize: 10,
      doneRetentionDays: null,
    }),
  ]);
  console.log(JSON.stringify({
    durationMs: Math.round(performance.now() - startedAt),
    taskId: space.id,
    itemCount: board?.items.length ?? 0,
    columnPagination: board?.columnPagination ?? {},
    allHistoryDone: allHistoryBoard?.columnPagination.DONE ?? null,
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
