// src/app/(admin)/admin/payments/_server/payment.service.ts
import {
    Order,
    ReserveType,
    PaymentPurpose,
    PaymentType,
    PaymentMethod,
    PaymentDirection,
} from "@prisma/client";

import * as paymentRepo from "./payment.repo";
import type { PaymentListInput } from "../_helper/SearchParams";
import { prisma } from "@/server/db/client"; // ✅ nhớ import prisma đúng project bạn

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
                method: "COD", // hoặc PaymentMethod.COD nếu enum có
                status: "UNPAID",
                // paidAt: repo sẽ tự set new Date() nếu schema NOT NULL
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

    // CASE 2: HOLD (đặt cọc giữ hàng)
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

    // ✅ repo tự gen refNo từng dòng + auto paidAt
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

/**
 * ✅ Admin list payments
 * - trả về items + total (theo tab/status hiện tại)
 * - trả về counts (đếm theo toàn bộ dataset, KHÔNG phụ thuộc page)
 */
export async function getAdminPaymentList(input: PaymentListInput) {
    const page = Math.max(1, Number(input.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20)));

    const { items, total, counts } = await paymentRepo.listAdmin(prisma, {
        ...input,
        page,
        pageSize,
    });

    return serialize({
        items,
        total,
        counts, // ✅ thêm counts
        page,
        pageSize,
    });
}