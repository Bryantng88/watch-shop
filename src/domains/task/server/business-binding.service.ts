import { TaskExecutionActionType, TaskExecutionTargetType, TaskStatus, type Prisma } from "@prisma/client";
import { dbOrTx, withDbTransaction, type DB } from "@/server/db/client";
import { createSystemActivity } from "./activity";
import {
  createBusinessBinding,
  findBusinessBindingByTaskItemTarget,
  findBusinessBindingsByTaskItem,
  findQueueActivitiesByTaskItem,
  findTaskItemIdsByTarget,
  updateBusinessBindingMetadata,
} from "./business-binding.repo";
import {
  ensureQueueItemWorkflowState,
  getQueueItemWorkflowState,
  getWorkflowStateLabel,
  initializeQueueItemWorkflowState,
  listAvailableManualTransitionsForQueueItem,
  resolveBindingWorkflowDefinition,
} from "./business-binding-workflow.service";
import {
  parseWorkspaceDefinitionSnapshot,
  resolveAppliedWorkflowSnapshot,
} from "@/domains/blueprint/shared/workspace-capabilities";
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

function toInputJsonObject(value: Prisma.InputJsonValue | null | undefined) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? { ...(value as Prisma.InputJsonObject) }
    : {};
}

function cleanUpper(value: unknown) {
  return clean(value).toUpperCase();
}

function cleanNullable(value: unknown) {
  const text = clean(value);
  return text || null;
}

function technicalIssueOwnerLabel(issue: {
  actionMode?: string | null;
  vendorId?: string | null;
  vendorNameSnap?: string | null;
  supplyCatalogId?: string | null;
  mechanicalPartCatalogId?: string | null;
}) {
  const actionMode = cleanUpper(issue.actionMode);
  if (actionMode === "VENDOR" || issue.vendorId) {
    return issue.vendorNameSnap ? `Vendor: ${issue.vendorNameSnap}` : "Vendor";
  }
  if (issue.supplyCatalogId || issue.mechanicalPartCatalogId) return "Parts";
  if (actionMode === "INTERNAL") return "Internal";
  return null;
}

function mediaUrl(value?: string | null) {
  const raw = clean(value);
  if (!raw) return null;
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("/")
  ) {
    return raw;
  }

  return `/api/media/sign?key=${encodeURIComponent(raw)}`;
}

