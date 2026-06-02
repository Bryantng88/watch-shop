import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";

export async function GET() {
    const [serviceCatalogs, supplyCatalogs, mechanicalPartCatalogs, vendors] = await Promise.all([
        prisma.serviceCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, code: true, name: true, defaultPrice: true },
        }),
        prisma.supplyCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, code: true, name: true, defaultCost: true },
        }),
        prisma.mechanicalPartCatalog.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            select: { id: true, code: true, name: true },
        }),
        prisma.vendor.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        }),
    ]);

    return NextResponse.json({
        serviceCatalogs,
        supplyCatalogs,
        mechanicalPartCatalogs,
        vendors,
    });
}
