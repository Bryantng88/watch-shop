import { isPrismaClient, prisma, type DB } from "@/server/db/client";
import {
    ProductStatus,
    WatchSaleStage,
    WatchStockStage,
    type Prisma,
    type WatchReviewState,
} from "@prisma/client";
import {
    type BusinessEventDispatchOptions,
} from "@/domains/event/server/business-event.service";
import {
    createWatchReviewRejectionFeedback,
    normalizeBusinessFeedbackMessage,
} from "@/domains/shared/business-feedback/server";
import {
    emitWatchReviewBusinessEvent,
    watchReviewEventKey,
    type WatchReviewStatus,
    type WatchReviewTargetType,
} from "@/domains/watch/server/events";
import { perfLog, perfNow, perfStep } from "@/lib/server-perf";
import { buildWatchStorefrontSlug } from "@/domains/watch/shared/storefront-slug";
type ReviewTargetType = WatchReviewTargetType;
type ReviewStatus = WatchReviewStatus;

type ReviewInput = {
    productId: string;
    targetType: ReviewTargetType;
    userId?: string | null;
    deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
};

type ApproveReviewInput = ReviewInput & {
    emitBusinessEvent?: boolean;
};

type RejectInput = ReviewInput & {
    note?: string | null;
};

const WATCH_REVIEW_PERF_SCOPE = "watch-review";

async function getWatchOrThrow(db: DB, productId: string) {
    const watch = await db.watch.findUnique({
        where: { productId },
        select: {
            id: true,
            productId: true,
            saleStage: true,
            product: {
                select: {
                    title: true,
                    slug: true,
                    sku: true,
                    primaryImageUrl: true,
                    status: true,
                },
            },
        },
    });

    if (!watch) throw new Error("Không tìm thấy watch.");

    return watch;
}

async function ensureReviewState(db: DB, input: {
    productId: string;
    targetType: ReviewTargetType;
}) {
    const existing = await db.watchReviewState.findFirst({
        where: {
            productId: input.productId,
            targetType: input.targetType,
        },
    });

    if (existing) return existing;

    const watch = await getWatchOrThrow(db, input.productId);

    try {
        return await db.watchReviewState.create({
            data: {
                watchId: watch.id,
                productId: watch.productId,
                targetType: input.targetType,
                status: "DRAFT",
            },
        });
    } catch (error) {
        if (
            typeof error === "object" &&
            error &&
            "code" in error &&
            error.code === "P2002"
        ) {
            const state = await db.watchReviewState.findUnique({
                where: {
                    watchId_targetType: {
                        watchId: watch.id,
                        targetType: input.targetType,
                    },
                },
            });

            if (state) return state;
        }

        throw error;
    }
}

async function approveReviewStateQueries(db: DB, input: {
    stateId: string;
    fromStatus: ReviewStatus;
    userId?: string | null;
}) {
    const state = await db.watchReviewState.update({
            where: { id: input.stateId },
            data: {
                status: "APPROVED",
                reviewedAt: new Date(),
                reviewedById: input.userId ?? null,
                reviewNote: null,
            },
        });
    const log = await db.watchReviewLog.create({
            data: {
                reviewStateId: input.stateId,
                action: "APPROVE",
                fromStatus: input.fromStatus,
                toStatus: "APPROVED",
                actorId: input.userId ?? null,
            },
        });
    return [state, log] as const;
}

async function runApprovedSideEffects(db: DB, input: ApproveReviewInput) {
    const emitBusinessEvent = input.emitBusinessEvent !== false;

    if (emitBusinessEvent) {
        await perfStep(
            WATCH_REVIEW_PERF_SCOPE,
            `${input.targetType}:approve:emitApprovedEvent`,
            () => emitWatchReviewApprovedEvent(db, input),
        );
    }
    await perfStep(
        WATCH_REVIEW_PERF_SCOPE,
        `${input.targetType}:approve:finalizeFullyApproved`,
        () => finalizeWatchIfFullyApproved(db, input.productId),
    );
}

