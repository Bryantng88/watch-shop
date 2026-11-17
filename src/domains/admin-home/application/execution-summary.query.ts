import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { MEDIA_OPERATION_BOARD_PROJECTION_KEY, MEDIA_OPERATION_BOARD_PROJECTION_VERSION } from "@/domains/projection/server/media-operation-board.projection";
import { TECHNICAL_ISSUE_BOARD_PROJECTION_KEY, TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION } from "@/domains/projection/server/technical-issue-board.projection";
import { mediaExecutionState, technicalExecutionState, type DashboardExecutionCounts } from "../shared/execution-summary";

/** Aggregate all current records, independent of the board's first 100 visible rows. */
export async function queryDashboardExecutionCounts(db: DB) {
  const result = { media: { waiting: 0, inProgress: 0, unknown: 0 }, technical: { waiting: 0, inProgress: 0, unknown: 0 } } satisfies Record<string, DashboardExecutionCounts>;
  const groups = await dbOrTx(db).$queryRaw<Array<{
    projectionKey: string; state: string | null; executionStatus: string | null;
    completed: string | null; total: string | null; count: bigint;
  }>>(Prisma.sql`
    WITH latest AS (
      SELECT DISTINCT ON ("projectionKey", "entityId") "projectionKey", "entityId", "status", "dataJson"
      FROM "ProjectionRecord"
      WHERE ("projectionKey" = ${MEDIA_OPERATION_BOARD_PROJECTION_KEY} AND "projectionVersion" = ${MEDIA_OPERATION_BOARD_PROJECTION_VERSION})
         OR ("projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY} AND "projectionVersion" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_VERSION})
      ORDER BY "projectionKey", "entityId", "updatedAt" DESC
    )
    SELECT "projectionKey", "dataJson"->>'workflowState' AS state,
      "dataJson"->>'executionStatus' AS "executionStatus",
      "dataJson"#>>'{mediaWorkProgress,completed}' AS completed,
      "dataJson"#>>'{mediaWorkProgress,total}' AS total, COUNT(*) AS count
    FROM latest
    WHERE ("projectionKey" = ${MEDIA_OPERATION_BOARD_PROJECTION_KEY} AND "status" IN ('PHOTOGRAPHY', 'MEDIA_PROCESSING', 'PUBLISH'))
       OR ("projectionKey" = ${TECHNICAL_ISSUE_BOARD_PROJECTION_KEY} AND "status" IN ('INSPECT', 'READY', 'PROCESSING'))
    GROUP BY 1, 2, 3, 4, 5
  `);
  for (const group of groups) {
    if (group.projectionKey === MEDIA_OPERATION_BOARD_PROJECTION_KEY) {
      result.media[mediaExecutionState(group.state, group.completed, group.total)] += Number(group.count);
    } else {
      result.technical[technicalExecutionState(group.executionStatus)] += Number(group.count);
    }
  }
  return result;
}
