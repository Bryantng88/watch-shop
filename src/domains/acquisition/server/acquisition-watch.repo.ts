import {
    AudienceSegment,
    ContentStatus,
    MediaPipelineKey,
    Prisma,
    ProductStatus,
    ProductType,
    Strap,
    StrapClaspType,
    StrapOriginType,
    StrapSurface,
} from "@prisma/client";
import { type DB, dbOrTx } from "@/server/db/client";
import { getPricingFromDescription } from "../shared/acquisition-item-metadata";

function getDb(tx?: DB) {
    return dbOrTx(tx);
}

export async function createStrapDraftForAcquisitionItem(tx: DB, input: {
    acquisitionItemId: string;
    vendorId: string | null;
    title: string;
    quantity: number;
    unitCost: number;
    spec: Record<string, unknown>;
}) {
    const db = getDb(tx);
    const product = await db.product.create({ data: {
        type: ProductType.WATCH_STRAP,
        title: input.title,
        vendorId: input.vendorId,
        status: ProductStatus.AVAILABLE,
        contentStatus: ContentStatus.DRAFT,
        specStatus: "COMPLETE",
    }, select: { id: true } });
    const variant = await db.productVariant.create({ data: {
        productId: product.id,
        stockQty: Math.max(0, Math.trunc(input.quantity)),
        costPrice: new Prisma.Decimal(input.unitCost),
        price: new Prisma.Decimal(Number(input.spec.sellPrice ?? 0)),
        updatedAt: new Date(),
        StrapVariantSpec: { create: {
            material: String(input.spec.material ?? "LEATHER") as Strap,
            lugWidthMM: Number(input.spec.lugWidthMM ?? 0),
            buckleWidthMM: input.spec.buckleWidthMM == null ? null : Number(input.spec.buckleWidthMM),
            color: String(input.spec.color ?? "").trim() || null,
            quickRelease: Boolean(input.spec.quickRelease),
            originType: String(input.spec.originType ?? "AFTERMARKET") as StrapOriginType,
            brandName: String(input.spec.brandName ?? "").trim() || null,
            leatherType: String(input.spec.leatherType ?? "").trim() || null,
            surface: input.spec.surface ? String(input.spec.surface) as StrapSurface : null,
            inventoryPolicy: "STOCKED",
            updatedAt: new Date(),
        } },
    }, select: { id: true } });
    await db.acquisitionItem.update({ where: { id: input.acquisitionItemId }, data: { productId: product.id, variantId: variant.id } });
    return { productId: product.id, variantId: variant.id };
}

export async function createClaspDraftForAcquisitionItem(tx: DB, input: {
    acquisitionItemId: string;
    vendorId: string | null;
    title: string;
    quantity: number;
    unitCost: number;
    spec: Record<string, unknown>;
}) {
    const db = getDb(tx);
    const product = await db.product.create({ data: {
        type: ProductType.WATCH_CLASP,
        title: input.title,
        vendorId: input.vendorId,
        status: ProductStatus.AVAILABLE,
        contentStatus: ContentStatus.DRAFT,
        specStatus: "COMPLETE",
    }, select: { id: true } });
    const variant = await db.productVariant.create({ data: {
        productId: product.id,
        stockQty: Math.max(0, Math.trunc(input.quantity)),
        costPrice: new Prisma.Decimal(input.unitCost),
        price: new Prisma.Decimal(Number(input.spec.sellPrice ?? 0)),
        updatedAt: new Date(),
        ClaspVariantSpec: { create: {
            claspType: String(input.spec.claspType ?? "PIN_BUCKLE") as StrapClaspType,
            widthMM: Number(input.spec.widthMM ?? 0),
            originType: String(input.spec.originType ?? "AFTERMARKET") as StrapOriginType,
            brandName: String(input.spec.brandName ?? "").trim() || null,
            color: String(input.spec.color ?? "").trim() || null,
            finish: String(input.spec.finish ?? "").trim() || null,
        } },
    }, select: { id: true } });
    await db.acquisitionItem.update({ where: { id: input.acquisitionItemId }, data: { productId: product.id, variantId: variant.id } });
    return { productId: product.id, variantId: variant.id };
}

export async function createWatchDraftForAcquisitionItem(
    tx: DB,
    input: {
        acquisitionItemId: string;
        acquisitionId: string;
        vendorId: string | null;
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
            // HOLD is owned exclusively by an active OrderItem. Acquisition
            // creates inventory; Watch.saleStage carries its preparation state.
            status: ProductStatus.AVAILABLE,
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
            acquisition: { select: { type: true } },
        },
    });

    if (!item?.productId) return null;

    const isReturningSoldWatch = item.acquisition.type === "BUY_BACK" || item.acquisition.type === "TRADE_IN";
    if (!isReturningSoldWatch) {
        await db.product.update({
            where: { id: item.productId },
            data: {
                title: item.productTitle ?? "Untitled watch",
            },
        });
    }

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
