import { TaskExecutionTargetType } from "@prisma/client";
import type { DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "../projection.types";
import {
  deleteProjectionRecords,
  upsertProjectionRecord,
} from "../projection-record.repo";
import {
  WATCH_LIST_PROJECTION_KEY,
  WATCH_LIST_PROJECTION_SOURCE_EVENTS,
  WATCH_LIST_PROJECTION_VERSION,
} from "./watch-list-projection.constants";
import {
  mapWatchListSourceRowToProjectionData,
  watchListProjectionSearchText,
  watchListProjectionSortAt,
} from "./watch-list-projection.mapper";
import {
  loadWatchListProjectionSourceRows,
  resolveWatchIdsForProjectionTarget,
} from "./watch-list-projection.source";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function result(input: {
  context: ProjectionBuildContext;
  scope: ProjectionScope;
  applied: number;
  skipped?: number;
  reason?: string;
  metadata?: Record<string, unknown>;
}): ProjectionBuildResult {
  return {
    ok: true,
    status: input.applied > 0 ? "applied" : "skipped",
    projectionKey: input.context.projectionKey,
    projectionVersion: input.context.projectionVersion,
    scope: input.scope,
    applied: input.applied,
    skipped: input.skipped ?? (input.applied > 0 ? 0 : 1),
    failed: 0,
    reason: input.applied > 0 ? undefined : input.reason ?? "NO_WATCH_LIST_ROWS",
    metadata: input.metadata,
  };
}

export async function rebuildWatchListProjectionRows(
  db: DB,
  input: {
    watchIds?: string[] | null;
    productIds?: string[] | null;
    limit?: number | null;
  } = {},
) {
  const scoped = Boolean(input.watchIds?.length || input.productIds?.length);
  const limit = Math.min(1000, Math.max(1, Number(input.limit || 500)));
  const rowKeys: string[] = [];
  let offset = 0;

  if (!scoped) {
    await deleteProjectionRecords(db, {
      projectionKey: WATCH_LIST_PROJECTION_KEY,
    });
  }

  for (;;) {
    const rows = await loadWatchListProjectionSourceRows(db, {
      ...input,
      limit,
      offset: scoped ? 0 : offset,
    });
    const batchKeys = rows.map((row) => row.id);
    rowKeys.push(...batchKeys);

    if (scoped && batchKeys.length) {
      await deleteProjectionRecords(db, {
        projectionKey: WATCH_LIST_PROJECTION_KEY,
        rowKeys: batchKeys,
      });
    }

    for (const row of rows) {
      const data = mapWatchListSourceRowToProjectionData(row);

      await upsertProjectionRecord(db, {
        projectionKey: WATCH_LIST_PROJECTION_KEY,
        projectionVersion: WATCH_LIST_PROJECTION_VERSION,
        rowKey: data.filters.watchId,
        entityType: TaskExecutionTargetType.WATCH,
        entityId: data.filters.watchId,
        spaceId: data.filters.productId,
        status: data.filters.saleStage,
        searchText: watchListProjectionSearchText(data),
        sortAt: watchListProjectionSortAt(data),
        sourceUpdatedAt: data.filters.updatedAt,
        dataJson: data,
      });
    }

    if (scoped || rows.length < limit) break;
    offset += rows.length;
  }

  return {
    applied: rowKeys.length,
    rowKeys,
  };
}

async function rebuildWatchListProjection(
  db: DB,
  context: ProjectionBuildContext & {
    scope: ProjectionScope;
  },
): Promise<ProjectionBuildResult> {
  const watchIds = await resolveWatchIdsForProjectionTarget(db, {
    targetType: context.scope.targetType,
    targetId: context.scope.targetId,
  });
  const hasTargetScope = Boolean(clean(context.scope.targetType) || clean(context.scope.targetId));
  const productId = clean(context.scope.targetType).toUpperCase() === "PRODUCT"
    ? clean(context.scope.targetId)
    : "";

  if (hasTargetScope && !watchIds.length && !productId) {
    return result({
      context,
      scope: context.scope,
      applied: 0,
      reason: "WATCH_LIST_TARGET_NOT_FOUND",
    });
  }

  const rebuildResult = await rebuildWatchListProjectionRows(db, {
    watchIds,
    productIds: productId ? [productId] : [],
    limit: context.scope.limit,
  });

  return result({
    context,
    scope: context.scope,
    applied: rebuildResult.applied,
    reason: "NO_WATCH_LIST_SCOPE_ROWS",
    metadata: {
      rowKeys: rebuildResult.rowKeys,
    },
  });
}

async function buildWatchListProjectionFromEvent(
  db: DB,
  context: ProjectionBuildContext & {
    sourceEvent: BusinessEventDispatchContext;
  },
): Promise<ProjectionBuildResult> {
  return rebuildWatchListProjection(db, {
    ...context,
    scope: {
      targetType: context.sourceEvent.targetType,
      targetId: context.sourceEvent.targetId,
      limit: 10,
    },
  });
}

export const watchListProjectionBuilder: ProjectionBuilder = {
  key: WATCH_LIST_PROJECTION_KEY,
  version: WATCH_LIST_PROJECTION_VERSION,
  description: "Read model for Admin Watch List rows.",
  sourceEvents: [...WATCH_LIST_PROJECTION_SOURCE_EVENTS],
  targetTypes: ["WATCH", "PRODUCT"],
  buildFromEvent: buildWatchListProjectionFromEvent,
  rebuild: rebuildWatchListProjection,
};
