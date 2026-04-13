import type { Prisma } from "@prisma/client";
import type { AdminAcqFiltersInput } from "./acquisition.dto";

export const DEFAULT_PAGE_SIZE = 50 as const;

function startOfDay(value: string | Date) {
    const d = new Date(value);
    d.setHours(0, 0, 0, 0);
    return d;
}

function endOfDay(value: string | Date) {
    const d = new Date(value);
    d.setHours(23, 59, 59, 999);
    return d;
}

export function buildAcqWhere(f: AdminAcqFiltersInput): Prisma.AcquisitionWhereInput {
    return {
        ...(f.q
            ? {
                OR: [
                    { refNo: { contains: f.q, mode: "insensitive" } },
                    { notes: { contains: f.q, mode: "insensitive" } },
                    { condition: { contains: f.q, mode: "insensitive" } },
                    { vendor: { name: { contains: f.q, mode: "insensitive" } } },
                ],
            }
            : {}),
        ...(f.vendorIds?.length ? { vendorId: { in: f.vendorIds } } : {}),
        ...(f.customerIds?.length ? { customerId: { in: f.customerIds } } : {}),
        ...(f.type?.length ? { type: { in: f.type as any } } : {}),
        ...(f.status?.length ? { accquisitionStt: { in: f.status as any } } : {}),
        ...(f.acquiredFrom || f.acquiredTo
            ? {
                acquiredAt: {
                    ...(f.acquiredFrom ? { gte: startOfDay(f.acquiredFrom) } : {}),
                    ...(f.acquiredTo ? { lte: endOfDay(f.acquiredTo) } : {}),
                },
            }
            : {}),
        ...(f.hasInvoice === "yes" ? { invoice: { some: {} } } : {}),
        ...(f.hasInvoice === "no" ? { invoice: { none: {} } } : {}),
    };
}

export function buildAcqOrderBy(
    sort: AdminAcqFiltersInput["sort"]
): Prisma.AcquisitionOrderByWithRelationInput[] {
    switch (sort) {
        case "acquiredAsc":
            return [{ acquiredAt: "asc" }];
        case "acquiredDesc":
            return [{ acquiredAt: "desc" }];
        case "createdAsc":
            return [{ createdAt: "asc" }];
        case "createdDesc":
            return [{ createdAt: "desc" }];
        case "updatedAsc":
            return [{ updatedAt: "asc" }];
        default:
            return [{ updatedAt: "desc" }];
    }
}