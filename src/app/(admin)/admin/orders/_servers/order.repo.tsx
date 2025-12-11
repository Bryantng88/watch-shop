// app/(admin)/admin/orders/_server/order.repo.ts
import prisma from "@/server/db/client";

export const repoOrder = {
    async getList({ page, pageSize, where }: any) {
        const [total, items] = await Promise.all([
            prisma.order.count({ where }),
            prisma.order.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { updatedAt: "desc" },
                include: {
                    _count: { select: { items: true } }
                }
            }),
        ]);

        return {
            items,
            total,
            page,
            pageSize,
        };
    },
};
