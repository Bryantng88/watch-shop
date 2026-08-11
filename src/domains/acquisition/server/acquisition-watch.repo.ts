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

function requirePositiveMillimeters(value: unknown, label: string) {
    const millimeters = Math.trunc(Number(value));
    if (!Number.isFinite(millimeters) || millimeters <= 0) {
        throw new Error(`${label} phải lớn hơn 0 mm.`);
    }
    return millimeters;
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
    const quantity = Math.max(1, Math.trunc(input.quantity));
    const material = String(input.spec.material ?? "LEATHER") as Strap;
    const lugWidthMM = requirePositiveMillimeters(input.spec.lugWidthMM, "Kích thước đầu lug");
    const buckleWidthMM = requirePositiveMillimeters(input.spec.buckleWidthMM, "Kích thước đầu khóa");
    const color = String(input.spec.color ?? "").trim() || null;
    const quickRelease = Boolean(input.spec.quickRelease);
    const originType = String(input.spec.originType ?? "AFTERMARKET") as StrapOriginType;
    const brandName = String(input.spec.brandName ?? "").trim() || null;
    const leatherType = String(input.spec.leatherType ?? "").trim() || null;
    const surface = input.spec.surface ? String(input.spec.surface) as StrapSurface : null;
    const identityKey = [material, lugWidthMM, buckleWidthMM, color?.toLocaleUpperCase("vi") ?? "", originType, brandName?.toLocaleUpperCase("vi") ?? "", leatherType?.toUpperCase() ?? "", surface ?? "", quickRelease ? "1" : "0"].join("|");

    await db.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${identityKey}, 0))`;
    const existing = await db.productVariant.findFirst({
        where: {
            Product: { type: ProductType.WATCH_STRAP, specStatus: { not: "MERGED" } },
            StrapVariantSpec: {
                material,
                lugWidthMM,
                buckleWidthMM,
                color: color ? { equals: color, mode: "insensitive" } : null,
                quickRelease,
                originType,
                brandName: brandName ? { equals: brandName, mode: "insensitive" } : null,
                leatherType,
                surface,
                inventoryPolicy: "STOCKED",
            },
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, productId: true, stockQty: true, costPrice: true },
    });

    if (existing) {
        const balanceAfter = existing.stockQty + quantity;
        const previousCost = Number(existing.costPrice ?? 0);
        const weightedCost = ((previousCost * existing.stockQty) + (input.unitCost * quantity)) / balanceAfter;
        await db.productVariant.update({
            where: { id: existing.id },
            data: {
                stockQty: balanceAfter,
                costPrice: new Prisma.Decimal(weightedCost),
                price: new Prisma.Decimal(Number(input.spec.sellPrice ?? 0)),
                updatedAt: new Date(),
            },
        });
        await db.strapInventoryMovement.create({
            data: {
                strapVariantId: existing.id,
                movementType: "RECEIPT",
                quantity,
                balanceAfter,
                sourceType: "ACQUISITION_ITEM",
                sourceId: input.acquisitionItemId,
            },
        });
        await db.acquisitionItem.update({
            where: { id: input.acquisitionItemId },
            data: { productId: existing.productId, variantId: existing.id },
        });
        return { productId: existing.productId, variantId: existing.id, created: false, balanceAfter };
    }

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
        stockQty: quantity,
        costPrice: new Prisma.Decimal(input.unitCost),
        price: new Prisma.Decimal(Number(input.spec.sellPrice ?? 0)),
        updatedAt: new Date(),
        StrapVariantSpec: { create: {
            material,
            lugWidthMM,
            buckleWidthMM,
            color,
            quickRelease,
            originType,
            brandName,
            leatherType,
            surface,
            inventoryPolicy: "STOCKED",
            updatedAt: new Date(),
        } },
    }, select: { id: true } });
    await db.strapInventoryMovement.create({
        data: {
            strapVariantId: variant.id,
            movementType: "RECEIPT",
            quantity,
            balanceAfter: quantity,
            sourceType: "ACQUISITION_ITEM",
            sourceId: input.acquisitionItemId,
        },
    });
    await db.acquisitionItem.update({ where: { id: input.acquisitionItemId }, data: { productId: product.id, variantId: variant.id } });
    return { productId: product.id, variantId: variant.id, created: true, balanceAfter: quantity };
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
