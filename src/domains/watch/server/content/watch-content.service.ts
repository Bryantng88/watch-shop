import { prisma } from "@/server/db/client";
import type { SaveWatchContentInput } from "../shared";
import {
  getWatchContentRepo,
  getWatchContentReviewTargetRepo,
  saveWatchContentRepo,
  syncWatchContentSnapshotRepo,
  updateWatchContentStatusRepo,
  type WatchContentReviewAction,
} from "./watch-content.repo";

function hasMeaningfulContent(content: any) {
  return Boolean(
    String(content?.titleOverride ?? "").trim() ||
    String(content?.hookText ?? "").trim() ||
    String(content?.body ?? "").trim() ||
    String(content?.summary ?? "").trim() ||
    (Array.isArray(content?.bulletSpecs) &&
      content.bulletSpecs.some((x: any) => String(x ?? "").trim()))
  );
}

async function getReviewTargetOrThrow(productId: string) {
  const target = await getWatchContentReviewTargetRepo(
    prisma as any,
    productId
  );

  if (!target) throw new Error("Không tìm thấy watch");

  return target;
}

export async function getWatchContent(productId: string) {
  return getWatchContentRepo(prisma as any, productId);
}

export async function saveWatchContent(
  productId: string,
  input: Omit<SaveWatchContentInput, "productId">
) {
  return saveWatchContentRepo(prisma as any, productId, {
    productId,
    ...input,
  });
}

export async function syncWatchContentSnapshot(productId: string) {
  return syncWatchContentSnapshotRepo(prisma as any, productId);
}

export async function submitWatchContentForReview(input: {
  productId: string;
  userId?: string | null;
}) {
  const target = await getReviewTargetOrThrow(input.productId);

  if (!hasMeaningfulContent(target.watchContent)) {
    throw new Error("Chưa có nội dung để gửi duyệt.");
  }

  return updateWatchContentStatusRepo(prisma as any, {
    productId: input.productId,
    status: "SUBMITTED",
    userId: input.userId ?? null,
  });
}

export async function approveWatchContent(input: {
  productId: string;
  userId?: string | null;
}) {
  await getReviewTargetOrThrow(input.productId);

  return updateWatchContentStatusRepo(prisma as any, {
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
  await getReviewTargetOrThrow(input.productId);

  return updateWatchContentStatusRepo(prisma as any, {
    productId: input.productId,
    status: "REJECTED",
    userId: input.userId ?? null,
    reviewNote: input.note ?? null,
  });
}

export async function markWatchContentPublished(input: {
  productId: string;
  userId?: string | null;
}) {
  const target = await getReviewTargetOrThrow(input.productId);
  const currentStatus = target.watchContent?.contentStatus;

  if (currentStatus !== "APPROVED" && currentStatus !== "PUBLISHED") {
    throw new Error("Content chưa được duyệt nên chưa thể chuyển sang đã đăng.");
  }

  return updateWatchContentStatusRepo(prisma as any, {
    productId: input.productId,
    status: "PUBLISHED",
    userId: input.userId ?? null,
  });
}

export async function moveWatchContentToDraft(input: {
  productId: string;
  userId?: string | null;
}) {
  await getReviewTargetOrThrow(input.productId);

  return updateWatchContentStatusRepo(prisma as any, {
    productId: input.productId,
    status: "DRAFT",
    userId: input.userId ?? null,
  });
}

export async function updateWatchContentReviewStatus(input: {
  productId: string;
  action: WatchContentReviewAction;
  userId?: string | null;
  note?: string | null;
}) {
  if (input.action === "submit") {
    return submitWatchContentForReview(input);
  }

  if (input.action === "approve") {
    return approveWatchContent(input);
  }

  if (input.action === "reject") {
    return rejectWatchContent(input);
  }

  if (input.action === "publish") {
    return markWatchContentPublished(input);
  }

  return moveWatchContentToDraft(input);
}