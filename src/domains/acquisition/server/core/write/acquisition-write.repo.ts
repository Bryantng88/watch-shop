import { randomUUID } from "crypto";
import {
    ContentStatus,
    Prisma,
    ProductStatus,
    ProductType,
    type AcquisitionType,
} from "@prisma/client";
import { DB, dbOrTx } from "@/server/db/client";
import {
    stringifyAcquisitionItemMeta,
    getAiMetaFromDescription,
} from "../../metadata";

type CreateDraftInput = {
    vendorId: string;
    currency?: string;
    type?: AcquisitionType;
    createdAt?: Date;
    notes?: string | null;
};

type CreateOrUpdateAcqItemInput = {
    id?: string;
    title?: string;
    productTitle?: string;
    quantity?: number;
    unitCost?: number;
    unitPrice?: number;
    watchFlags?: any;
    quickSpec?: any;
    aiMeta?: any;
};

function getDb(tx?: DB) {
    return dbOrTx(tx);
}

function resolveItemTitle(input: CreateOrUpdateAcqItemInput) {
    return String(input.productTitle ?? input.title ?? "").trim() || "Untitled watch";
}

function resolveItemUnitCost(input: CreateOrUpdateAcqItemInput) {
    return Number(input.unitCost ?? input.unitPrice ?? 0);
}

function buildItemDescription(input: CreateOrUpdateAcqItemInput) {
    return stringifyAcquisitionItemMeta({
        watchFlags: input.watchFlags,
        quickSpec: input.quickSpec,
        aiMeta: input.aiMeta,
    });
}

export async function ensureVendorExists(tx: DB, vendorId: string) {
    const db = getDb(tx);

    const vendor = await db.vendor.findUnique({
        where: { id: vendorId },
        select: { id: true },
    });

    if (!vendor) {
        throw new Error("Vendor không tồn tại");
    }

    return vendor;
}

export async function createDraft(tx: DB, input: CreateDraftInput) {
    const db = getDb(tx);

    await ensureVendorExists(tx, input.vendorId);

    return db.acquisition.create({
        data: {
            vendorId: input.vendorId,
            acquiredAt: input.createdAt ?? new Date(),
            currency: input.currency ?? "VND",
            accquisitionStt: "DRAFT",
            type: input.type ?? "PURCHASE",
            notes: input.notes ?? null,
            cost: new Prisma.Decimal(0),
        },
        select: { id: true },
    });
}

export async function updateAcquisitionCost(tx: DB, acqId: string, total: number) {
    const db = getDb(tx);

    return db.acquisition.update({
        where: { id: acqId },
        data: { cost: new Prisma.Decimal(Number(total || 0)) },
        select: { id: true, cost: true },
    });
}

export async function updateAcqTotal(tx: DB, acqId: string, total: number) {
    return updateAcquisitionCost(tx, acqId, total);
}

export async function createAcqItem(
    tx: DB,
    acqId: string,
    item: CreateOrUpdateAcqItemInput
) {
    const db = getDb(tx);

    return db.acquisitionItem.create({
        data: {
            acquisitionId: acqId,
            productTitle: resolveItemTitle(item),
            quantity: 1,
            unitCost: resolveItemUnitCost(item),
            productType: ProductType.WATCH,
            productId: null,
            variantId: null,
            description: buildItemDescription(item),
        },
        select: {
            id: true,
            productTitle: true,
            quantity: true,
            unitCost: true,
            productType: true,
            productId: true,
            variantId: true,
            description: true,
        },
    });
}

export async function updateAcqItem(
    tx: DB,
    item: CreateOrUpdateAcqItemInput & { id: string }
) {
    const db = getDb(tx);

    const shouldRewriteDescription =
        item.watchFlags !== undefined ||
        item.quickSpec !== undefined ||
        item.aiMeta !== undefined;

    return db.acquisitionItem.update({
        where: { id: item.id },
        data: {
            productTitle: resolveItemTitle(item),
            quantity: 1,
            unitCost: resolveItemUnitCost(item),
            ...(shouldRewriteDescription
                ? { description: buildItemDescription(item) }
                : {}),
        },
    });
}

export async function deleteAcqItems(tx: DB, ids: string[]) {
    const db = getDb(tx);
    if (!ids.length) return;

    await db.acquisitionItem.deleteMany({
        where: { id: { in: ids } },
    });
}

export async function findAcqItems(tx: DB, acqId: string) {
    const db = getDb(tx);

    return db.acquisitionItem.findMany({
        where: { acquisitionId: acqId },
        include: {
            Product: true,
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
}

export async function getAcqtById(id: string, tx?: DB) {
    const db = getDb(tx);

    return db.acquisition.findUnique({
        where: { id },
        include: {
            Vendor: true,
            Customer: true,
            AcquisitionItem: {
                include: {
                    Product: true,
                },
                orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            },
            Invoice: true,
        },
    });
}

export async function linkAcquisitionItemToProduct(
    tx: DB,
    input: {
        itemId: string;
        productId: string;
    }
) {
    const db = getDb(tx);

    return db.acquisitionItem.update({
        where: { id: input.itemId },
        data: {
            productId: input.productId,
            variantId: null,
        },
        select: {
            id: true,
            productId: true,
            variantId: true,
        },
    });
}

export async function updateAcquisitionItemStatus(
    tx: DB,
    input:
        | {
            itemId: string;
            toStatus: string;
        }
        | {
            acquisitionId: string;
            fromStatus?: string;
            toStatus: string;
        }
) {
    const db = getDb(tx);

    if ("itemId" in input) {
        return db.acquisitionItem.update({
            where: { id: input.itemId },
            data: { status: input.toStatus as any },
        });
    }

    return db.acquisitionItem.updateMany({
        where: {
            acquisitionId: input.acquisitionId,
            ...(input.fromStatus ? { status: input.fromStatus as any } : {}),
        },
        data: {
            status: input.toStatus as any,
        },
    });
}

export async function changeDraftToPost(tx: DB, acqId: string) {
    const db = getDb(tx);

    const itemCount = await db.acquisitionItem.count({
        where: { acquisitionId: acqId },
    });

    if (itemCount === 0) {
        throw new Error("Không thể duyệt phiếu trống");
    }

    const current = await db.acquisition.findUnique({
        where: { id: acqId },
        select: {
            id: true,
            refNo: true,
            accquisitionStt: true,
        },
    });

    if (!current) {
        throw new Error("Không tìm thấy phiếu nhập");
    }

    if (current.accquisitionStt === "POSTED") {
        return current;
    }

    const postedCount = await db.acquisition.count({
        where: {
            refNo: {
                startsWith: "PN-",
            },
        },
    });

    const refNo = current.refNo ?? `PN-${String(postedCount + 1).padStart(6, "0")}`;

    return db.acquisition.update({
        where: { id: acqId },
        data: {
            refNo,
            accquisitionStt: "POSTED",
        },
        select: {
            id: true,
            refNo: true,
            accquisitionStt: true,
        },
    });
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
            Product: true,
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