// src/app/(admin)/admin/payments/_server/payment.repo.ts
import { Prisma, PaymentStatus, PaymentType, PaymentDirection, PaymentPurpose, PaymentMethod } from "@prisma/client";
import { DB, dbOrTx } from "@/server/db/client";
import type { PaymentListInput, PaymentListSort } from "../_helper/SearchParams";
import { genRefNo } from "../../__components/AutoGenRef";

// ✅ dùng genRefNo bạn đưai

/**
 * Input chuẩn cho payment creation (để nhiều nơi gọi chung)
 * - refNo sẽ được repo tự gen => không bắt buộc truyền vào
 */
export type CreatePaymentInput = {
    // auto
    refNo?: string;

    // amounts
    amount: any; // number | Prisma.Decimal (tuỳ nơi bạn gọi)
    currency: string;

    // enums
    method: PaymentMethod | string;
    purpose: PaymentPurpose | string;
    type: PaymentType | string;
    direction: PaymentDirection | string;

    // status / meta
    status?: PaymentStatus | string;
    paidAt?: Date | null;
    reference?: string | null;
    note?: string | null;

    // relations (snake-case theo prisma schema của bạn)
    order_id?: string | null;
    service_request_id?: string | null;
    vendor_id?: string | null;
    acquisition_id?: string | null;
    shipment_id?: string | null;

    // convenience camelCase (cho service đang dùng)
    orderId?: string | null;
};

/** =========================
 * RefNo generator (single source)
 * ========================= */
async function ensureRefNo(db: any, tx: any, maybeRefNo?: string) {
    if (maybeRefNo) return maybeRefNo;

    // ✅ gen dựa trên model payment, prefix PM
    return genRefNo(tx, {
        model: db.payment,
        prefix: "PM",
        field: "refNo",
        padding: 6,
    });
}

/** =========================
 * Create one payment (repo self-contained)
 * ========================= */
export async function createPayment(tx: DB, input: CreatePaymentInput) {
    const db = dbOrTx(tx);
    const refNo = await ensureRefNo(db, tx, input.refNo);

    return db.payment.create({
        data: {
            refNo,

            method: input.method as any,
            amount: input.amount as any,
            currency: input.currency,

            paidAt: input.paidAt ?? null,
            reference: input.reference ?? null,
            note: input.note ?? null,

            direction: input.direction as any,
            status: (input.status ?? PaymentStatus.UNPAID) as any,
            purpose: input.purpose as any,
            type: input.type as any,

            // relations
            order_id: (input.order_id ?? input.orderId ?? null) as any,
            service_request_id: input.service_request_id ?? null,
            vendor_id: input.vendor_id ?? null,
            acquisition_id: input.acquisition_id ?? null,
            shipment_id: input.shipment_id ?? null,
        },
        select: { id: true, refNo: true },
    });
}

/** =========================
 * Create many payments
 * - ✅ mỗi record 1 refNo riêng
 * - ✅ map đủ field
 * - ⚠ prisma createMany không cho nested + không return per-row
 *   nên mình insert từng row để đảm bảo genRefNo + consistency.
 * ========================= */
export async function createMany(tx: DB, payments: CreatePaymentInput[]) {
    if (!payments.length) return;
    const db = dbOrTx(tx);

    const createdIds: string[] = [];

    for (const p of payments) {
        const refNo = await ensureRefNo(db, tx, p.refNo);

        const created = await db.payment.create({
            data: {
                refNo,

                order_id: (p.order_id ?? p.orderId ?? null) as any,
                service_request_id: p.service_request_id ?? null,
                vendor_id: p.vendor_id ?? null,
                acquisition_id: p.acquisition_id ?? null,
                shipment_id: p.shipment_id ?? null,

                amount: p.amount as any,
                currency: p.currency,

                status: (p.status ?? PaymentStatus.UNPAID) as any,
                method: p.method as any,
                purpose: p.purpose as any,
                type: p.type as any,
                direction: p.direction as any,

                paidAt: p.paidAt ?? null,
                reference: p.reference ?? null,
                note: p.note ?? null,
            },
            select: { id: true },
        });

        createdIds.push(created.id);
    }

    return { createdIds };
}

/** =========================
 * Shipment fee helpers
 * ========================= */
