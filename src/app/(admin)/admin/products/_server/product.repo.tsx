
import prisma from "@/server/db/client";
import { Prisma } from "@prisma/client";

type DB = Tx | typeof prisma;
const dbOrTx = (tx?: Tx): DB => tx ?? prisma;
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];



export async function createProductDraft(
    tx: Tx,
    title: string,
    vendorId: string // hoặc ProductUncheckedCreateInput
) {
    console.log('typeof tx.product:', typeof tx.product)
    return tx.product.create({
        data: {
            title: title,
            vendorId: vendorId,
            contentStatus: "DRAFT",
            type: "WATCH",
        },
        select: { id: true, slug: true }  // <-- đúng cấp với data
    });
}