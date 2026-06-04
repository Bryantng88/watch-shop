"use server";

import {
    PaymentDirection,
    PaymentMethod,
    PaymentStatus,
    Prisma,
    ProductType,
} from "@prisma/client";

import { prisma, type DB } from "@/server/db/client";
import { buildPaymentRef, money, toNumber, type Tx } from "@/domains/payment/server";
import {
    getAiMetaFromDescription,
    stringifyAcquisitionItemMeta,
} from "../shared/acquisition-item-metadata";
import type { WatchItemInput } from "../shared/acquisition.dto";

type UpdateAcquisitionEditInput = {
    acquisitionId: string;
    notes?: string | null;
    items: WatchItemInput[];
};

type ExistingItem = Awaited<ReturnType<typeof findExistingItemsTx>>[number];

function cleanId(value: unknown) {
    return String(value ?? "").trim();
}

function normalizeCost(value: unknown) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) && n >= 0 ? n : 0;
}

function resolveTitle(input: WatchItemInput, fallback = "Untitled watch") {
    return String(input.productTitle ?? input.title ?? "").trim() || fallback;
}

function resolveAiMeta(input: WatchItemInput, existing?: ExistingItem | null) {
    const current = getAiMetaFromDescription(existing?.description ?? null) ?? {};
    const incoming = input.aiMeta ?? {};

    return {
        ...current,
        ...incoming,
        images: Array.isArray(incoming.images) ? incoming.images : current.images ?? [],
    };
}


function buildDescription(input: WatchItemInput, existing?: ExistingItem | null) {
    return stringifyAcquisitionItemMeta({
        quickSpec: input.quickSpec ?? null,
        aiMeta: resolveAiMeta(input, existing),
    });
}

function isTmpId(id: string) {
    return !id || id.startsWith("tmp-");
}

