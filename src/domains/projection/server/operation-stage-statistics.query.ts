import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";

export type StageStatisticsRow = {
  stageKey: string;
  count: bigint;
  averageIdleHours: number | null;
  oldestIdleHours: number | null;
  staleCount: bigint;
  stepsDone: bigint | null;
  stepsTotal: bigint | null;
  stepsSampleCount: bigint;
};

// Full aggregates, independent of the paginated board rows shown on a page.
export async function queryProjectionStageStatistics(db: DB, key: string, version: number, now: Date) {
  return dbOrTx(db).$queryRaw<StageStatisticsRow[]>(Prisma.sql`
    WITH latest AS (
      SELECT DISTINCT ON ("entityId") "status", "dataJson"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${key} AND "projectionVersion" = ${version}
      ORDER BY "entityId", "updatedAt" DESC
    ), active AS (
      SELECT *, NULLIF("dataJson"->>'updatedAt', '')::timestamptz AS activity_at
      FROM latest WHERE "status" <> 'DONE'
    )
    SELECT lower(replace("status", '_', '-')) AS "stageKey", COUNT(*) AS count,
      AVG(GREATEST(0, EXTRACT(EPOCH FROM (${now}::timestamptz - activity_at)) / 3600))
        FILTER (WHERE activity_at IS NOT NULL) AS "averageIdleHours",
      MAX(GREATEST(0, EXTRACT(EPOCH FROM (${now}::timestamptz - activity_at)) / 3600))
        FILTER (WHERE activity_at IS NOT NULL) AS "oldestIdleHours",
      COUNT(*) FILTER (WHERE activity_at <= ${new Date(now.getTime() - 7 * 86400000)}) AS "staleCount",
      SUM(LEAST(4, GREATEST(0, ("dataJson"#>>'{mediaWorkProgress,completed}')::int))) AS "stepsDone",
      4 * COUNT(*) FILTER (WHERE "dataJson"#>>'{mediaWorkProgress,completed}' IS NOT NULL) AS "stepsTotal",
      COUNT(*) FILTER (WHERE "dataJson"#>>'{mediaWorkProgress,completed}' IS NOT NULL) AS "stepsSampleCount"
    FROM active GROUP BY "status"
  `);
}

export type StageThroughputRow = {
  queueKey: string;
  stageKey: string;
  completedCount: bigint;
  averageHandlingHours: number | null;
  cohortCount: bigint;
  cohortCompletedCount: bigint;
};

export async function queryOpenOperationStageStatistics(db: DB, input: { now: Date; todayStart: Date; todayEnd: Date; userId: string | null }) {
  return dbOrTx(db).$queryRaw<Array<StageStatisticsRow & { queueKey: string }>>(Prisma.sql`
    WITH active AS (
      SELECT 'purchase-requests'::text AS queue_key,
        CASE WHEN "status" = 'WAITING' THEN 'waiting' ELSE 'processing' END AS stage_key, "updatedAt" AS activity_at
      FROM "PurchaseRequest" WHERE "status" IN ('WAITING', 'PROCESSING')
      UNION ALL
      SELECT 'payments', CASE WHEN direction = 'IN' THEN 'payment-in' WHEN direction = 'OUT' THEN 'payment-out' ELSE 'payment-unclassified' END, "updatedAt" AT TIME ZONE 'UTC'
      FROM "Payment" WHERE status = 'UNPAID'
      UNION ALL
      SELECT 'personal-work', CASE
        WHEN i."dueAt" IS NULL THEN 'personal-unscheduled'
        WHEN i."dueAt" AT TIME ZONE 'UTC' < ${input.todayStart} THEN 'personal-overdue'
        WHEN i."dueAt" AT TIME ZONE 'UTC' < ${input.todayEnd} THEN 'personal-today'
        ELSE 'personal-upcoming' END, i."updatedAt" AT TIME ZONE 'UTC'
      FROM "TaskItem" i LEFT JOIN "Task" t ON t.id = i."taskId"
      WHERE (i."personalOwnerUserId" IS NOT NULL OR t.kind = 'PERSONAL') AND i.status NOT IN ('DONE', 'CANCELLED')
        AND ${input.userId}::text IS NOT NULL
        AND (i."personalOwnerUserId" = ${input.userId} OR (t.kind = 'PERSONAL' AND (t."createdByUserId" = ${input.userId} OR t."assignedToUserId" = ${input.userId}))
          OR EXISTS (SELECT 1 FROM "PersonalTaskShare" s WHERE s."taskItemId" = i.id AND s."userId" = ${input.userId}))
    )
    SELECT queue_key AS "queueKey", stage_key AS "stageKey", COUNT(*) AS count,
      AVG(GREATEST(0, EXTRACT(EPOCH FROM (${input.now}::timestamptz - activity_at)) / 3600))::double precision AS "averageIdleHours",
      MAX(GREATEST(0, EXTRACT(EPOCH FROM (${input.now}::timestamptz - activity_at)) / 3600))::double precision AS "oldestIdleHours",
      COUNT(*) FILTER (WHERE activity_at <= ${new Date(input.now.getTime() - 7 * 86400000)}) AS "staleCount",
      NULL::bigint AS "stepsDone", NULL::bigint AS "stepsTotal", 0::bigint AS "stepsSampleCount"
    FROM active GROUP BY queue_key, stage_key
  `);
}

