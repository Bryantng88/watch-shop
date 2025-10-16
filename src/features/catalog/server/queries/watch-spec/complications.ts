import prisma from '@/server/db/client';


export type ComplicationOption = { id: string; name: string };

export async function listComplications(): Promise<ComplicationOption[]> {
    const complications = await prisma.complication.findMany({
        where: {
            watchSpecs: {
                some: {

                }
            }
        },
        select: {
            id: true,
            name: true,
            _count: { select: { watchSpecs: true } }, // nếu muốn đếm số sản phẩm liên quan

        },

        orderBy: { name: "asc" },
    });

    const complicationWithCount = complications.map(b => ({
        id: b.id,
        name: b.name,
        productCount: b._count.watchSpecs,
    }));

    return complicationWithCount;
}