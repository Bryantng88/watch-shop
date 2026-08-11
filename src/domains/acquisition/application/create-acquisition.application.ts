import { runBusinessEventTransaction } from "@/domains/event/server/business-event-transaction";
import type { BusinessEventDispatchOptions } from "@/domains/event/server/business-event.service";
import * as dto from "../shared/acquisition.dto";
import { toDraftItem } from "../shared/acquisition.mapper";
import * as repoAcq from "../server";

function parseLocalDateVN(value?: string | null) {
    const text = String(value ?? "").trim();
    if (!text) return undefined;

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return new Date(`${text}T00:00:00+07:00`);
    }

    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function createAcquisitionWithItemApplication(
    input: dto.CreateAcquisitionInput,
    options?: {
        actorUserId?: string | null;
        deferConsumers?: BusinessEventDispatchOptions["deferConsumers"];
    },
) {
    return runBusinessEventTransaction(async (tx, delivery) => {
        let vendorId = input.vendorId;
        let customerId: string | null = null;
        let sourceOrderRefNo: string | null = null;
        const purchasedSourceByItemId = new Map<string, {
            productId: string;
            variantId: string | null;
        }>();

        if (input.type === "TRADE_IN") {
            const sourceOrderId = String(input.sourceOrderId ?? "").trim();
            if (!sourceOrderId) throw new Error("Thiếu đơn hàng trade-in");

            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`trade-in-order:${sourceOrderId}`}, 0))`;

            const order = await tx.order.findUnique({
                where: { id: sourceOrderId },
                select: {
                    customerId: true,
                    refNo: true,
                    customerName: true,
                    shipPhone: true,
                },
            });
            if (!order) throw new Error("Không tìm thấy đơn hàng trade-in");
            sourceOrderRefNo = order.refNo;

            customerId = order.customerId;
            if (!customerId && order.shipPhone) {
                const customer = await tx.customer.findFirst({
                    where: { phone: order.shipPhone },
                    select: { id: true },
                }) ?? await tx.customer.create({
                    data: { name: order.customerName ?? order.shipPhone, phone: order.shipPhone },
                    select: { id: true },
                });
                customerId = customer.id;
                await tx.order.update({
                    where: { id: sourceOrderId },
                    data: { customerId },
                });
            }
            if (!customerId) {
                throw new Error("Đơn hàng chưa có hồ sơ khách hàng hoặc số điện thoại");
            }

            const duplicated = await tx.acquisition.findFirst({
                where: {
                    type: "TRADE_IN",
                    accquisitionStt: { not: "CANCELED" },
                    sourceOrderId,
                },
                select: { id: true, refNo: true },
            });
            if (duplicated) {
                throw new Error(`Đơn hàng đã có phiếu trade-in ${duplicated.refNo ?? duplicated.id}`);
            }

            const purchasedSourceIds = input.items
                .map((item) => String(item.sourceOrderItemId ?? "").trim())
                .filter(Boolean);
            if (new Set(purchasedSourceIds).size !== purchasedSourceIds.length) {
                throw new Error("Mỗi Watch khách đã mua chỉ được chọn một lần trong phiếu trade-in.");
            }

            if (purchasedSourceIds.length) {
                // Two different trade-in orders may target the same historical
                // sale concurrently. Lock sources in a deterministic order so
                // the active-use check below cannot race.
                for (const sourceOrderItemId of [...purchasedSourceIds].sort()) {
                    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`trade-in-source-item:${sourceOrderItemId}`}, 0))`;
                }
                const purchasedItems = await tx.orderItem.findMany({
                    where: {
                        id: { in: purchasedSourceIds },
                        kind: "PRODUCT",
                        productId: { not: null },
                        order: {
                            customerId,
                            status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED", "POSTED"] },
                        },
                    },
                    select: {
                        id: true,
                        productId: true,
                        variantId: true,
                        product: { select: { type: true, status: true } },
                    },
                });
                if (
                    purchasedItems.length !== purchasedSourceIds.length ||
                    purchasedItems.some((item) => item.product?.type !== "WATCH" || item.product.status !== "SOLD" || !item.productId)
                ) {
                    throw new Error("Watch đã mua không thuộc khách hàng của đơn trade-in hoặc không còn liên kết hợp lệ.");
                }


                const saleHistory = await tx.orderItem.findMany({
                    where: {
                        productId: { in: purchasedItems.map((item) => item.productId!) },
                        kind: "PRODUCT",
                        order: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED", "POSTED"] } },
                    },
                    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                    select: { id: true, productId: true },
                });
                const latestSaleByProductId = new Map<string, string>();
                for (const sale of saleHistory) {
                    if (sale.productId && !latestSaleByProductId.has(sale.productId)) {
                        latestSaleByProductId.set(sale.productId, sale.id);
                    }
                }
                if (purchasedItems.some((item) => latestSaleByProductId.get(item.productId!) !== item.id)) {
                    throw new Error("Watch đã được bán lại trong một giao dịch mới hơn và không còn thuộc khách hàng này.");
                }

                const alreadyUsed = await tx.acquisitionItem.findFirst({
                    where: {
                        sourceOrderItemId: { in: purchasedSourceIds },
                        acquisition: {
                            type: "TRADE_IN",
                            accquisitionStt: { not: "CANCELED" },
                        },
                    },
                    select: { acquisition: { select: { id: true, refNo: true } } },
                });
                if (alreadyUsed) {
                    throw new Error(`Watch đã có trong phiếu trade-in ${alreadyUsed.acquisition.refNo ?? alreadyUsed.acquisition.id}.`);
                }

                for (const item of purchasedItems) {
                    purchasedSourceByItemId.set(item.id, {
                        productId: item.productId!,
                        variantId: item.variantId,
                    });
                }
            }
            vendorId = undefined;
        }

        if (!vendorId && input.quickVendorName) {
            const newVendor = await tx.vendor.create({
                data: { name: input.quickVendorName },
            });
            vendorId = newVendor.id;
        }

        if (!vendorId && input.type !== "TRADE_IN") {
            throw new Error("Thiếu vendor");
        }

        const acq = await repoAcq.createDraft(tx, {
            vendorId,
            customerId,
            sourceOrderId: input.type === "TRADE_IN" ? input.sourceOrderId ?? null : null,
            currency: input.currency,
            type: input.type,
            createdAt: parseLocalDateVN(input.createdAt),
            notes: input.notes,
            audienceSegment: input.audienceSegment,
        });

        let total = 0;

        for (const raw of input.items) {
            const item = toDraftItem(raw);
            const purchasedSource = item.sourceOrderItemId
                ? purchasedSourceByItemId.get(item.sourceOrderItemId)
                : undefined;
            await repoAcq.createAcqItem(tx, acq.id, {
                ...item,
                sourceOrderItemId: purchasedSource ? item.sourceOrderItemId : null,
                productId: purchasedSource?.productId ?? null,
                variantId: purchasedSource?.variantId ?? null,
            });
            total += Number(item.unitCost ?? 0) * Number(item.quantity ?? 1);
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);

        const result = {
            id: acq.id,
            type: input.type ?? "PURCHASE",
            sourceOrderId: input.sourceOrderId ?? null,
            sourceOrderRefNo,
        };
        const event = await repoAcq.emitAcquisitionBusinessEvent(tx, {
            eventKey: "acquisition.created",
            acquisitionId: result.id,
            actorUserId: options?.actorUserId ?? null,
            payload: {
                type: result.type,
                sourceOrderId: result.sourceOrderId,
                sourceOrderRefNo: result.sourceOrderRefNo,
                itemCount: input.items.length,
                totalAmount: total,
            },
        });
        delivery.track(event);
        return {
            ...result,
            projectionDeliveryKey: event.projectionDeliveryKey,
            reconciliationMode: "ASYNC_DELIVERY" as const,
        };
    }, { deferConsumers: options?.deferConsumers });
}

export const createAcquisitionWithItem = createAcquisitionWithItemApplication;
export const createAcquisitionApplication = createAcquisitionWithItemApplication;
