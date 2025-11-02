import type { Prisma } from "@prisma/client";
import type { AdminAcqFiltersInput } from "./dto";

export const DEFAULT_PAGE_SIZE = 50 as const;

export function buildAcqWhere(f: AdminAcqFiltersInput): Prisma.AcquisitionWhereInput {
    return {
        ...(f.q ? {
            OR: [
                { refNo: { contains: f.q, mode: "insensitive" } },
                { notes: { contains: f.q, mode: "insensitive" } },
                { condition: { contains: f.q, mode: "insensitive" } },
            ],
        } : {}),
        ...(f.vendorIds?.length ? { vendorId: { in: f.vendorIds } } : {}),
        ...(f.customerIds?.length ? { customerId: { in: f.customerIds } } : {}),
        ...(f.type?.length ? { type: { in: f.type as any } } : {}),
        ...(f.status?.length ? { acquisitionStt: { in: f.status as any } } : {}),
        ...(f.acquiredFrom || f.acquiredTo ? {
            acquiredAt: {
                ...(f.acquiredFrom ? { gte: new Date(f.acquiredFrom) } : {}),
                ...(f.acquiredTo ? { lte: new Date(f.acquiredTo) } : {}),
            },
        } : {}),
        ...(f.hasInvoice === "yes" ? { Invoice: { some: {} } } : {}),
        ...(f.hasInvoice === "no" ? { Invoice: { none: {} } } : {}),
    };
}

export function buildAcqOrderBy(
    sort: AdminAcqFiltersInput["sort"]
): Prisma.AcquisitionOrderByWithRelationInput[] {
    switch (sort) {
        case "acquiredAsc": return [{ acquiredAt: "asc" }];
        case "acquiredDesc": return [{ acquiredAt: "desc" }];
        case "createdAsc": return [{ createdAt: "asc" }];
        case "createdDesc": return [{ createdAt: "desc" }];
        case "updatedAsc": return [{ updatedAt: "asc" }];
        default: return [{ updatedAt: "desc" }];
    }
}
