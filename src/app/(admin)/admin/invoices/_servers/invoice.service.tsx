"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/server/db/client";
import { InvoiceListInput } from "../_utils/search-params";

/**
 * Dùng cho trang admin Invoice list
 * Trả về: items + total + page + pageSize
 */
export async function getAdminInvoiceList(input: InvoiceListInput) {
    const { page, pageSize, q, sort, status, type, customerId, vendorId } = input;

    // WHERE
    const where: Prisma.InvoiceWhereInput = {};

    if (q) {
        where.OR = [
            { code: { contains: q, mode: "insensitive" } },
            { notes: { contains: q, mode: "insensitive" } },
        ];
    }

    if (status) {
        where.status = status as any; // InvoiceStatus
    }

    if (type) {
        where.type = type as any; // InvoiceType
    }

    if (customerId) {
        where.customerId = customerId;
    }

    if (vendorId) {
        where.vendorId = vendorId;
    }

    // ORDER BY
    const orderBy: Prisma.InvoiceOrderByWithRelationInput[] = [];
    switch (sort) {
        case "createdAsc":
            orderBy.push({ createdAt: "asc" });
            break;
        case "createdDesc":
            orderBy.push({ createdAt: "desc" });
            break;
        case "updatedAsc":
            orderBy.push({ updatedAt: "asc" });
            break;
        case "updatedDesc":
        default:
            orderBy.push({ updatedAt: "desc" });
            break;
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [rows, total] = await Promise.all([
        prisma.invoice.findMany({
            where,
            orderBy,
            skip,
            take,
            select: {
                id: true,
                code: true,
                type: true,
                status: true,
                currency: true,
                subTotal: true,
                grandTotal: true,
                createdAt: true,
                updatedAt: true,
                customer: { select: { id: true, name: true } },
                vendor: { select: { id: true, name: true } },
                _count: { select: { items: true } },
            },
        }),
        prisma.invoice.count({ where }),
    ]);

    const items = rows.map((r) => ({
        id: r.id,
        code: r.code,
        type: r.type,
        status: r.status,
        currency: r.currency,
        subTotal: r.subTotal,
        grandTotal: r.grandTotal,
        itemCount: r._count.items,
        customerName: r.customer?.name ?? null,
        vendorName: r.vendor?.name ?? null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }));

    return {
        items,
        total,
        page,
        pageSize,
    };
}
