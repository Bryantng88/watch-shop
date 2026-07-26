import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const [summary] = await prisma.$queryRawUnsafe(`
    SELECT
      COUNT(*)::int AS "activeBindings",
      COUNT(DISTINCT ("taskId", "targetType", "targetId"))::int AS "uniqueTargets",
      (
        COUNT(*) -
        COUNT(DISTINCT ("taskId", "targetType", "targetId"))
      )::int AS "duplicateBindings"
    FROM "TaskExecution"
    WHERE "targetType" = 'PAYMENT'
      AND "actionType" <> 'CANCELLED'
      AND "taskItemId" IS NOT NULL
  `);

  const duplicateGroups = await prisma.$queryRawUnsafe(`
    SELECT
      "taskId",
      "targetId",
      COUNT(*)::int AS "bindingCount"
    FROM "TaskExecution"
    WHERE "targetType" = 'PAYMENT'
      AND "actionType" <> 'CANCELLED'
      AND "taskItemId" IS NOT NULL
    GROUP BY "taskId", "targetId"
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC, "targetId"
    LIMIT 20
  `);

  console.log(JSON.stringify({ summary, duplicateGroups }, null, 2));
} finally {
  await prisma.$disconnect();
}
