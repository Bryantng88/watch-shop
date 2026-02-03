import { ProductStatus, PriceVisibility } from "@prisma/client";

export type AdminProductRow = {
    id: string;
    title: string;
    slug: string;

    availabilityStatus: string | null;
    status: ProductStatus;
    priceVisibility: PriceVisibility;

    type: string;
    brand: string | null;
    primaryImageUrl: string | null;

    minPrice: number | null;

    variantsCount: number;
    imagesCount: number;
    ordersCount: number;

    lastSoldAt: Date | null;
    maintenanceCount: number;
    lastServicedAt: Date | null;

    invoicesCount: number;
    acquisitionsCount: number;
    serviceRequests: number;
    reservations: number;

    createdAt: Date;
    updatedAt: Date;
};

export function mapProductToAdminRow(p: any): AdminProductRow {
    return {
        id: p.id,
        title: p.title,
        slug: p.slug,

        availabilityStatus: p.variants?.[0]?.availabilityStatus ?? null,
        status: p.status,
        priceVisibility: p.priceVisibility,

        type: p.type,
        brand: p.brand?.name ?? null,
        primaryImageUrl: p.primaryImageUrl ?? null,

        minPrice: p.variants?.[0]?.price ?? null,

        variantsCount: p._count?.variants ?? 0,
        imagesCount: p._count?.image ?? 0,
        ordersCount: p._count?.orderItems ?? 0,

        lastSoldAt: p.orderItems?.[0]?.createdAt ?? null,
        maintenanceCount: p._count?.maintenanceRecords ?? 0,
        lastServicedAt: p.maintenanceRecords?.[0]?.servicedAt ?? null,

        invoicesCount: p._count?.InvoiceItem ?? 0,
        acquisitionsCount: p._count?.AcquisitionItem ?? 0,
        serviceRequests: p._count?.ServiceRequest ?? 0,
        reservations: p._count?.Reservation ?? 0,

        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}
