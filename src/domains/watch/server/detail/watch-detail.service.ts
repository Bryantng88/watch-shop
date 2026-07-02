import { prisma } from "@/server/db/client";
import { perfStep } from "@/lib/server-perf";
import { mapWatchDetail } from "../shared";
import { listWatchChosenMediaPool } from "@/domains/media/server";
import {
  getLatestBusinessFeedbackByTargets,
  getWatchReviewFeedbackTargetType,
} from "@/domains/shared/business-feedback/server";
import {
  getAdminEditWatchDetail,
  getAdminWatchDetail,
  getAdminWatchRow,
  getLatestWatchVariantForAdmin,
  getOpenServiceWatches,
  getWatchServiceHistory,
  getWatchTradeHistory,
} from "./watch-detail.repo";

type ReviewFeedbackTarget = "CONTENT" | "IMAGE";

async function getLatestAcquisitionUnitCost(
  productId: string,
  acquisitionId?: string | null
) {
  const item = await prisma.acquisitionItem.findFirst({
    where: {
      OR: [
        { productId },
        ...(acquisitionId ? [{ acquisitionId }] : []),
      ],
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
  const row = await perfStep("watch-edit-detail", "watchRow", () =>
    getAdminEditWatchDetail(prisma, productId),
  );

  if (!row) {
    throw new Error("Không tìm thấy watch để edit");
  }

  const [rowWithReviewNotes, acq, poolImages] = await Promise.all([
    perfStep("watch-edit-detail", "reviewNotes", () =>
      withComposedReviewNotes(row),
    ),
    perfStep("watch-edit-detail", "acquisitionCost", () =>
      getLatestAcquisitionUnitCost(productId, row.acquisitionId),
    ),
    perfStep("watch-edit-detail", "mediaPool", () =>
      listWatchChosenMediaPool({
        productId,
        acquisitionId: row.acquisitionId,
      }),
    ),
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
    acquisition: acq,
    price: {
      ...(mapped.price ?? {}),
      costPrice: mapped.price?.costPrice ?? acq?.unitCost ?? null,
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

export async function getLatestWatchVariant(productId: string) {
  return getLatestWatchVariantForAdmin(prisma, productId);
}

export async function getOpenServiceWatchList() {
  return getOpenServiceWatches(prisma);
}
