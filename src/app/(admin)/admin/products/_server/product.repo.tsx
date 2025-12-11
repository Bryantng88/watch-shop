
import { DB, dbOrTx } from "@/server/db/client";
import { ProductType } from "@prisma/client";
import * as helper from "./helper";

export async function createProductDraft(
    tx: DB,
    title: string,
    type: ProductType,
    quantity: number,
    vendorId: string,
    // hoặc ProductUncheckedCreateInput
) {
    const db = dbOrTx(tx);
    return db.product.create({
        data: {
            title: title,
            vendorId,
            contentStatus: "DRAFT",
            type: type,
            variants: {
                create: [{
                    stockQty: quantity
                }]
            }
        },
        select: { id: true, slug: true }  // <-- đúng cấp với data
    });
}



export async function searchProductsRepo(tx: DB, q: string) {
    const db = dbOrTx(tx);

    return db.product.findMany({
        where: {
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                //{ sku: { contains: q, mode: "insensitive" } },
            ]
        },
        select: {
            id: true,
            title: true,
            primaryImageUrl: true,
            //productType: true,
            //sellPrice: true,
        },
        take: 20,
        orderBy: { updatedAt: "desc" },
    });
}
