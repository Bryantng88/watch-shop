import { PaymentStatus } from "@prisma/client";
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
