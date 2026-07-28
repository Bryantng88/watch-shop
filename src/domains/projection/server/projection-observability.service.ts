import { Prisma } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { WatchListFilters } from "@/domains/watch/ui/list/types";
import {
  compareWatchMediaQueueProjection,
  WATCH_MEDIA_QUEUE_PROJECTION_KEY,
} from "./watch-media-queue.projection";
import {
  comparePaymentListProjection,
  PAYMENT_LIST_PROJECTION_KEY,
} from "./payment-list.projection";
import {
  compareWatchListProjection,
  WATCH_LIST_PROJECTION_KEY,
} from "./watch-list";
import {
  getProjectionBuilder,
  listProjectionBuilders,
} from "./projection.registry";
import { listOperationalProjectionSubscriptions } from "./operation-projection-subscriptions";
import {
  getProjectionRecordStoreHealth,
  summarizeProjectionRecords,
} from "./projection-record.repo";
import { rebuildProjection } from "./projection.runner";
import type { ProjectionScope } from "./projection.types";
import type {
  ProjectionCompareResult,
  ProjectionRepairInput,
  ProjectionRepairResult,
  ProjectionStatusSummary,
} from "./projection-observability.types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function numberCount(value: bigint | number) {
  return typeof value === "bigint" ? Number(value) : Number(value);
}

const ENTITY_COVERAGE_PROJECTIONS: Record<
  string,
  { table: string; sourceWhere?: string }
> = {
  "acquisition-list": { table: "Acquisition" },
  "watch-list": { table: "Watch" },
  "order-list": { table: "Order" },
  "order-detail": { table: "Order" },
  "payment-list": { table: "Payment" },
  // technical-issue-board only materializes issues that have an active
  // coordination binding, so raw TechnicalIssue row counts are not equivalent.
  "service-request-list": { table: "ServiceRequest" },
  "shipment-operation-queue": { table: "Shipment" },
  "coordination-workspace-summary": {
    table: "TaskItem",
    sourceWhere: `"status" <> 'CANCELLED'`,
  },
};

const REQUIRED_SINGLETON_PROJECTIONS = ["admin-dashboard-summary"] as const;

async function compareEntityProjectionCoverage(
  db: DB,
  projectionKey: string,
) {
  const config = ENTITY_COVERAGE_PROJECTIONS[projectionKey];
  const builder = getProjectionBuilder(projectionKey);
  if (!config || !builder) return null;
  const table = Prisma.raw(`"${config.table}"`);
  const sourceWhere = config.sourceWhere
    ? Prisma.raw(`WHERE ${config.sourceWhere}`)
    : Prisma.empty;
  const rows = await dbOrTx(db).$queryRaw<Array<{
    sourceCount: bigint;
    projectionCount: bigint;
    missingCount: bigint;
    staleCount: bigint;
  }>>(Prisma.sql`
    WITH source AS (
      SELECT "id"::text AS "id", "updatedAt"
      FROM ${table}
      ${sourceWhere}
    ),
    projection AS (
      SELECT "entityId", "sourceUpdatedAt"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${projectionKey}
        AND "projectionVersion" = ${builder.version}
    )
    SELECT
      (SELECT COUNT(*) FROM source) AS "sourceCount",
      (SELECT COUNT(*) FROM projection) AS "projectionCount",
      (
        SELECT COUNT(*)
        FROM source
        LEFT JOIN projection ON projection."entityId" = source."id"
        WHERE projection."entityId" IS NULL
      ) AS "missingCount",
      (
        SELECT COUNT(*)
        FROM source
        JOIN projection ON projection."entityId" = source."id"
        WHERE projection."sourceUpdatedAt" IS NULL
           OR source."updatedAt" > projection."sourceUpdatedAt"
      ) AS "staleCount"
  `);
  const row = rows[0];
  const details = {
    sourceCount: Number(row?.sourceCount ?? 0),
    projectionCount: Number(row?.projectionCount ?? 0),
    missingCount: Number(row?.missingCount ?? 0),
    staleCount: Number(row?.staleCount ?? 0),
  };
  return {
    // Aggregate projections can intentionally use a related entity's
    // updatedAt as sourceUpdatedAt (Product for Watch, Order/Payment for
    // Shipment). Treat timestamp differences as diagnostics only; durable
    // event delivery is responsible for freshness. Auto-repair is reserved
    // for provably missing rows to avoid rebuild loops and cron load.
    ok: details.missingCount === 0,
    details,
  };
}

async function compareRequiredSingletonProjection(
  db: DB,
  projectionKey: string,
) {
  if (!REQUIRED_SINGLETON_PROJECTIONS.includes(
    projectionKey as (typeof REQUIRED_SINGLETON_PROJECTIONS)[number],
  )) {
    return null;
  }
  const builder = getProjectionBuilder(projectionKey);
  if (!builder) return null;
  const count = await dbOrTx(db).projectionRecord.count({
    where: {
      projectionKey,
      projectionVersion: builder.version,
    },
  });
  return {
    ok: count === 1,
    details: {
      expectedCount: 1,
      projectionCount: count,
    },
  };
}

