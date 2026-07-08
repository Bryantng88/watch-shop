import type { DB } from "@/server/db/client";
import type { WatchListFilters } from "@/domains/watch/ui/list/types";
import {
  compareWatchMediaQueueProjection,
  WATCH_MEDIA_QUEUE_PROJECTION_KEY,
} from "./watch-media-queue.projection";
import {
  compareWatchListProjection,
  WATCH_LIST_PROJECTION_KEY,
} from "./watch-list";
import {
  getProjectionBuilder,
  listProjectionBuilders,
} from "./projection.registry";
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
  storageReady?: boolean;
  storageReason?: string;
}): ProjectionStatusSummary {
  return {
    ...input,
    storageReady: input.storageReady ?? true,
    rowCount: 0,
    statusCounts: {},
    latestProjectedAt: null,
    latestSourceUpdatedAt: null,
    oldestProjectedAt: null,
    staleVersion: false,
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

  return {
    ok: true,
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
