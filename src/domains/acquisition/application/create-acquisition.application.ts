"use server";

import { prisma } from "@/server/db/client";
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
    options?: { actorUserId?: string | null },
) {
    const result = await prisma.$transaction(async (tx) => {
        let vendorId = input.vendorId;
        let customerId: string | null = null;
        let sourceOrderItemId: string | null = null;
        let sourceOrderRefNo: string | null = null;

        if (input.type === "TRADE_IN") {
            const sourceOrderId = String(input.sourceOrderId ?? "").trim();
            if (!sourceOrderId) throw new Error("Thiếu đơn hàng trade-in");

            const order = await tx.order.findUnique({
                where: { id: sourceOrderId },
                select: {
                    customerId: true,
                    refNo: true,
                    customerName: true,
                    shipPhone: true,
                    orderItem: {
                        orderBy: { createdAt: "asc" },
                        select: { id: true, kind: true },
                    },
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
                    data: { name: order.customerName, phone: order.shipPhone },
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

            sourceOrderItemId = order.orderItem.find((item) => item.kind === "PRODUCT")?.id
                ?? order.orderItem[0]?.id
                ?? null;
            if (!sourceOrderItemId) throw new Error("Đơn hàng không có dòng hàng để liên kết trade-in");

            const duplicated = await tx.acquisition.findFirst({
                where: {
                    type: "TRADE_IN",
                    accquisitionStt: { not: "CANCELED" },
                    acquisitionItem: { some: { sourceOrderItemId } },
                },
                select: { id: true, refNo: true },
            });
            if (duplicated) {
                throw new Error(`Đơn hàng đã có phiếu trade-in ${duplicated.refNo ?? duplicated.id}`);
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
            currency: input.currency,
            type: input.type,
            createdAt: parseLocalDateVN(input.createdAt),
            notes: input.notes,
            audienceSegment: input.audienceSegment,
        });

        let total = 0;

        for (const raw of input.items) {
            const item = toDraftItem(raw);
            await repoAcq.createAcqItem(tx, acq.id, {
                ...item,
                sourceOrderItemId,
            });
            total += Number(item.unitCost ?? 0);
        }

        await repoAcq.updateAcquisitionCost(tx, acq.id, total);

        return {
            id: acq.id,
            type: input.type ?? "PURCHASE",
            sourceOrderId: input.sourceOrderId ?? null,
            sourceOrderRefNo,
        };
    });

    await repoAcq.emitAcquisitionBusinessEvent(prisma, {
        eventKey: "acquisition.created",
        acquisitionId: result.id,
        actorUserId: options?.actorUserId ?? null,
        payload: {
            type: result.type,
            sourceOrderId: result.sourceOrderId,
            sourceOrderRefNo: result.sourceOrderRefNo,
        },
    });

    return result;
}

export const createAcquisitionWithItem = createAcquisitionWithItemApplication;
export const createAcquisitionApplication = createAcquisitionWithItemApplication;
