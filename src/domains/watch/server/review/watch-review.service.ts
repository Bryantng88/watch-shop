import { prisma } from "@/server/db/client";
import {
    getWatchReviewTargetRepo,
    updateWatchReviewStatusRepo,
} from "./watch-review.repo";
import type { WatchReviewTargetType } from "./watch-review.types";

async function getCurrentStateOrDraft(productId: string, targetType: WatchReviewTargetType) {
    const target = await getWatchReviewTargetRepo(prisma as any, productId, targetType);
    if (!target) throw new Error("Không tìm thấy watch.");

    const state = target.reviewStates?.[0] ?? null;
    return {
        watchId: target.id,
        productId: target.productId,
        state,
        status: String(state?.status ?? "DRAFT").toUpperCase(),
    };
}

function labelTarget(targetType: WatchReviewTargetType) {
    return targetType === "CONTENT" ? "nội dung" : "hình ảnh";
}

export async function submitWatchReview(input: {
    productId: string;
    targetType: WatchReviewTargetType;
    userId?: string | null;
}) {
    const current = await getCurrentStateOrDraft(input.productId, input.targetType);

    if (!["DRAFT", "REJECTED"].includes(current.status)) {
        throw new Error(`Chỉ ${labelTarget(input.targetType)} Draft hoặc Trả về mới được gửi duyệt.`);
    }

    return updateWatchReviewStatusRepo(prisma as any, {
        productId: input.productId,
        targetType: input.targetType,
        status: "SUBMITTED",
        action: "SUBMIT",
        userId: input.userId ?? null,
        reviewNote: null,
    });
}

export async function approveWatchReview(input: {
    productId: string;
    targetType: WatchReviewTargetType;
    userId?: string | null;
}) {
    const current = await getCurrentStateOrDraft(input.productId, input.targetType);

    if (current.status !== "SUBMITTED") {
        throw new Error(`Chỉ ${labelTarget(input.targetType)} đã gửi duyệt mới được duyệt.`);
    }

    return updateWatchReviewStatusRepo(prisma as any, {
        productId: input.productId,
        targetType: input.targetType,
        status: "APPROVED",
        action: "APPROVE",
        userId: input.userId ?? null,
        reviewNote: null,
    });
}

export async function rejectWatchReview(input: {
    productId: string;
    targetType: WatchReviewTargetType;
    userId?: string | null;
    note?: string | null;
}) {
    const current = await getCurrentStateOrDraft(input.productId, input.targetType);

    if (current.status !== "SUBMITTED") {
        throw new Error(`Chỉ ${labelTarget(input.targetType)} đã gửi duyệt mới được trả về.`);
    }

    return updateWatchReviewStatusRepo(prisma as any, {
        productId: input.productId,
        targetType: input.targetType,
        status: "REJECTED",
        action: "REJECT",
        userId: input.userId ?? null,
        reviewNote: input.note ?? null,
    });
}

export async function resetWatchReviewToDraft(input: {
    productId: string;
    targetType: WatchReviewTargetType;
    userId?: string | null;
}) {
    return updateWatchReviewStatusRepo(prisma as any, {
        productId: input.productId,
        targetType: input.targetType,
        status: "DRAFT",
        action: "RESET_DRAFT",
        userId: input.userId ?? null,
        reviewNote: null,
    });
}

export async function autoApproveWatchReview(input: {
    productId: string;
    targetType: WatchReviewTargetType;
    userId?: string | null;
}) {
    return updateWatchReviewStatusRepo(prisma as any, {
        productId: input.productId,
        targetType: input.targetType,
        status: "APPROVED",
        action: "AUTO_APPROVE",
        userId: input.userId ?? null,
        reviewNote: null,
    });
}

export async function submitManyWatchReviews(input: {
    productId: string;
    targetTypes: WatchReviewTargetType[];
    userId?: string | null;
}) {
    const results = [];
    for (const targetType of input.targetTypes) {
        results.push(
            await submitWatchReview({
                productId: input.productId,
                targetType,
                userId: input.userId ?? null,
            })
        );
    }
    return results;
}
