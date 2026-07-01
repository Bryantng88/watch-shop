import { AcquisitionStatus, OrderStatus, AcquisitionType, Prisma, ProductStatus, WatchSaleStage, WatchStockStage } from "@prisma/client";

import { prisma, type DB, dbOrTx } from "@/server/db/client";

function money(value: unknown) {
    const amount = Number(value ?? 0);

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Giá mua lại phải lớn hơn 0.");
    }

    return new Prisma.Decimal(amount);
}

function cleanText(value?: string | null) {
    const text = String(value ?? "").trim();
    return text.length ? text : null;
}

async function resolveLatestSoldOrderForProduct(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    return db.orderItem.findFirst({
        where: {
            productId,
            order: {
                status: {
                    notIn: [
                        OrderStatus.DRAFT,
                        OrderStatus.CANCELLED,
                    ],
                },
            },
        },
        orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
        ],
        select: {
            id: true,
            orderId: true,
            unitPriceAgreed: true,
            listPrice: true,
            order: {
                select: {
                    id: true,
                    refNo: true,
                    customerId: true,
                    customerName: true,
                    createdAt: true,
                },
            },
        },
    });
}

async function assertNoOpenBuyBackDraft(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    const existing = await db.acquisitionItem.findFirst({
        where: {
            productId,
            acquisition: {
                type: AcquisitionType.BUY_BACK,
                accquisitionStt: AcquisitionStatus.DRAFT,
            },
        },
        select: {
            acquisitionId: true,
            acquisition: {
                select: {
                    id: true,
                    refNo: true,
                },
            },
        },
    });

    if (existing?.acquisitionId) {
        throw new Error(
            `Watch này đã có phiếu buy back DRAFT (${existing.acquisition?.refNo ?? existing.acquisitionId}). Vui lòng xử lý phiếu đó trước.`,
        );
    }
}

async function hasContent(tx: DB, watchId: string) {
    const db = dbOrTx(tx);

    const content = await db.watchContent.findUnique({
        where: { watchId },
        select: {
            body: true,
            hookText: true,
            titleOverride: true,
            bulletSpecs: true,
        },
    });

    if (!content) return false;

    const hasText = [content.body, content.hookText, content.titleOverride].some((value) =>
        String(value ?? "").trim().length > 0,
    );

    const hasBullets = Array.isArray(content.bulletSpecs)
        ? content.bulletSpecs.length > 0
        : Boolean(content.bulletSpecs);

    return hasText || hasBullets;
}

async function hasGalleryImage(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    const count = await db.productImage.count({
        where: {
            productId,
        },
    });

    return count > 0;
}

async function resolveSaleStageAfterBuyBackPost(
    tx: DB,
    input: {
        productId: string;
        watchId: string;
    },
) {
    const [contentReady, imageReady] = await Promise.all([
        hasContent(tx, input.watchId),
        hasGalleryImage(tx, input.productId),
    ]);

    return contentReady && imageReady
        ? WatchSaleStage.READY
        : WatchSaleStage.PROCESSING;
}

export async function createBuyBackFromProduct(input: {
    productId: string;
    unitCost: number;
    notes?: string | null;
    customerId?: string | null;
    needService?: boolean;
}) {
    const productId = String(input.productId ?? "").trim();

    if (!productId) {
        throw new Error("Thiếu productId.");
    }

    return prisma.$transaction(async (tx) => {
        const watch = await tx.watch.findUnique({
            where: { productId },
            select: {
                id: true,
                productId: true,
                saleStage: true,
                product: {
                    select: {
                        id: true,
                        title: true,
                        sku: true,
                        status: true,
                    },
                },
            },
        });

        if (!watch) {
            throw new Error("Không tìm thấy watch.");
        }

        const productStatus = String(watch.product?.status ?? "").toUpperCase();
        const saleStage = String(watch.saleStage ?? "").toUpperCase();

        if (productStatus !== ProductStatus.SOLD && saleStage !== WatchSaleStage.SOLD) {
            throw new Error("Chỉ watch SOLD mới được tạo phiếu buy back.");
        }

        await assertNoOpenBuyBackDraft(tx as any, productId);

        const soldOrderItem = await resolveLatestSoldOrderForProduct(tx as any, productId);
        const customerId = cleanText(input.customerId) ?? soldOrderItem?.order.customerId ?? null;
        const noteLines = [
            cleanText(input.notes),
            soldOrderItem?.order?.refNo
                ? `Buy back từ order ${soldOrderItem.order.refNo}`
                : soldOrderItem?.orderId
                    ? `Buy back từ order ${soldOrderItem.orderId}`
                    : null,
            soldOrderItem?.id ? `Source order item: ${soldOrderItem.id}` : null,
        ].filter(Boolean);

        const acquisition = await tx.acquisition.create({
            data: {
                vendorId: null,
                customerId,
                type: AcquisitionType.BUY_BACK,
                acquiredAt: new Date(),
                currency: "VND",
                accquisitionStt: AcquisitionStatus.DRAFT,
                notes: noteLines.join("\n") || null,
                totalAmount: money(input.unitCost),
            },
            select: {
                id: true,
                refNo: true,
                accquisitionStt: true,
                type: true,
            },
        });

        await tx.acquisitionItem.create({
            data: {
                acquisitionId: acquisition.id,
                productId,
                variantId: null,
                productType: "WATCH" as any,
                productTitle: watch.product?.title ?? "Watch buy back",
                quantity: 1,
                unitCost: money(input.unitCost),
                currency: "VND",
                status: "DRAFT" as any,
                kind: "PRODUCT" as any,
                capitalizeToProduct: true,
                sourceOrderItemId: soldOrderItem?.id ?? null,
                notes: cleanText(input.notes),
                description: JSON.stringify({
                    source: "BUY_BACK_FROM_WATCH",
                    productId,
                    sku: watch.product?.sku ?? null,
                    sourceOrderId: soldOrderItem?.orderId ?? null,
                    sourceOrderRefNo: soldOrderItem?.order?.refNo ?? null,
                    previousSaleStage: watch.saleStage,
                    previousProductStatus: watch.product?.status ?? null,
                }),
            },
        });

        return {
            id: acquisition.id,
            acquisitionId: acquisition.id,
            refNo: acquisition.refNo,
            status: acquisition.accquisitionStt,
            type: acquisition.type,
        };
    });
}

