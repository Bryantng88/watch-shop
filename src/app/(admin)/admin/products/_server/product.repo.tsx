
import prisma from "@/server/db/client";
import { Prisma } from "@prisma/client";

type DB = Tx | typeof prisma;
const dbOrTx = (tx?: Tx): DB => tx ?? prisma;
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];



export async function createProductDraft(
    tx: Tx,
    data: Prisma.ProductCreateInput, // hoặc ProductUncheckedCreateInput
) {
    console.log("test dư lieu " + data)
    return tx.product.create({
        data,
        select: { id: true, slug: true },
    });
}