export async function findShippingFeePaymentByShipmentId(shipment_id: string, tx: DB) {
    const db = dbOrTx(tx);
    return db.payment.findFirst({
        where: {
            shipment_id,
            type: PaymentType.SHIPMENT,
        },
    });
}

export async function createShippingFeePayment(
    input: {
        shipmentId: string;
        orderId: string | null;
        amount: number;
        currency: string;
        method: PaymentMethod | string;
        status?: PaymentStatus | string;
        note?: string;
    },
    tx: DB
) {
    // ✅ dùng createPayment để auto refNo + map đủ fields
    return createPayment(tx, {
        orderId: input.orderId,
        shipment_id: input.shipmentId,

        amount: input.amount,
        currency: input.currency,

        method: input.method,
        status: input.status ?? PaymentStatus.UNPAID,

        type: PaymentType.SHIPMENT,
        direction: PaymentDirection.OUT, // shipping fee thường là OUT (tuỳ business)
        purpose: "SHIPPING_FEE" as any,   // nếu bạn có enum purpose tương ứng thì thay đúng enum

        note: input.note ?? null,
    });
}

/** =========================
 * Admin list
 * ========================= */
function buildOrderBy(sort?: PaymentListSort): Prisma.PaymentOrderByWithRelationInput {
    switch (sort) {
        case "createdAsc":
            return { createdAt: "asc" };
        case "paidDesc":
            return { paidAt: "desc" };
        case "paidAsc":
            return { paidAt: "asc" };
        case "amountDesc":
            return { amount: "desc" };
        case "amountAsc":
            return { amount: "asc" };
        case "createdDesc":
        default:
            return { createdAt: "desc" };
    }
}

function parseDateMaybe(s?: string) {
    if (!s) return undefined;
    const d = new Date(s);
    return Number.isFinite(d.getTime()) ? d : undefined;
}

export async function listAdmin(
    tx: DB,
    input: PaymentListInput & { page: number; pageSize: number }
) {
    const db = dbOrTx(tx);

    const q = (input.q || "").trim();
    const where: Prisma.PaymentWhereInput = {};

    if (input.status) where.status = input.status as any;
    if (input.purpose) where.purpose = input.purpose as any;
    if (input.type) where.type = input.type as any;
    if (input.direction) where.direction = input.direction as any;
    if (input.method) where.method = input.method as any;
    if (input.currency) where.currency = input.currency;

    const paidFrom = parseDateMaybe(input.paidFrom);
    const paidTo = parseDateMaybe(input.paidTo);
    if (paidFrom || paidTo) {
        where.paidAt = {
            ...(paidFrom ? { gte: paidFrom } : {}),
            ...(paidTo ? { lte: paidTo } : {}),
        };
    }

    const createdFrom = parseDateMaybe(input.createdFrom);
    const createdTo = parseDateMaybe(input.createdTo);
    if (createdFrom || createdTo) {
        where.createdAt = {
            ...(createdFrom ? { gte: createdFrom } : {}),
            ...(createdTo ? { lte: createdTo } : {}),
        };
    }

    if (q) {
        where.OR = [
            { id: { contains: q, mode: "insensitive" } },
            { refNo: { contains: q, mode: "insensitive" } },      // ✅ thêm refNo search
            { reference: { contains: q, mode: "insensitive" } },
            { note: { contains: q, mode: "insensitive" } },

            { order_id: { contains: q, mode: "insensitive" } },
            { service_request_id: { contains: q, mode: "insensitive" } },
            { vendor_id: { contains: q, mode: "insensitive" } },
            { acquisition_id: { contains: q, mode: "insensitive" } },
            { shipment_id: { contains: q, mode: "insensitive" } },
        ];
    }

    const skip = (input.page - 1) * input.pageSize;
    const take = input.pageSize;

    const [total, items] = await Promise.all([
        db.payment.count({ where }),
        db.payment.findMany({
            where,
            orderBy: buildOrderBy(input.sort),
            skip,
            take,
            select: {
                id: true,
                refNo: true, // ✅ return refNo

                method: true,
                amount: true,
                currency: true,
                paidAt: true,
                createdAt: true,

                reference: true,
                note: true,

                direction: true,
                status: true,
                purpose: true,
                type: true,

                order_id: true,
                service_request_id: true,
                vendor_id: true,
                acquisition_id: true,
                shipment_id: true,
            },
        }),
    ]);

    return { total, items };
}