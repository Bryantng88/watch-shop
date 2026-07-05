import { prisma } from "@/server/db/client";
import type { SaveWatchContentInput } from "../shared";
import {
  getWatchContentRepo,
  getWatchContentReviewTargetRepo,
  saveWatchContentRepo,
  syncWatchContentSnapshotRepo,
  updateWatchContentStatusRepo,
} from "./watch-content.repo";
import { emitWatchContentModifiedEvent } from "@/domains/watch/server/events";

type MeaningfulWatchContent = {
  titleOverride?: unknown;
  hookText?: unknown;
  body?: unknown;
  summary?: unknown;
  hashtags?: unknown;
  bulletSpecs?: unknown;
};

async function safeEmitWatchContentUpdatedEvent(input: {
  productId: string;
  userId?: string | null;
}) {
  try {
    const target = await getReviewTargetOrThrow(input.productId);

    await emitWatchContentModifiedEvent(prisma, {
      watch: target,
      actorUserId: input.userId ?? null,
    });
  } catch (error) {
    console.error("WORKFLOW_EMIT_WATCH_CONTENT_UPDATED_FAILED", {
      productId: input.productId,
      error,
    });
  }
}
function hasMeaningfulContent(content: MeaningfulWatchContent | null | undefined) {
  const bulletSpecs = Array.isArray(content?.bulletSpecs) ? content.bulletSpecs : [];

  return Boolean(
    String(content?.titleOverride ?? "").trim() ||
    String(content?.hookText ?? "").trim() ||
    String(content?.body ?? "").trim() ||
    String(content?.summary ?? "").trim() ||
    String(content?.hashtags ?? "").trim() ||
    bulletSpecs.some((item) => String(item ?? "").trim())
  );
}

async function getReviewTargetOrThrow(productId: string) {
  const target = await getWatchContentReviewTargetRepo(prisma, productId);
  if (!target) throw new Error("Không tìm thấy watch");
  return target;
}

export async function getWatchContent(productId: string) {
  return getWatchContentRepo(prisma, productId);
}

export async function saveWatchContent(
  productId: string,
  input: Omit<SaveWatchContentInput, "productId"> & {
    userId?: string | null;
  },
) {
  const content = await saveWatchContentRepo(prisma, productId, {
    productId,
    ...input,
  });

  await safeEmitWatchContentUpdatedEvent({
    productId,
    userId: input.userId ?? null,
  });

  return content;
}

export async function syncWatchContentSnapshot(productId: string) {
  return syncWatchContentSnapshotRepo(prisma, productId);
}

export async function submitWatchContentForReview(input: {
  productId: string;
  userId?: string | null;
}) {
  const target = await getReviewTargetOrThrow(input.productId);
  const currentStatus = target.watchContent?.contentStatus ?? "DRAFT";

  if (!["DRAFT", "REJECTED"].includes(currentStatus)) {
    throw new Error("Chỉ content Draft hoặc Trả về mới được gửi duyệt.");
  }

  if (!hasMeaningfulContent(target.watchContent)) {
    throw new Error("Chưa có nội dung để gửi duyệt.");
  }

  return updateWatchContentStatusRepo(prisma, {
    productId: input.productId,
    status: "SUBMITTED",
    userId: input.userId ?? null,
    reviewNote: null,
  });
}

export async function approveWatchContent(input: {
  productId: string;
  userId?: string | null;
}) {
  const target = await getReviewTargetOrThrow(input.productId);
  const currentStatus = target.watchContent?.contentStatus ?? "DRAFT";

  if (currentStatus !== "SUBMITTED") {
    throw new Error("Chỉ content đã gửi duyệt mới được duyệt.");
  }

  return updateWatchContentStatusRepo(prisma, {
    productId: input.productId,
    status: "APPROVED",
    userId: input.userId ?? null,
    reviewNote: null,
  });
}

export async function rejectWatchContent(input: {
  productId: string;
  userId?: string | null;
  note?: string | null;
}) {
  const target = await getReviewTargetOrThrow(input.productId);
  const currentStatus = target.watchContent?.contentStatus ?? "DRAFT";

  if (currentStatus !== "SUBMITTED") {
    throw new Error("Chỉ content đã gửi duyệt mới được trả về.");
  }

  return updateWatchContentStatusRepo(prisma, {
    productId: input.productId,
    status: "REJECTED",
    userId: input.userId ?? null,
    reviewNote: input.note ?? null,
  });
}

export async function autoApproveWatchContent(input: {
  productId: string;
  userId?: string | null;
}) {
  const target = await getReviewTargetOrThrow(input.productId);

  if (!hasMeaningfulContent(target.watchContent)) {
    return target.watchContent;
  }

  return updateWatchContentStatusRepo(prisma, {
    productId: input.productId,
    status: "APPROVED",
    userId: input.userId ?? null,
    reviewNote: null,
  });
}

export async function publishWatchContent(input: {
  productId: string;
  userId?: string | null;
}) {
  return updateWatchContentStatusRepo(prisma, {
    productId: input.productId,
    status: "PUBLISHED",
    userId: input.userId ?? null,
  });
}