export async function queryStageThroughput(db: DB, now: Date) {
  const since = new Date(now.getTime() - 7 * 86400000);
  return dbOrTx(db).$queryRaw<StageThroughputRow[]>(Prisma.sql`
    WITH occurrences AS (
      SELECT 'media'::text AS queue_key,
        lower(substring(i."note" FROM 'workTypeKey: *([a-zA-Z0-9-]+)')) AS stage_key,
        NULLIF(e."metadataJson"#>>'{workflowRuntime,startedAt}', '')::timestamptz AS started_at,
        NULLIF(e."metadataJson"#>>'{workflowRuntime,completedAt}', '')::timestamptz AS completed_at
      FROM "TaskExecution" e JOIN "TaskItem" i ON i.id = e."taskItemId"
      WHERE e."targetType" IN ('WATCH', 'MEDIA_POST') AND e."actionType" <> 'CANCELLED'
        AND COALESCE(e."metadataJson"#>>'{workflowRuntime,currentState}', '') NOT IN ('CANCELLED', 'CANCELED')
        AND i."note" ~ 'workTypeKey: *(photography|media-processing|publish)'
      UNION ALL
      SELECT 'purchase-requests', 'waiting', "createdAt" AT TIME ZONE 'UTC', COALESCE("processingStartedAt", "completedAt")
      FROM "PurchaseRequest" WHERE outcome IS DISTINCT FROM 'CANCELLED'
      UNION ALL
      SELECT 'purchase-requests', 'processing', "processingStartedAt", "completedAt"
      FROM "PurchaseRequest" WHERE "processingStartedAt" IS NOT NULL AND outcome IS DISTINCT FROM 'CANCELLED'
    )
    SELECT queue_key AS "queueKey", stage_key AS "stageKey",
      COUNT(*) FILTER (WHERE completed_at >= ${since} AND completed_at <= ${now}) AS "completedCount",
      AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 3600)
        FILTER (WHERE completed_at >= ${since} AND completed_at <= ${now}) AS "averageHandlingHours",
      COUNT(*) FILTER (WHERE started_at >= ${since}) AS "cohortCount",
      COUNT(*) FILTER (WHERE started_at >= ${since} AND completed_at <= ${now}) AS "cohortCompletedCount"
    FROM occurrences
    WHERE started_at IS NOT NULL AND started_at <= ${now}
      AND (completed_at IS NULL OR completed_at >= started_at)
      AND (started_at >= ${since} OR completed_at >= ${since})
    GROUP BY queue_key, stage_key
  `);
}
