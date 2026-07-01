import { prisma } from "@/server/db/client";
import { ProductStatus, WatchSaleStage, WatchStockStage, type Prisma } from "@prisma/client";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import {
    createWatchReviewRejectionFeedback,
    normalizeBusinessFeedbackMessage,
} from "@/domains/shared/business-feedback/server";
type ReviewTargetType = "CONTENT" | "IMAGE";
type ReviewStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

type ReviewInput = {
    productId: string;
    targetType: ReviewTargetType;
    userId?: string | null;
};

type RejectInput = ReviewInput & {
    note?: string | null;
};
function watchReviewRejectedEventKey(targetType: ReviewTargetType) {
    return targetType === "CONTENT"
        ? "watch.content.rejected"
        : "watch.image.rejected";
}

function watchReviewSubmittedEventKey(targetType: ReviewTargetType) {
    return targetType === "CONTENT"
        ? "watch.content.submitted"
        : "watch.image.submitted";
}

function watchReviewApprovedEventKey(targetType: ReviewTargetType) {
    return targetType === "CONTENT"
        ? "watch.content.approved"
        : "watch.image.approved";
}

function watchReviewUnapprovedEventKey(targetType: ReviewTargetType) {
    return targetType === "CONTENT"
        ? "watch.content.unapproved"
        : "watch.image.unapproved";
}

async function getWatchOrThrow(productId: string) {
    const watch = await prisma.watch.findUnique({
        where: { productId },
        select: {
            id: true,
            productId: true,
            product: {
                select: {
                    title: true,
                },
            },
        },
    });

    if (!watch) throw new Error("Không tìm thấy watch.");

    return watch;
}

async function ensureReviewState(input: {
    productId: string;
    targetType: ReviewTargetType;
}) {
    const watch = await getWatchOrThrow(input.productId);

    return prisma.watchReviewState.upsert({
        where: {
            watchId_targetType: {
                watchId: watch.id,
                targetType: input.targetType,
            },
        },
        create: {
            watchId: watch.id,
            productId: watch.productId,
            targetType: input.targetType,
            status: "DRAFT",
        },
        update: {},
    });
}

async function writeReviewLog(input: {
    reviewStateId: string;
    action: "SUBMIT" | "APPROVE" | "REJECT" | "RESET_DRAFT";
    fromStatus?: ReviewStatus | null;
    toStatus: ReviewStatus;
    actorId?: string | null;
    note?: string | null;
}) {
    return prisma.watchReviewLog.create({
        data: {
            reviewStateId: input.reviewStateId,
            action: input.action,
            fromStatus: input.fromStatus ?? null,
            toStatus: input.toStatus,
            actorId: input.actorId ?? null,
            note: input.note ?? null,
        },
    });
}

async function emitWatchReviewApprovedEvent(input: ReviewInput) {
    const watch = await getWatchOrThrow(input.productId);

    await recordBusinessEvent(prisma, {
        eventKey: watchReviewApprovedEventKey(input.targetType),
        targetType: "WATCH",
        targetId: watch.id,
        targetAliasIds: [input.productId],
        actorUserId: input.userId ?? null,
        payload: {
            productId: input.productId,
            watchId: watch.id,
            reviewTargetType: input.targetType,
        },
    });
}

async function safeEmitWatchReviewSubmittedEvent(input: ReviewInput & {
    fromStatus: ReviewStatus;
    toStatus: ReviewStatus;
    reviewLogId?: string | null;
}) {
    try {
        const watch = await getWatchOrThrow(input.productId);

        await recordBusinessEvent(prisma, {
            eventKey: watchReviewSubmittedEventKey(input.targetType),
            targetType: "WATCH",
            targetId: input.reviewLogId
                ? `${watch.id}:${input.targetType}:${input.reviewLogId}`
                : watch.id,
            targetAliasIds: [input.productId],
            actorUserId: input.userId ?? null,
            payload: {
                productId: input.productId,
                watchId: watch.id,
                reviewLogId: input.reviewLogId ?? null,
                reviewTargetType: input.targetType,
                fromStatus: input.fromStatus,
                toStatus: input.toStatus,
            },
        });
    } catch (error) {
        console.error("WORKFLOW_EMIT_SUBMITTED_FAILED", {
            productId: input.productId,
            targetType: input.targetType,
            error,
        });
    }
}

async function safeEmitWatchReviewApprovedEvent(input: ReviewInput) {
    try {
        await emitWatchReviewApprovedEvent(input);
    } catch (error) {
        console.error("WORKFLOW_EMIT_APPROVED_FAILED", {
            productId: input.productId,
            targetType: input.targetType,
            error,
        });
    }
}