function productPreviewImage(product?: {
  primaryImageUrl?: string | null;
  storefrontImageKey?: string | null;
  productImage?: Array<{ fileKey?: string | null }> | null;
} | null) {
  const img = product?.productImage?.[0];
  return mediaUrl(
    img?.fileKey ||
      product?.primaryImageUrl ||
      product?.storefrontImageKey ||
      null,
  );
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

function noteField(note: string | null | undefined, key: string) {
  const pattern = new RegExp(`^${key}:\\s*(.+)$`, "im");
  return clean(String(note ?? "").match(pattern)?.[1]);
}

function normalizeKey(value: unknown) {
  return clean(value).toLowerCase();
}

function workflowKeyFromTaskItemNote(note: string | null | undefined) {
  return (
    clean(resolveAppliedWorkflowSnapshot({ note })?.key) ||
    noteField(note, "workflowKey") ||
    null
  );
}

function bindingMatchesTaskItemWorkflow(
  binding: { metadataJson: unknown },
  expectedWorkflowKey: string | null,
) {
  if (!expectedWorkflowKey) return true;

  const runtime = getQueueItemWorkflowState(binding);
  const metadata = asRecord(binding.metadataJson);
  const workflowKey = normalizeKey(runtime?.workflowKey ?? metadata.workflowKey);

  if (!workflowKey) return true;
  return workflowKey === normalizeKey(expectedWorkflowKey);
}

function serviceOperationWorkspaceRoleFromNote(note: string | null | undefined) {
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  return cleanUpper(
    snapshot?.operationWorkspaceRole ??
      snapshot?.workspaceRole?.key ??
      String(note ?? "").match(/^serviceOperationWorkspaceRole:\s*([A-Z_]+)\s*$/im)?.[1] ??
      String(note ?? "").match(/^operationWorkspaceRole:\s*([A-Z_]+)\s*$/im)?.[1],
  );
}

async function moveCompletedServiceOperationBindingsToDone(input: {
  db: DB;
  taskId: string;
  sourceTaskItemId: string;
}) {
  const taskItems = await dbOrTx(input.db).taskItem.findMany({
    where: {
      taskId: input.taskId,
      status: { not: TaskStatus.CANCELLED },
    },
    select: { id: true, note: true },
    orderBy: { sortOrder: "asc" },
  });
  const doneTaskItem = taskItems.find(
    (item) => serviceOperationWorkspaceRoleFromNote(item.note) === "DONE",
  );

  if (!doneTaskItem) return;

  const bindings = await findBusinessBindingsByTaskItem(input.db, input.sourceTaskItemId);
  const doneBindingIds = bindings
    .filter((binding) => {
      const runtime = getQueueItemWorkflowState(binding);
      return (
        binding.targetType === TaskExecutionTargetType.TECHNICAL_ISSUE &&
        runtime?.workflowKey === "service-operation-technical-bench" &&
        runtime.currentState === "DONE"
      );
    })
    .map((binding) => binding.id);

  if (!doneBindingIds.length) return;

  await dbOrTx(input.db).taskExecution.updateMany({
    where: { id: { in: doneBindingIds } },
    data: { taskItemId: doneTaskItem.id },
  });
}

async function metadataWithWorkspaceWorkflowSnapshot(
  db: DB,
  input: {
    taskItemId: string;
    metadataJson?: Prisma.InputJsonValue | null;
  },
): Promise<Prisma.InputJsonObject> {
  const metadata = toInputJsonObject(input.metadataJson);
  if (resolveAppliedWorkflowSnapshot({ metadataJson: metadata })) return metadata;

  const taskItem = await dbOrTx(db).taskItem.findUnique({
    where: { id: input.taskItemId },
    select: { note: true },
  });
  const appliedWorkflowSnapshot = resolveAppliedWorkflowSnapshot({
    note: taskItem?.note ?? null,
  });

  if (!appliedWorkflowSnapshot) {
    const workflowKey = noteField(taskItem?.note, "workflowKey");
    const workTypeKey = noteField(taskItem?.note, "workTypeKey");

    return {
      ...metadata,
      ...(workflowKey && !metadata.workflowKey ? { workflowKey } : {}),
      ...(workTypeKey && !metadata.workTypeKey ? { workTypeKey } : {}),
    };
  }

  return {
    ...metadata,
    appliedWorkflowSnapshot: appliedWorkflowSnapshot as unknown as Prisma.InputJsonValue,
  };
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
  if (state.includes("RETURNED")) {
    if (runtime.workflowKey === "watch-media-processing") return "IN_PROGRESS";
    return "RETURNED";
  }

  if (
    state.includes("FEEDBACK") ||
    state.includes("REJECTED") ||
    state.includes("RECALLED") ||
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

function mediaWorkProgress(metadata: Record<string, unknown>) {
  const progress = asRecord(metadata.mediaWorkProgress);
  const parts = asRecord(progress.parts);
  const profile = parts.profile === true;
  const content = parts.content === true;
  const image = parts.image === true;
  const completed = [profile, content, image].filter(Boolean).length;

  if (!completed && !clean(progress.updatedAt)) return null;

  return {
    profile,
    content,
    image,
    completed,
    total: 3,
    updatedAt: clean(progress.updatedAt) || null,
  };
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
  discussionCount: number;
  hasRejectedOrFeedback: boolean;
  hasDoneSignal: boolean;
};

type QueueBusinessPreview = {
  title: string | null;
  ref: string | null;
  status: string | null;
  imageUrl: string | null;
  imageUrls: string[];
  postTargets?: QueueItemDTO["preview"]["postTargets"];
  mediaWorkProgress?: QueueItemDTO["mediaWorkProgress"];
  technicalIssue?: QueueItemDTO["technicalIssue"];
};

type ProductPostTargetsShape = {
  postTargets?: Array<{
    postTarget?: {
      id?: string | null;
      name?: string | null;
      platform?: string | null;
    } | null;
  } | {
    id?: string | null;
    name?: string | null;
    platform?: string | null;
  }> | null;
} | null;

function mapPostTargets(product: ProductPostTargetsShape): QueueItemDTO["preview"]["postTargets"] {
  const relations = Array.isArray(product?.postTargets) ? product.postTargets : [];
  const byName = new Map<string, { id: string; name: string; platform?: string | null }>();

  for (const item of relations) {
    const target = item?.postTarget ?? item;
    const id = clean(target?.id);
    const name = clean(target?.name);

    if (!id || !name) continue;

    const key = name.toLowerCase();
    if (byName.has(key)) continue;

    byName.set(key, {
      id,
      name,
      platform: clean(target?.platform) || null,
    });
  }

  return Array.from(byName.values());
}

function hasWatchContentPreview(watch: {
  watchContent?: {
    titleOverride?: string | null;
    summary?: string | null;
    hookText?: string | null;
    body?: string | null;
    bulletSpecs?: string[] | null;
    hashTags?: string | null;
  } | null;
  product?: {
    postContent?: string | null;
    productContent?: {
      generatedContent?: string | null;
      specBullets?: string[] | null;
      hashtags?: string[] | null;
    } | null;
  } | null;
}) {
  const watchContent = watch.watchContent;
  const productContent = watch.product?.productContent;

  return Boolean(
    clean(watchContent?.titleOverride) ||
      clean(watchContent?.summary) ||
      clean(watchContent?.hookText) ||
      clean(watchContent?.body) ||
      clean(watchContent?.hashTags) ||
      (watchContent?.bulletSpecs?.length ?? 0) > 0 ||
      clean(watch.product?.postContent) ||
      clean(productContent?.generatedContent) ||
      (productContent?.specBullets?.length ?? 0) > 0 ||
      (productContent?.hashtags?.length ?? 0) > 0,
  );
}

function watchPreviewMediaProgress(watch: {
  watchContent?: Parameters<typeof hasWatchContentPreview>[0]["watchContent"];
  product?: Parameters<typeof hasWatchContentPreview>[0]["product"] & {
    productImage?: Array<unknown>;
  } | null;
}): QueueItemDTO["mediaWorkProgress"] {
  const profile = false;
  const content = hasWatchContentPreview(watch);
  const image = (watch.product?.productImage?.length ?? 0) > 0;
  const completed = [profile, content, image].filter(Boolean).length;

  if (!completed) return null;

  return {
    profile,
    content,
    image,
    completed,
    total: 3,
    updatedAt: null,
  };
}

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
      discussionCount: 0,
      hasRejectedOrFeedback: false,
      hasDoneSignal: false,
    };
    const activityAt = latestDate(activity.occurredAt);
    const updatedAt = latestDate(activity.updatedAt, activity.occurredAt);
    const hasFeedback = activityHasFeedback(activity);

    current.activityCount += 1;
    if (hasFeedback) current.feedbackCount += 1;
    current.discussionCount += activity._count.replies;
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
  const technicalIssueIds = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === TaskExecutionTargetType.TECHNICAL_ISSUE)
        .map((binding) => clean(binding.targetId))
        .filter(Boolean),
    ),
  );

  const [watches, orders, technicalIssues] = await Promise.all([
    watchIds.length
      ? client.watch.findMany({
        where: { id: { in: watchIds } },
        select: {
          id: true,
          saleStage: true,
          watchContent: {
            select: {
              titleOverride: true,
              summary: true,
              hookText: true,
              body: true,
              bulletSpecs: true,
              hashTags: true,
            },
          },
          product: {
            select: {
              title: true,
              sku: true,
              primaryImageUrl: true,
              postContent: true,
              status: true,
              productContent: {
                select: {
                  generatedContent: true,
                  specBullets: true,
                  hashtags: true,
                },
              },
              productImage: {
                where: { role: "GALLERY" },
                select: { id: true },
                take: 1,
              },
              postTargets: {
                select: {
                  postTargetId: true,
                  postTarget: {
                    select: {
                      id: true,
                      name: true,
                      platform: true,
                    },
                  },
                },
              },
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
                  storefrontImageKey: true,
                  productImage: {
                    where: { role: "INLINE" },
                    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    take: 1,
                    select: {
                      fileKey: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      : Promise.resolve([]),
    technicalIssueIds.length
      ? client.technicalIssue.findMany({
        where: { id: { in: technicalIssueIds } },
        select: {
          id: true,
          summary: true,
          note: true,
          area: true,
          actionMode: true,
          executionStatus: true,
          priority: true,
          vendorId: true,
          vendorNameSnap: true,
          estimatedCost: true,
          actualCost: true,
          technicalDetailCatalogId: true,
          supplyCatalogId: true,
          mechanicalPartCatalogId: true,
          technicalDetailCatalog: {
            select: {
              id: true,
              area: true,
              code: true,
              name: true,
            },
          },
          SupplyCatalog: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          MechanicalPartCatalog: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          serviceRequest: {
            select: {
              refNo: true,
              skuSnapshot: true,
              primaryImageUrlSnapshot: true,
              product: {
                select: {
                  title: true,
                  sku: true,
                  primaryImageUrl: true,
                  storefrontImageKey: true,
                  productImage: {
                    where: { role: "INLINE" },
                    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    take: 1,
                    select: {
                      fileKey: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      : Promise.resolve([]),
  ]);

  for (const watch of watches) {
    const imageUrl = productPreviewImage(watch.product);
    map.set(queueKey(TaskExecutionTargetType.WATCH, watch.id), {
      title: watch.product.title || "Watch",
      ref: watch.product.sku || null,
      status: String(watch.saleStage || watch.product.status || ""),
      imageUrl,
      imageUrls: imageUrl ? [imageUrl] : [],
      postTargets: mapPostTargets(watch.product),
      mediaWorkProgress: watchPreviewMediaProgress(watch),
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

  for (const issue of technicalIssues) {
    const product = issue.serviceRequest?.product ?? null;
    const srRef = issue.serviceRequest?.refNo ?? null;
    const sku = issue.serviceRequest?.skuSnapshot ?? product?.sku ?? null;
    const watchTitle = product?.title ?? null;
    const imageUrl =
      productPreviewImage(product) ||
      mediaUrl(issue.serviceRequest?.primaryImageUrlSnapshot ?? null);
    const refParts = [srRef, sku || watchTitle].filter(Boolean);
    const statusParts = [
      clean(issue.area),
      technicalIssueOwnerLabel(issue),
      clean(issue.priority),
    ].filter(Boolean);
    const title =
      clean(issue.summary) ||
      clean(issue.note) ||
      clean(issue.area) ||
      "Technical issue";

    map.set(queueKey(TaskExecutionTargetType.TECHNICAL_ISSUE, issue.id), {
      title,
      ref: refParts.length ? refParts.join(" / ") : issue.id,
      status: statusParts.length
        ? statusParts.join(" / ")
        : String(issue.executionStatus || ""),
      imageUrl,
      imageUrls: imageUrl ? [imageUrl] : [],
      technicalIssue: {
        id: issue.id,
        summary: issue.summary ?? null,
        note: issue.note ?? null,
        area: issue.area ?? null,
        actionMode: issue.actionMode ?? null,
        executionStatus: issue.executionStatus ?? null,
        vendorId: issue.vendorId ?? null,
        vendorNameSnap: issue.vendorNameSnap ?? null,
        estimatedCost: issue.estimatedCost == null ? null : Number(issue.estimatedCost),
        actualCost: issue.actualCost == null ? null : Number(issue.actualCost),
        technicalDetailCatalogId: issue.technicalDetailCatalogId ?? null,
        technicalDetailCatalog: issue.technicalDetailCatalog
          ? {
              id: issue.technicalDetailCatalog.id,
              area: issue.technicalDetailCatalog.area ?? null,
              code: issue.technicalDetailCatalog.code ?? null,
              name: issue.technicalDetailCatalog.name ?? null,
            }
          : null,
        supplyCatalog: issue.SupplyCatalog
          ? {
              id: issue.SupplyCatalog.id,
              code: issue.SupplyCatalog.code ?? null,
              name: issue.SupplyCatalog.name ?? null,
            }
          : null,
        mechanicalPartCatalog: issue.MechanicalPartCatalog
          ? {
              id: issue.MechanicalPartCatalog.id,
              code: issue.MechanicalPartCatalog.code ?? null,
              name: issue.MechanicalPartCatalog.name ?? null,
            }
          : null,
      },
    });
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
  const metadataJson = await metadataWithWorkspaceWorkflowSnapshot(db, {
    taskItemId: input.taskItemId,
    metadataJson: input.metadataJson ?? null,
  });

  const binding = await createBusinessBinding(db, {
    ...input,
    taskId: clean(input.taskId),
    taskItemId: clean(input.taskItemId),
    targetId: clean(input.targetId),
    metadataJson: initializeQueueItemWorkflowState({
      metadataJson,
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
    const metadataJson = await metadataWithWorkspaceWorkflowSnapshot(db, {
      taskItemId: cleanInput.taskItemId,
      metadataJson: existing.metadataJson,
    });
    const nextMetadataJson = initializeQueueItemWorkflowState({
      metadataJson,
      createdAt: existing.createdAt,
    });
    const binding = nextMetadataJson.workflowRuntime
      ? await updateBusinessBindingMetadata(db, existing.id, nextMetadataJson)
      : await ensureQueueItemWorkflowState(db, existing);

    return {
      binding: toBusinessBindingDTO(binding),
      created: false,
    };
  }

  const metadataJson = await metadataWithWorkspaceWorkflowSnapshot(db, {
    taskItemId: cleanInput.taskItemId,
    metadataJson: cleanInput.metadataJson ?? null,
  });

  const binding = await createBusinessBinding(db, {
    ...cleanInput,
    metadataJson: initializeQueueItemWorkflowState({
      metadataJson,
      createdAt: new Date(),
    }),
  });

  return {
    binding: toBusinessBindingDTO(binding),
    created: true,
  };
}

export async function findTaskItemBusinessBinding(
  db: DB,
  input: BindTaskItemToBusinessObjectInput,
) {
  assertPresent(input.taskItemId, "Missing taskItemId");

  const binding = await findBusinessBindingByTaskItemTarget(db, {
    ...input,
    taskId: clean(input.taskId),
    taskItemId: clean(input.taskItemId),
    targetId: clean(input.targetId),
  });

  return binding ? toBusinessBindingDTO(binding) : null;
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

  const taskItem = await dbOrTx(db).taskItem.findUnique({
    where: { id: cleanTaskItemId },
    select: { taskId: true, note: true },
  });

  if (
    taskItem?.taskId &&
    serviceOperationWorkspaceRoleFromNote(taskItem.note) === "PROCESSING"
  ) {
    await moveCompletedServiceOperationBindingsToDone({
      db,
      taskId: taskItem.taskId,
      sourceTaskItemId: cleanTaskItemId,
    });
  }

  const [bindings, activities] = await Promise.all([
    findBusinessBindingsByTaskItem(db, cleanTaskItemId),
    findQueueActivitiesByTaskItem(db, cleanTaskItemId),
  ]);
  const expectedWorkflowKey = workflowKeyFromTaskItemNote(taskItem?.note ?? null);
  const visibleBindings = bindings.filter((binding) =>
    bindingMatchesTaskItemWorkflow(binding, expectedWorkflowKey),
  );
  const photoshootTargetIds = visibleBindings
    .filter((binding) => binding.targetType === TaskExecutionTargetType.WATCH)
    .map((binding) => binding.targetId);
  const reshootEvents = photoshootTargetIds.length &&
    noteField(taskItem?.note, "workTypeKey") === "photography"
    ? await dbOrTx(db).businessEventLog.findMany({
      where: {
        eventKey: "watch.media.photoshoot.requested",
        targetType: TaskExecutionTargetType.WATCH,
        targetId: { in: photoshootTargetIds },
      },
      select: { targetId: true, metadataJson: true },
    })
    : [];
  const reshootNoteByTargetId = new Map(
    reshootEvents.flatMap((event) => {
      const eventMetadata = asRecord(event.metadataJson);
      const sourceId = clean(eventMetadata.sourceId);
      const note = clean(eventMetadata.intakeNote);
      return sourceId.startsWith("media-reshoot:") && note
        ? [[event.targetId, note] as const]
        : [];
    }),
  );
  const activityStats = buildQueueActivityStats(activities);
  const businessPreviews = await buildQueueBusinessPreviewMap(db, visibleBindings);

  return visibleBindings
    .filter((binding) => binding.taskItemId)
    .map((binding) => {
      const metadata = asRecord(binding.metadataJson);
      const workflowRuntime = getQueueItemWorkflowState(binding);
      const workflowDefinition = resolveBindingWorkflowDefinition(
        binding.metadataJson,
      );
      const key = queueKey(binding.targetType, binding.targetId);
      const businessPreview = businessPreviews.get(key);
      const stats = activityStats.get(key) ?? {
        latestActivityTitle: null,
        latestActivityAt: null,
        latestUpdatedAt: null,
        activityCount: 0,
        feedbackCount: 0,
        discussionCount: 0,
        hasRejectedOrFeedback: false,
        hasDoneSignal: false,
      };
      const updatedAt = latestDate(
        stats.latestUpdatedAt,
        stats.latestActivityAt,
          workflowRuntime?.updatedAt,
          binding.createdAt,
      );
      const progress =
        mediaWorkProgress(metadata) ?? businessPreview?.mediaWorkProgress ?? null;
      const workflowStatus = resolveWorkflowQueueStatus({
        workflowRuntime,
        workflowDefinition,
      });
      const queueStatus =
        workflowStatus === "WAITING" && progress?.completed
          ? "IN_PROGRESS"
          : workflowStatus ?? resolveQueueStatus(stats);

      return {
        id: binding.id,
        taskItemId: binding.taskItemId as string,
        targetType: binding.targetType,
        targetId: binding.targetId,
        source: resolveQueueSource(metadata),
        status: queueStatus,
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
          imageUrl: businessPreview?.imageUrl ??
            queueItemImageUrl(metadata) ??
            null,
          imageUrls: businessPreview?.imageUrls?.length
            ? businessPreview.imageUrls
            : queueItemImageUrls(metadata),
          postTargets: businessPreview?.postTargets ?? [],
        },
        latestActivityTitle: stats.latestActivityTitle,
        feedbackCount: stats.feedbackCount,
        discussionCount: stats.discussionCount,
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
        reshootNote: metadataText(metadata, ["reshootNote"]) ??
          (queueStatus !== "DONE" ? reshootNoteByTargetId.get(binding.targetId) ?? null : null),
        mediaAssetAttachedAt: metadataText(metadata, ["mediaAssetAttachedAt"]),
        mediaWorkProgress: progress,
        technicalIssue: businessPreview?.technicalIssue ?? null,
        href: metadataText(metadata, ["targetHref", "href"]) ??
          businessPreview?.href ??
          null,
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
    RETURNED: 0,
    FEEDBACK: 0,
    DONE: 0,
    total: items.length,
  };

  for (const item of items) {
    summary[item.status] += 1;
  }

  return summary;
}
