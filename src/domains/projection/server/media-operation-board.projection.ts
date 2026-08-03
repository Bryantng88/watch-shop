import {
  Prisma,
  TaskExecutionActionType,
  TaskExecutionTargetType,
} from "@prisma/client";

import type { CoordinationMediaBoardItemDTO } from "@/domains/coordination/server/coordination-dashboard.types";
import type { BusinessEventDispatchContext } from "@/domains/event/dispatcher/business-event-consumer.types";
import {
  getQueueItemWorkflowState,
  listAvailableManualTransitionsForQueueItem,
  resolveBindingWorkflowDefinition,
} from "@/domains/task/server/business-binding-workflow.service";
import {
  mapProductPostTargets,
  resolveMediaWorkProgressFromMetadata,
} from "@/domains/task/server/business-binding.service";
import { dbOrTx, type DB } from "@/server/db/client";
import { operationBoardDoneCutoff } from "./operation-board-retention.policy";
import { deleteProjectionRecords, upsertProjectionRecord } from "./projection-record.repo";
import type {
  ProjectionBuildContext,
  ProjectionBuildResult,
  ProjectionBuilder,
  ProjectionScope,
} from "./projection.types";

export const MEDIA_OPERATION_BOARD_PROJECTION_KEY = "media-operation-board";
export const MEDIA_OPERATION_BOARD_PROJECTION_VERSION = 10;
const MEDIA_OPERATION_BOARD_EVENTS = [
  "watch.created",
  "watch.media.photoshoot.requested",
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
  "watch.publish.assets.downloaded",
  "watch.saleStage.posted",
  "watch.sold",
  "task.item.activity.commented",
] as const;

export type MediaOperationBoardStage = CoordinationMediaBoardItemDTO["stage"];
export type MediaOperationBoardProjection = CoordinationMediaBoardItemDTO & {
  workspaceId: string;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function workTypeKey(note?: string | null) {
  return clean(String(note ?? "").match(/workTypeKey:\s*([a-z0-9-]+)/i)?.[1]).toLowerCase();
}

function mediaBindingRank(input: {
  taskItem?: { note?: string | null } | null;
  metadataJson: unknown;
  createdAt: Date;
}) {
  const stageRank = {
    photography: 1,
    "media-processing": 2,
    publish: 3,
  }[workTypeKey(input.taskItem?.note)] ?? 0;
  const workflowRuntime = asRecord(asRecord(input.metadataJson).workflowRuntime);
  const workflowUpdatedAt = Date.parse(clean(workflowRuntime.updatedAt));
  const recency = Number.isFinite(workflowUpdatedAt)
    ? workflowUpdatedAt
    : input.createdAt.getTime();
  // The most recently active workflow owns the visible stage. Stage order is
  // only a tie-breaker; otherwise an older Publish/Media binding can mask a
  // newer reshoot binding in Photography.
  return recency * 10 + stageRank;
}

function mediaStage(
  note: string | null | undefined,
  metadataJson: unknown,
  watch?: {
    saleStage: unknown;
    isContentDownloaded: boolean;
    isImageDownloaded: boolean;
  } | null,
): MediaOperationBoardStage | null {
  const workType = workTypeKey(note);
  if (!["photography", "media-processing", "publish"].includes(workType)) return null;
  const runtime = getQueueItemWorkflowState({ metadataJson });
  const saleStage = clean(watch?.saleStage).toUpperCase();
  const businessDone =
    ["DONE", "POSTED", "SOLD", "CONSIGNED_TO", "CANCELED", "CANCELLED"].includes(saleStage);
  if (workType === "photography") {
    return runtime?.currentState === "DONE" ? "MEDIA_PROCESSING" : "PHOTOGRAPHY";
  }
  if (workType === "media-processing") {
    return runtime?.currentState === "DONE" ? "PUBLISH" : "MEDIA_PROCESSING";
  }
  return businessDone ||
      runtime?.currentState === "DONE" ||
      runtime?.currentState === "CANCELLED"
    ? "DONE"
    : "PUBLISH";
}

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "-";
}

