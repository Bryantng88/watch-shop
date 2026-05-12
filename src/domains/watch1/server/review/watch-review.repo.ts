import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import type { WatchReviewAction, WatchReviewStatus, WatchReviewTargetType } from "./watch-review.types";

export async function getWatchReviewTargetRepo(
    db: DB,
    productId: string,
    targetType: WatchReviewTargetType
) {
    const client = dbOrTx(db);

    return client.watch.findUnique({
        where: { productId },
        select: {
            id: true,
            productId: true,
            reviewStates: {
                where: { targetType },
                take: 1,
            },
        },
    });
}

export async function ensureWatchReviewStateRepo(
    db: DB,
    input: {
        watchId: string;
        productId: string;
        targetType: WatchReviewTargetType;
    }
) {
    const client = dbOrTx(db);

    return client.watchReviewState.upsert({
        where: {
            watchId_targetType: {
                watchId: input.watchId,
                targetType: input.targetType as any,
            },
        },
        create: {
            watchId: input.watchId,
            productId: input.productId,
            targetType: input.targetType as any,
            status: "DRAFT" as any,
        },
        update: {},
    });
}

export async function updateWatchReviewStatusRepo(
    db: DB,
    input: {
        productId: string;
        targetType: WatchReviewTargetType;
        status: WatchReviewStatus;
        action: WatchReviewAction;
        userId?: string | null;
        reviewNote?: string | null;
    }
) {
    const client = dbOrTx(db);

    return client.$transaction(async (tx: any) => {
        const watch = await tx.watch.findUnique({
            where: { productId: input.productId },
            select: { id: true, productId: true },
        });

        if (!watch) throw new Error("Không tìm thấy watch.");

        const current = await tx.watchReviewState.upsert({
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

        const now = new Date();
        const data: any = {
            status: input.status,
            reviewNote: input.reviewNote ?? null,
        };

        if (input.action === "SUBMIT") {
            data.submittedAt = now;
            data.submittedById = input.userId ?? null;
            data.reviewedAt = null;
            data.reviewedById = null;
        }

        if (input.action === "APPROVE" || input.action === "REJECT" || input.action === "AUTO_APPROVE") {
            data.reviewedAt = now;
            data.reviewedById = input.userId ?? null;
        }

        if (input.action === "RESET_DRAFT") {
            data.reviewedAt = null;
            data.reviewedById = null;
            data.reviewNote = null;
        }

        const updated = await tx.watchReviewState.update({
            where: { id: current.id },
            data,
        });

        await tx.watchReviewLog.create({
            data: {
                reviewStateId: current.id,
                action: input.action,
                fromStatus: current.status,
                toStatus: input.status,
                actorId: input.userId ?? null,
                note: input.reviewNote ?? null,
            },
        });

        return updated;
    });
}
