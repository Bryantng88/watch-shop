import type { WatchReviewStateDTO, WatchReviewTargetType } from "./watch-review.types";

const DEFAULT_STATUS = "DRAFT" as const;

export function normalizeReviewTarget(value: string): WatchReviewTargetType {
    const target = String(value ?? "").toUpperCase();
    if (target === "CONTENT" || target === "IMAGE") return target;
    throw new Error("Review target không hợp lệ.");
}

export function buildEmptyReviewState(input: {
    watchId: string;
    productId: string;
    targetType: WatchReviewTargetType;
}): WatchReviewStateDTO {
    return {
        id: "",
        watchId: input.watchId,
        productId: input.productId,
        targetType: input.targetType,
        status: DEFAULT_STATUS,
        submittedAt: null,
        submittedById: null,
        reviewedAt: null,
        reviewedById: null,
        reviewNote: null,
    };
}

export function getReviewByTarget(reviewStates: any[] | null | undefined) {
    const map = new Map<string, any>();
    for (const item of reviewStates ?? []) {
        map.set(String(item.targetType).toUpperCase(), item);
    }
    return map;
}

export function isReviewApproved(status?: string | null) {
    return String(status ?? "DRAFT").toUpperCase() === "APPROVED";
}
