import { Prisma, TaskExecutionTargetType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import { listTaskItemQueueItems } from "@/domains/task/server/business-binding.service";
import type { QueueItemDTO } from "@/domains/task/server/business-binding.types";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";
import {
  deleteProjectionRecords,
  listProjectionRecords,
  upsertProjectionRecord,
} from "./projection-record.repo";

export const WATCH_MEDIA_QUEUE_PROJECTION_KEY = "watch-media-queue";
export const WATCH_MEDIA_QUEUE_PROJECTION_VERSION = 1;

const WATCH_MEDIA_QUEUE_SOURCE_EVENTS = [
  "watch.media.photoshoot.completed",
  "watch.media.asset.attached",
  "watch.content.modified",
  "watch.content.submitted",
  "watch.content.approved",
  "watch.content.rejected",
  "watch.image.submitted",
  "watch.image.approved",
  "watch.image.rejected",
  "watch.media.ready_for_publish",
  "watch.media.recalled",
] as const;

type ProjectionSource = "projection" | "source";

export type WatchMediaQueueProjectionListResult = {
  source: ProjectionSource;
  items: QueueItemDTO[];
  fallbackReason?: string;
};

export type WatchMediaQueueProjectionCompareResult = {
  ok: boolean;
  workspaceId: string;
  sourceCount: number;
  projectionCount: number;
  missingInProjection: string[];
  extraInProjection: string[];
  changedRows: Array<{
    id: string;
    fields: string[];
  }>;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function cleanUpper(value: unknown) {
  return clean(value).toUpperCase();
}

function asQueueItem(value: unknown): QueueItemDTO | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Partial<QueueItemDTO>;
  if (!clean(row.id) || !clean(row.taskItemId)) return null;
  return row as QueueItemDTO;
}

function isWatchMediaQueueItem(item: QueueItemDTO) {
  return (
    item.targetType === TaskExecutionTargetType.WATCH &&
    item.workflowKey === "watch-media-processing"
  );
}

function isActiveMediaProcessingQueueItem(item: QueueItemDTO) {
  if (!isWatchMediaQueueItem(item)) return false;

  const state = cleanUpper(item.currentWorkflowState ?? item.status);
  return state !== "DONE";
}

function itemSearchText(item: QueueItemDTO) {
  return [
    item.id,
    item.taskItemId,
    item.targetType,
    item.targetId,
    item.preview.title,
    item.preview.ref,
    item.preview.status,
    item.latestActivityTitle,
    item.workflowKey,
    item.currentWorkflowState,
    item.currentWorkflowStateLabel,
  ]
    .map(clean)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function itemSortAt(item: QueueItemDTO) {
  const date = new Date(item.updatedAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function appliedResult(input: {
  context: ProjectionBuildContext;
  scope: ProjectionScope;
  applied: number;
  skipped?: number;
  metadata?: Record<string, unknown>;
}): ProjectionBuildResult {
  return {
    ok: true,
    status: input.applied > 0 ? "applied" : "skipped",
    projectionKey: input.context.projectionKey,
    projectionVersion: input.context.projectionVersion,
    scope: input.scope,
    applied: input.applied,
    skipped: input.skipped ?? 0,
    failed: 0,
    reason: input.applied > 0 ? undefined : "NO_WATCH_MEDIA_QUEUE_ROWS",
    metadata: input.metadata,
  };
}

function skippedResult(input: {
  context: ProjectionBuildContext;
  scope: ProjectionScope;
  reason: string;
  metadata?: Record<string, unknown>;
}): ProjectionBuildResult {
  return {
    ok: true,
    status: "skipped",
    projectionKey: input.context.projectionKey,
    projectionVersion: input.context.projectionVersion,
    scope: input.scope,
    applied: 0,
    skipped: 1,
    failed: 0,
    reason: input.reason,
    metadata: input.metadata,
  };
}

async function findAllMediaWorkspaceIds(db: DB) {
  const client = dbOrTx(db);
  const rows = await client.$queryRaw<Array<{ taskItemId: string }>>(
    Prisma.sql`
      SELECT DISTINCT te."taskItemId" AS "taskItemId"
      FROM "TaskExecution" te
      INNER JOIN "TaskItem" ti ON ti."id" = te."taskItemId"
      WHERE te."taskItemId" IS NOT NULL
        AND te."actionType"::text <> 'CANCELLED'
        AND te."targetType"::text = ${TaskExecutionTargetType.WATCH}
        AND ti."note" ~* ${"workTypeKey:\\s*media-processing"}
      ORDER BY te."taskItemId" ASC
    `,
  );

  return rows.map((row) => clean(row.taskItemId)).filter(Boolean);
}

async function findMediaWorkspaceIdsForTarget(db: DB, input: ProjectionScope) {
  const targetType = cleanUpper(input.targetType);
  const targetId = clean(input.targetId);
  if (targetType !== TaskExecutionTargetType.WATCH || !targetId) return [];

  const client = dbOrTx(db);
  const rows = await client.$queryRaw<Array<{ taskItemId: string }>>(
    Prisma.sql`
      SELECT DISTINCT te."taskItemId" AS "taskItemId"
      FROM "TaskExecution" te
      INNER JOIN "TaskItem" ti ON ti."id" = te."taskItemId"
      WHERE te."taskItemId" IS NOT NULL
        AND te."actionType"::text <> 'CANCELLED'
        AND te."targetType"::text = ${TaskExecutionTargetType.WATCH}
        AND te."targetId" = ${targetId}
        AND ti."note" ~* ${"workTypeKey:\\s*media-processing"}
      ORDER BY te."taskItemId" ASC
    `,
  );

  return rows.map((row) => clean(row.taskItemId)).filter(Boolean);
}

async function resolveMediaWorkspaceIds(db: DB, scope: ProjectionScope) {
  const workspaceId = clean(scope.workspaceId);
  if (workspaceId) return [workspaceId];

  if (clean(scope.targetId)) {
    return findMediaWorkspaceIdsForTarget(db, scope);
  }

  return findAllMediaWorkspaceIds(db);
}

export async function rebuildWatchMediaQueueProjectionForWorkspace(
  db: DB,
  input: {
    workspaceId: string;
  },
) {
  const workspaceId = clean(input.workspaceId);
  if (!workspaceId) return { applied: 0, sourceCount: 0 };

  const sourceItems = (await listTaskItemQueueItems(db, workspaceId))
    .filter(isActiveMediaProcessingQueueItem);
  const rowKeys = sourceItems.map((item) => item.id);

  await deleteProjectionRecords(db, {
    projectionKey: WATCH_MEDIA_QUEUE_PROJECTION_KEY,
    workspaceId,
  });

  for (const item of sourceItems) {
    await upsertProjectionRecord(db, {
      projectionKey: WATCH_MEDIA_QUEUE_PROJECTION_KEY,
      projectionVersion: WATCH_MEDIA_QUEUE_PROJECTION_VERSION,
      rowKey: item.id,
      workspaceId,
      entityType: item.targetType,
      entityId: item.targetId,
      status: item.status,
      searchText: itemSearchText(item),
      sortAt: itemSortAt(item),
      sourceUpdatedAt: itemSortAt(item),
      dataJson: item,
    });
  }

  return {
    applied: rowKeys.length,
    sourceCount: sourceItems.length,
  };
}

export async function listWatchMediaQueueProjectionItems(
  db: DB,
  input: {
    workspaceId: string;
    status?: string | null;
    limit?: number | null;
    offset?: number | null;
  },
) {
  const records = await listProjectionRecords(db, {
    projectionKey: WATCH_MEDIA_QUEUE_PROJECTION_KEY,
    workspaceId: input.workspaceId,
    status: input.status,
    limit: input.limit,
    offset: input.offset,
  });

  return records
    .map((record) => asQueueItem(record.dataJson))
    .filter((item): item is QueueItemDTO =>
      Boolean(item && isActiveMediaProcessingQueueItem(item)),
    );
}

export async function listWatchMediaQueueProjectionItemsWithFallback(
  db: DB,
  input: {
    workspaceId: string;
  },
): Promise<WatchMediaQueueProjectionListResult> {
  const workspaceId = clean(input.workspaceId);
  const sourceItems = async () =>
    (await listTaskItemQueueItems(db, workspaceId)).filter(
      isActiveMediaProcessingQueueItem,
    );

  if (process.env.WATCH_MEDIA_QUEUE_PROJECTION_READ !== "1") {
    return {
      source: "source",
      items: await sourceItems(),
      fallbackReason: "PROJECTION_READ_FLAG_DISABLED",
    };
  }

  try {
    let projectionItems = await listWatchMediaQueueProjectionItems(db, {
      workspaceId,
      limit: 500,
    });

    if (!projectionItems.length) {
      await rebuildWatchMediaQueueProjectionForWorkspace(db, { workspaceId });
      projectionItems = await listWatchMediaQueueProjectionItems(db, {
        workspaceId,
        limit: 500,
      });
    }

    if (projectionItems.length) {
      return {
        source: "projection",
        items: projectionItems,
      };
    }

    return {
      source: "source",
      items: await sourceItems(),
      fallbackReason: "EMPTY_PROJECTION",
    };
  } catch (error) {
    return {
      source: "source",
      items: await sourceItems(),
      fallbackReason: error instanceof Error ? error.message : "PROJECTION_READ_FAILED",
    };
  }
}

export async function compareWatchMediaQueueProjection(
  db: DB,
  input: {
    workspaceId: string;
  },
): Promise<WatchMediaQueueProjectionCompareResult> {
  const workspaceId = clean(input.workspaceId);
  const [source, projection] = await Promise.all([
    listTaskItemQueueItems(db, workspaceId),
    listWatchMediaQueueProjectionItems(db, { workspaceId, limit: 500 }),
  ]);
  const sourceItems = source.filter(isWatchMediaQueueItem);
  const sourceMap = new Map(sourceItems.map((item) => [item.id, item]));
  const projectionMap = new Map(projection.map((item) => [item.id, item]));
  const missingInProjection = sourceItems
    .map((item) => item.id)
    .filter((id) => !projectionMap.has(id));
  const extraInProjection = projection
    .map((item) => item.id)
    .filter((id) => !sourceMap.has(id));
  const changedRows: WatchMediaQueueProjectionCompareResult["changedRows"] = [];

  for (const [id, item] of sourceMap) {
    const projected = projectionMap.get(id);
    if (!projected) continue;

    const fields = [
      item.status !== projected.status ? "status" : null,
      item.updatedAt !== projected.updatedAt ? "updatedAt" : null,
      item.currentWorkflowState !== projected.currentWorkflowState
        ? "currentWorkflowState"
        : null,
      item.preview.title !== projected.preview.title ? "preview.title" : null,
      item.preview.ref !== projected.preview.ref ? "preview.ref" : null,
      item.preview.imageUrl !== projected.preview.imageUrl
        ? "preview.imageUrl"
        : null,
    ].filter((field): field is string => Boolean(field));

    if (fields.length) changedRows.push({ id, fields });
  }

  return {
    ok: !missingInProjection.length && !extraInProjection.length && !changedRows.length,
    workspaceId,
    sourceCount: sourceItems.length,
    projectionCount: projection.length,
    missingInProjection,
    extraInProjection,
    changedRows,
  };
}

async function rebuildWatchMediaQueueProjection(
  db: DB,
  context: ProjectionBuildContext & {
    scope: ProjectionScope;
  },
): Promise<ProjectionBuildResult> {
  const workspaceIds = await resolveMediaWorkspaceIds(db, context.scope);
  if (!workspaceIds.length) {
    return skippedResult({
      context,
      scope: context.scope,
      reason: "NO_MEDIA_WORKSPACE_SCOPE",
    });
  }

  let applied = 0;
  for (const workspaceId of workspaceIds) {
    const result = await rebuildWatchMediaQueueProjectionForWorkspace(db, {
      workspaceId,
    });
    applied += result.applied;
  }

  return appliedResult({
    context,
    scope: context.scope,
    applied,
    metadata: {
      workspaceCount: workspaceIds.length,
      workspaceIds,
    },
  });
}

async function buildWatchMediaQueueProjectionFromEvent(
  db: DB,
  context: ProjectionBuildContext & {
    sourceEvent: BusinessEventDispatchContext;
  },
): Promise<ProjectionBuildResult> {
  if (cleanUpper(context.sourceEvent.targetType) !== TaskExecutionTargetType.WATCH) {
    return skippedResult({
      context,
      scope: context.scope ?? {},
      reason: "EVENT_TARGET_NOT_WATCH",
    });
  }

  return rebuildWatchMediaQueueProjection(db, {
    ...context,
    scope: {
      targetType: context.sourceEvent.targetType,
      targetId: context.sourceEvent.targetId,
    },
  });
}

export const watchMediaQueueProjectionBuilder: ProjectionBuilder = {
  key: WATCH_MEDIA_QUEUE_PROJECTION_KEY,
  version: WATCH_MEDIA_QUEUE_PROJECTION_VERSION,
  description: "Read model for Media Workspace watch queue rows.",
  sourceEvents: [...WATCH_MEDIA_QUEUE_SOURCE_EVENTS],
  targetTypes: [TaskExecutionTargetType.WATCH],
  buildFromEvent: buildWatchMediaQueueProjectionFromEvent,
  rebuild: rebuildWatchMediaQueueProjection,
};
