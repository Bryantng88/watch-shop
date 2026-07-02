import { TaskExecutionActionType, TaskExecutionTargetType, type Prisma } from "@prisma/client";
import { dbOrTx, withDbTransaction, type DB } from "@/server/db/client";
import { createSystemActivity } from "./activity";
import {
  createBusinessBinding,
  findBusinessBindingByTaskItemTarget,
  findBusinessBindingsByTaskItem,
  findQueueActivitiesByTaskItem,
  findTaskItemIdsByTarget,
} from "./business-binding.repo";
import {
  ensureQueueItemWorkflowState,
  getQueueItemWorkflowState,
  getWorkflowStateLabel,
  initializeQueueItemWorkflowState,
  listAvailableManualTransitionsForQueueItem,
} from "./business-binding-workflow.service";
import { resolveWorkflowDefinition } from "@/domains/workflow-definition/server";
import type { WorkflowDefinition } from "@/domains/workflow-definition/server";
import type {
  BindTaskItemToBusinessObjectInput,
  BusinessBinding,
  BusinessBindingDTO,
  BusinessBindingTargetInput,
  ManualQueueTargetPreviewDTO,
  QueueItemDTO,
  QueueItemSource,
  QueueItemStatus,
  QueueSummaryDTO,
  WorkflowRuntimeState,
} from "./business-binding.types";
import { findTaskItemIdsByTargetIds } from "./business-binding.repo";
import type { BusinessBindingTargetType } from "./business-binding.types";
function clean(value: unknown) {
  return String(value ?? "").trim();
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function cleanUpper(value: unknown) {
  return clean(value).toUpperCase();
}

function cleanNullable(value: unknown) {
  const text = clean(value);
  return text || null;
}

function metadataText(metadata: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = clean(metadata[key]);
    if (value) return value;
  }

  return null;
}

function actorLabel(value: unknown) {
  const metadata = asRecord(value);
  return clean(metadata.name) || clean(metadata.email) || "Người dùng";
}

function queueItemImageUrl(metadata: Record<string, unknown>) {
  return metadataText(metadata, ["targetImageUrl", "imageUrl", "thumbnailUrl"]);
}

function queueItemImageUrls(metadata: Record<string, unknown>) {
  const value = metadata.targetImageUrls ?? metadata.imageUrls;
  if (!Array.isArray(value)) return [];
  return value.map(clean).filter(Boolean).slice(0, 4);
}

function queueItemIntakeNote(metadata: Record<string, unknown>) {
  return metadataText(metadata, ["intakeNote"]);
}

function queueKey(targetType: string, targetId: string) {
  return `${cleanUpper(targetType)}:${clean(targetId)}`;
}

function hasAnyToken(value: string, tokens: string[]) {
  const normalized = value.toLowerCase();
  return tokens.some((token) => normalized.includes(token));
}

function activityTarget(activity: { metadataJson: unknown }) {
  const metadata = asRecord(activity.metadataJson);
  const targetType = cleanUpper(metadata.targetType);
  const targetId = clean(metadata.targetId);

  if (!targetType || !targetId) return null;

  return {
    targetType,
    targetId,
  };
}

function activityEventText(activity: { title: string; metadataJson: unknown }) {
  const metadata = asRecord(activity.metadataJson);
  return `${clean(metadata.eventKey)} ${clean(activity.title)}`;
}

function activityHasFeedback(activity: { title: string; metadataJson: unknown }) {
  const metadata = asRecord(activity.metadataJson);
  const feedback = asRecord(metadata.feedback);

  return Boolean(
    clean(metadata.feedbackId) ||
      clean(metadata.feedbackMessage) ||
      clean(feedback.id) ||
      clean(feedback.message) ||
      hasAnyToken(activityEventText(activity), ["rejected", "feedback"]),
  );
}

function activityHasDoneSignal(activity: { title: string; metadataJson: unknown }) {
  return hasAnyToken(activityEventText(activity), [
    "approved",
    "done",
    "completed",
  ]);
}

function resolveQueueStatus(input: {
  activityCount: number;
  feedbackCount: number;
  hasRejectedOrFeedback: boolean;
  hasDoneSignal: boolean;
}): QueueItemStatus {
  if (input.hasRejectedOrFeedback || input.feedbackCount > 0) return "FEEDBACK";
  if (input.hasDoneSignal) return "DONE";
  if (input.activityCount > 0) return "IN_PROGRESS";
  return "WAITING";
}

