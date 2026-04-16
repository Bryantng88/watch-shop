import {
    Order,
    ReserveType,
    PaymentPurpose,
    PaymentType,
    PaymentMethod,
    PaymentDirection,
} from "@prisma/client";

import * as paymentRepo from "./payment.repo";
import type { PaymentListInput, PaymentViewKey } from "../_helper/SearchParams";
import { prisma } from "@/server/db/client";

export async function createPaymentsForOrder(tx: any, order: Order) {
    const payments: paymentRepo.CreatePaymentInput[] = [];

    const subtotal = Number(order.subtotal || 0);
    const deposit = Number(order.depositRequired || 0);

    if (subtotal <= 0) return;

    // CASE 1: COD
    if (order.paymentMethod === "COD") {
        if (deposit > 0) {
            payments.push({
                order_id: order.id,
                amount: deposit,
                currency: "VND",
                type: PaymentType.ORDER,
                direction: PaymentDirection.IN,
                purpose: PaymentPurpose.ORDER_DEPOSIT,
                method: "COD",
                status: "UNPAID",
            });
        }

        payments.push({
            order_id: order.id,
            amount: subtotal - deposit,
            currency: "VND",
            type: PaymentType.ORDER,
            direction: PaymentDirection.IN,
            purpose: PaymentPurpose.ORDER_REMAIN,
            method: "COD",
            status: "UNPAID",
        });
    }

    // CASE 2: HOLD
    else if (order.reserveType === ReserveType.DEPOSIT && deposit > 0) {
        payments.push({
            order_id: order.id,
            amount: deposit,
            currency: "VND",
            type: PaymentType.ORDER,
            direction: PaymentDirection.IN,
            purpose: PaymentPurpose.ORDER_DEPOSIT,
            method: PaymentMethod.BANK_TRANSFER,
            status: "UNPAID",
        });
    }

    // CASE 3: đơn thường
    else {
        payments.push({
            order_id: order.id,
            amount: subtotal,
            currency: "VND",
            type: PaymentType.ORDER,
            direction: PaymentDirection.IN,
            purpose: PaymentPurpose.ORDER_FULL,
            method: PaymentMethod.BANK_TRANSFER,
            status: "UNPAID",
        });
    }

    await paymentRepo.createMany(tx, payments);
}

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_k, v) => {
            if (v instanceof Date) return v.toISOString();
            if (typeof v === "object" && v?._isDecimal) return Number(v);
            return v;
        })
    );
}

function viewToStatus(view?: PaymentViewKey): string | undefined {
    switch (view) {
        case "paid":
            return "PAID";
        case "unpaid":
            return "UNPAID";
        case "canceled":
            return "CANCELED";
        case "all":
        default:
            return undefined;
    }
}

/**
 * ✅ Admin list payments
 * - view là từ tab UI
 * - status là filter thực thi ở repo
 * - ưu tiên status explicit nếu có, còn không thì map từ view
 */
export async function getAdminPaymentList(input: PaymentListInput) {
    const page = Math.max(1, Number(input.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));

    const effectiveStatus = input.status || viewToStatus(input.view);

    const { items, total, counts } = await paymentRepo.listAdmin(prisma, {
        ...input,
        status: effectiveStatus,
        page,
        pageSize,
    });

    return serialize({
        items,
        total,
        counts,
        page,
        pageSize,
    });
}