async function safeEmitWatchReviewUnapprovedEvent(input: ReviewInput & {
    fromStatus: ReviewStatus;
    toStatus: ReviewStatus;
}) {
    try {
        const watch = await getWatchOrThrow(input.productId);

        await recordBusinessEvent(prisma, {
            eventKey: watchReviewUnapprovedEventKey(input.targetType),
            targetType: "WATCH",
            targetId: watch.id,
            targetAliasIds: [input.productId],
            actorUserId: input.userId ?? null,
            effect: "REVOKE",
            revokeEventKey: watchReviewApprovedEventKey(input.targetType),
            payload: {
                productId: input.productId,
                watchId: watch.id,
                reviewTargetType: input.targetType,
                fromStatus: input.fromStatus,
                toStatus: input.toStatus,
            },
        });
    } catch (error) {
        console.error("WORKFLOW_EMIT_UNAPPROVED_FAILED", {
            productId: input.productId,
            targetType: input.targetType,
            error,
        });
    }
}

async function moveWatchToProcessingIfEditable(productId: string) {
    await prisma.watch.updateMany({
        where: {
            productId,
            saleStage: {
                in: [WatchSaleStage.DRAFT, WatchSaleStage.READY],
            },
        },
        data: {
            saleStage: WatchSaleStage.PROCESSING,
            updatedAt: new Date(),
        },
    });
}

async function getReviewPair(productId: string) {
    const watch = await prisma.watch.findUnique({
        where: { productId },
        include: {
            product: true,
            reviewStates: true,
        },
    });

    if (!watch) return null;

    const content = watch.reviewStates.find((x) => x.targetType === "CONTENT");
    const image = watch.reviewStates.find((x) => x.targetType === "IMAGE");

    return { watch, content, image };
}

async function moveWatchToReadyIfFullyApproved(productId: string) {
    const pair = await getReviewPair(productId);
    if (!pair?.content || !pair?.image) return false;

    const fullyApproved =
        pair.content.status === "APPROVED" && pair.image.status === "APPROVED";

    if (!fullyApproved) return false;

    await prisma.watch.updateMany({
        where: {
            productId,
            saleStage: {
                in: [WatchSaleStage.DRAFT, WatchSaleStage.PROCESSING],
            },
        },
        data: {
            saleStage: WatchSaleStage.READY,
            stockStage: WatchStockStage.IN_STOCK,
            updatedAt: new Date(),
        },
    });

    await prisma.product.update({
        where: { id: productId },
        data: {
            status: ProductStatus.AVAILABLE,
            updatedAt: new Date(),
        },
    });

    return true;
}

async function notifyReviewRejected(input: {
    state: { submittedById?: string | null };
    productId: string;
    targetType: ReviewTargetType;
    note?: string | null;
}) {
    const userId = input.state.submittedById;
    if (!userId) return;

    await prisma.notification.create({
        data: {
            userId,
            type:
                input.targetType === "CONTENT"
                    ? "WATCH_CONTENT_REJECTED"
                    : "WATCH_IMAGE_REJECTED",
            title:
                input.targetType === "CONTENT"
                    ? "Content watch bị trả về"
                    : "Hình ảnh watch bị trả về",
            message: normalizeBusinessFeedbackMessage(input.note),
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${input.productId}/edit`,
                productId: input.productId,
                targetType: input.targetType,
            },
        },
    });
}

async function notifyFullyApprovedIfReady(productId: string) {
    const pair = await getReviewPair(productId);
    if (!pair?.content || !pair?.image) return;

    if (
        pair.content.status !== "APPROVED" ||
        pair.image.status !== "APPROVED"
    ) {
        return;
    }

    const userIds = Array.from(
        new Set(
            [pair.content.submittedById, pair.image.submittedById].filter(Boolean),
        ),
    );

    if (!userIds.length) return;

    const notifications: Prisma.NotificationCreateManyInput[] = userIds.map((userId) => ({
            userId,
            type: "WATCH_REVIEW_APPROVED",
            title: "Watch đã được duyệt hoàn toàn",
            message: `${pair.watch.product.title || "Watch"} đã được duyệt cả content và hình ảnh.`,
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${productId}`,
                productId,
            },
        }));

    await prisma.notification.createMany({
        data: notifications,
        skipDuplicates: false,
    });
}

export async function submitWatchReview(input: ReviewInput) {
    const current = await ensureReviewState(input);

    if (!["DRAFT", "REJECTED"].includes(current.status)) {
        throw new Error("Chỉ bản nháp hoặc bản trả về mới được gửi duyệt.");
    }

    const state = await prisma.watchReviewState.update({
        where: { id: current.id },
        data: {
            status: "SUBMITTED",
            submittedAt: new Date(),
            submittedById: input.userId ?? null,
            reviewedAt: null,
            reviewedById: null,
            reviewNote: null,
        },
    });

    const reviewLog = await writeReviewLog({
        reviewStateId: state.id,
        action: "SUBMIT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "SUBMITTED",
        actorId: input.userId,
    });

    await moveWatchToProcessingIfEditable(input.productId);
    await safeEmitWatchReviewSubmittedEvent({
        ...input,
        fromStatus: current.status as ReviewStatus,
        toStatus: "SUBMITTED",
        reviewLogId: reviewLog.id,
    });

    return state;
}

