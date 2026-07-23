import {
    AudienceSegment,
    ContentStatus,
    MediaPipelineKey,
    Prisma,
    ProductStatus,
    ProductType,
} from "@prisma/client";
import { type DB, dbOrTx } from "@/server/db/client";
import { getPricingFromDescription } from "../shared/acquisition-item-metadata";

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
        salePrice?: number | null;
        audienceSegment?: AudienceSegment;
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
            gender: input.audienceSegment === AudienceSegment.WOMEN
                ? "WOMEN"
                : input.audienceSegment === AudienceSegment.UNISEX
                    ? "UNISEX"
                    : "MEN",
            audienceSegment: input.audienceSegment ?? AudienceSegment.MEN,
            mediaPipelineKey: input.audienceSegment === AudienceSegment.WOMEN
                ? MediaPipelineKey.WOMEN_LITE
                : input.audienceSegment === AudienceSegment.UNISEX
                    ? MediaPipelineKey.UNISEX_STANDARD
                    : MediaPipelineKey.MEN_STANDARD,
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
            salePrice: input.salePrice == null ? undefined : new Prisma.Decimal(input.salePrice),
        },
        update: {
            costPrice: new Prisma.Decimal(unitCost),
            landedCost: new Prisma.Decimal(unitCost),
            salePrice: input.salePrice == null ? undefined : new Prisma.Decimal(input.salePrice),
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
            description: true,
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
        const proposedSalePrice = getPricingFromDescription(item.description)?.proposedSalePrice;
        await db.watchPrice.upsert({
            where: { watchId: watch.id },
            create: {
                watchId: watch.id,
                costPrice: item.unitCost ?? undefined,
                landedCost: item.unitCost ?? undefined,
                salePrice: proposedSalePrice == null ? undefined : new Prisma.Decimal(proposedSalePrice),
            },
            update: {
                costPrice: item.unitCost ?? undefined,
                landedCost: item.unitCost ?? undefined,
                salePrice: proposedSalePrice == null ? undefined : new Prisma.Decimal(proposedSalePrice),
            },
        });
    }

    return { productId: item.productId };
}
