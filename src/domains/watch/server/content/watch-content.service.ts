import { prisma } from "@/server/db/client";
import type { SaveWatchContentInput } from "../shared";
import {
  getWatchContentRepo,
  getWatchContentReviewTargetRepo,
  saveWatchContentRepo,
  syncWatchContentSnapshotRepo,
  updateWatchContentStatusRepo,
} from "./watch-content.repo";

function hasMeaningfulContent(content: any) {
  return Boolean(
    String(content?.titleOverride ?? "").trim() ||
    String(content?.hookText ?? "").trim() ||
    String(content?.body ?? "").trim() ||
    String(content?.summary ?? "").trim() ||
    String(content?.hashtags ?? "").trim() ||
    (Array.isArray(content?.bulletSpecs) &&
      content.bulletSpecs.some((x: any) => String(x ?? "").trim()))
  );
}

async function getReviewTargetOrThrow(productId: string) {
  const target = await getWatchContentReviewTargetRepo(prisma as any, productId);
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
  const currentStatus = target.watchContent?.contentStatus ?? "DRAFT";

  if (!["DRAFT", "REJECTED"].includes(currentStatus)) {
    throw new Error("Chỉ content Draft hoặc Trả về mới được gửi duyệt.");
  }

  if (!hasMeaningfulContent(target.watchContent)) {
    throw new Error("Chưa có nội dung để gửi duyệt.");
  }

  return updateWatchContentStatusRepo(prisma as any, {
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
  const target = await getReviewTargetOrThrow(input.productId);
  const currentStatus = target.watchContent?.contentStatus ?? "DRAFT";

  if (currentStatus !== "SUBMITTED") {
    throw new Error("Chỉ content đã gửi duyệt mới được trả về.");
  }

  return updateWatchContentStatusRepo(prisma as any, {
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

  return updateWatchContentStatusRepo(prisma as any, {
    productId: input.productId,
    status: "APPROVED",
    userId: input.userId ?? null,
    reviewNote: null,
  });
}