import type { DB } from "@/server/db/client";
import { dbOrTx, withDbTransaction } from "@/server/db/client";
import { Prisma } from "@prisma/client";

const watchDownloadGallerySelect =
    Prisma.validator<Prisma.WatchSelect>()({
        id: true,
        productId: true,
        reviewStates: {
            select: {
                targetType: true,
                status: true,
            },
        },
        product: {
            select: {
                id: true,
                title: true,
                sku: true,
                productImage: {
                    where: {
                        role: "GALLERY",
                    },
                    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                    select: {
                        id: true,
                        fileKey: true,
                        role: true,
                        sortOrder: true,
                        mime: true,
                    },
                },
            },
        },
    });
export type WatchDownloadGallerySnapshot =
    Prisma.WatchGetPayload<{
        select: typeof watchDownloadGallerySelect;
    }>;


export async function getWatchDownloadGallerySnapshotRepo(
    db: DB,
    productId: string
): Promise<WatchDownloadGallerySnapshot | null> {
    const client = dbOrTx(db);

    return client.watch.findUnique({
        where: { productId },
        select: watchDownloadGallerySelect,
    });
}
export async function markWatchImageDownloadedRepo(
    db: DB,
    productId: string
) {
    return withDbTransaction(db, async (tx) => {
        const watch = await tx.watch.findUnique({
            where: { productId },
            select: {
                id: true,
                isContentDownloaded: true,
            },
        });

        if (!watch) throw new Error("Không tìm thấy watch");

        return tx.watch.update({
            where: { id: watch.id },
            data: {
                isImageDownloaded: true,
            },
            select: {
                isContentDownloaded: true,
                isImageDownloaded: true,
            },
        });
    });
}