import { prisma } from "@/server/db/client";

export async function listWatchEditOptions() {
    const [brands, vendors, categories] = await Promise.all([
        prisma.brand.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        }),
        prisma.vendor.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
            },
        }),
        prisma.productCategory.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
            },
        }),
    ]);

    return {
        brands,
        vendors,
        categories,
    };
}