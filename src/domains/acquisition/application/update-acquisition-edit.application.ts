import { Prisma, ProductType } from "@prisma/client";

import { type DB } from "@/server/db/client";
import { recordPaymentMutations, syncAcquisitionPaymentDueTx, type PaymentMutation, type Tx } from "@/domains/payment/server";
import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import { emitAcquisitionBusinessEvent } from "../server/acquisition-business-event";
import {
    getAiMetaFromDescription,
    getPricingFromDescription,
    parseAcquisitionItemMeta,
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

function normalizeQuantity(value: unknown, productType: ProductType) {
    if (productType === ProductType.WATCH) return 1;
    const quantity = Math.trunc(Number(value ?? 1));
    if (!Number.isFinite(quantity) || quantity < 1) {
        throw new Error("Số lượng phải là số nguyên lớn hơn 0.");
    }
    return quantity;
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
    const existingPricing = getPricingFromDescription(existing?.description ?? null);
    const current = parseAcquisitionItemMeta(existing?.description ?? null);
    return stringifyAcquisitionItemMeta({
        ...current,
        quickSpec: input.quickSpec === undefined ? current.quickSpec : input.quickSpec,
        aiMeta: resolveAiMeta(input, existing),
        pricing: input.salePrice === undefined
            ? existingPricing
            : input.salePrice == null ? undefined : { proposedSalePrice: input.salePrice },
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
            productType: true,
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
        const requestedProductType = input.productType ?? ProductType.WATCH;

        if (isTmpId(id)) {
            await tx.acquisitionItem.create({
                data: {
                    acquisitionId,
                    productTitle: resolveTitle(input),
                    quantity: normalizeQuantity(input.quantity, requestedProductType),
                    unitCost: new Prisma.Decimal(cost),
                    productType: requestedProductType,
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
                quantity: normalizeQuantity(input.quantity, current.productType),
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

export async function updateAcquisitionEditApplication(
    input: UpdateAcquisitionEditInput,
    options?: {
        actorUserId?: string | null;
        deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
    },
) {
    return runBusinessEventTransaction(async (tx, delivery) => {
        const projectionDeliveryKeys: string[] = [];
        const track = <T extends { projectionDeliveryKey?: string | null }>(event: T) => {
            delivery.track(event);
            const key = String(event.projectionDeliveryKey ?? "").trim();
            if (key) projectionDeliveryKeys.push(key);
        };
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

        let paymentMutations: PaymentMutation[] = [];
        if (status === "POSTED") {
            paymentMutations = await syncAcquisitionPaymentDueTx(tx as unknown as Tx, {
                acquisitionId: input.acquisitionId,
                totalAmount: total,
                currency: acquisition.currency,
            });
        }

        const result = {
            ok: true,
            acquisitionId: input.acquisitionId,
            status,
            totalAmount: total,
            paymentMutations,
        };

        const paymentEvents = await recordPaymentMutations(db, paymentMutations, {
            actorUserId: options?.actorUserId,
        });
        paymentEvents.forEach(track);
        track(await emitAcquisitionBusinessEvent(db, {
            eventKey: result.status === "DRAFT" ? "acquisition.items.updated" : "acquisition.updated",
            acquisitionId: result.acquisitionId,
            actorUserId: options?.actorUserId,
            payload: { totalAmount: result.totalAmount },
        }));
        return {
            ...result,
            projectionDeliveryKeys: Array.from(new Set(projectionDeliveryKeys)),
            reconciliationMode: "ASYNC_DELIVERY" as const,
        };
    }, { deferConsumers: options?.deferConsumers });
}
