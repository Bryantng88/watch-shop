import type { BusinessListDashboardData } from "@/domains/shared/ui/business-list";
import { dbOrTx, type DB } from "@/server/db/client";

function bangkokTodayRange(now = new Date()) {
  const offsetMs = 7 * 60 * 60 * 1000;
  const local = new Date(now.getTime() + offsetMs);
  const start = new Date(
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) -
    offsetMs,
  );
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

export async function loadTechnicalDailyPerformance(
  db: DB,
): Promise<NonNullable<BusinessListDashboardData["technicalDailyPerformance"]>> {
  const client = dbOrTx(db);
  const { start, end } = bangkokTodayRange();
  const [eventCounts, completedWithDeadline, onTime] = await Promise.all([
    client.businessEventLog.groupBy({
      by: ["eventKey"],
      where: {
        eventKey: {
          in: [
            "technical_issue.created",
            "technical_issue.started",
            "technical_issue.completed",
          ],
        },
        createdAt: { gte: start, lt: end },
      },
      _count: { _all: true },
    }),
    client.technicalIssue.count({
      where: {
        completedAt: { gte: start, lt: end },
        expectedCompletionAt: { not: null },
      },
    }),
    client.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) AS "count"
      FROM "TechnicalIssue"
      WHERE "completedAt" >= ${start}
        AND "completedAt" < ${end}
        AND "expectedCompletionAt" IS NOT NULL
        AND "completedAt" <= "expectedCompletionAt"
    `,
  ]);
  const count = (eventKey: string) =>
    eventCounts.find((row) => row.eventKey === eventKey)?._count._all ?? 0;
  return {
    label: "Hiệu suất TI hôm nay",
    onTime: Number(onTime[0]?.count ?? 0),
    completedWithDeadline,
    created: count("technical_issue.created"),
    started: count("technical_issue.started"),
    completed: count("technical_issue.completed"),
  };
}
