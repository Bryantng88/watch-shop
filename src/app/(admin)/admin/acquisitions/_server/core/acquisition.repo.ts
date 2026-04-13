import {
    ContentStatus,
    Prisma,
    ProductStatus,
    ProductType,
    AcquisitionType,
} from "@prisma/client";
import { DB, dbOrTx } from "@/server/db/client";
import { genRefNo } from "../../../__components/AutoGenRef";
import { stringifyAcquisitionItemMeta } from "../content/acquisition-item-metadata";

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
    productType?: ProductType | string;
    productId?: string | null;
    variantId?: string | null;
    strapSpec?: any;
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
        strapSpec: input.strapSpec,
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

    if (!vendor) throw new Error("Vendor không tồn tại!");
    return vendor;
}

export async function createDraft(tx: DB, input: CreateDraftInput) {
    const db = getDb(tx);

    await ensureVendorExists(tx, input.vendorId);

    return db.acquisition.create({
        data: {
            vendor: { connect: { id: input.vendorId } },
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
        data: { cost: total },
        select: { id: true, cost: true },
    });
}

export async function updateAcqTotal(tx: DB, acqId: string, total: number) {
    return updateAcquisitionCost(tx, acqId, total);
}

export async function resolveVariantIdForProduct(tx: DB, productId?: string | null) {
    const db = getDb(tx);
    if (!productId) return null;

    const variant = await db.productVariant.findFirst({
        where: { productId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
    });

    return variant?.id ?? null;
}

export async function createAcqItem(
    tx: DB,
    acqId: string,
    item: CreateOrUpdateAcqItemInput
) {
    const db = getDb(tx);
    const productId = item.productId ?? null;
    const variantId =
        item.variantId ?? (productId ? await resolveVariantIdForProduct(tx, productId) : null);

    return db.acquisitionItem.create({
        data: {
            acquisitionId: acqId,
            productTitle: resolveItemTitle(item),
            quantity: Number(item.quantity ?? 1),
            unitCost: resolveItemUnitCost(item),
            productType: (item.productType ?? ProductType.WATCH) as ProductType,
            productId,
            variantId,
            description: buildItemDescription(item),
        },
    });
}

export async function updateAcqItem(
    tx: DB,
    item: CreateOrUpdateAcqItemInput & { id: string }
) {
    const db = getDb(tx);
    const productId = item.productId ?? null;
    const variantId =
        item.variantId ?? (productId ? await resolveVariantIdForProduct(tx, productId) : null);

    const shouldRewriteDescription =
        item.strapSpec !== undefined ||
        item.watchFlags !== undefined ||
        item.quickSpec !== undefined ||
        item.aiMeta !== undefined;

    return db.acquisitionItem.update({
        where: { id: item.id },
        data: {
            productTitle: resolveItemTitle(item),
            quantity: Number(item.quantity ?? 1),
            unitCost: resolveItemUnitCost(item),
            productType: item.productType ? (item.productType as ProductType) : undefined,
            productId,
            variantId,
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
    });
}

export async function getAcqList(
    where: Prisma.AcquisitionWhereInput,
    orderBy: Prisma.AcquisitionOrderByWithRelationInput[],
    skip: number,
    take: number,
    tx?: DB
) {
    const db = getDb(tx);

    const [rows, total] = await Promise.all([
        db.acquisition.findMany({
            where,
            orderBy,
            skip,
            take,
            select: {
                id: true,
                refNo: true,
                type: true,
                accquisitionStt: true,
                createdAt: true,
                cost: true,
                currency: true,
                updatedAt: true,
                notes: true,
                vendor: { select: { id: true, name: true } },
                acquisitionItem: {
                    select: {
                        id: true,
                        status: true,
                        quantity: true,
                        unitCost: true,
                    },
                },
                _count: { select: { invoice: true } },
            },
        }),
        db.acquisition.count({ where }),
    ]);

    return { rows, total };
}

export async function getAcqtById(id: string, tx?: DB) {
    const db = getDb(tx);

    return db.acquisition.findUnique({
        where: { id },
        include: {
            vendor: true,
            customer: true,
            acquisitionItem: {
                include: {
                    product: true,
                    variant: true,
                },
            },
            invoice: true,
        },
    });
}

export async function changeDraftToPost(tx: DB, acqId: string) {
    const db = getDb(tx);

    const itemCount = await db.acquisitionItem.count({
        where: { acquisitionId: acqId },
    });

    if (itemCount === 0) {
        throw new Error("Không thể đăng phiếu trống.");
    }

    const refNo = await genRefNo(db, {
        model: db.acquisition,
        prefix: "PN",
    });

    return db.acquisition.update({
        where: { id: acqId },
        data: {
            refNo,
            accquisitionStt: "POSTED",
        },
        select: {
            id: true,
            accquisitionStt: true,
        },
    });
}

export async function createWatchProduct(tx: DB, input: {
    title: string;
    sku: string;
    vendorId: string;
    productType: any;
    primaryImageUrl?: string | null;
    nickname?: string | null;
    specStatus?: string | null;
    brandConnect?: { connect: { id: string } } | undefined;
}) {
    const db = getDb(tx);

    return db.product.create({
        data: {
            title: input.title,
            sku: input.sku,
            nickname: input.nickname ?? null,
            specStatus: input.specStatus ?? "PENDING",
            status: ProductStatus.AVAILABLE,
            contentStatus: ContentStatus.DRAFT,
            type: input.productType,
            primaryImageUrl: input.primaryImageUrl ?? null,
            vendor: { connect: { id: input.vendorId } },
            ...(input.brandConnect ? { brand: input.brandConnect } : {}),
        },
        select: {
            id: true,
            sku: true,
            primaryImageUrl: true,
        },
    });
}

export async function createWatchVariant(tx: DB, input: {
    productId: string;
    sku: string;
    quantity?: number | null;
    unitCost?: number | null;
}) {
    const db = getDb(tx);

    return db.productVariant.create({
        data: {
            productId: input.productId,
            sku: input.sku,
            stockQty: Number(input.quantity ?? 1),
            costPrice: new Prisma.Decimal(Number(input.unitCost ?? 0)),
            availabilityStatus: "HIDDEN" as any,
        },
        select: {
            id: true,
            sku: true,
        },
    });
}

export async function createStrapProduct(tx: DB, input: {
    title: string;
    vendorId: string;
    primaryImageUrl?: string | null;
    sku: string;
    quantity?: number | null;
    unitCost?: number | null;
    strapSpec?: {
        lugWidthMM?: number | null;
        buckleWidthMM?: number | null;
        color?: string | null;
        material?: string | null;
        quickRelease?: boolean | null;
        sellPrice?: number | null;
    } | null;
}) {
    const db = getDb(tx);

    return db.product.create({
        data: {
            title: input.title,
            status: ProductStatus.AVAILABLE,
            contentStatus: ContentStatus.DRAFT,
            type: "WATCH_STRAP" as any,
            vendor: { connect: { id: input.vendorId } },
            primaryImageUrl: input.primaryImageUrl ?? null,
            variants: {
                create: [
                    {
                        sku: input.sku,
                        stockQty: Number(input.quantity ?? 1),
                        costPrice: new Prisma.Decimal(Number(input.unitCost ?? 0)),
                        price: new Prisma.Decimal(
                            input.strapSpec?.sellPrice != null
                                ? Number(input.strapSpec.sellPrice)
                                : Number(input.unitCost ?? 0)
                        ),
                        availabilityStatus: "HIDDEN" as any,
                        strapSpec: {
                            create: {
                                lugWidthMM: Number(input.strapSpec?.lugWidthMM ?? 20),
                                buckleWidthMM: Number(input.strapSpec?.buckleWidthMM ?? 18),
                                color: input.strapSpec?.color ?? "Black",
                                material: (input.strapSpec?.material as any) ?? "LEATHER",
                                quickRelease:
                                    input.strapSpec?.quickRelease == null
                                        ? true
                                        : Boolean(input.strapSpec.quickRelease),
                            },
                        },
                    },
                ],
            },
        },
        select: {
            id: true,
            variants: { select: { id: true }, take: 1 },
        },
    });
}

export async function linkAcquisitionItemToProduct(tx: DB, input: {
    itemId: string;
    productId: string;
    variantId?: string | null;
}) {
    const db = getDb(tx);

    return db.acquisitionItem.update({
        where: { id: input.itemId },
        data: {
            productId: input.productId,
            variantId: input.variantId ?? null,
        },
    });
}

export async function updateAcquisitionItemStatus(tx: DB, input: {
    acquisitionId?: string;
    itemId?: string;
    fromStatus?: string;
    toStatus: string;
}) {
    const db = getDb(tx);

    if (input.itemId) {
        return db.acquisitionItem.update({
            where: { id: input.itemId },
            data: { status: input.toStatus as any },
        });
    }

    if (!input.acquisitionId) {
        throw new Error("Thiếu acquisitionId hoặc itemId để update status.");
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

export async function archiveProductForCancelledAcquisitionItem(tx: DB, input: {
    productId: string;
}) {
    const db = getDb(tx);

    await db.product.update({
        where: { id: input.productId },
        data: {
            status: ProductStatus.HOLD,
            contentStatus: ContentStatus.ARCHIVED,
        },
    });

    await db.productVariant.updateMany({
        where: { productId: input.productId },
        data: {
            stockQty: 0,
            availabilityStatus: "HIDDEN" as any,
        },
    });
}

export async function syncLinkedProductFromAcquisitionItem(tx: DB, itemId: string) {
    const db = getDb(tx);

    const item = await db.acquisitionItem.findUnique({
        where: { id: itemId },
        include: {
            product: true,
            variant: true,
        },
    });

    if (!item?.productId) return;

    await db.product.update({
        where: { id: item.productId },
        data: {
            title: item.productTitle ?? "Untitled watch",
        },
    });

    if (item.variantId) {
        await db.productVariant.update({
            where: { id: item.variantId },
            data: {
                stockQty: Number(item.quantity ?? 0),
                costPrice: item.unitCost ?? undefined,
            },
        });
    }
}