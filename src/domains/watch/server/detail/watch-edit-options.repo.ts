import { prisma } from "@/server/db/client";
import { perfStep } from "@/lib/server-perf";

export async function listWatchEditOptions() {
    const [brands, vendors, categories, postTargets] = await Promise.all([
        perfStep("watch-edit-options", "brands", () =>
            prisma.brand.findMany({
                orderBy: { name: "asc" },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            }),
        ),
        perfStep("watch-edit-options", "vendors", () =>
            prisma.vendor.findMany({
                orderBy: { name: "asc" },
                select: {
                    id: true,
                    name: true,
                },
            }),
        ),
        perfStep("watch-edit-options", "categories", () =>
            prisma.productCategory.findMany({
                orderBy: { name: "asc" },
                select: {
                    id: true,
                    name: true,
                },
            }),
        ),
        perfStep("watch-edit-options", "postTargets", () =>
            prisma.postTarget.findMany({
                where: { isActive: true },
                orderBy: [{ platform: "asc" }, { name: "asc" }],
                select: {
                    id: true,
                    name: true,
                    platform: true,
                },
            }),
        ),
    ]);

    return {
        brands,
        vendors,
        categories,
        postTargets,
    };
}
