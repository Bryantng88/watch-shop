import {
    createBusinessFeedbackRecord,
    findLatestBusinessFeedbackRecord,
    listBusinessFeedbackRecords,
    listBusinessFeedbackRecordsForTargets,
    type CreateBusinessFeedbackRecordInput,
} from "./business-feedback.repo";

export const BUSINESS_FEEDBACK_TARGET_TYPES = {
    WATCH_CONTENT_REVIEW: "WATCH_CONTENT_REVIEW",
    WATCH_IMAGE_REVIEW: "WATCH_IMAGE_REVIEW",
    WATCH: "WATCH",
    ORDER: "ORDER",
    SHIPMENT: "SHIPMENT",
    SERVICE_REQUEST: "SERVICE_REQUEST",
    TECHNICAL_ISSUE: "TECHNICAL_ISSUE",
    WORK_CASE: "WORK_CASE",
    TASK: "TASK",
} as const;

export type BusinessFeedbackTargetType =
    (typeof BUSINESS_FEEDBACK_TARGET_TYPES)[keyof typeof BUSINESS_FEEDBACK_TARGET_TYPES];

export type WatchReviewFeedbackTarget = "CONTENT" | "IMAGE";

export const DEFAULT_WATCH_REVIEW_REJECTION_MESSAGE =
    "Admin đã trả về hạng mục cần chỉnh lại.";

export type CreateBusinessFeedbackInput = Omit<
    CreateBusinessFeedbackRecordInput,
    "targetType"
> & {
    targetType: BusinessFeedbackTargetType | string;
};

function clean(value: unknown) {
    return String(value ?? "").trim();
}

export function normalizeBusinessFeedbackMessage(
    message?: string | null,
    fallback = DEFAULT_WATCH_REVIEW_REJECTION_MESSAGE,
) {
    return clean(message) || fallback;
}

export function getWatchReviewFeedbackTargetType(
    targetType: WatchReviewFeedbackTarget,
): BusinessFeedbackTargetType {
    return targetType === "CONTENT"
        ? BUSINESS_FEEDBACK_TARGET_TYPES.WATCH_CONTENT_REVIEW
        : BUSINESS_FEEDBACK_TARGET_TYPES.WATCH_IMAGE_REVIEW;
}

export async function createBusinessFeedback(input: CreateBusinessFeedbackInput) {
    const targetType = clean(input.targetType);
    const targetId = clean(input.targetId);
    const message = clean(input.message);

    if (!targetType) throw new Error("Missing feedback targetType");
    if (!targetId) throw new Error("Missing feedback targetId");
    if (!message) throw new Error("Vui lòng nhập nội dung feedback.");

    return createBusinessFeedbackRecord({
        ...input,
        targetType,
        targetId,
        message,
    });
}

export async function createWatchReviewRejectionFeedback(input: {
    productId: string;
    watchId: string;
    reviewStateId: string;
    reviewTargetType: WatchReviewFeedbackTarget;
    eventKey: string;
    actorUserId?: string | null;
    message?: string | null;
}) {
    const message = normalizeBusinessFeedbackMessage(input.message);

    return createBusinessFeedback({
        targetType: getWatchReviewFeedbackTargetType(input.reviewTargetType),
        targetId: input.productId,
        eventKey: input.eventKey,
        actorUserId: input.actorUserId ?? null,
        message,
        metadataJson: {
            productId: input.productId,
            watchId: input.watchId,
            reviewTargetType: input.reviewTargetType,
            reviewStateId: input.reviewStateId,
        },
    });
}

export async function listBusinessFeedbacks(input: {
    targetType: BusinessFeedbackTargetType | string;
    targetId: string;
    limit?: number;
}) {
    return listBusinessFeedbackRecords({
        targetType: clean(input.targetType),
        targetId: clean(input.targetId),
        limit: input.limit,
    });
}

export async function getLatestBusinessFeedback(input: {
    targetType: BusinessFeedbackTargetType | string;
    targetId: string;
}) {
    return findLatestBusinessFeedbackRecord({
        targetType: clean(input.targetType),
        targetId: clean(input.targetId),
    });
}

export async function getLatestBusinessFeedbackByTargets(
    targets: Array<{
        targetType: BusinessFeedbackTargetType | string;
        targetId: string;
    }>,
) {
    const normalizedTargets = targets
        .map((target) => ({
            targetType: clean(target.targetType),
            targetId: clean(target.targetId),
        }))
        .filter((target) => target.targetType && target.targetId);

    const rows = await listBusinessFeedbackRecordsForTargets(normalizedTargets);
    const latest = new Map<string, (typeof rows)[number]>();

    for (const row of rows) {
        const key = `${row.targetType}:${row.targetId}`;
        if (!latest.has(key)) latest.set(key, row);
    }

    return latest;
}
