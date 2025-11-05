
import prisma from "@/server/db/client";
type DB = Tx | typeof prisma;
const dbOrTx = (tx?: Tx): DB => tx ?? prisma;
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];


export async function createProductDraft(
    tx: Tx,
    title: string
) {
    return tx.product.create({
        data: {
            title,
            type: "WATCH",
            contentStatus: "DRAFT",
        },
        select: { id: true },
    });
}