import { ImageRole, Prisma, TaskExecutionActionType, TaskExecutionTargetType } from "@prisma/client";
import { dbOrTx, type DB } from "@/server/db/client";
import { getQueueItemWorkflowState } from "@/domains/task/server/business-binding-workflow.service";
import { watchActivityLabel } from "@/domains/watch/shared/watch-activity";
import type {
  WatchListProjectionLastAction,
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
      publishedAt: true,
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

export function mediaWorkTypeKey(
  value: unknown,
): WatchListProjectionMediaState["workTypeKey"] | null {
  const normalized = clean(value).toLowerCase();
  if (["photography", "photoshoot", "photo-shoot", "shooting"].includes(normalized)) {
    return "photography";
  }
  if (normalized === "media-processing") return "media-processing";
  if (normalized === "publish") return "publish";
  return null;
}

function noteField(note: unknown, key: string) {
  const match = clean(note).match(new RegExp(`^${key}:\\s*(.+)$`, "im"));
  return clean(match?.[1]) || null;
}

function recordText(value: unknown, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return clean((value as Record<string, unknown>)[key]) || null;
}

function bindingMediaWorkTypeKey(binding: {
  metadataJson: unknown;
  taskItem: { note: string | null } | null;
}) {
  const metadataWorkType = mediaWorkTypeKey(recordText(binding.metadataJson, "workTypeKey"));
  if (metadataWorkType) return metadataWorkType;

  const noteWorkType = mediaWorkTypeKey(noteField(binding.taskItem?.note, "workTypeKey"));
  if (noteWorkType) return noteWorkType;

  const workflowKey =
    recordText(binding.metadataJson, "workflowKey") ??
    noteField(binding.taskItem?.note, "workflowKey");
  if (workflowKey === "watch-photography") return "photography";
  if (workflowKey === "watch-media-processing") return "media-processing";
  if (workflowKey === "watch-publish") return "publish";
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
    const workTypeKey = bindingMediaWorkTypeKey(binding);
    if (!workTypeKey) continue;

    const runtime = getQueueItemWorkflowState(binding);
    const item: WatchListProjectionMediaState = {
      watchId: binding.targetId,
      workTypeKey,
      workflowKey: runtime?.workflowKey ?? null,
      workflowState: runtime?.currentState ?? null,
      taskStatus: clean(binding.taskItem?.status) || null,
      taskItemId: binding.taskItem?.id ?? null,
      workspaceHref: binding.taskItem?.id ? "/admin/coordination/media" : null,
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

function metadataText(value: unknown, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const text = clean((value as Record<string, unknown>)[key]);
  return text || null;
}

async function loadLastActionsByWatchId(
  db: DB,
  watchIds: string[],
): Promise<Map<string, WatchListProjectionLastAction>> {
  if (!watchIds.length) return new Map();

  const events = await dbOrTx(db).businessEventLog.findMany({
    where: {
      targetType: "WATCH",
      targetId: { in: watchIds },
      eventKey: { startsWith: "watch." },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      eventKey: true,
      targetId: true,
      actorUserId: true,
      metadataJson: true,
      createdAt: true,
    },
  });
  const latestByWatchId = new Map<string, (typeof events)[number]>();
  for (const event of events) {
    if (!latestByWatchId.has(event.targetId)) latestByWatchId.set(event.targetId, event);
  }

  const actorIds = [...new Set(
    [...latestByWatchId.values()].map((event) => event.actorUserId).filter(Boolean),
  )] as string[];
  const actors = actorIds.length
    ? await dbOrTx(db).user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, name: true, email: true, avatarUrl: true },
    })
    : [];
  const actorById = new Map(
    actors.map((actor) => [actor.id, clean(actor.name) || clean(actor.email) || "Người dùng"]),
  );
  const actorAvatarById = new Map(
    actors.map((actor) => [actor.id, clean(actor.avatarUrl) || null]),
  );

  return new Map(
    [...latestByWatchId.entries()].map(([watchId, event]) => [
      watchId,
      {
        eventKey: event.eventKey,
        label: watchActivityLabel(event.eventKey),
        note: metadataText(event.metadataJson, "intakeNote"),
        actorUserId: event.actorUserId,
        actorLabel: event.actorUserId ? actorById.get(event.actorUserId) ?? null : "Hệ thống",
        actorAvatarUrl: event.actorUserId
          ? actorAvatarById.get(event.actorUserId) ?? null
          : null,
        at: event.createdAt.toISOString(),
      },
    ]),
  );
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
      workspaceHref: taskItemId ? "/admin/coordination/media" : null,
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
    duplicateConfirmedAt: null,
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

  const [mediaStatesByWatchId, serviceStatesByWatchId, lastActionsByWatchId] = await Promise.all([
    loadMediaStatesByWatchId(
      db,
      rows.map((row) => row.id),
    ),
    loadServiceStatesByWatchId(
      db,
      rows.map((row) => ({ id: row.id, productId: row.productId })),
    ),
    loadLastActionsByWatchId(db, rows.map((row) => row.id)),
  ]);

  return rows.map((row) => ({
    ...row,
    __mediaState: mediaStatesByWatchId.get(row.id) ?? [],
    __serviceState: serviceStatesByWatchId.get(row.id) ?? null,
    __lastAction: lastActionsByWatchId.get(row.id) ?? null,
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
        order_id: true,
        service_request_id: true,
        technical_issue_id: true,
      },
    });

    if (payment?.order_id) {
      return resolveWatchIdsForOrder(db, payment.order_id);
    }

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

  if (targetType === "ORDER") {
    return resolveWatchIdsForOrder(db, targetId);
  }

  if (targetType === "SHIPMENT") {
    const shipment = await dbOrTx(db).shipment.findUnique({
      where: { id: targetId },
      select: { orderId: true },
    });
    return resolveWatchIdsForOrder(db, shipment?.orderId);
  }

  return [];
}

async function resolveWatchIdsForOrder(db: DB, orderId?: string | null) {
  const id = clean(orderId);
  if (!id) return [];
  const rows = await dbOrTx(db).orderItem.findMany({
    where: { orderId: id, productId: { not: null } },
    select: { product: { select: { watch: { select: { id: true } } } } },
  });
  return Array.from(new Set(rows.map((row) => row.product?.watch?.id).filter(Boolean))) as string[];
}

async function resolveWatchIdsForServiceRequest(
  db: DB,
  serviceRequestId?: string | null,
) {
  const id = clean(serviceRequestId);
  if (!id) return [];

  const serviceRequest = await dbOrTx(db).serviceRequest.findUnique({
    where: { id },
    select: {
      product: {
        select: {
          watch: { select: { id: true } },
        },
      },
    },
  });
  const watchId = clean(serviceRequest?.product?.watch?.id);
  return watchId ? [watchId] : [];
}
