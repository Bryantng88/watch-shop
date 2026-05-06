export type WatchReviewTargetType = "CONTENT" | "IMAGE";
export type WatchReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
export type WatchReviewAction = "SUBMIT" | "APPROVE" | "REJECT" | "RESET_DRAFT" | "AUTO_APPROVE";

export type WatchReviewStateDTO = {
    id: string;
    watchId: string;
    productId: string;
    targetType: WatchReviewTargetType;
    status: WatchReviewStatus;
    submittedAt: Date | null;
    submittedById: string | null;
    reviewedAt: Date | null;
    reviewedById: string | null;
    reviewNote: string | null;
};

export type WatchReviewMap = Record<WatchReviewTargetType, WatchReviewStateDTO>;
