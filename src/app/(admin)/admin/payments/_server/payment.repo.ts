import { PaymentStatus, PaymentType, Prisma } from "@prisma/client";
import { CreatePaymentInput } from "./payment.type";
import { DB, dbOrTx } from "@/server/db/client";

import type { PaymentListInput, PaymentListSort } from "../_helper/SearchParams";


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

export async function createPayment(tx: DB, input: CreatePaymentInput) {
    const db = dbOrTx(tx);

    return db.payment.create({
        data: {
            method: input.method,
            amount: input.amount,
            currency: input.currency,

            paidAt: input.paidAt ?? new Date(),
            reference: input.reference ?? null,
            note: input.note ?? null,

            direction: input.direction,
            status: input.status,
            purpose: input.purpose,
            type: input.type,

            order_id: input.order_id ?? null,
            service_request_id: input.service_request_id ?? null,
            vendor_id: input.vendor_id ?? null,
            acquisition_id: input.acquisition_id ?? null,
            shipment_id: input.shipment_id ?? null,
        },
        select: { id: true },
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

/**
 * Admin list payments
 * - q: match id/reference/note + ids (order_id/service_request_id/vendor_id/acquisition_id/shipment_id)
 * - filters: status/purpose/type/direction/method/currency
 * - date: paidFrom/paidTo/createdFrom/createdTo
 */
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