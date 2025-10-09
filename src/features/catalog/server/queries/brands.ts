import prisma from '@/server/db/client';


export type BrandOption = { id: string; name: string };

export async function listBrands(): Promise<BrandOption[]> {
    return prisma.brand.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    });
}