async function writeReviewLog(db: DB, input: {
    reviewStateId: string;
    action: "SUBMIT" | "APPROVE" | "REJECT" | "RESET_DRAFT";
    fromStatus?: ReviewStatus | null;
    toStatus: ReviewStatus;
    actorId?: string | null;
    note?: string | null;
}) {
    return db.watchReviewLog.create({
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

async function emitWatchReviewApprovedEvent(db: DB, input: ReviewInput) {
    const watch = await perfStep(
        WATCH_REVIEW_PERF_SCOPE,
        `${input.targetType}:approved:getWatch`,
        () => getWatchOrThrow(db, input.productId),
    );

    await perfStep(
        WATCH_REVIEW_PERF_SCOPE,
        `${input.targetType}:approved:recordBusinessEvent`,
        () => emitWatchReviewBusinessEvent(db, {
            watch,
            reviewTargetType: input.targetType,
            sourceAction: "APPROVE",
            actorUserId: input.userId ?? null,
            toStatus: "APPROVED",
            deferConsumers: input.deferConsumers,
        }),
    );
}

async function emitWatchReviewSubmittedEvent(db: DB, input: ReviewInput & {
    fromStatus: ReviewStatus;
    toStatus: ReviewStatus;
    reviewLogId?: string | null;
}) {
    const watch = await getWatchOrThrow(db, input.productId);

    await emitWatchReviewBusinessEvent(db, {
        watch,
        reviewTargetType: input.targetType,
        sourceAction: "SUBMIT",
        actorUserId: input.userId ?? null,
        fromStatus: input.fromStatus,
        toStatus: input.toStatus,
        sourceId: input.reviewLogId ?? null,
        extraPayload: {
            reviewLogId: input.reviewLogId ?? null,
        },
        deferConsumers: input.deferConsumers,
    });
}

async function emitWatchReviewUnapprovedEvent(db: DB, input: ReviewInput & {
    fromStatus: ReviewStatus;
    toStatus: ReviewStatus;
}) {
    const watch = await getWatchOrThrow(db, input.productId);

    await emitWatchReviewBusinessEvent(db, {
        watch,
        reviewTargetType: input.targetType,
        sourceAction: "RESET_DRAFT",
        actorUserId: input.userId ?? null,
        effect: "REVOKE",
        revokeEventKey: watchReviewEventKey(input.targetType, "APPROVE"),
        fromStatus: input.fromStatus,
        toStatus: input.toStatus,
        deferConsumers: input.deferConsumers,
    });
}

async function moveWatchToProcessingIfEditable(db: DB, productId: string) {
    await db.watch.updateMany({
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

async function getReviewPair(db: DB, productId: string) {
    const watch = await db.watch.findUnique({
        where: { productId },
        select: {
            product: {
                select: {
                    title: true,
                    slug: true,
                },
            },
            reviewStates: {
                select: {
                    targetType: true,
                    status: true,
                    submittedById: true,
                },
            },
        },
    });

    if (!watch) return null;

    const content = watch.reviewStates.find((x) => x.targetType === "CONTENT");
    const image = watch.reviewStates.find((x) => x.targetType === "IMAGE");

    return { watch, content, image };
}

async function notifyReviewRejected(db: DB, input: {
    state: { submittedById?: string | null };
    productId: string;
    targetType: ReviewTargetType;
    note?: string | null;
}) {
    const userId = input.state.submittedById;
    if (!userId) return;

    await db.notification.create({
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function notifyFullyApprovedIfReady(db: DB, productId: string) {
    const pair = await getReviewPair(db, productId);
    if (!pair?.content || !pair?.image) return;

    if (
        pair.content.status !== "APPROVED" ||
        pair.image.status !== "APPROVED"
    ) {
        return;
    }

    const userIds = Array.from(
        new Set(
            [pair.content.submittedById, pair.image.submittedById].filter(
                (userId): userId is string => Boolean(userId),
            ),
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

    await db.notification.createMany({
        data: notifications,
        skipDuplicates: false,
    });
}

export async function submitWatchReview(
    input: ReviewInput,
    db: DB = prisma,
): Promise<WatchReviewState> {
    if (isPrismaClient(db)) {
        return db.$transaction((tx) => submitWatchReview(input, tx));
    }
    const current = await ensureReviewState(db, input);

    if (!["DRAFT", "REJECTED"].includes(current.status)) {
        throw new Error("Chỉ bản nháp hoặc bản trả về mới được gửi duyệt.");
    }

    const state = await db.watchReviewState.update({
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

    const reviewLog = await writeReviewLog(db, {
        reviewStateId: state.id,
        action: "SUBMIT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "SUBMITTED",
        actorId: input.userId,
    });

    await moveWatchToProcessingIfEditable(db, input.productId);
    await emitWatchReviewSubmittedEvent(db, {
        ...input,
        fromStatus: current.status as ReviewStatus,
        toStatus: "SUBMITTED",
        reviewLogId: reviewLog.id,
    });

    return state;
}

async function finalizeWatchIfFullyApproved(db: DB, productId: string) {
    const pair = await getReviewPair(db, productId);
    if (!pair?.content || !pair?.image) return false;

    const fullyApproved =
        pair.content.status === "APPROVED" && pair.image.status === "APPROVED";

    if (!fullyApproved) return false;

    const userIds = Array.from(
        new Set(
            [pair.content.submittedById, pair.image.submittedById].filter(
                (userId): userId is string => Boolean(userId),
            ),
        ),
    );

    const notifications: Prisma.NotificationCreateManyInput[] = userIds.map((userId) => ({
            userId,
            type: "WATCH_REVIEW_APPROVED",
            title: "Watch Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t hoÃ n toÃ n",
            message: `${pair.watch.product.title || "Watch"} Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t cáº£ content vÃ  hÃ¬nh áº£nh.`,
            priority: "NORMAL",
            metadata: {
                route: `/admin/watches/${productId}`,
                productId,
            },
        }));

    const storefrontSlug = buildWatchStorefrontSlug(pair.watch.product.title, productId);

    await db.watch.updateMany({
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
    await db.product.update({
            where: { id: productId },
            data: {
                status: ProductStatus.AVAILABLE,
                ...(pair.watch.product.slug ? {} : { slug: storefrontSlug }),
                updatedAt: new Date(),
            },
        });
    if (notifications.length) {
        await db.notification.createMany({
            data: notifications,
            skipDuplicates: false,
        });
    }

    return true;
}

export async function approveWatchReview(
    input: ApproveReviewInput,
    db: DB = prisma,
): Promise<WatchReviewState> {
    if (isPrismaClient(db)) {
        return db.$transaction((tx) => approveWatchReview(input, tx));
    }
    const totalStartedAt = perfNow();
    const step = (label: string) => `${input.targetType}:approve:${label}`;
    const current = await perfStep(
        WATCH_REVIEW_PERF_SCOPE,
        step("ensureReviewState"),
        () => ensureReviewState(db, input),
    );

    if (current.status === "APPROVED") {
        await runApprovedSideEffects(db, input);
        perfLog(WATCH_REVIEW_PERF_SCOPE, step("total"), totalStartedAt);
        return current;
    }

    if (!["DRAFT", "SUBMITTED", "REJECTED"].includes(current.status)) {
        throw new Error(
            `${input.targetType === "CONTENT" ? "Nội dung" : "Hình ảnh"} hiện không thể duyệt. Status hiện tại: ${current.status}`,
        );
    }

    const [state] = await perfStep(
        WATCH_REVIEW_PERF_SCOPE,
        step("updateStateAndWriteLog"),
        () => approveReviewStateQueries(db, {
            stateId: current.id,
            fromStatus: current.status as ReviewStatus,
            userId: input.userId,
        }),
    );

    await runApprovedSideEffects(db, input);

    perfLog(WATCH_REVIEW_PERF_SCOPE, step("total"), totalStartedAt);
    return state;
}

export async function rejectWatchReview(
    input: RejectInput,
    db: DB = prisma,
): Promise<WatchReviewState> {
    if (isPrismaClient(db)) {
        return db.$transaction((tx) => rejectWatchReview(input, tx));
    }
    const current = await ensureReviewState(db, input);

    if (current.status !== "SUBMITTED") {
        throw new Error(
            input.targetType === "CONTENT"
                ? "Chỉ nội dung đã gửi duyệt mới được trả về."
                : "Chỉ hình ảnh đã gửi duyệt mới được trả về.",
        );
    }

    const feedbackMessage = normalizeBusinessFeedbackMessage(input.note);

    const state = await db.watchReviewState.update({
        where: { id: current.id },
        data: {
            status: "REJECTED",
            reviewedAt: new Date(),
            reviewedById: input.userId ?? null,
            reviewNote: feedbackMessage,
        },
    });

    await writeReviewLog(db, {
        reviewStateId: state.id,
        action: "REJECT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "REJECTED",
        actorId: input.userId,
        note: feedbackMessage,
    });

    const watch = await getWatchOrThrow(db, input.productId);
    const rejectedEventKey = watchReviewEventKey(input.targetType, "REJECT");

    const feedback = await createWatchReviewRejectionFeedback({
        productId: input.productId,
        watchId: watch.id,
        reviewStateId: state.id,
        reviewTargetType: input.targetType,
        eventKey: rejectedEventKey,
        actorUserId: input.userId ?? null,
        message: feedbackMessage,
    }, db);

    await moveWatchToProcessingIfEditable(db, input.productId);

    await emitWatchReviewBusinessEvent(db, {
        watch,
        reviewTargetType: input.targetType,
        sourceAction: "REJECT",
        actorUserId: input.userId ?? null,
        fromStatus: current.status as ReviewStatus,
        toStatus: "REJECTED",
        sourceId: feedback.id,
        feedbackId: feedback.id,
        feedbackMessage: feedback.message,
        feedbackCreatedAt: feedback.createdAt,
        extraPayload: {
            feedbackId: feedback.id,
            feedbackMessage: feedback.message,
            feedbackCreatedAt: feedback.createdAt,
        },
        deferConsumers: input.deferConsumers,
    });

    await notifyReviewRejected(db, {
        state,
        productId: input.productId,
        targetType: input.targetType,
        note: feedback.message,
    });

    return state;
}

export async function resetWatchReviewToDraft(
    input: ReviewInput,
    db: DB = prisma,
): Promise<WatchReviewState> {
    if (isPrismaClient(db)) {
        return db.$transaction((tx) => resetWatchReviewToDraft(input, tx));
    }
    const current = await ensureReviewState(db, input);

    if (current.status === "DRAFT") {
        await moveWatchToProcessingIfEditable(db, input.productId);
        return current;
    }

    const wasApproved = current.status === "APPROVED";

    const state = await db.watchReviewState.update({
        where: { id: current.id },
        data: {
            status: "DRAFT",
            reviewedAt: null,
            reviewedById: null,
            reviewNote: null,
        },
    });

    await writeReviewLog(db, {
        reviewStateId: state.id,
        action: "RESET_DRAFT",
        fromStatus: current.status as ReviewStatus,
        toStatus: "DRAFT",
        actorId: input.userId,
    });

    if (wasApproved) {
        await emitWatchReviewUnapprovedEvent(db, {
            ...input,
            fromStatus: current.status as ReviewStatus,
            toStatus: "DRAFT",
        });
    }

    await moveWatchToProcessingIfEditable(db, input.productId);

    return state;
}