export async function approveWatchReview(input: ReviewInput) {
    const current = await ensureReviewState(input);

    if (current.status === "APPROVED") {
        await safeEmitWatchReviewApprovedEvent(input);
        await moveWatchToReadyIfFullyApproved(input.productId);
        await notifyFullyApprovedIfReady(input.productId);
        return current;
    }

    if (!["DRAFT", "SUBMITTED", "REJECTED"].includes(current.status)) {
        throw new Error(
            `${input.targetType === "CONTENT" ? "Nội dung" : "Hình ảnh"} hiện không thể duyệt. Status hiện tại: ${current.status}`,
        );
    }

    const state = await prisma.watchReviewState.update({
        where: { id: current.id },
        data: {
            status: "APPROVED",
            reviewedAt: new Date(),
            reviewedById: input.userId ?? null,
            reviewNote: null,
        },
    });

    await writeReviewLog({
        reviewStateId: state.id,
        action: "APPROVE",
        fromStatus: current.status as ReviewStatus,
        toStatus: "APPROVED",
        actorId: input.userId,
    });

    await safeEmitWatchReviewApprovedEvent(input);

    await moveWatchToReadyIfFullyApproved(input.productId);
    await notifyFullyApprovedIfReady(input.productId);

    return state;
}

export async function rejectWatchReview(input: RejectInput) {
    const current = await ensureReviewState(input);

    if (current.status !== "SUBMITTED") {
        throw new Error(
            input.targetType === "CONTENT"
                ? "Chỉ nội dung đã gửi duyệt mới được trả về."
                : "Chỉ hình ảnh đã gửi duyệt mới được trả về.",
        );
    }

    const feedbackMessage = normalizeBusinessFeedbackMessage(input.note);

    const state = await prisma.watchReviewState.update({
        where: { id: current.id },
        data: {
            status: "REJECTED",
            reviewedAt: new Date(),
            reviewedById: input.userId ?? null,
            reviewNote: feedbackMessage,
        },
    });

    await writeReviewLog({
        reviewStateId: state.id,
        action: "REJECT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "REJECTED",
        actorId: input.userId,
        note: feedbackMessage,
    });

    const watch = await getWatchOrThrow(input.productId);
    const rejectedEventKey = watchReviewRejectedEventKey(input.targetType);

    const feedback = await createWatchReviewRejectionFeedback({
        productId: input.productId,
        watchId: watch.id,
        reviewStateId: state.id,
        reviewTargetType: input.targetType,
        eventKey: rejectedEventKey,
        actorUserId: input.userId ?? null,
        message: feedbackMessage,
    });

    await moveWatchToProcessingIfEditable(input.productId);

    await recordBusinessEvent(prisma, {
        eventKey: rejectedEventKey,
        targetType: "WATCH",
        targetId: `${watch.id}:${input.targetType}:${feedback.id}`,
        targetAliasIds: [input.productId],
        actorUserId: input.userId ?? null,
        payload: {
            productId: input.productId,
            watchId: watch.id,
            reviewTargetType: input.targetType,

            feedbackId: feedback.id,
            feedbackMessage: feedback.message,
            feedbackCreatedAt: feedback.createdAt,
        },
    });

    await notifyReviewRejected({
        state,
        productId: input.productId,
        targetType: input.targetType,
        note: feedback.message,
    });

    return state;
}

export async function resetWatchReviewToDraft(input: ReviewInput) {
    const current = await ensureReviewState(input);

    if (current.status === "DRAFT") {
        await moveWatchToProcessingIfEditable(input.productId);
        return current;
    }

    const wasApproved = current.status === "APPROVED";

    const state = await prisma.watchReviewState.update({
        where: { id: current.id },
        data: {
            status: "DRAFT",
            reviewedAt: null,
            reviewedById: null,
            reviewNote: null,
        },
    });

    await writeReviewLog({
        reviewStateId: state.id,
        action: "RESET_DRAFT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "DRAFT",
        actorId: input.userId,
    });

    if (wasApproved) {
        await safeEmitWatchReviewUnapprovedEvent({
            ...input,
            fromStatus: current.status as ReviewStatus,
            toStatus: "DRAFT",
        });
    }

    await moveWatchToProcessingIfEditable(input.productId);

    return state;
}