function resolveWorkflowQueueStatus(input: {
  workflowRuntime: WorkflowRuntimeState | null;
  workflowDefinition: WorkflowDefinition | null;
}): QueueItemStatus | null {
  const runtime = input.workflowRuntime;
  const definition = input.workflowDefinition;
  if (!runtime || !definition) return null;

  if (definition.terminalStates.includes(runtime.currentState)) return "DONE";

  const state = runtime.currentState.toUpperCase();
  const metadata = asRecord(runtime.metadata);
  if (
    state.includes("FEEDBACK") ||
    state.includes("REJECTED") ||
    metadata.contentRejected === true ||
    metadata.imageRejected === true
  ) {
    return "FEEDBACK";
  }

  if (
    state.includes("REVIEW") ||
    state.includes("READY") ||
    metadata.contentSubmitted === true ||
    metadata.imageSubmitted === true ||
    metadata.contentApproved === true ||
    metadata.imageApproved === true
  ) {
    return "IN_PROGRESS";
  }

  return "WAITING";
}

function resolveQueueSource(metadata: Record<string, unknown>): QueueItemSource {
  return cleanUpper(metadata.source) === "AUTO" ? "AUTO" : "MANUAL";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return new Date(0).toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function latestDate(...values: Array<Date | string | null | undefined>) {
  let latest: Date | null = null;

  for (const value of values) {
    if (!value) continue;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) continue;
    if (!latest || date > latest) latest = date;
  }

  return latest;
}

type QueueActivityStats = {
  latestActivityTitle: string | null;
  latestActivityAt: Date | null;
  latestUpdatedAt: Date | null;
  activityCount: number;
  feedbackCount: number;
  hasRejectedOrFeedback: boolean;
  hasDoneSignal: boolean;
};

type QueueBusinessPreview = {
  title: string | null;
  ref: string | null;
  status: string | null;
  imageUrl: string | null;
  imageUrls: string[];
};

function buildQueueActivityStats(
  activities: Awaited<ReturnType<typeof findQueueActivitiesByTaskItem>>,
) {
  const map = new Map<string, QueueActivityStats>();

  for (const activity of activities) {
    const target = activityTarget(activity);
    if (!target) continue;

    const key = queueKey(target.targetType, target.targetId);
    const current = map.get(key) ?? {
      latestActivityTitle: null,
      latestActivityAt: null,
      latestUpdatedAt: null,
      activityCount: 0,
      feedbackCount: 0,
      hasRejectedOrFeedback: false,
      hasDoneSignal: false,
    };
    const activityAt = latestDate(activity.occurredAt);
    const updatedAt = latestDate(activity.updatedAt, activity.occurredAt);
    const hasFeedback = activityHasFeedback(activity);

    current.activityCount += 1;
    if (hasFeedback) current.feedbackCount += 1;
    current.hasRejectedOrFeedback ||= hasFeedback;
    current.hasDoneSignal ||= activityHasDoneSignal(activity);

    if (activityAt && (!current.latestActivityAt || activityAt >= current.latestActivityAt)) {
      current.latestActivityAt = activityAt;
      current.latestActivityTitle = activity.title;
    }

    if (updatedAt && (!current.latestUpdatedAt || updatedAt > current.latestUpdatedAt)) {
      current.latestUpdatedAt = updatedAt;
    }

    map.set(key, current);
  }

  return map;
}

