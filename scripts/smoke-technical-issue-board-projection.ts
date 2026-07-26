import { Prisma } from "@prisma/client";

import {
  TECHNICAL_ISSUE_BOARD_PROJECTION_KEY,
  listTechnicalIssueBoardWorkspaceProjection,
} from "@/domains/projection/server/technical-issue-board.projection";
import { prisma } from "@/server/db/client";

async function main() {
  const [stages, actors] = await Promise.all([
    prisma.$queryRaw<Array<{ status: string | null; count: number }>>(Prisma.sql`
      SELECT "status", COUNT(*)::int AS "count"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY}
      GROUP BY "status"
      ORDER BY "status"
    `),
    prisma.$queryRaw<Array<{ actor: string | null; count: number }>>(Prisma.sql`
      SELECT "dataJson"->'lastUpdatedBy'->>'label' AS "actor", COUNT(*)::int AS "count"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY}
      GROUP BY 1
      ORDER BY 2 DESC
    `),
  ]);
  const workspaces = await prisma.$queryRaw<Array<{ workspaceId: string; count: number }>>(Prisma.sql`
    SELECT "workspaceId", COUNT(*)::int AS "count"
    FROM "ProjectionRecord"
    WHERE "projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY}
      AND "status" = 'INSPECT'
      AND "workspaceId" IS NOT NULL
    GROUP BY "workspaceId"
    ORDER BY "count" DESC
    LIMIT 1
  `);
  const workspace = workspaces[0] ?? null;
  const startedAt = performance.now();
  const [board, inspectPage1, inspectPage2] = workspace?.workspaceId
    ? await Promise.all([
      listTechnicalIssueBoardWorkspaceProjection(prisma, {
        workspaceId: workspace.workspaceId,
        page: 1,
        pageSize: 10,
      }),
      listTechnicalIssueBoardWorkspaceProjection(prisma, {
        workspaceId: workspace.workspaceId,
        requestedStage: "INSPECT",
        page: 1,
        pageSize: 10,
      }),
      listTechnicalIssueBoardWorkspaceProjection(prisma, {
        workspaceId: workspace.workspaceId,
        requestedStage: "INSPECT",
        page: 2,
        pageSize: 10,
      }),
    ])
    : [null, null, null];
  const readDurationMs = Math.round(performance.now() - startedAt);
  console.log(JSON.stringify({
    stages,
    actors,
    projectionRead: {
      workspaceId: workspace?.workspaceId ?? null,
      readDurationMs,
      loaded: board?.rows.length ?? 0,
      total: board ? [...board.totals.values()].reduce((sum, total) => sum + total, 0) : 0,
      inspectPage1: inspectPage1?.rows.map((row) => row.id) ?? [],
      inspectPage2: inspectPage2?.rows.map((row) => row.id) ?? [],
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
