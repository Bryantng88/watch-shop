import prisma from '@/server/db/client';


export type ComplicationOption = { id: string; name: string };

export async function listComplications(): Promise<ComplicationOption[]> {
    return prisma.complication.findMany({
        select: {
            id: true,
            name: true,

        },

        orderBy: { name: "asc" },
    });
}