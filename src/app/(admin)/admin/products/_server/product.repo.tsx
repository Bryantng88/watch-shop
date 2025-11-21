
import { DB, dbOrTx } from "@/server/db/client";
import { ProductType } from "@prisma/client";


export async function createProductDraft(
    tx: DB,
    title: string,
    type: ProductType,
    vendorId: string // hoặc ProductUncheckedCreateInput
) {
    const db = dbOrTx(tx);
    return db.product.create({
        data: {
            title: title,
            vendorId: vendorId,
            contentStatus: "DRAFT",
            type: type,
            variants: { stockQty: }
        },
        select: { id: true, slug: true }  // <-- đúng cấp với data
    });
}