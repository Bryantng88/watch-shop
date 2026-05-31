import { prisma } from "@/server/db/client";

export async function listWatchEditOptions() {
    const [brands, vendors, categories, postTargets] = await Promise.all([
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
        prisma.postTarget.findMany({
            where: { isActive: true },
            orderBy: [{ platform: "asc" }, { name: "asc" }],
            select: {
                id: true,
                name: true,
                platform: true,
            },
        }),
    ]);

    return {
        brands,
        vendors,
        categories,
        postTargets,
    };
}