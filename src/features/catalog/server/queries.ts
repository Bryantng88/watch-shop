import { prisma } from "@/server/db/client";

const statusOrder = { available: 1, "on hold": 2, sold: 3 } as const;

export async function listProducts({
    page = 1,
    pageSize = 12,
    sort = "default",
    brand,
}: {
    page?: number; pageSize?: number; sort?: string; brand?: string;
}) {
    const skip = (page - 1) * pageSize;

    // sort ưu tiên theo status (available → on hold → sold)
    const orderBy =
        sort === "low" ? [{ price: "asc" }] :
            sort === "high" ? [{ price: "desc" }] :
                [{ createdAt: "desc" }];

    const where = {
        ...(brand ? { brand } : {}),
    };

    const [raw, total] = await Promise.all([
        prisma.product.findMany({
            where, skip, take: pageSize, orderBy,
            include: { images: true, variants: true, /* ... */ },
        }),
        prisma.product.count({ where }),
    ]);

    // áp dụng sort theo status sau khi lấy (nếu DB chưa có cột để order)
    const items = raw.sort((a, b) => {
        const sa = statusOrder[(a.status ?? "available") as keyof typeof statusOrder] ?? 99;
        const sb = statusOrder[(b.status ?? "available") as keyof typeof statusOrder] ?? 99;
        return sa - sb;
    });

    return { items, total, pageSize };
}
