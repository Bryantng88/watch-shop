import { dbOrTx, type DB } from "@/server/db/client";
import { getTaskItemActivityViewModels } from "@/domains/task/server/activity";
import { listTaskItemQueueItems } from "@/domains/task/server/business-binding.service";
import type { QueueItemDTO } from "@/domains/task/server/business-binding.types";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";
import { listWatchMediaQueueProjectionItemsWithFallback } from "@/domains/projection/server/watch-media-queue.projection";
import { TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";
import { parseWorkspaceDefinitionSnapshot } from "@/domains/blueprint/shared/workspace-capabilities";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
} as const;

function noteHasSystemOwner(note?: string | null) {
  return /ownerType:\s*SYSTEM/i.test(String(note ?? ""));
}

function noteHasCoreWorkspace(note?: string | null) {
  return /workTypeKey:\s*[a-z0-9-]+/i.test(String(note ?? ""));
}

function noteWorkTypeKey(note?: string | null) {
  return String(note ?? "").match(/^workTypeKey:\s*([a-z0-9-]+)/im)?.[1] ?? null;
}

function coreFlowScopeKeyFromNote(note?: string | null) {
  const explicit = String(note ?? "").match(/^coreFlowKey:\s*([a-z0-9-]+)/im)?.[1] ?? null;
  const snapshot = parseWorkspaceDefinitionSnapshot(note);
  return explicit ?? snapshot?.coreFlowKey ?? noteWorkTypeKey(note);
}

function uniqueShareIds(userIds: Array<string | null | undefined>) {
  return Array.from(
    new Set(userIds.map((id) => String(id ?? "").trim()).filter(Boolean)),
  );
}

function noteLineValue(note: string | null | undefined, key: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(note ?? "").match(new RegExp(`^${escapedKey}:\\s*(.+)$`, "im"))?.[1] ?? "";
}

function shareUserIdsFromNoteLine(note: string | null | undefined, key: string) {
  return uniqueShareIds(noteLineValue(note, key).split(","));
}

function shouldUseWatchMediaQueueProjection(note?: string | null) {
  return noteWorkTypeKey(note) === "media-processing";
}

function isMediaFlowWorkType(value?: string | null) {
  return value === "photography" || value === "media-processing" || value === "publish";
}

function serviceOperationWorkspaceRole(note?: string | null) {
  return String(note ?? "")
    .match(/^serviceOperationWorkspaceRole:\s*([A-Z_]+)\s*$/im)?.[1]
    ?.toUpperCase() ?? null;
}

function queueStatusFromTechnicalIssue(issue: {
  executionStatus?: string | null;
  isConfirmed?: boolean | null;
}): QueueItemDTO["status"] {
  const status = String(issue.executionStatus ?? "").toUpperCase();
  if (status === "DONE") return "DONE";
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  if (status === "CONFIRMED" || issue.isConfirmed) return "IN_PROGRESS";
  return "WAITING";
}

