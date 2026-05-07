import { prisma } from "@/server/db/client";

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

async function getWatchOrThrow(productId: string) {
    const watch = await prisma.watch.findUnique({
        where: { productId },
        select: {
            id: true,
            productId: true,
        },
    });

    if (!watch) {
        throw new Error("Không tìm thấy watch.");
    }

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
    action: "SUBMIT" | "APPROVE" | "REJECT" | "RESET_DRAFT" | "AUTO_APPROVE";
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

async function notifyReviewRejected(input: {
    state: any;
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
            message: input.note || "Admin đã trả về hạng mục cần chỉnh lại.",
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${input.productId}/edit`,
                productId: input.productId,
                targetType: input.targetType,
            },
        } as any,
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
            [
                pair.content.submittedById,
                pair.image.submittedById,
            ].filter(Boolean)
        )
    );

    if (userIds.length === 0) return;

    await prisma.notification.createMany({
        data: userIds.map((userId) => ({
            userId,
            type: "WATCH_REVIEW_APPROVED",
            title: "Watch đã được duyệt hoàn toàn",
            message: `${pair.watch.product.title || "Watch"} đã được duyệt cả content và hình ảnh.`,
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${productId}`,
                productId,
            },
        })) as any,
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

    await writeReviewLog({
        reviewStateId: state.id,
        action: "SUBMIT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "SUBMITTED",
        actorId: input.userId,
    });

    return state;
}

export async function approveWatchReview(input: ReviewInput) {
    const current = await ensureReviewState(input);

    if (!["DRAFT", "SUBMITTED", "REJECTED"].includes(current.status)) {
        throw new Error(
            input.targetType === "CONTENT"
                ? "Nội dung hiện không thể duyệt."
                : "Hình ảnh hiện không thể duyệt."
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
    await notifyFullyApprovedIfReady(input.productId);
    return state;
}
export async function rejectWatchReview(input: RejectInput) {
    const current = await ensureReviewState(input);

    if (current.status !== "SUBMITTED") {
        throw new Error(
            input.targetType === "CONTENT"
                ? "Chỉ nội dung đã gửi duyệt mới được trả về."
                : "Chỉ hình ảnh đã gửi duyệt mới được trả về."
        );
    }

    const state = await prisma.watchReviewState.update({
        where: { id: current.id },
        data: {
            status: "REJECTED",
            reviewedAt: new Date(),
            reviewedById: input.userId ?? null,
            reviewNote: input.note ?? null,
        },
    });

    await writeReviewLog({
        reviewStateId: state.id,
        action: "REJECT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "REJECTED",
        actorId: input.userId,
        note: input.note,
    });
    await notifyReviewRejected({
        state,
        productId: input.productId,
        targetType: input.targetType,
        note: input.note,
    });
    return state;
}

export async function resetWatchReviewToDraft(input: ReviewInput) {
    const current = await ensureReviewState(input);

    if (current.status === "DRAFT") {
        return current;
    }

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

    return state;
}

export async function autoApproveWatchReview(input: ReviewInput) {
    const current = await ensureReviewState(input);

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
        action: "AUTO_APPROVE",
        fromStatus: current.status as ReviewStatus,
        toStatus: "APPROVED",
        actorId: input.userId,
    });

    return state;
}