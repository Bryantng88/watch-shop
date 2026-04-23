import type { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import prisma from "component for chatGPT/src/server/db/client";
import { dbOrTx } from "@/server/db/client";

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
                //slug: true,
            },
        }),
    ]);

    return {
        brands,
        vendors,
        categories,
    };
}