import { ContentStatus, Prisma, ProductStatus, ProductType } from "@prisma/client";
import { type DB, dbOrTx } from "@/server/db/client";

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
            primaryImageUrl: null,
            storefrontImageKey: null,
        },
        select: {
            id: true,
        },
    });

    const watch = await db.watch.create({
        data: {
            productId: product.id,
            acquisitionId: input.acquisitionId,
            gender: "MEN",
            siteChannel: "AFFORDABLE",
            stockStage: "IN_STOCK",
            saleStage: "DRAFT",
            serviceStage: "NOT_REQUIRED",
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
        select: {
            productId: true,
            productTitle: true,
            unitCost: true,
        },
    });

    if (!item?.productId) return null;

    await db.product.update({
        where: { id: item.productId },
        data: {
            title: item.productTitle ?? "Untitled watch",
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

    return { productId: item.productId };
}
