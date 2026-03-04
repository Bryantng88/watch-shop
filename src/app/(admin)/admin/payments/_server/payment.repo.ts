// src/app/(admin)/admin/payments/_server/payment.repo.ts
import { Prisma, PaymentStatus, PaymentType } from "@prisma/client";
import { DB, dbOrTx } from "@/server/db/client";
import type { PaymentListInput, PaymentListSort } from "../_helper/SearchParams";

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
 * Build where from filters.
 * - includeStatus: true => include status filter (for list)
 * - includeStatus: false => ignore status filter (for segment counts)
 */
function buildWhere(input: PaymentListInput, includeStatus: boolean): Prisma.PaymentWhereInput {
    const q = (input.q || "").trim();
    const where: Prisma.PaymentWhereInput = {};

    if (includeStatus && input.status) where.status = input.status as any;
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

    return where;
}

export async function listAdmin(
    tx: DB,
    input: PaymentListInput & { page: number; pageSize: number }
) {
    const db = dbOrTx(tx);

    const where = buildWhere(input, true);
    const baseWhere = buildWhere(input, false); // ✅ bỏ status để đếm segment

    const skip = (input.page - 1) * input.pageSize;
    const take = input.pageSize;

    const [total, items, grouped] = await Promise.all([
        db.payment.count({ where: baseWhere }), // ✅ total theo filter chung (không theo status)
        db.payment.findMany({
            where,
            orderBy: buildOrderBy(input.sort),
            skip,
            take,
            select: {
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
            },
        }),
        db.payment.groupBy({
            by: ["status"],
            where: baseWhere,
            _count: { _all: true },
        }),
    ]);

    const map: Record<string, number> = {};
    for (const g of grouped) map[String(g.status)] = g._count._all;

    const counts = {
        ALL: total,
        UNPAID: map[String(PaymentStatus.UNPAID)] ?? 0,
        PAID: map[String(PaymentStatus.PAID)] ?? 0,
        CANCELED: map[String(PaymentStatus.CANCELED)] ?? 0,
    };

    return { total, items, counts };
}