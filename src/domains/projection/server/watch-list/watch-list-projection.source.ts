import { ImageRole, Prisma, TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";
import type {
  WatchListProjectionMediaState,
  WatchListProjectionServiceState,
  WatchListProjectionSourceRow,
} from "./watch-list-projection.types";

const WATCH_LIST_SOURCE_SELECT = {
  id: true,
  productId: true,
  saleStage: true,
  serviceStage: true,
  serviceExpectedWorkingDays: true,
  serviceExpectedCompletionAt: true,
  stockStage: true,
  audienceSegment: true,
  mediaPipelineKey: true,
  conditionGrade: true,
  specStatus: true,
  isContentDownloaded: true,
  isImageDownloaded: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      title: true,
      sku: true,
      slug: true,
      primaryImageUrl: true,
      storefrontImageKey: true,
      brandId: true,
      vendorId: true,
      brand: { select: { id: true, name: true } },
      vendor: { select: { id: true, name: true } },
      postTargets: {
        orderBy: { createdAt: "asc" },
        select: {
          createdAt: true,
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
      productImage: {
        where: { role: { in: [ImageRole.INLINE, ImageRole.GALLERY] } },
        select: {
          id: true,
          role: true,
          fileKey: true,
          sortOrder: true,
          createdAt: true,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 4,
      },
    },
  },
  watchSpecV2: {
    select: {
      id: true,
      brand: true,
      model: true,
      referenceNumber: true,
    },
  },
  watchPrice: {
    select: {
      salePrice: true,
      listPrice: true,
      costPrice: true,
      minPrice: true,
    },
  },
  watchContent: {
    select: {
      id: true,
      titleOverride: true,
      hookText: true,
      body: true,
      summary: true,
      bulletSpecs: true,
    },
  },
  reviewStates: {
    select: {
      id: true,
      targetType: true,
      status: true,
      reviewedAt: true,
      reviewedById: true,
      submittedAt: true,
      submittedById: true,
    },
  },
} satisfies Prisma.WatchSelect;

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function workTypeKeyFromNote(note: unknown): WatchListProjectionMediaState["workTypeKey"] | null {
  const text = clean(note).toLowerCase();
  if (/worktypekey:\s*photoshoot/.test(text)) return "photoshoot";
  if (/worktypekey:\s*media-processing/.test(text)) return "media-processing";
  if (/worktypekey:\s*publish/.test(text)) return "publish";
  return null;
}

async function loadMediaStatesByWatchId(
  db: DB,
  watchIds: string[],
): Promise<Map<string, WatchListProjectionMediaState[]>> {
  if (!watchIds.length) return new Map();

  const bindings = await dbOrTx(db).taskExecution.findMany({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: { in: watchIds },
      taskItemId: { not: null },
    },
    select: {
      targetId: true,
      metadataJson: true,
      createdAt: true,
      taskItem: {
        select: {
          id: true,
          note: true,
          status: true,
          updatedAt: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const byWatchId = new Map<string, WatchListProjectionMediaState[]>();

  for (const binding of bindings) {
    const workTypeKey = workTypeKeyFromNote(binding.taskItem?.note);
    if (!workTypeKey) continue;

    const runtime = getQueueItemWorkflowState(binding);
    const item: WatchListProjectionMediaState = {
      watchId: binding.targetId,
      workTypeKey,
      workflowKey: runtime?.workflowKey ?? null,
      workflowState: runtime?.currentState ?? null,
      taskStatus: clean(binding.taskItem?.status) || null,
      taskItemId: binding.taskItem?.id ?? null,
      workspaceHref: binding.taskItem?.id ? `/admin/task-items/${binding.taskItem.id}` : null,
      updatedAt:
        runtime?.updatedAt ??
        binding.taskItem?.updatedAt?.toISOString() ??
        binding.createdAt.toISOString(),
    };

    byWatchId.set(binding.targetId, [
      ...(byWatchId.get(binding.targetId) ?? []),
      item,
    ]);
  }

  return byWatchId;
}

function serviceStatusFromRequest(input: {
  serviceRequestStatus?: unknown;
  technicalIssueStatuses?: unknown[] | null;
}): Pick<WatchListProjectionServiceState, "status" | "statusLabel" | "technicalIssueStatus"> {
  const serviceRequestStatus = clean(input.serviceRequestStatus).toUpperCase();
  const issueStatuses = (input.technicalIssueStatuses ?? [])
    .map((item) => clean(item).toUpperCase())
    .filter(Boolean);
  const hasIssue = (status: string) => issueStatuses.includes(status);
  const activeIssue = issueStatuses.find((status) =>
    ["IN_PROGRESS", "CONFIRMED", "OPEN"].includes(status),
  ) ?? null;

  if (serviceRequestStatus === "CANCELED") {
    return {
      status: "NOT_REQUIRED",
      statusLabel: "Không cần service",
      technicalIssueStatus: activeIssue,
    };
  }

  if (hasIssue("IN_PROGRESS") || serviceRequestStatus === "IN_PROGRESS") {
    return {
      status: "IN_SERVICE",
      statusLabel: "Đang service",
      technicalIssueStatus: "IN_PROGRESS",
    };
  }

  if (["COMPLETED", "DELIVERED"].includes(serviceRequestStatus)) {
    return {
      status: "DONE",
      statusLabel: "Đã xong",
      technicalIssueStatus: issueStatuses.find((status) => status === "DONE") ?? null,
    };
  }

  if (hasIssue("OPEN") || hasIssue("CONFIRMED") || serviceRequestStatus) {
    return {
      status: "WAITING",
      statusLabel: "Chờ service",
      technicalIssueStatus: activeIssue,
    };
  }

  return {
    status: "NOT_REQUIRED",
    statusLabel: "Không cần service",
    technicalIssueStatus: null,
  };
}

async function loadServiceStatesByWatchId(
  db: DB,
  rows: Array<{ id: string; productId: string }>,
): Promise<Map<string, WatchListProjectionServiceState>> {
  const productIdToWatchId = new Map(
    rows
      .map((row) => [clean(row.productId), clean(row.id)] as const)
      .filter(([productId, watchId]) => Boolean(productId && watchId)),
  );
  const productIds = [...productIdToWatchId.keys()];
  if (!productIds.length) return new Map();

  const serviceRequests = await dbOrTx(db).serviceRequest.findMany({
    where: { productId: { in: productIds } },
    select: {
      id: true,
      productId: true,
      status: true,
      updatedAt: true,
      technicalIssue: {
        select: {
          executionStatus: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  const serviceRequestIds = serviceRequests.map((row) => row.id);
  const bindings = serviceRequestIds.length
    ? await dbOrTx(db).taskExecution.findMany({
      where: {
        targetType: TaskExecutionTargetType.SERVICE_REQUEST,
        targetId: { in: serviceRequestIds },
        actionType: { not: TaskExecutionActionType.CANCELLED },
        taskItemId: { not: null },
      },
      select: {
        targetId: true,
        taskItemId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
    : [];
  const workspaceByServiceRequestId = new Map<string, string>();
  for (const binding of bindings) {
    if (!workspaceByServiceRequestId.has(binding.targetId) && binding.taskItemId) {
      workspaceByServiceRequestId.set(binding.targetId, binding.taskItemId);
    }
  }

  const byWatchId = new Map<string, WatchListProjectionServiceState>();
  for (const request of serviceRequests) {
    const watchId = productIdToWatchId.get(clean(request.productId));
    if (!watchId || byWatchId.has(watchId)) continue;

    const status = serviceStatusFromRequest({
      serviceRequestStatus: request.status,
      technicalIssueStatuses: request.technicalIssue.map((issue) => issue.executionStatus),
    });
    if (status.status === "NOT_REQUIRED" && clean(request.status).toUpperCase() === "CANCELED") {
      continue;
    }

    const taskItemId = workspaceByServiceRequestId.get(request.id) ?? null;
    byWatchId.set(watchId, {
      watchId,
      serviceRequestId: request.id,
      status: status.status,
      statusLabel: status.statusLabel,
      serviceRequestStatus: clean(request.status) || null,
      technicalIssueStatus: status.technicalIssueStatus,
      taskItemId,
      workspaceHref: taskItemId ? `/admin/task-items/${taskItemId}` : null,
      updatedAt: request.updatedAt.toISOString(),
    });
  }

  return byWatchId;
}

export async function loadWatchListProjectionSourceRows(
  db: DB,
  input: {
    watchIds?: string[] | null;
    productIds?: string[] | null;
    limit?: number | null;
    offset?: number | null;
  } = {},
): Promise<WatchListProjectionSourceRow[]> {
  const client = dbOrTx(db);
  const watchIds = Array.from(new Set((input.watchIds ?? []).map(clean).filter(Boolean)));
  const productIds = Array.from(new Set((input.productIds ?? []).map(clean).filter(Boolean)));
  const limit = Math.min(1000, Math.max(1, Number(input.limit || 500)));
  const offset = Math.max(0, Number(input.offset || 0));

  const where: Prisma.WatchWhereInput = {
    ...(watchIds.length ? { id: { in: watchIds } } : {}),
    ...(productIds.length ? { productId: { in: productIds } } : {}),
  };

  const rows = await client.watch.findMany({
    where,
    select: WATCH_LIST_SOURCE_SELECT,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: offset,
    take: limit,
  });

  const mediaStatesByWatchId = await loadMediaStatesByWatchId(
    db,
    rows.map((row) => row.id),
  );
  const serviceStatesByWatchId = await loadServiceStatesByWatchId(
    db,
    rows.map((row) => ({ id: row.id, productId: row.productId })),
  );

  return rows.map((row) => ({
    ...row,
    __mediaState: mediaStatesByWatchId.get(row.id) ?? [],
    __serviceState: serviceStatesByWatchId.get(row.id) ?? null,
  })) as WatchListProjectionSourceRow[];
}

export async function resolveWatchIdsForProjectionTarget(
  db: DB,
  input: {
    targetType?: string | null;
    targetId?: string | null;
  },
) {
  const targetType = clean(input.targetType).toUpperCase();
  const targetId = clean(input.targetId);
  if (!targetId) return [];

  if (targetType === "WATCH") return [targetId];

  if (targetType === "PRODUCT") {
    const row = await dbOrTx(db).watch.findUnique({
      where: { productId: targetId },
      select: { id: true },
    });
    return row?.id ? [row.id] : [];
  }

  if (targetType === "SERVICE_REQUEST") {
    return resolveWatchIdsForServiceRequest(db, targetId);
  }

  if (targetType === "TECHNICAL_ISSUE") {
    const issue = await dbOrTx(db).technicalIssue.findUnique({
      where: { id: targetId },
      select: { serviceRequestId: true },
    });
    return resolveWatchIdsForServiceRequest(db, issue?.serviceRequestId);
  }

  if (targetType === "PAYMENT") {
    const payment = await dbOrTx(db).payment.findUnique({
      where: { id: targetId },
      select: {
        service_request_id: true,
        technical_issue_id: true,
      },
    });

    if (payment?.service_request_id) {
      return resolveWatchIdsForServiceRequest(db, payment.service_request_id);
    }

    if (payment?.technical_issue_id) {
      const issue = await dbOrTx(db).technicalIssue.findUnique({
        where: { id: payment.technical_issue_id },
        select: { serviceRequestId: true },
      });
      return resolveWatchIdsForServiceRequest(db, issue?.serviceRequestId);
    }
  }

  return [];
}

async function resolveWatchIdsForServiceRequest(
  db: DB,
  serviceRequestId?: string | null,
) {
  const id = clean(serviceRequestId);
  if (!id) return [];

  const serviceRequest = await dbOrTx(db).serviceRequest.findUnique({
    where: { id },
    select: { productId: true },
  });
  const productId = clean(serviceRequest?.productId);
  if (!productId) return [];

  const watch = await dbOrTx(db).watch.findUnique({
    where: { productId },
    select: { id: true },
  });

  return watch?.id ? [watch.id] : [];
}
