import prisma from '@/server/db/client';


export type BrandOption = { id: string; name: string };

export async function listBrands(): Promise<BrandOption[]> {
    const brands = await prisma.brand.findMany({
        select: {
            name: true,
            id: true,
            _count: {
                select: { products: true },
            }
        },
        orderBy: { name: "asc" },
    });
    const brandsWithCount = brands.map(b => ({
        id: b.id,
        name: b.name,
        productCount: b._count.products,
    }));

    return brandsWithCount;
}