function statusKey(value: unknown) {
  return clean(value) || "unknown";
}

function maxDate(left: Date | null, right: Date | null) {
  if (!left) return right;
  if (!right) return left;
  return left.getTime() >= right.getTime() ? left : right;
}

function minDate(left: Date | null, right: Date | null) {
  if (!left) return right;
  if (!right) return left;
  return left.getTime() <= right.getTime() ? left : right;
}

function emptySummary(input: {
  projectionKey: string;
  projectionVersion: number;
  description?: string;
  registered: boolean;
  rebuildSupported: boolean;
  eventBuildSupported: boolean;
  sourceEvents?: string[];
  storageReady?: boolean;
  storageReason?: string;
}): ProjectionStatusSummary {
  const operationSubscriptions = operationProjectionSubscriptions(input.projectionKey);

  return {
    ...input,
    sourceEvents: input.sourceEvents ?? [],
    operationSubscriptionEvents: operationSubscriptions.eventKeys,
    operationSubscriptionKeys: operationSubscriptions.operationKeys,
    storageReady: input.storageReady ?? true,
    rowCount: 0,
    statusCounts: {},
    latestProjectedAt: null,
    latestSourceUpdatedAt: null,
    oldestProjectedAt: null,
    staleVersion: false,
  };
}

function operationProjectionSubscriptions(projectionKey: string) {
  const eventKeys = new Set<string>();
  const operationKeys = new Set<string>();

  for (const match of listOperationalProjectionSubscriptions({ projectionKey })) {
    for (const eventKey of match.eventKeys) {
      eventKeys.add(eventKey);
    }
    operationKeys.add(match.operationKey);
  }

  return {
    eventKeys: [...eventKeys].sort(),
    operationKeys: [...operationKeys].sort(),
  };
}

export async function listProjectionStatus(
  db: DB,
  input: {
    projectionKey?: string | null;
    scope?: ProjectionScope | null;
  } = {},
): Promise<ProjectionStatusSummary[]> {
  const projectionKey = clean(input.projectionKey);
  const scope = input.scope ?? {};
  const storeHealth = await getProjectionRecordStoreHealth(db);
  const rows = storeHealth.ready
    ? await summarizeProjectionRecords(db, {
      projectionKey: projectionKey || null,
      workspaceId: scope.workspaceId,
      spaceId: scope.spaceId,
      entityType: scope.targetType,
      entityId: scope.targetId,
    })
    : [];
  const summaries = new Map<string, ProjectionStatusSummary>();

  for (const builder of listProjectionBuilders()) {
    if (projectionKey && builder.key !== projectionKey) continue;
    summaries.set(
      builder.key,
      emptySummary({
        projectionKey: builder.key,
        projectionVersion: builder.version,
        description: builder.description,
        registered: true,
        rebuildSupported: Boolean(builder.rebuild),
        eventBuildSupported: Boolean(builder.buildFromEvent),
        sourceEvents: builder.sourceEvents ?? [],
        storageReady: storeHealth.ready,
        storageReason: storeHealth.reason,
      }),
    );
  }

  for (const row of rows) {
    const builder = getProjectionBuilder(row.projectionKey);
    const summary =
      summaries.get(row.projectionKey) ??
      emptySummary({
        projectionKey: row.projectionKey,
        projectionVersion: row.projectionVersion,
        registered: Boolean(builder),
        description: builder?.description,
        rebuildSupported: Boolean(builder?.rebuild),
        eventBuildSupported: Boolean(builder?.buildFromEvent),
        sourceEvents: builder?.sourceEvents ?? [],
        storageReady: storeHealth.ready,
        storageReason: storeHealth.reason,
      });
    const count = numberCount(row.count);
    const key = statusKey(row.status);

    summary.rowCount += count;
    summary.statusCounts[key] = (summary.statusCounts[key] ?? 0) + count;
    summary.latestProjectedAt = maxDate(
      summary.latestProjectedAt,
      row.latestProjectedAt,
    );
    summary.latestSourceUpdatedAt = maxDate(
      summary.latestSourceUpdatedAt,
      row.latestSourceUpdatedAt,
    );
    summary.oldestProjectedAt = minDate(
      summary.oldestProjectedAt,
      row.oldestProjectedAt,
    );
    summary.staleVersion =
      summary.staleVersion ||
      (Boolean(builder) && row.projectionVersion !== builder?.version);

    summaries.set(row.projectionKey, summary);
  }

  return Array.from(summaries.values()).sort((left, right) =>
    left.projectionKey.localeCompare(right.projectionKey),
  );
}

export async function getProjectionStatus(
  db: DB,
  projectionKey: string,
  scope?: ProjectionScope | null,
) {
  const summaries = await listProjectionStatus(db, { projectionKey, scope });
  return summaries[0] ?? null;
}

function watchListFiltersFromScope(scope: ProjectionScope): WatchListFilters {
  const filters =
    scope.filters && typeof scope.filters === "object" && !Array.isArray(scope.filters)
      ? scope.filters
      : {};

  return {
    ...filters,
    page: Number(filters.page ?? 1),
    pageSize: Math.min(100, Math.max(1, Number(scope.limit ?? filters.pageSize ?? 20))),
    meta: typeof filters.meta === "string" ? filters.meta : "lite",
  } as WatchListFilters;
}