function result(
  context: ProjectionBuildContext,
  scope: ProjectionScope,
  applied: number,
  reason?: string,
): ProjectionBuildResult {
  return {
    ok: true,
    status: applied ? "applied" : "skipped",
    projectionKey: context.projectionKey,
    projectionVersion: context.projectionVersion,
    scope,
    applied,
    skipped: applied ? 0 : 1,
    failed: 0,
    reason,
  };
}

export async function buildMediaOperationBoardRow(
  db: DB,
  input: { watchId: string },
) {
  const client = dbOrTx(db);
  const bindings = await client.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: input.watchId,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      taskItemId: { not: null },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      taskId: true,
      taskItemId: true,
      metadataJson: true,
      createdAt: true,
      createdByUser: { select: { name: true, email: true, avatarUrl: true } },
      taskItem: { select: { note: true } },
    },
  });
  const binding = bindings
    .filter((row) => mediaStage(row.taskItem?.note, row.metadataJson))
    .sort((left, right) => mediaBindingRank(right) - mediaBindingRank(left))[0];
  if (!binding?.taskItemId) {
    await deleteProjectionRecords(db, {
      projectionKey: MEDIA_OPERATION_BOARD_PROJECTION_KEY,
      projectionVersion: MEDIA_OPERATION_BOARD_PROJECTION_VERSION,
      rowKeys: [input.watchId],
    });
    return null;
  }
  const [watch, activities] = await Promise.all([
    client.watch.findUnique({
      where: { id: input.watchId },
      select: {
        id: true,
        productId: true,
        updatedAt: true,
        saleStage: true,
        isContentDownloaded: true,
        isImageDownloaded: true,
        product: {
          select: {
            title: true,
            sku: true,
            primaryImageUrl: true,
            postTargets: {
              select: {
                postTarget: {
                  select: { id: true, name: true, platform: true },
                },
              },
            },
          },
        },
      },
    }),
    client.taskItemActivity.findMany({
      where: { taskItemId: binding.taskItemId },
      select: {
        sourceType: true,
        metadataJson: true,
        _count: { select: { replies: true } },
      },
    }),
  ]);
  if (!watch) return null;
  const stage = mediaStage(binding.taskItem?.note, binding.metadataJson, watch);
  if (!stage) return null;
  let commentCount = 0;
  for (const activity of activities) {
    const metadata = activity.metadataJson;
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) continue;
    const target = metadata as { targetType?: unknown; targetId?: unknown };
    if (clean(target.targetType) !== "WATCH" || clean(target.targetId) !== watch.id) continue;
    commentCount += (String(activity.sourceType) === "DISCUSSION" ? 1 : 0) + activity._count.replies;
  }
  const runtime = getQueueItemWorkflowState({ metadataJson: binding.metadataJson });
  const workflowDefinition = resolveBindingWorkflowDefinition(binding.metadataJson);
  const bindingWorkType = workTypeKey(binding.taskItem?.note);
  const bindingStage: MediaOperationBoardStage =
    bindingWorkType === "photography"
      ? "PHOTOGRAPHY"
      : bindingWorkType === "media-processing"
        ? "MEDIA_PROCESSING"
        : "PUBLISH";
  const transitionedToNextStage = stage !== bindingStage;
  const publishState =
    watch.isContentDownloaded || watch.isImageDownloaded
      ? "ASSETS_DOWNLOADED"
      : "NEW";
  const visibleWorkflowState =
    stage === "DONE"
      ? "DONE"
      : stage === "PUBLISH"
        ? publishState
        : transitionedToNextStage
          ? "NEW"
          : runtime?.currentState ?? null;
  const availableTransitions = transitionedToNextStage
    ? []
    : listAvailableManualTransitionsForQueueItem({
        workflowDefinition,
        currentState: runtime?.currentState ?? null,
      });
  const manualTransitions =
    stage === "PUBLISH" && publishState === "ASSETS_DOWNLOADED"
      ? [...availableTransitions].sort((left, right) =>
          Number(right.actionKey === "mark-posted") -
          Number(left.actionKey === "mark-posted")
        )
      : availableTransitions;
  const actor = userLabel(binding.createdByUser);
  const bindingMetadata = asRecord(binding.metadataJson);
  const data: MediaOperationBoardProjection = {
    id: watch.id,
    productId: watch.productId,
    bindingId: binding.id,
    workspaceTaskItemId: binding.taskItemId,
    title: watch.product?.title ?? "Watch",
    sku: watch.product?.sku ?? null,
    imageUrl: watch.product?.primaryImageUrl ?? null,
    stage,
    workflowKey: transitionedToNextStage ? null : runtime?.workflowKey ?? null,
    workflowState: visibleWorkflowState,
    reshootNote: clean(bindingMetadata.reshootNote) || null,
    mediaWorkProgress: transitionedToNextStage || stage === "PUBLISH"
      ? null
      : resolveMediaWorkProgressFromMetadata(bindingMetadata),
    postTargets: mapProductPostTargets(watch.product),
    manualTransitions,
    commentCount,
    mentionedMeCount: 0,
    unreadMentionCount: 0,
    updatedAt: watch.updatedAt.toISOString(),
    lastUpdatedBy: {
      label: actor === "-" ? "Hệ thống" : actor,
      avatarUrl: binding.createdByUser?.avatarUrl ?? null,
      isSystem: actor === "-",
    },
    workspaceId: binding.taskId,
  };
  await upsertProjectionRecord(db, {
    projectionKey: MEDIA_OPERATION_BOARD_PROJECTION_KEY,
    projectionVersion: MEDIA_OPERATION_BOARD_PROJECTION_VERSION,
    rowKey: watch.id,
    workspaceId: binding.taskId,
    entityType: "WATCH",
    entityId: watch.id,
    status: stage,
    searchText: [data.title, data.sku].filter(Boolean).join(" ").toLowerCase(),
    sortAt: watch.updatedAt,
    sourceUpdatedAt: watch.updatedAt,
    dataJson: data,
  });
  return data;
}