async function buildQueueBusinessPreviewMap(
  db: DB,
  bindings: BusinessBinding[],
) {
  const client = dbOrTx(db);
  const map = new Map<string, QueueBusinessPreview>();
  const watchIds = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === TaskExecutionTargetType.WATCH)
        .map((binding) => clean(binding.targetId))
        .filter(Boolean),
    ),
  );
  const orderIds = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === TaskExecutionTargetType.ORDER)
        .map((binding) => clean(binding.targetId))
        .filter(Boolean),
    ),
  );

  const [watches, orders] = await Promise.all([
    watchIds.length
      ? client.watch.findMany({
        where: { id: { in: watchIds } },
        select: {
          id: true,
          saleStage: true,
          product: {
            select: {
              title: true,
              sku: true,
              primaryImageUrl: true,
              status: true,
            },
          },
        },
      })
      : Promise.resolve([]),
    orderIds.length
      ? client.order.findMany({
        where: { id: { in: orderIds } },
        select: {
          id: true,
          refNo: true,
          customerName: true,
          status: true,
          orderItem: {
            where: { productId: { not: null } },
            orderBy: [{ createdAt: "asc" }],
            take: 4,
            select: {
              title: true,
              img: true,
              product: {
                select: {
                  title: true,
                  sku: true,
                  primaryImageUrl: true,
                },
              },
            },
          },
        },
      })
      : Promise.resolve([]),
  ]);

  for (const watch of watches) {
    const imageUrl = watch.product.primaryImageUrl || null;
    map.set(queueKey(TaskExecutionTargetType.WATCH, watch.id), {
      title: watch.product.title || "Watch",
      ref: watch.product.sku || null,
      status: String(watch.saleStage || watch.product.status || ""),
      imageUrl,
      imageUrls: imageUrl ? [imageUrl] : [],
    });
  }

  for (const order of orders) {
    const images = order.orderItem
      .map((item) => item.product?.primaryImageUrl || item.img || null)
      .map(clean)
      .filter(Boolean);
    const firstItem = order.orderItem[0] ?? null;
    const itemCount = order.orderItem.length;

    map.set(queueKey(TaskExecutionTargetType.ORDER, order.id), {
      title: order.refNo ? `Đơn hàng ${order.refNo}` : "Đơn hàng",
      ref: firstItem?.product?.sku || order.refNo || null,
      status: String(order.status || ""),
      imageUrl: images[0] ?? null,
      imageUrls: images,
    });
    if (!itemCount && order.customerName) {
      const current = map.get(queueKey(TaskExecutionTargetType.ORDER, order.id));
      if (current) current.title = `Đơn hàng ${order.customerName}`;
    }
  }

  return map;
}
export async function findRelatedTaskItemIdsForBusinessTargets(
  db: DB,
  input: {
    targetType: BusinessBindingTargetType;
    targetIds: string[];
  },
) {
  return findTaskItemIdsByTargetIds(db, input);
}
function assertPresent(value: unknown, message: string) {
  if (!clean(value)) throw new Error(message);
}

// TaskExecution remains the database model. This service exposes the
// BusinessBinding abstraction so new server code does not need that legacy name.
export function toBusinessBindingDTO(
  binding: BusinessBinding,
): BusinessBindingDTO {
  return {
    id: binding.id,
    targetType: binding.targetType,
    targetId: binding.targetId,
    taskItemId: binding.taskItemId,
    actionType: binding.actionType,
    metadata: binding.metadataJson,
  };
}

export async function bindTaskItemToBusinessObject(
  db: DB,
  input: BindTaskItemToBusinessObjectInput,
) {
  assertPresent(input.taskItemId, "Missing taskItemId");

  const binding = await createBusinessBinding(db, {
    ...input,
    taskId: clean(input.taskId),
    taskItemId: clean(input.taskItemId),
    targetId: clean(input.targetId),
    metadataJson: initializeQueueItemWorkflowState({
      metadataJson: input.metadataJson ?? null,
      createdAt: new Date(),
    }),
  });

  return toBusinessBindingDTO(binding);
}

export async function ensureTaskItemBusinessBinding(
  db: DB,
  input: BindTaskItemToBusinessObjectInput,
) {
  assertPresent(input.taskItemId, "Missing taskItemId");

  const cleanInput = {
    ...input,
    taskId: clean(input.taskId),
    taskItemId: clean(input.taskItemId),
    targetId: clean(input.targetId),
  };

  const existing = await findBusinessBindingByTaskItemTarget(db, cleanInput);

  if (existing) {
    const binding = await ensureQueueItemWorkflowState(db, existing);

    return {
      binding: toBusinessBindingDTO(binding),
      created: false,
    };
  }

  const binding = await createBusinessBinding(db, {
    ...cleanInput,
    metadataJson: initializeQueueItemWorkflowState({
      metadataJson: cleanInput.metadataJson ?? null,
      createdAt: new Date(),
    }),
  });

  return {
    binding: toBusinessBindingDTO(binding),
    created: true,
  };
}

export async function findRelatedTaskItemIdsForBusinessTarget(
  db: DB,
  input: BusinessBindingTargetInput,
) {
  return findTaskItemIdsByTarget(db, input.targetType, input.targetId);
}

export async function listTaskItemBusinessBindings(
  db: DB,
  taskItemId: string,
) {
  const bindings = await findBusinessBindingsByTaskItem(db, taskItemId);
  return bindings.map(toBusinessBindingDTO);
}

