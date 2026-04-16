import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";

export async function getWatchBridgeRow(db: DB, productId: string) {
    const client = dbOrTx(db);

    return client.watch.findUnique({
        where: { productId },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                    type: true,
                    sku: true,
                    primaryImageUrl: true,
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            },
            watchSpecV2: {
                select: {
                    model: true,
                    referenceNumber: true,
                },
            },
            watchPrice: {
                select: {
                    listPrice: true,
                    salePrice: true,
                },
            },
        },
    });
}