async function watchIdFromComment(db: DB, eventId: string) {
  const activity = await dbOrTx(db).taskItemActivity.findFirst({
    where: { OR: [{ id: eventId }, { replies: { some: { id: eventId } } }] },
    select: { metadataJson: true },
  });
  const metadata = activity?.metadataJson;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const target = metadata as { targetType?: unknown; targetId?: unknown };
  return clean(target.targetType) === "WATCH" ? clean(target.targetId) || null : null;
}

async function buildFromEvent(
  db: DB,
  context: ProjectionBuildContext & { sourceEvent: BusinessEventDispatchContext },
) {
  const watchId = context.sourceEvent.eventKey === "task.item.activity.commented"
    ? await watchIdFromComment(db, context.sourceEvent.targetId)
    : clean(context.sourceEvent.targetId);
  if (!watchId) return result(context, context.scope ?? {}, 0, "WATCH_NOT_FOUND");
  const applied = await buildMediaOperationBoardRow(db, { watchId }) ? 1 : 0;
  return result(context, { targetType: "WATCH", targetId: watchId }, applied, applied ? undefined : "NO_MEDIA_BOARD_BINDING");
}

async function rebuild(
  db: DB,
  context: ProjectionBuildContext & { scope: ProjectionScope },
) {
  const client = dbOrTx(db);
  const targetId = clean(context.scope.targetId);
  if (!targetId) {
    await deleteProjectionRecords(db, { projectionKey: MEDIA_OPERATION_BOARD_PROJECTION_KEY });
  }
  const rows = await client.taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
      ...(targetId ? { targetId } : {}),
    },
    distinct: ["targetId"],
    select: { targetId: true },
    take: context.scope.limit ? Math.max(1, Math.min(10000, context.scope.limit)) : undefined,
  });
  let applied = 0;
  for (let index = 0; index < rows.length; index += 8) {
    const built = await Promise.all(
      rows.slice(index, index + 8).map((row) =>
        buildMediaOperationBoardRow(db, { watchId: row.targetId }),
      ),
    );
    applied += built.filter(Boolean).length;
  }
  return result(context, context.scope, applied, applied ? undefined : "NO_MEDIA_BOARD_ROWS");
}