export async function listTaskItemQueueItems(
  db: DB,
  taskItemId: string,
): Promise<QueueItemDTO[]> {
  const cleanTaskItemId = clean(taskItemId);
  assertPresent(cleanTaskItemId, "Missing taskItemId");

  const [bindings, activities] = await Promise.all([
    findBusinessBindingsByTaskItem(db, cleanTaskItemId),
    findQueueActivitiesByTaskItem(db, cleanTaskItemId),
  ]);
  const activityStats = buildQueueActivityStats(activities);
  const businessPreviews = await buildQueueBusinessPreviewMap(db, bindings);

  return bindings
    .filter((binding) => binding.taskItemId)
    .map((binding) => {
      const metadata = asRecord(binding.metadataJson);
      const workflowRuntime = getQueueItemWorkflowState(binding);
      const workflowDefinition = resolveWorkflowDefinition(
        workflowRuntime?.workflowKey,
      );
      const key = queueKey(binding.targetType, binding.targetId);
      const businessPreview = businessPreviews.get(key);
      const stats = activityStats.get(key) ?? {
        latestActivityTitle: null,
        latestActivityAt: null,
        latestUpdatedAt: null,
        activityCount: 0,
        feedbackCount: 0,
        hasRejectedOrFeedback: false,
        hasDoneSignal: false,
      };
      const updatedAt = latestDate(
        stats.latestUpdatedAt,
        stats.latestActivityAt,
        workflowRuntime?.updatedAt,
        binding.createdAt,
      );

      return {
        id: binding.id,
        taskItemId: binding.taskItemId as string,
        targetType: binding.targetType,
        targetId: binding.targetId,
        source: resolveQueueSource(metadata),
        status: resolveWorkflowQueueStatus({
          workflowRuntime,
          workflowDefinition,
        }) ?? resolveQueueStatus(stats),
        preview: {
          title: metadataText(metadata, ["targetTitle", "title"]) ??
            businessPreview?.title ??
            null,
          ref: metadataText(metadata, ["targetRefNo", "targetRef", "refNo", "ref"]) ??
            businessPreview?.ref ??
            null,
          status: metadataText(metadata, ["targetStatus", "status"]) ??
            businessPreview?.status ??
            null,
          imageUrl: queueItemImageUrl(metadata) ??
            businessPreview?.imageUrl ??
            null,
          imageUrls: queueItemImageUrls(metadata).length
            ? queueItemImageUrls(metadata)
            : businessPreview?.imageUrls ?? [],
        },
        latestActivityTitle: stats.latestActivityTitle,
        feedbackCount: stats.feedbackCount,
        activityCount: stats.activityCount,
        workflowKey: workflowRuntime?.workflowKey ?? null,
        currentWorkflowState: workflowRuntime?.currentState ?? null,
        currentWorkflowStateLabel: getWorkflowStateLabel(
          workflowDefinition,
          workflowRuntime?.currentState ?? null,
        ),
        isWorkflowDone: Boolean(
          workflowRuntime &&
            workflowDefinition?.terminalStates.includes(
              workflowRuntime.currentState,
            ),
        ),
        manualTransitions: listAvailableManualTransitionsForQueueItem({
          workflowDefinition,
          currentState: workflowRuntime?.currentState ?? null,
        }),
        intakeNote: queueItemIntakeNote(metadata),
        updatedAt: formatDate(updatedAt),
      };
    });
}

function watchPreviewHref(productId: string | null) {
  return productId ? `/admin/watches/${productId}` : null;
}

function targetPreviewMetadata(
  preview: ManualQueueTargetPreviewDTO,
  input: {
    source: QueueItemSource;
    intakeNote?: string | null;
    addedBy?: string | null;
    addedAt?: string | null;
  },
): Prisma.InputJsonObject {
  return {
    source: input.source,
    targetTitle: preview.title,
    targetRef: preview.ref,
    targetStatus: preview.status,
    targetImageUrl: preview.imageUrl,
    targetImageUrls: preview.imageUrl ? [preview.imageUrl] : [],
    targetHref: preview.href,
    intakeNote: input.intakeNote ?? null,
    addedBy: input.addedBy ?? null,
    addedAt: input.addedAt ?? null,
  };
}

