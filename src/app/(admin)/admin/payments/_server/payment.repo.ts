import { PaymentStatus, PaymentType } from "@prisma/client";
import { CreatePaymentInput } from "./payment.type";
import { DB, dbOrTx } from "@/server/db/client";

export async function createMany(
    tx: DB,
    payments: CreatePaymentInput[]
) {
    if (!payments.length) return;
    const db = dbOrTx(tx);
    return db.payment.createMany({
        data: payments.map((p) => ({
            order_id: p.orderId,
            amount: p.amount,
            currency: p.currency,
            status: PaymentStatus.UNPAID,
            method: p.method,
            purpose: p.purpose
        })),
    });
}

export async function findShippingFeePaymentByShipmentId(shipment_id: string, tx: DB) {
    // Bạn cần có field shipmentId + type để idempotent

    const db = dbOrTx(tx);
    return db.payment.findFirst({
        where: {
            shipment_id,
            type: PaymentType.SHIPMENT, // enum bạn tạo
        },
    });
}

export async function createShippingFeePayment(
    input: {
        shipmentId: string;
        orderId: string | null;
        amount: number;
        currency: string;
        method: string;
        status: string;
        note?: string;
    },
    tx: DB
) {
    const db = dbOrTx(tx);
    return db.payment.create({
        data: {
            type: "SHIPMENT",
            shipment_id: input.shipmentId,
            order_id: input.orderId,
            amount: input.amount,
            currency: input.currency,
            method: input.method,
            status: input.status,
            note: input.note ?? null,
        } as any,
    });
}