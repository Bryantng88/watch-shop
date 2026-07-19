import { prisma } from "@/server/db/client";
import { perfStep } from "@/lib/server-perf";
import {
  TaskExecutionActionType,
  TaskExecutionTargetType,
  TaskStatus,
} from "@prisma/client";
import type { WatchServiceProjection } from "../../shared/watch-detail.projection";
import { mapWatchDetail } from "../shared";
import { listWatchChosenMediaPool } from "@/domains/media/server";
import {
  getLatestBusinessFeedbackByTargets,
  getWatchReviewFeedbackTargetType,
} from "@/domains/shared/business-feedback/server";
import {
  getAdminEditWatchDetail,
  getAdminWatchMediaEditDetail,
  getAdminWatchDetail,
  getAdminWatchRow,
  getLatestWatchVariantForAdmin,
  getOpenServiceWatches,
  getWatchServiceHistory,
  getWatchServiceProjectionSource,
  getWatchTradeHistory,
} from "./watch-detail.repo";

type ReviewFeedbackTarget = "CONTENT" | "IMAGE";

async function getLatestAcquisitionUnitCost(
  productId: string,
) {
  const item = await prisma.acquisitionItem.findFirst({
    where: {
      productId,
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      unitCost: true,
      acquisitionId: true,
      id: true,
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    acquisitionId: item.acquisitionId,
    unitCost: item.unitCost?.toString() ?? null,
  };
}

async function getActiveMediaWorkspaceItem(productId?: string | null) {
  if (!productId) {
    return {
      hasActiveItem: false,
      bindingId: null,
    };
  }

  const watch = await prisma.watch.findUnique({
    where: { productId },
    select: { id: true },
  });
  if (!watch) {
    return {
      hasActiveItem: false,
      bindingId: null,
    };
  }

  const binding = await prisma.taskExecution.findFirst({
    where: {
      targetType: TaskExecutionTargetType.WATCH,
      targetId: watch.id,
      taskItem: {
        status: { notIn: [TaskStatus.DONE, TaskStatus.CANCELLED] },
        note: {
          contains: "workTypeKey: media-processing",
          mode: "insensitive",
        },
      },
    },
    select: {
      id: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    hasActiveItem: Boolean(binding),
    bindingId: binding?.id ?? null,
  };
}

function normalizeReviewFeedbackTarget(
  value?: string | null,
): ReviewFeedbackTarget | null {
  const targetType = String(value ?? "").toUpperCase();
  return targetType === "CONTENT" || targetType === "IMAGE" ? targetType : null;
}

function feedbackKey(targetType: ReviewFeedbackTarget, productId: string) {
  return `${getWatchReviewFeedbackTargetType(targetType)}:${productId}`;
}

async function withComposedReviewNotes<
  T extends {
    productId?: string | null;
    reviewStates?: Array<{
      targetType?: string | null;
      status?: string | null;
      reviewNote?: string | null;
    }> | null;
  },
>(
  row: T,
) {
  if (!row?.productId) return row;

  const productId = row.productId;

  const feedbacks = await getLatestBusinessFeedbackByTargets([
    {
      targetType: getWatchReviewFeedbackTargetType("CONTENT"),
      targetId: productId,
    },
    {
      targetType: getWatchReviewFeedbackTargetType("IMAGE"),
      targetId: productId,
    },
  ]);

  const nextReviewStates = (row.reviewStates ?? []).map((state) => {
    const targetType = normalizeReviewFeedbackTarget(state.targetType);
    const status = String(state.status ?? "DRAFT").toUpperCase();

    if (!targetType) return state;
    if (status !== "REJECTED") return state;

    const feedback = feedbacks.get(feedbackKey(targetType, productId));

    return {
      ...state,
      reviewNote: feedback?.message ?? state.reviewNote ?? null,
    };
  });

  return {
    ...row,
    reviewStates: nextReviewStates,
  };
}

export async function getWatchDetail(productId: string) {
  const row = await getAdminWatchDetail(prisma, productId);

  if (!row) {
    throw new Error("Không tìm thấy watch");
  }

  return mapWatchDetail(await withComposedReviewNotes(row));
}

export async function getWatchEditDetail(productId: string) {
  const acquisitionCostPromise = perfStep(
    "watch-edit-detail",
    "acquisitionCost",
    () => getLatestAcquisitionUnitCost(productId),
  );
  const mediaPoolPromise = perfStep("watch-edit-detail", "mediaPool", () =>
    listWatchChosenMediaPool({ productId }),
  );
  const mediaWorkspacePromise = perfStep(
    "watch-edit-detail",
    "activeMediaWorkspaceItem",
    () => getActiveMediaWorkspaceItem(productId),
  );
  const row = await perfStep("watch-edit-detail", "watchRow", () =>
    getAdminEditWatchDetail(prisma, productId),
  );

  if (!row) {
    throw new Error("Không tìm thấy watch để edit");
  }

  const [rowWithReviewNotes, acq, poolImages, mediaWorkspace] = await Promise.all([
    perfStep("watch-edit-detail", "reviewNotes", () =>
      withComposedReviewNotes(row),
    ),
    acquisitionCostPromise,
    mediaPoolPromise,
    mediaWorkspacePromise,
  ]);
  const mapped = mapWatchDetail(rowWithReviewNotes);
  const mappedMedia = (mapped as { media?: Record<string, unknown> }).media ?? {};

  return {
    ...mapped,
    taskSummary: row.taskSummary ?? {
      watchImage: 0,
      watchContent: 0,
      watchReview: 0,
    },
    media: {
      ...mappedMedia,
      poolImages,
    },
    mediaWorkspace,
    acquisition: acq,
    price: {
      ...(mapped.price ?? {}),
      costPrice: mapped.price?.costPrice ?? acq?.unitCost ?? null,
    },
  };
}

export async function getWatchMediaEditDetail(productId: string) {
  const row = await perfStep("watch-media-edit-detail", "watchRow", () =>
    getAdminWatchMediaEditDetail(prisma, productId),
  );

  if (!row) {
    throw new Error("KhÃ´ng tÃ¬m tháº¥y watch Ä‘á»ƒ edit media");
  }

  const poolImages = await perfStep("watch-media-edit-detail", "mediaPool", () =>
    listWatchChosenMediaPool({
      productId,
      acquisitionId: row.acquisitionId,
    }),
  );
  const mapped = mapWatchDetail({
    ...row,
    stockState: row.stockStage,
    saleState: row.saleStage,
    serviceState: row.serviceStage,
  });
  const mappedMedia = (mapped as { media?: Record<string, unknown> }).media ?? {};

  return {
    ...mapped,
    taskSummary: {
      watchImage: 0,
      watchContent: 0,
      watchReview: 0,
    },
    media: {
      ...mappedMedia,
      poolImages,
    },
  };
}

export async function getWatchRow(productId: string) {
  return getAdminWatchRow(prisma, productId);
}

export async function getWatchTradeHistoryDetail(productId: string) {
  return getWatchTradeHistory(prisma, productId);
}

export async function getWatchServiceHistoryDetail(productId: string) {
  return getWatchServiceHistory(prisma, productId);
}

export async function getWatchServiceProjectionDetail(
  productId: string,
): Promise<WatchServiceProjection> {
  const rows = await getWatchServiceProjectionSource(prisma, productId);
  const serviceRequestIds = rows.map((row) => row.id);
  const bindings = serviceRequestIds.length
    ? await prisma.taskExecution.findMany({
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
  const bindingByServiceRequestId = new Map<string, string>();

  for (const binding of bindings) {
    if (!binding.targetId || !binding.taskItemId) continue;
    if (!bindingByServiceRequestId.has(binding.targetId)) {
      bindingByServiceRequestId.set(binding.targetId, binding.taskItemId);
    }
  }

  const terminalRequestStatuses = new Set(["COMPLETED", "DELIVERED", "CANCELED"]);
  const terminalIssueStatuses = new Set(["DONE", "CANCELED"]);
  const requests = rows.map((row) => {
    const workspaceTaskItemId = bindingByServiceRequestId.get(row.id) ?? null;
    const issues = row.technicalIssue.map((issue) => ({
      id: issue.id,
      summary: issue.summary ?? issue.note ?? "Technical issue",
      status: String(issue.executionStatus),
      isConfirmed: issue.isConfirmed,
      updatedAt: issue.updatedAt.toISOString(),
    }));

    return {
      id: row.id,
      refNo: row.refNo ?? row.id.slice(0, 8),
      status: String(row.status),
      note: row.notes ?? null,
      vendorName: row.vendor?.name ?? null,
      issueCount: issues.length,
      activeIssueCount: issues.filter((issue) => !terminalIssueStatuses.has(issue.status)).length,
      workspaceTaskItemId,
      workspaceHref: workspaceTaskItemId ? `/admin/task-items/${workspaceTaskItemId}` : null,
      updatedAt: row.updatedAt.toISOString(),
      issues,
    };
  });

  return {
    requestCount: requests.length,
    activeRequestCount: requests.filter(
      (request) => !terminalRequestStatuses.has(request.status),
    ).length,
    issueCount: requests.reduce((total, request) => total + request.issueCount, 0),
    activeIssueCount: requests.reduce(
      (total, request) => total + request.activeIssueCount,
      0,
    ),
    requests,
  };
}

export async function getLatestWatchVariant(productId: string) {
  return getLatestWatchVariantForAdmin(prisma, productId);
}

export async function getOpenServiceWatchList() {
  return getOpenServiceWatches(prisma);
}
