
import { DB, dbOrTx } from "@/server/db/client";


export async function createProductDraft(
    tx: DB,
    title: string,
    vendorId: string // hoặc ProductUncheckedCreateInput
) {
    const db = dbOrTx(tx);
    return db.product.create({
        data: {
            title: title,
            vendorId: vendorId,
            contentStatus: "DRAFT",
            type: "WATCH"
        },
        select: { id: true, slug: true }  // <-- đúng cấp với data
    });
}