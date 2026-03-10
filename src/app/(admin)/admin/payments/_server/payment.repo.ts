import {
    Prisma,
    PaymentStatus,
    PaymentType,
    PaymentDirection,
    PaymentPurpose,
    PaymentMethod,
} from "@prisma/client";
import { DB, dbOrTx } from "@/server/db/client";
import type { PaymentListInput, PaymentListSort } from "../_helper/SearchParams";
import { genRefNo } from "../../__components/AutoGenRef";

/**
 * Input chuẩn cho payment creation
 */
export type CreatePaymentInput = {
    refNo?: string;

    amount: any; // number | Prisma.Decimal
    currency: string;

    method: PaymentMethod | string;
    purpose: PaymentPurpose | string;
    type: PaymentType | string;
    direction: PaymentDirection | string;

    status?: PaymentStatus | string;
    paidAt?: Date | null;
    reference?: string | null;
    note?: string | null;

    order_id?: string | null;
    service_request_id?: string | null;
    vendor_id?: string | null;
    acquisition_id?: string | null;
    shipment_id?: string | null;

    // convenience camelCase
    orderId?: string | null;
};

async function ensureRefNo(db: any, tx: any, maybeRefNo?: string) {
    if (maybeRefNo) return maybeRefNo;

    return genRefNo(tx, {
        model: db.payment,
        prefix: "PM",
        field: "refNo",
        padding: 6,
    });
}

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

/** =========================
 * Create ONE payment
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

            paidAt: input.paidAt ?? new Date(),

            reference: input.reference ?? null,
            note: input.note ?? null,

            direction: input.direction as any,
            status: (input.status ?? PaymentStatus.UNPAID) as any,
            purpose: input.purpose as any,
            type: input.type as any,

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
 * Create MANY payments
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

                paidAt: p.paidAt ?? new Date(),
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
        where: { shipment_id, type: PaymentType.SHIPMENT },
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
    return createPayment(tx, {
        orderId: input.orderId,
        shipment_id: input.shipmentId,
        amount: input.amount,
        currency: input.currency,
        method: input.method,
        status: input.status ?? PaymentStatus.UNPAID,

        type: PaymentType.SHIPMENT,
        direction: PaymentDirection.OUT,
        purpose: "SHIPPING_FEE" as any,

        note: input.note ?? null,
    });
}

/** =========================
 * Admin LIST + COUNTS
 * - filter theo status trước rồi mới paginate
 * ========================= */
export async function listAdmin(
    tx: DB,
    input: PaymentListInput & { page: number; pageSize: number }
) {
    const db = dbOrTx(tx);

    const q = (input.q || "").trim();

    const whereBase: Prisma.PaymentWhereInput = {};

    if (input.purpose) whereBase.purpose = input.purpose as any;
    if (input.type) whereBase.type = input.type as any;
    if (input.direction) whereBase.direction = input.direction as any;
    if (input.method) whereBase.method = input.method as any;
    if (input.currency) whereBase.currency = input.currency;

    const paidFrom = parseDateMaybe(input.paidFrom);
    const paidTo = parseDateMaybe(input.paidTo);
    if (paidFrom || paidTo) {
        whereBase.paidAt = {
            ...(paidFrom ? { gte: paidFrom } : {}),
            ...(paidTo ? { lte: paidTo } : {}),
        };
    }

    const createdFrom = parseDateMaybe(input.createdFrom);
    const createdTo = parseDateMaybe(input.createdTo);
    if (createdFrom || createdTo) {
        whereBase.createdAt = {
            ...(createdFrom ? { gte: createdFrom } : {}),
            ...(createdTo ? { lte: createdTo } : {}),
        };
    }

    if (q) {
        whereBase.OR = [
            { id: { contains: q, mode: "insensitive" } },
            { refNo: { contains: q, mode: "insensitive" } },
            { reference: { contains: q, mode: "insensitive" } },
            { note: { contains: q, mode: "insensitive" } },

            { order_id: { contains: q, mode: "insensitive" } },
            { service_request_id: { contains: q, mode: "insensitive" } },
            { vendor_id: { contains: q, mode: "insensitive" } },
            { acquisition_id: { contains: q, mode: "insensitive" } },
            { shipment_id: { contains: q, mode: "insensitive" } },
        ];
    }

    const whereList: Prisma.PaymentWhereInput = {
        ...whereBase,
        ...(input.status ? { status: input.status as any } : {}),
    };

    const skip = (input.page - 1) * input.pageSize;
    const take = input.pageSize;

    const select: Prisma.PaymentSelect = {
        id: true,
        refNo: true,

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
    };

    const [total, items, totalAll, cPaid, cUnpaid, cCanceled] = await Promise.all([
        db.payment.count({ where: whereList }),
        db.payment.findMany({
            where: whereList,
            orderBy: buildOrderBy(input.sort),
            skip,
            take,
            select,
        }),
        db.payment.count({ where: whereBase }),
        db.payment.count({ where: { ...whereBase, status: "PAID" as any } }),
        db.payment.count({ where: { ...whereBase, status: "UNPAID" as any } }),
        db.payment.count({ where: { ...whereBase, status: "CANCELED" as any } }),
    ]);

    return {
        total,
        items,
        counts: {
            all: totalAll,
            paid: cPaid,
            unpaid: cUnpaid,
            canceled: cCanceled,
        },
    };
}