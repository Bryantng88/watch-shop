
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