function mediaUrl(value?: string | null) {
  const raw = String(value ?? "").trim();
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

function technicalIssueOwnerLabel(issue: {
  actionMode?: string | null;
  vendorId?: string | null;
  vendorNameSnap?: string | null;
  supplyCatalogId?: string | null;
  mechanicalPartCatalogId?: string | null;
}) {
  const actionMode = String(issue.actionMode ?? "").trim().toUpperCase();
  if (actionMode === "VENDOR" || issue.vendorId) {
    return issue.vendorNameSnap ? `Vendor: ${issue.vendorNameSnap}` : "Vendor";
  }
  if (issue.supplyCatalogId || issue.mechanicalPartCatalogId) return "Parts";
  if (actionMode === "INTERNAL") return "Internal";
  return null;
}

async function resolveServiceRequestIdForWorkspace(db: DB, taskItemId: string) {
  const binding = await dbOrTx(db).taskExecution.findFirst({
    where: {
      taskItemId,
      targetType: TaskExecutionTargetType.SERVICE_REQUEST,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      targetId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return binding?.targetId ?? null;
}

async function listServiceRequestTechnicalIssueQueueItems(
  db: DB,
  input: {
    taskItemId: string;
    serviceRequestId: string;
  },
): Promise<QueueItemDTO[]> {
  const rows = await dbOrTx(db).technicalIssue.findMany({
    where: {
      serviceRequestId: input.serviceRequestId,
      executionStatus: { not: "CANCELED" },
    },
    orderBy: [{ sortOrder: "asc" }, { openedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      summary: true,
      note: true,
      area: true,
      actionMode: true,
      executionStatus: true,
      priority: true,
      isConfirmed: true,
      updatedAt: true,
      openedAt: true,
      vendorId: true,
      vendorNameSnap: true,
      supplyCatalogId: true,
      mechanicalPartCatalogId: true,
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
  });

  return rows.map((issue): QueueItemDTO => {
    const product = issue.serviceRequest.product;
    const imageUrl =
      mediaUrl(product?.productImage?.[0]?.fileKey) ||
      mediaUrl(product?.primaryImageUrl) ||
      mediaUrl(product?.storefrontImageKey) ||
      mediaUrl(issue.serviceRequest.primaryImageUrlSnapshot);
    const refParts = [
      issue.serviceRequest.refNo,
      issue.serviceRequest.skuSnapshot ?? product?.sku ?? product?.title,
    ].filter(Boolean);
    const statusParts = [
      issue.area,
      technicalIssueOwnerLabel(issue),
      issue.priority,
    ].filter(Boolean);

    return {
      id: `technical-issue:${issue.id}`,
      taskItemId: input.taskItemId,
      targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
      targetId: issue.id,
      source: "AUTO",
      status: queueStatusFromTechnicalIssue(issue),
      preview: {
        title:
          issue.summary ||
          issue.note ||
          issue.area ||
          "Technical issue",
        ref: refParts.length ? refParts.join(" / ") : issue.id,
        status: statusParts.length
          ? statusParts.join(" / ")
          : String(issue.executionStatus || ""),
        imageUrl,
        imageUrls: imageUrl ? [imageUrl] : [],
      },
      latestActivityTitle: null,
      feedbackCount: 0,
      discussionCount: 0,
      activityCount: 0,
      workflowKey: null,
      currentWorkflowState: String(issue.executionStatus ?? "") || null,
      currentWorkflowStateLabel: null,
      isWorkflowDone: issue.executionStatus === "DONE",
      manualTransitions: [],
      intakeNote: issue.note ?? null,
      reshootNote: null,
      mediaAssetAttachedAt: null,
      mediaWorkProgress: null,
      serviceRequestId: input.serviceRequestId,
      serviceRequestWorkspaceHref: `/admin/task-items/${input.taskItemId}`,
      updatedAt: (issue.updatedAt ?? issue.openedAt).toISOString(),
    };
  });
}

async function listQueueItemsForTaskItemDetail(
  db: DB,
  input: {
    taskId: string;
    taskItemId: string;
    note?: string | null;
  },
) {
  if (!shouldUseWatchMediaQueueProjection(input.note)) {
    if (noteWorkTypeKey(input.note) === "publish") {
      await restorePublishDoneQueueItemsForDetail(db, {
        taskId: input.taskId,
        publishTaskItemId: input.taskItemId,
      });
    }

    if (
      noteWorkTypeKey(input.note) === "service-operation" &&
      !["INSPECT", "PROCESSING", "DONE"].includes(
        serviceOperationWorkspaceRole(input.note) ?? "",
      )
    ) {
      const serviceRequestId = await resolveServiceRequestIdForWorkspace(
        db,
        input.taskItemId,
      );
      if (serviceRequestId) {
        return listServiceRequestTechnicalIssueQueueItems(db, {
          taskItemId: input.taskItemId,
          serviceRequestId,
        });
      }
    }

    return listTaskItemQueueItems(db, input.taskItemId);
  }

  const result = await listWatchMediaQueueProjectionItemsWithFallback(db, {
    workspaceId: input.taskItemId,
  });

  return result.items;
}

async function restorePublishDoneQueueItemsForDetail(
  db: DB,
  input: { taskId: string; publishTaskItemId: string },
) {
  const client = dbOrTx(db);
  const mediaTaskItems = await client.taskItem.findMany({
    where: { taskId: input.taskId },
    select: { id: true, note: true },
  });
  const mediaTaskItemIds = mediaTaskItems
    .filter((item) => isMediaFlowWorkType(noteWorkTypeKey(item.note)))
    .map((item) => item.id);
  if (!mediaTaskItemIds.includes(input.publishTaskItemId)) return;

  const linkedBindings = await client.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: { in: mediaTaskItemIds },
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: { targetId: true },
  });
  const linkedTargetIds = new Set(linkedBindings.map((binding) => binding.targetId));

  const orphanBindings = await client.taskExecution.findMany({
    where: {
      taskId: input.taskId,
      taskItemId: null,
      targetType: TaskExecutionTargetType.WATCH,
      actionType: { not: TaskExecutionActionType.CANCELLED },
    },
    select: {
      id: true,
      targetId: true,
      metadataJson: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const restoreIdsByTarget = new Map<string, string>();

  for (const binding of orphanBindings) {
    if (linkedTargetIds.has(binding.targetId) || restoreIdsByTarget.has(binding.targetId)) {
      continue;
    }

    const runtime = getQueueItemWorkflowState(binding);
    if (runtime?.workflowKey !== "watch-publish" || runtime.currentState !== "DONE") {
      continue;
    }

    restoreIdsByTarget.set(binding.targetId, binding.id);
  }

  const restoreIds = [...restoreIdsByTarget.values()];
  if (!restoreIds.length) return;

  await client.taskExecution.updateMany({
    where: { id: { in: restoreIds } },
    data: { taskItemId: input.publishTaskItemId },
  });
}

async function listDefaultAdminShareUserIds(db: DB) {
  const users = await dbOrTx(db).user.findMany({
    where: {
      isActive: true,
      roles: {
        some: {
          OR: [
            { name: { equals: "ADMIN", mode: "insensitive" } },
            {
              permissions: {
                some: { code: { equals: "ADMIN", mode: "insensitive" } },
              },
            },
          ],
        },
      },
    },
    select: { id: true },
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });

  return users.map((user) => user.id);
}

function fallbackQueueTitle(targetType: string) {
  if (targetType === "WATCH") return "Watch";
  if (targetType === "ORDER") return "Đơn hàng";
  if (targetType === "SERVICE_REQUEST") return "Yêu cầu dịch vụ";
  if (targetType === "TECHNICAL_ISSUE") return "Vấn đề kỹ thuật";
  if (targetType === "SHIPMENT") return "Vận chuyển";
  if (targetType === "PAYMENT") return "Thanh toán";
  if (targetType === "WORK_CASE") return "Hồ sơ xử lý";
  if (targetType === "ACQUISITION") return "Thu mua";
  return "Nghiệp vụ";
}

function queueKey(targetType: string, targetId: string) {
  return `${targetType}:${targetId}`;
}

function bindingHref(
  binding: { targetType: string; targetId: string },
  watchProductIds: Map<string, string>,
) {
  if (binding.targetType === "WATCH") {
    const productId = watchProductIds.get(binding.targetId);
    return productId ? `/admin/watches/${productId}` : null;
  }

  if (binding.targetType === "SERVICE_REQUEST") return `/admin/services/${binding.targetId}`;
  if (binding.targetType === "TECHNICAL_ISSUE") {
    return `/admin/services/issues-board?issueId=${binding.targetId}`;
  }
  if (binding.targetType === "ORDER") return `/admin/orders/${binding.targetId}`;
  if (binding.targetType === "SHIPMENT") return `/admin/shipments/${binding.targetId}`;
  if (binding.targetType === "PAYMENT") return "/admin/payments";
  if (binding.targetType === "WORK_CASE") return `/admin/work-cases/${binding.targetId}`;
  if (binding.targetType === "ACQUISITION") return `/admin/acquisitions/${binding.targetId}`;

  return null;
}

function isSrCaseWorkspaceNote(note?: string | null) {
  const text = String(note ?? "");
  return (
    /serviceOperationWorkspaceRole:\s*SR_CASE/im.test(text) ||
    /operationWorkspaceRole:\s*SR_CASE/im.test(text)
  );
}

async function resolveTechnicalIssueServiceRequestWorkspaceLinks(
  db: DB,
  input: {
    taskId?: string | null;
    queueItems: Array<{ targetType: string; targetId: string }>;
  },
) {
  const issueIds = Array.from(
    new Set(
      input.queueItems
        .filter((item) => item.targetType === TaskExecutionTargetType.TECHNICAL_ISSUE)
        .map((item) => item.targetId)
        .filter(Boolean),
    ),
  );

  if (!issueIds.length) {
    return new Map<
      string,
      {
        serviceRequestId: string;
        serviceRequestWorkspaceHref: string | null;
        technicalIssueWorkspaceHref: string | null;
      }
    >();
  }

  const client = dbOrTx(db);
  const issues = await perfStep(
    "task-item-detail-repo",
    "technicalIssueServiceRequests",
    () =>
      client.technicalIssue.findMany({
        where: { id: { in: issueIds } },
        select: { id: true, serviceRequestId: true },
      }),
  );
  const serviceRequestIds = Array.from(
    new Set(issues.map((issue) => issue.serviceRequestId).filter(Boolean)),
  );

  if (!serviceRequestIds.length) {
    return new Map<
      string,
      {
        serviceRequestId: string;
        serviceRequestWorkspaceHref: string | null;
        technicalIssueWorkspaceHref: string | null;
      }
    >();
  }

  const [srWorkspaceBindings, issueWorkspaceBindings] = await Promise.all([
    perfStep(
      "task-item-detail-repo",
      "srCaseWorkspaceLinks",
      () =>
        client.taskExecution.findMany({
          where: {
            ...(input.taskId ? { taskId: input.taskId } : {}),
            targetType: TaskExecutionTargetType.SERVICE_REQUEST,
            targetId: { in: serviceRequestIds },
            actionType: { not: TaskExecutionActionType.CANCELLED },
            taskItemId: { not: null },
          },
          select: {
            targetId: true,
            taskItemId: true,
            taskItem: {
              select: {
                note: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
    ),
    perfStep(
      "task-item-detail-repo",
      "technicalIssueWorkspaceLinks",
      () =>
        client.taskExecution.findMany({
        where: {
          ...(input.taskId ? { taskId: input.taskId } : {}),
          targetType: TaskExecutionTargetType.TECHNICAL_ISSUE,
          targetId: { in: issueIds },
          actionType: { not: TaskExecutionActionType.CANCELLED },
          taskItemId: { not: null },
        },
        select: {
          targetId: true,
          taskItemId: true,
          taskItem: {
            select: {
              note: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ),
  ]);
  const hrefByServiceRequestId = new Map<string, string>();
  const hrefByIssueId = new Map<string, string>();

  for (const binding of srWorkspaceBindings) {
    if (!binding.taskItemId || hrefByServiceRequestId.has(binding.targetId)) continue;
    if (!isSrCaseWorkspaceNote(binding.taskItem?.note)) continue;
    hrefByServiceRequestId.set(binding.targetId, `/admin/task-items/${binding.taskItemId}`);
  }

  for (const binding of issueWorkspaceBindings) {
    if (!binding.taskItemId || hrefByIssueId.has(binding.targetId)) continue;
    if (isSrCaseWorkspaceNote(binding.taskItem?.note)) continue;
    hrefByIssueId.set(binding.targetId, `/admin/task-items/${binding.taskItemId}`);
  }

  return new Map(
    issues.map((issue) => [
      issue.id,
      {
        serviceRequestId: issue.serviceRequestId,
        serviceRequestWorkspaceHref: hrefByServiceRequestId.get(issue.serviceRequestId) ?? null,
        technicalIssueWorkspaceHref: hrefByIssueId.get(issue.id) ?? null,
      },
    ]),
  );
}

async function resolveWatchProductIds(
  db: DB,
  bindings: Array<{ targetType: string; targetId: string }>,
) {
  const watchIds = Array.from(
    new Set(
      bindings
        .filter((binding) => binding.targetType === "WATCH")
        .map((binding) => binding.targetId)
        .filter(Boolean),
    ),
  );

  if (!watchIds.length) return new Map<string, string>();

  const rows = await perfStep("task-item-detail-repo", "watchProductIds", () =>
    dbOrTx(db).watch.findMany({
      where: { id: { in: watchIds } },
      select: { id: true, productId: true },
    }),
  );

  return new Map(
    rows
      .filter((row) => row.productId)
      .map((row) => [row.id, row.productId as string]),
  );
}

export async function getTaskItemDetailPageRepo(db: DB, id: string) {
  const totalStartedAt = perfNow();
  const client = dbOrTx(db);
  const item = await perfStep("task-item-detail-repo", "taskItemFindUnique", () =>
    client.taskItem.findUnique({
      where: { id },
      include: {
        assignedToUser: { select: USER_SELECT },
        User: { select: USER_SELECT },
        checklists: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
        task: {
          select: {
            id: true,
            title: true,
            kind: true,
            status: true,
            priority: true,
            dueAt: true,
            periodKey: true,
            createdByUserId: true,
            assignedToUserId: true,
            taskItems: {
              select: {
                id: true,
                title: true,
                note: true,
                status: true,
                sortOrder: true,
                updatedAt: true,
              },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
          },
        },
      },
    }),
  );

  if (!item) return null;

  const workspaceSharedUserIds = shareUserIdsFromNoteLine(item.note, "sharedUserIds");
  const taskScopeNotes = [
    item.note,
    ...(item.task.taskItems ?? []).map((taskItem) => taskItem.note),
  ];
  const currentCoreFlowScopeKey = coreFlowScopeKeyFromNote(item.note);
  const spaceSharedUserIds = uniqueShareIds(
    taskScopeNotes.flatMap((note) => shareUserIdsFromNoteLine(note, "spaceSharedUserIds")),
  );
  const coreFlowSharedUserIds = currentCoreFlowScopeKey
    ? uniqueShareIds(
      taskScopeNotes.flatMap((note) =>
        shareUserIdsFromNoteLine(note, `coreFlowSharedUserIds:${currentCoreFlowScopeKey}`),
      ),
    )
    : [];
  const defaultAdminShareUserIds =
    noteHasSystemOwner(item.note) && noteHasCoreWorkspace(item.note)
      ? await listDefaultAdminShareUserIds(db)
      : [];
  const sharedUserIds = uniqueShareIds(
    [
      ...workspaceSharedUserIds,
      ...coreFlowSharedUserIds,
      ...spaceSharedUserIds,
      ...defaultAdminShareUserIds,
    ],
  );

  const [queueItems, sharedUsers] = await Promise.all([
    perfStep("task-item-detail-repo", "queueItems", () =>
      listQueueItemsForTaskItemDetail(db, {
        taskId: item.taskId,
        taskItemId: item.id,
        note: item.note,
      }),
    ),
    sharedUserIds.length
      ? client.user.findMany({
        where: { id: { in: sharedUserIds } },
        select: USER_SELECT,
        orderBy: [{ name: "asc" }, { email: "asc" }],
      })
      : Promise.resolve([]),
  ]);
  const activities = await perfStep("task-item-detail-repo", "activities", () =>
    getTaskItemActivityViewModels(item.id, {
      limit: 50,
      scope: {
        targets: queueItems.map((queueItem) => ({
          targetType: queueItem.targetType,
          targetId: queueItem.targetId,
        })),
        includeWorkspaceLevel: true,
        workspaceWorkTypeKey: noteWorkTypeKey(item.note),
      },
    }),
  );
  const watchProductIds = await resolveWatchProductIds(db, queueItems);
  const queueHrefs = new Map(
    queueItems.map((queueItem) => [
      queueKey(queueItem.targetType, queueItem.targetId),
      bindingHref(queueItem, watchProductIds),
    ]),
  );
  const serviceRequestWorkspaceLinks =
    await resolveTechnicalIssueServiceRequestWorkspaceLinks(db, {
      taskId: item.taskId,
      queueItems,
    });

  const result = {
    ...item,
    ownerUser: item.User,
    sharedUserIds,
    sharingScopeUserIds: {
      workspace: workspaceSharedUserIds,
      coreFlow: coreFlowSharedUserIds,
      space: spaceSharedUserIds,
      system: defaultAdminShareUserIds,
    },
    sharedUsers,
    activities,
    queueItems: queueItems.map((queueItem) => ({
      ...queueItem,
      href:
        serviceRequestWorkspaceLinks.get(queueItem.targetId)?.technicalIssueWorkspaceHref ??
        queueHrefs.get(queueKey(queueItem.targetType, queueItem.targetId)) ??
        null,
      serviceRequestId:
        serviceRequestWorkspaceLinks.get(queueItem.targetId)?.serviceRequestId ??
        queueItem.serviceRequestId ??
        null,
      serviceRequestWorkspaceHref:
        serviceRequestWorkspaceLinks.get(queueItem.targetId)?.serviceRequestWorkspaceHref ??
        queueItem.serviceRequestWorkspaceHref ??
        null,
    })),
    businessBindings: queueItems.map((queueItem) => ({
      id: queueItem.id,
      targetType: queueItem.targetType,
      targetId: queueItem.targetId,
      taskItemId: queueItem.taskItemId,
      actionType: queueItem.status,
      href: queueHrefs.get(queueKey(queueItem.targetType, queueItem.targetId)) ?? null,
      createdAt: queueItem.updatedAt,
      updatedAt: queueItem.updatedAt,
      preview: {
        title: queueItem.preview.title ||
          fallbackQueueTitle(queueItem.targetType),
        ref: queueItem.preview.ref || queueItem.targetType,
        subtitle: null,
        status: queueItem.preview.status || queueItem.status,
        imageUrl: queueItem.preview.imageUrl ?? null,
        imageUrls: queueItem.preview.imageUrls ?? [],
      },
      stats: {
        lastActivityTitle: queueItem.latestActivityTitle,
        lastActivityAt: queueItem.updatedAt,
        feedbackCount: queueItem.feedbackCount,
        discussionCount: queueItem.discussionCount,
      },
      processingLabel: queueItem.status,
    })),
  };
  perfLog("task-item-detail-repo", "total", totalStartedAt);
  return result;
}
