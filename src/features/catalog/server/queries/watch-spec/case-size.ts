import prisma from '@/server/db/client';


export type SizeCategory = { id: string, name: string };

export async function listSize(): Promise<SizeCategory[]> {
    const rows = await prisma.watchSpec.groupBy({
        by: ['sizeCategory'],
        where: { sizeCategory: { not: null } },
        _count: { _all: true },
        orderBy: { sizeCategory: 'asc' },
    });

    const SizeWithCount = rows.map((r) => ({
        // đảm bảo không null
        id: r.sizeCategory!,
        name: r.sizeCategory!,
        productCount: r._count._all

    }));
    return SizeWithCount
}