async function findExistingItemsTx(tx: DB, acquisitionId: string) {
    return tx.acquisitionItem.findMany({
        where: { acquisitionId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: {
            id: true,
            acquisitionId: true,
            productId: true,
            productTitle: true,
            quantity: true,
            unitCost: true,
            description: true,
            status: true,
        },
    });
}

async function recomputeAcquisitionTotalTx(tx: DB, acquisitionId: string) {
    const rows = await tx.acquisitionItem.findMany({
        where: { acquisitionId },
        select: { quantity: true, unitCost: true },
    });

    const total = rows.reduce((sum, item) => {
        return sum + Number(item.quantity ?? 1) * normalizeCost(item.unitCost);
    }, 0);

    await tx.acquisition.update({
        where: { id: acquisitionId },
        data: { totalAmount: new Prisma.Decimal(total) },
    });

    return total;
}

async function buildPaymentRefSafe(tx: Tx) {
    try {
        return await buildPaymentRef(tx);
    } catch {
        return null;
    }
}

async function syncPostedAcquisitionPaymentTx(
    tx: Tx,
    input: { acquisitionId: string; totalAmount: number; currency?: string | null },
) {
    const totalAmount = normalizeCost(input.totalAmount);

    const payments = await tx.payment.findMany({
        where: {
            acquisition_id: input.acquisitionId,
            direction: PaymentDirection.OUT,
            status: { in: [PaymentStatus.PAID, PaymentStatus.UNPAID, PaymentStatus.COLLECTED] as any },
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            currency: true,
        },
    });

    const paidTotal = payments
        .filter((payment) => payment.status === PaymentStatus.PAID || String(payment.status) === "COLLECTED")
        .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

    if (paidTotal > totalAmount) {
        throw new Error(
            `Tổng payment đã thanh toán (${Math.round(paidTotal).toLocaleString("vi-VN")} VND) đang lớn hơn tổng phiếu mới (${Math.round(totalAmount).toLocaleString("vi-VN")} VND). Cần xử lý hoàn/hủy payment trước khi giảm giá trị phiếu.`,
        );
    }

    const targetUnpaid = Math.max(0, totalAmount - paidTotal);
    const unpaidPayments = payments.filter((payment) => payment.status === PaymentStatus.UNPAID);
    const [primaryUnpaid, ...extraUnpaid] = unpaidPayments;

    if (targetUnpaid <= 0) {
        if (unpaidPayments.length) {
            await tx.payment.updateMany({
                where: { id: { in: unpaidPayments.map((payment) => payment.id) } },
                data: {
                    status: PaymentStatus.CANCELED,
                    note: "Payment UNPAID được hủy tự động vì tổng phiếu đã được thanh toán đủ sau khi chỉnh acquisition.",
                    updatedAt: new Date(),
                },
            });
        }
        return;
    }

    if (primaryUnpaid) {
        await tx.payment.update({
            where: { id: primaryUnpaid.id },
            data: {
                amount: money(targetUnpaid),
                currency: input.currency ?? primaryUnpaid.currency ?? "VND",
                note: "Payment UNPAID được đồng bộ theo tổng giá trị phiếu nhập sau chỉnh sửa.",
                updatedAt: new Date(),
            },
        });

        if (extraUnpaid.length) {
            await tx.payment.updateMany({
                where: { id: { in: extraUnpaid.map((payment) => payment.id) } },
                data: {
                    status: PaymentStatus.CANCELED,
                    note: "Payment UNPAID dư được hủy tự động sau khi đồng bộ acquisition.",
                    updatedAt: new Date(),
                },
            });
        }

        return;
    }

    await tx.payment.create({
        data: {
            refNo: await buildPaymentRefSafe(tx),
            acquisition_id: input.acquisitionId,
            direction: PaymentDirection.OUT,
            type: "ACQUISITION" as any,
            purpose: "ACQUISITION_FULL" as any,
            method: PaymentMethod.BANK_TRANSFER,
            amount: money(targetUnpaid),
            currency: input.currency ?? "VND",
            status: PaymentStatus.UNPAID,
            paidAt: null,
            note: "Payment UNPAID bổ sung do chỉnh giá trị phiếu nhập đã POSTED.",
        } as any,
    });
}

async function updateDraftItemsTx(
    tx: DB,
    acquisitionId: string,
    items: WatchItemInput[],
    existing: ExistingItem[],
) {
    const existingById = new Map(existing.map((item) => [item.id, item]));
    const receivedIds = new Set(items.map((item) => cleanId(item.id)).filter((id) => !isTmpId(id)));
    const deleteIds = existing.filter((item) => !receivedIds.has(item.id)).map((item) => item.id);

    if (deleteIds.length) {
        await tx.acquisitionItem.deleteMany({ where: { id: { in: deleteIds } } });
    }

    for (const input of items) {
        const id = cleanId(input.id);
        const cost = normalizeCost(input.unitCost ?? input.unitPrice);

        if (isTmpId(id)) {
            await tx.acquisitionItem.create({
                data: {
                    acquisitionId,
                    productTitle: resolveTitle(input),
                    quantity: 1,
                    unitCost: new Prisma.Decimal(cost),
                    productType: ProductType.WATCH,
                    productId: null,
                    variantId: null,
                    description: buildDescription(input),
                },
            });
            continue;
        }

        const current = existingById.get(id);
        if (!current) throw new Error("Dòng acquisition không tồn tại hoặc không thuộc phiếu này.");

        await tx.acquisitionItem.update({
            where: { id },
            data: {
                productTitle: resolveTitle(input, current.productTitle),
                quantity: 1,
                unitCost: new Prisma.Decimal(cost),
                description: buildDescription(input, current),
            },
        });
    }
}

async function updatePostedItemCostsTx(
    tx: DB,
    items: WatchItemInput[],
    existing: ExistingItem[],
) {
    const existingById = new Map(existing.map((item) => [item.id, item]));
    const existingIds = new Set(existing.map((item) => item.id));
    const receivedIds = new Set(items.map((item) => cleanId(item.id)).filter(Boolean));

    if (items.some((item) => isTmpId(cleanId(item.id)))) {
        throw new Error("Phiếu POSTED chỉ được chỉnh giá nhập, không được thêm watch mới.");
    }

    if (existing.length !== receivedIds.size || [...existingIds].some((id) => !receivedIds.has(id))) {
        throw new Error("Phiếu POSTED chỉ được chỉnh giá nhập, không được thêm/xóa dòng watch.");
    }

    for (const input of items) {
        const id = cleanId(input.id);
        const current = existingById.get(id);
        if (!current) throw new Error("Dòng acquisition không tồn tại hoặc không thuộc phiếu này.");

        await tx.acquisitionItem.update({
            where: { id },
            data: {
                unitCost: new Prisma.Decimal(normalizeCost(input.unitCost ?? input.unitPrice)),
            },
        });

        if (current.productId) {
            await tx.product.update({
                where: { id: current.productId },
                data: { updatedAt: new Date() },
            }).catch(() => null);
        }
    }
}

export async function updateAcquisitionEditApplication(input: UpdateAcquisitionEditInput) {
    return prisma.$transaction(async (tx) => {
        const db = tx as unknown as DB;
        const acquisition = await db.acquisition.findUnique({
            where: { id: input.acquisitionId },
            select: {
                id: true,
                accquisitionStt: true,
                currency: true,
            },
        });

        if (!acquisition) throw new Error("Không tìm thấy phiếu nhập.");
        const status = String(acquisition.accquisitionStt ?? "").toUpperCase();

        if (!["DRAFT", "POSTED"].includes(status)) {
            throw new Error("Chỉ phiếu DRAFT hoặc POSTED mới được chỉnh sửa.");
        }

        const existing = await findExistingItemsTx(db, input.acquisitionId);

        if (status === "DRAFT") {
            await updateDraftItemsTx(db, input.acquisitionId, input.items, existing);

            await db.acquisition.update({
                where: { id: input.acquisitionId },
                data: { notes: input.notes ?? null },
            });
        } else {
            await updatePostedItemCostsTx(db, input.items, existing);
        }

        const total = await recomputeAcquisitionTotalTx(db, input.acquisitionId);

        if (status === "POSTED") {
            await syncPostedAcquisitionPaymentTx(tx as unknown as Tx, {
                acquisitionId: input.acquisitionId,
                totalAmount: total,
                currency: acquisition.currency,
            });
        }

        return {
            ok: true,
            acquisitionId: input.acquisitionId,
            status,
            totalAmount: total,
        };
    });
}
