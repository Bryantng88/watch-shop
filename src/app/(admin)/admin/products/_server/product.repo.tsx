
import { DB, dbOrTx } from "@/server/db/client";
import { ProductType, Prisma } from "@prisma/client";
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


export async function searchProductsRepo(
    tx: DB,
    q: string
) {
    const product = await tx.product.findMany({
        where: {
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                // sau này mở SKU thì thêm ở đây
            ],
            contentStatus: "DRAFT", // admin search
        },
        select: {
            id: true,
            title: true,
            type: true,
            primaryImageUrl: true,
            variants: {
                select: {
                    price: true,
                },
            },
        },
        take: 20,
        orderBy: { updatedAt: "desc" },
    });

    return product.map((p) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        primaryImageUrl: p.primaryImageUrl,
        price: p.variants[0]
            ? Number(p.variants[0].price)
            : 0,
    }));
}

// app/(admin)/admin/products/_server/product.repo.ts


export async function updateProduct(
    tx: DB,
    id: string,
    data: Prisma.ProductUpdateInput
) {
    const db = dbOrTx(tx);
    return db.product.update({
        where: { id },
        data,
        select: {
            id: true,
            title: true,
            // chọn field ảnh đúng với DB bạn
            image: true,
            primaryImageUrl: true,
            //minPrice: true,
            contentStatus: true,
            priceVisibility: true,
            variants: {
                select: {
                    availabilityStatus: true,
                }
            },

            updatedAt: true,
            createdAt: true,
        },
    });
}

export async function deleteProduct(tx: DB, id: string) {
    const db = dbOrTx(tx);
    return db.product.delete({ where: { id } });
}