export async function compareProjection(
  db: DB,
  input: {
    projectionKey: string;
    scope?: ProjectionScope | null;
  },
): Promise<ProjectionCompareResult> {
  const projectionKey = clean(input.projectionKey);
  const scope = input.scope ?? {};
  const storeHealth = await getProjectionRecordStoreHealth(db);

  if (!storeHealth.ready) {
    return {
      ok: false,
      projectionKey,
      skipped: true,
      reason: storeHealth.reason ?? "PROJECTION_STORE_NOT_READY",
    };
  }

  if (projectionKey === WATCH_MEDIA_QUEUE_PROJECTION_KEY) {
    const workspaceId = clean(scope.workspaceId);
    if (!workspaceId) {
      return {
        ok: true,
        projectionKey,
        skipped: true,
        reason: "WORKSPACE_ID_REQUIRED_FOR_COMPARE",
      };
    }

    const details = await compareWatchMediaQueueProjection(db, { workspaceId });
    return {
      ok: details.ok,
      projectionKey,
      details,
    };
  }

  if (projectionKey === WATCH_LIST_PROJECTION_KEY) {
    const details = await compareWatchListProjection(
      db,
      watchListFiltersFromScope(scope),
    );
    return {
      ok: details.ok,
      projectionKey,
      details,
    };
  }

  if (projectionKey === PAYMENT_LIST_PROJECTION_KEY) {
    const details = await comparePaymentListProjection(db);
    return {
      ok: details.ok,
      projectionKey,
      details,
    };
  }

  const coverage = await compareEntityProjectionCoverage(db, projectionKey);
  if (coverage) {
    return {
      ok: coverage.ok,
      projectionKey,
      details: coverage.details,
    };
  }

  const singleton = await compareRequiredSingletonProjection(db, projectionKey);
  if (singleton) {
    return {
      ok: singleton.ok,
      projectionKey,
      details: singleton.details,
    };
  }

  return {
    ok: false,
    projectionKey,
    skipped: true,
    reason: "PROJECTION_COMPARE_NOT_SUPPORTED",
  };
}

export async function repairProjection(
  db: DB,
  input: ProjectionRepairInput,
): Promise<ProjectionRepairResult> {
  const projectionKey = clean(input.projectionKey);
  const scope = input.scope ?? {};
  const storeHealth = await getProjectionRecordStoreHealth(db);
  if (!storeHealth.ready) {
    return {
      ok: false,
      projectionKey,
      scope,
      before: null,
      build: {
        ok: false,
        status: "failed",
        projectionKey,
        projectionVersion: 0,
        scope,
        applied: 0,
        skipped: 0,
        failed: 1,
        reason: storeHealth.reason ?? "PROJECTION_STORE_NOT_READY",
      },
      after: null,
    };
  }
  const before = await getProjectionStatus(db, projectionKey, scope);
  const build = await rebuildProjection(db, { projectionKey, scope });
  const after = await getProjectionStatus(db, projectionKey, scope);
  const compare = input.compare
    ? await compareProjection(db, { projectionKey, scope })
    : undefined;

  return {
    ok: build.ok && (compare?.ok ?? true),
    projectionKey,
    scope,
    before,
    build,
    after,
    compare,
  };
}

export async function repairDriftedProjections(
  db: DB,
  input: { limit?: number } = {},
) {
  const limit = Math.max(1, Math.min(10, Math.trunc(input.limit ?? 2)));
  const checked: ProjectionCompareResult[] = [];
  const repaired: ProjectionRepairResult[] = [];

  // The recurring job deliberately uses lightweight entity coverage checks.
  // Deep payload comparisons remain available through compareProjection/smoke
  // scripts without adding their source-query cost to every cron execution.
  for (const projectionKey of Object.keys(ENTITY_COVERAGE_PROJECTIONS)) {
    const coverage = await compareEntityProjectionCoverage(db, projectionKey);
    if (!coverage) continue;
    const compare: ProjectionCompareResult = {
      ok: coverage.ok,
      projectionKey,
      details: coverage.details,
    };
    checked.push(compare);
    if (compare.ok) continue;
    repaired.push(await repairProjection(db, {
      projectionKey,
      compare: false,
    }));
    if (repaired.length >= limit) break;
  }
  if (repaired.length < limit) {
    for (const projectionKey of REQUIRED_SINGLETON_PROJECTIONS) {
      const singleton = await compareRequiredSingletonProjection(db, projectionKey);
      if (!singleton) continue;
      const compare: ProjectionCompareResult = {
        ok: singleton.ok,
        projectionKey,
        details: singleton.details,
      };
      checked.push(compare);
      if (compare.ok) continue;
      repaired.push(await repairProjection(db, {
        projectionKey,
        compare: false,
      }));
      if (repaired.length >= limit) break;
    }
  }

  return {
    checked: checked.length,
    drifted: checked.filter((item) => !item.skipped && !item.ok).length,
    repaired: repaired.length,
    results: repaired,
  };
}
