import { randomUUID } from "crypto";
import { ContentStatus, Prisma, ProductStatus, ProductType } from "@prisma/client";
import { type DB, dbOrTx } from "@/server/db/client";
import { getAiMetaFromDescription } from "./metadata";

function getDb(tx?: DB) {
    return dbOrTx(tx);
}

export async function createWatchDraftForAcquisitionItem(
    tx: DB,
    input: {
        acquisitionItemId: string;
        acquisitionId: string;
        vendorId: string;
        title: string;
        unitCost?: number | null;
        imageKey?: string | null;
        imageUrl?: string | null;
    }
) {
    const db = getDb(tx);
    const unitCost = Number(input.unitCost ?? 0);

    const product = await db.product.create({
        data: {
            type: ProductType.WATCH,
            title: input.title,
            vendorId: input.vendorId,
            status: ProductStatus.HOLD,
            contentStatus: ContentStatus.DRAFT,
            specStatus: "PENDING",
            sku: null,
            primaryImageUrl: input.imageUrl ?? null,
            storefrontImageKey: input.imageKey ?? null,
        },
        select: {
            id: true,
            primaryImageUrl: true,
            storefrontImageKey: true,
        },
    });

    const watch = await db.watch.create({
        data: {
            productId: product.id,
            acquisitionId: input.acquisitionId,
            gender: "MEN",
            siteChannel: "AFFORDABLE",
            stockState: "IN_STOCK",
            saleState: "OFF_SHELF",
            serviceState: "PENDING",
        },
        select: {
            id: true,
            productId: true,
        },
    });

    await db.watchPrice.upsert({
        where: { watchId: watch.id },
        create: {
            watchId: watch.id,
            costPrice: new Prisma.Decimal(unitCost),
            landedCost: new Prisma.Decimal(unitCost),
        },
        update: {
            costPrice: new Prisma.Decimal(unitCost),
            landedCost: new Prisma.Decimal(unitCost),
        },
    });

    await db.watchContent.upsert({
        where: { watchId: watch.id },
        create: {
            watchId: watch.id,
            bulletSpecs: [],
        },
        update: {},
    });

    if (input.imageKey) {
        await db.productImage.create({
            data: {
                id: randomUUID(),
                productId: product.id,
                fileKey: input.imageKey,
                role: "INLINE" as any,
                sortOrder: 0,
                isPrimary: true,
                isForAdmin: true,
                isForStorefront: true,
            },
        });
    }

    await db.acquisitionItem.update({
        where: { id: input.acquisitionItemId },
        data: {
            productId: product.id,
            variantId: null,
        },
    });

    return {
        productId: product.id,
        watchId: watch.id,
    };
}

export async function syncLinkedProductFromAcquisitionItem(tx: DB, itemId: string) {
    const db = getDb(tx);

    const item = await db.acquisitionItem.findUnique({
        where: { id: itemId },
        include: {
            product: true,
        },
    });

    if (!item?.productId) return;

    const aiMeta = getAiMetaFromDescription(item.description);
    const firstImage = Array.isArray(aiMeta?.images) ? aiMeta.images[0] : null;

    await db.product.update({
        where: { id: item.productId },
        data: {
            title: item.productTitle ?? "Untitled watch",
            primaryImageUrl: firstImage?.url ?? undefined,
            storefrontImageKey: firstImage?.key ?? undefined,
        },
    });

    const watch = await db.watch.findUnique({
        where: { productId: item.productId },
        select: { id: true },
    });

    if (watch?.id) {
        await db.watchPrice.upsert({
            where: { watchId: watch.id },
            create: {
                watchId: watch.id,
                costPrice: item.unitCost ?? undefined,
                landedCost: item.unitCost ?? undefined,
            },
            update: {
                costPrice: item.unitCost ?? undefined,
                landedCost: item.unitCost ?? undefined,
            },
        });
    }

    await db.productImage.deleteMany({
        where: {
            productId: item.productId,
            role: "INLINE" as any,
            isPrimary: true,
        },
    });

    if (firstImage?.key) {
        await db.productImage.create({
            data: {
                id: randomUUID(),
                productId: item.productId,
                fileKey: firstImage.key,
                role: "INLINE" as any,
                sortOrder: 0,
                isPrimary: true,
                isForAdmin: true,
                isForStorefront: true,
            },
        });
    }
}