export async function searchManualQueueTargets(
  db: DB,
  input: {
    targetType: BusinessBindingTargetType;
    keyword?: string | null;
    limit?: number | null;
  },
): Promise<ManualQueueTargetPreviewDTO[]> {
  const targetType = cleanUpper(input.targetType) as BusinessBindingTargetType;
  const keyword = clean(input.keyword);
  const limit = Math.min(20, Math.max(5, Number(input.limit || 10)));
  const client = dbOrTx(db);

  if (targetType !== TaskExecutionTargetType.WATCH) return [];

  const rows = await client.watch.findMany({
    where: keyword
      ? {
        OR: [
          { id: keyword },
          { productId: keyword },
          { product: { title: { contains: keyword, mode: "insensitive" } } },
          { product: { sku: { contains: keyword, mode: "insensitive" } } },
        ],
      }
      : {},
    select: {
      id: true,
      productId: true,
      saleStage: true,
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          status: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
  });

  return rows.map((row) => ({
    targetType,
    targetId: row.id,
    title: row.product.title || "Watch",
    ref: row.product.sku || null,
    status: String(row.saleStage || row.product.status || ""),
    imageUrl: row.product.primaryImageUrl || null,
    href: watchPreviewHref(row.productId),
  }));
}

async function getManualQueueTargetPreview(
  db: DB,
  input: {
    targetType: BusinessBindingTargetType;
    targetId: string;
  },
): Promise<ManualQueueTargetPreviewDTO | null> {
  const targetType = cleanUpper(input.targetType) as BusinessBindingTargetType;
  const targetId = clean(input.targetId);
  const client = dbOrTx(db);

  if (targetType !== TaskExecutionTargetType.WATCH) return null;

  const row = await client.watch.findUnique({
    where: { id: targetId },
    select: {
      id: true,
      productId: true,
      saleStage: true,
      product: {
        select: {
          title: true,
          sku: true,
          primaryImageUrl: true,
          status: true,
        },
      },
    },
  });

  if (!row) return null;

  return {
    targetType,
    targetId: row.id,
    title: row.product.title || "Watch",
    ref: row.product.sku || null,
    status: String(row.saleStage || row.product.status || ""),
    imageUrl: row.product.primaryImageUrl || null,
    href: watchPreviewHref(row.productId),
  };
}

export async function addManualQueueItem(
  db: DB,
  input: {
    taskItemId: string;
    targetType: BusinessBindingTargetType;
    targetId: string;
    intakeNote?: string | null;
    actorUserId?: string | null;
    actor?: unknown;
  },
) {
  const taskItemId = clean(input.taskItemId);
  const targetType = cleanUpper(input.targetType) as BusinessBindingTargetType;
  const targetId = clean(input.targetId);
  const intakeNote = cleanNullable(input.intakeNote);

  assertPresent(taskItemId, "Missing taskItemId");
  assertPresent(targetId, "Missing targetId");

  return withDbTransaction(db, async (tx) => {
    const taskItem = await tx.taskItem.findUnique({
      where: { id: taskItemId },
      select: { id: true, taskId: true },
    });
    if (!taskItem) throw new Error("Phiếu xử lý không tồn tại.");

    const preview = await getManualQueueTargetPreview(tx, {
      targetType,
      targetId,
    });
    if (!preview) {
      throw new Error("Không tìm thấy nghiệp vụ để thêm vào hàng đợi.");
    }

    const addedAt = new Date().toISOString();
    const result = await ensureTaskItemBusinessBinding(tx, {
      taskId: taskItem.taskId,
      taskItemId: taskItem.id,
      targetType,
      targetId,
      actionType: TaskExecutionActionType.LINKED,
      createdByUserId: cleanNullable(input.actorUserId),
      metadataJson: targetPreviewMetadata(preview, {
        source: "MANUAL",
        intakeNote,
        addedBy: cleanNullable(input.actorUserId),
        addedAt,
      }),
      note: intakeNote,
    });

    if (result.created) {
      const label = actorLabel(input.actor);
      await createSystemActivity({
        taskItemId: taskItem.id,
        sourceId: `manual-queue:${result.binding.id}`,
        title: `${label} đã thêm ${preview.title} vào hàng đợi.`,
        body: intakeNote,
        actorUserId: cleanNullable(input.actorUserId),
        metadataJson: {
          bindingId: result.binding.id,
          targetType,
          targetId,
          targetTitle: preview.title,
          targetRef: preview.ref,
          targetStatus: preview.status,
          triggerType: "MANUAL_QUEUE_INTAKE",
          intakeNote,
        },
      }, tx);
    }

    return {
      ...result,
      preview,
    };
  });
}

export async function summarizeTaskItemQueue(
  db: DB,
  taskItemId: string,
): Promise<QueueSummaryDTO> {
  const items = await listTaskItemQueueItems(db, taskItemId);
  const summary: QueueSummaryDTO = {
    WAITING: 0,
    IN_PROGRESS: 0,
    FEEDBACK: 0,
    DONE: 0,
    total: items.length,
  };

  for (const item of items) {
    summary[item.status] += 1;
  }

  return summary;
}
