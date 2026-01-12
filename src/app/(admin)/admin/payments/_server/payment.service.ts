import { Order, ReserveType, PaymentPurpose } from "@prisma/client";
import * as paymentRepo from "./payment.repo";

export async function createPaymentsForOrder(
    tx: any,
    order: Order
) {
    const payments = [];

    const subtotal = Number(order.subtotal || 0);
    const deposit = Number(order.depositRequired || 0);

    if (subtotal <= 0) return;

    // CASE 1: COD
    if (order.paymentMethod === "COD") {
        if (deposit > 0) {
            payments.push({
                orderId: order.id,
                amount: deposit,
                currency: "VND",
                purpose: PaymentPurpose.ORDER_DEPOSIT,
                method: "COD"
            });
        }

        payments.push({
            orderId: order.id,
            amount: subtotal - deposit,
            currency: "VND",
            purpose: PaymentPurpose.ORDER_REMAIN,
            method: "COD"
        });
    }

    // CASE 2: HOLD (đặt cọc giữ hàng)
    else if (order.reserveType === ReserveType.DEPOSIT && deposit > 0) {
        payments.push({
            orderId: order.id,
            amount: deposit,
            currency: "VND",
            purpose: PaymentPurpose.ORDER_DEPOSIT,
            method: "BANK_TRANSFER"
        });
    }

    // CASE 3: đơn thường
    else {
        payments.push({
            orderId: order.id,
            amount: subtotal,
            currency: "VND",
            purpose: PaymentPurpose.ORDER_FULL,
            method: "BANK_TRANSFER"
        });
    }

    await paymentRepo.createMany(tx, payments);
}