export async function queryMediaOperationBoardProjection(
  db: DB,
  input: {
    requestedStage?: MediaOperationBoardStage | null;
    page: number;
    pageSize: number;
    doneRetentionDays?: number | null;
  },
) {
  const offset = (input.page - 1) * input.pageSize;
  const doneCutoff = operationBoardDoneCutoff(input.doneRetentionDays);
  const rows = await dbOrTx(db).$queryRaw<Array<{
    kind: "ROW" | "TOTAL";
    status: MediaOperationBoardStage;
    dataJson: unknown;
    total: bigint;
  }>>(Prisma.sql`
    WITH latest AS (
      SELECT DISTINCT ON ("entityId")
        "entityId", "status", "dataJson", "sortAt", "updatedAt"
      FROM "ProjectionRecord"
      WHERE "projectionKey" = ${MEDIA_OPERATION_BOARD_PROJECTION_KEY}
        AND "projectionVersion" = ${MEDIA_OPERATION_BOARD_PROJECTION_VERSION}
      ORDER BY "entityId", "updatedAt" DESC
    ),
    eligible AS (
      SELECT "entityId", "status", "dataJson", "sortAt", "updatedAt"
      FROM latest
      WHERE "status" <> 'DONE'
        OR ${doneCutoff}::timestamptz IS NULL
        OR COALESCE("sortAt", "updatedAt") >= ${doneCutoff}
    ),
    ranked AS (
      SELECT "status", "dataJson",
        ROW_NUMBER() OVER (PARTITION BY "status" ORDER BY "sortAt" DESC NULLS LAST, "updatedAt" DESC) AS rn
      FROM eligible
    ),
    totals AS (
      SELECT "status", COUNT(*) AS total FROM ranked GROUP BY "status"
    ),
    selected AS (
      SELECT "status", "dataJson" FROM ranked
      WHERE (
        ${input.requestedStage ?? null}::text IS NULL AND rn <= ${input.pageSize}
      ) OR (
        "status" = ${input.requestedStage ?? null}
        AND rn > ${offset} AND rn <= ${offset + input.pageSize}
      )
    )
    SELECT 'ROW'::text AS kind, "status", "dataJson", 0::bigint AS total FROM selected
    UNION ALL
    SELECT 'TOTAL'::text, "status", NULL::jsonb, total FROM totals
  `);
  const totals = new Map<MediaOperationBoardStage, number>();
  const data: MediaOperationBoardProjection[] = [];
  for (const row of rows) {
    if (row.kind === "TOTAL") totals.set(row.status, Number(row.total));
    else data.push(row.dataJson as MediaOperationBoardProjection);
  }
  return { rows: data, totals };
}

export const mediaOperationBoardProjectionBuilder: ProjectionBuilder = {
  key: MEDIA_OPERATION_BOARD_PROJECTION_KEY,
  version: MEDIA_OPERATION_BOARD_PROJECTION_VERSION,
  description: "Media Operation four-stage board cards, counters and pagination read model.",
  sourceEvents: [...MEDIA_OPERATION_BOARD_EVENTS],
  targetTypes: ["WATCH", "TASK_ITEM"],
  buildFromEvent,
  rebuild,
};
