import prisma from '@/server/db/client';


export type SizeCategory = { id: string; name: string };

export async function listSize(): Promise<SizeCategory[]> {
    const rows = await prisma.watchSpec.findMany({
        distinct: ['sizeCategory'],
        where: { sizeCategory: { not: null } },
        select: { sizeCategory: true, productId: true },
        orderBy: { sizeCategory: 'asc' },
    });

    // map lại đúng với type SizeCategory
    return rows.map((r) => ({
        id: r.productId!,   // đảm bảo không null
        name: r.sizeCategory!,
    }));
}