export async function createConsignToFromProduct(input: {
    productId: string;
    vendorId: string;
    notes?: string | null;
}) {
    const productId = String(input.productId ?? "").trim();
    const vendorId = String(input.vendorId ?? "").trim();

    if (!productId) {
        throw new Error("Thieu productId.");
    }

    if (!vendorId) {
        throw new Error("Thieu vendorId.");
    }

    return prisma.$transaction(async (tx) => {
        const watch = await tx.watch.findUnique({
            where: { productId },
            select: {
                id: true,
                productId: true,
                product: {
                    select: {
                        id: true,
                        title: true,
                        sku: true,
                    },
                },
            },
        });

        if (!watch) {
            throw new Error("Khong tim thay watch.");
        }

        const vendor = await tx.vendor.findUnique({
            where: { id: vendorId },
            select: { id: true },
        });

        if (!vendor) {
            throw new Error("Vendor khong ton tai.");
        }

        const acquisition = await tx.acquisition.create({
            data: {
                vendorId,
                type: AcquisitionType.CONSIGNMENT,
                acquiredAt: new Date(),
                currency: "VND",
                accquisitionStt: AcquisitionStatus.DRAFT,
                totalAmount: new Prisma.Decimal(0),
                notes: cleanText(input.notes),
            },
            select: {
                id: true,
                refNo: true,
                accquisitionStt: true,
                type: true,
            },
        });

        await tx.acquisitionItem.create({
            data: {
                acquisitionId: acquisition.id,
                productId,
                variantId: null,
                productType: "WATCH" as any,
                productTitle: watch.product?.title ?? watch.product?.sku ?? "Watch consign",
                quantity: 1,
                unitCost: new Prisma.Decimal(0),
                currency: "VND",
                status: "DRAFT" as any,
                kind: "PRODUCT" as any,
                capitalizeToProduct: false,
                notes: cleanText(input.notes),
            },
        });

        return acquisition;
    });
}

export async function restoreBuyBackWatchAfterAcquisitionPostTx(tx: DB, acquisitionId: string) {
    const db = dbOrTx(tx);

    const acquisition = await db.acquisition.findUnique({
        where: { id: acquisitionId },
        select: {
            id: true,
            type: true,
            accquisitionStt: true,
            acquisitionItem: {
                select: {
                    id: true,
                    productId: true,
                },
            },
        },
    });

    if (!acquisition || acquisition.type !== AcquisitionType.BUY_BACK) {
        return null;
    }

    const productIds = acquisition.acquisitionItem
        .map((item) => item.productId)
        .filter((id): id is string => Boolean(id));

    if (!productIds.length) return null;

    const updated: Array<{ productId: string; saleStage: WatchSaleStage }> = [];

    for (const productId of productIds) {
        const watch = await db.watch.findUnique({
            where: { productId },
            select: {
                id: true,
                productId: true,
            },
        });

        if (!watch) continue;

        const nextSaleStage = await resolveSaleStageAfterBuyBackPost(tx, {
            productId,
            watchId: watch.id,
        });

        await db.product.update({
            where: { id: productId },
            data: {
                status: ProductStatus.AVAILABLE,
            },
        });

        await db.watch.update({
            where: { id: watch.id },
            data: {
                saleStage: nextSaleStage,
                stockStage: WatchStockStage.IN_STOCK,
                serviceStage: "NOT_REQUIRED" as any,
                updatedAt: new Date(),
            },
        });

        updated.push({ productId, saleStage: nextSaleStage });
    }

    return updated;
}
