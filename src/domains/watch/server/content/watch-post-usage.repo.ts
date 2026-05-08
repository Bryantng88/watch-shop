import type { Prisma } from "@prisma/client";

export type WatchPostUsageKind = "CONTENT_COPIED" | "IMAGE_DOWNLOADED";

type Tx = Prisma.TransactionClient;

export async function getWatchPostUsageStateRepo(tx: Tx, productId: string) {
    return tx.watch.findUnique({
        where: { productId },
        select: {
            id: true,
            productId: true,
            saleState: true,
            isContentDownloaded: true,
            isImageDownloaded: true,
            watchContent: {
                select: {
                    id: true,
                    titleOverride: true,
                    body: true,
                    hookText: true,
                    summary: true,
                    bulletSpecs: true,
                },
            },
            reviewStates: {
                select: {
                    targetType: true,
                    status: true,
                },
            },
            product: {
                select: {
                    id: true,
                    productImage: {
                        where: {
                            role: "GALLERY",
                        },
                        select: {
                            id: true,
                        },
                        take: 1,
                    },
                },
            },
        },
    });
}

export async function markWatchPostUsageRepo(
    tx: Tx,
    productId: string,
    kind: WatchPostUsageKind
) {
    return tx.watch.update({
        where: { productId },
        data: {
            ...(kind === "CONTENT_COPIED"
                ? { isContentDownloaded: true }
                : { isImageDownloaded: true }),
            updatedAt: new Date(),
        },
        select: {
            productId: true,
            isContentDownloaded: true,
            isImageDownloaded: true,
        },
    });
}
