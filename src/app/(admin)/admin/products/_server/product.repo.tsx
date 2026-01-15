
import { DB, dbOrTx, prisma } from "@/server/db/client";
import { ProductType, Prisma, AvailabilityStatus, ContentStatus } from "@prisma/client";
import * as helper from "./helper";

const DEFAULT_PAGE_SIZE = 50;


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

            variants: {
                some: {
                    availabilityStatus: "ACTIVE",
                },
            },


        },
        select: {
            id: true,
            title: true,
            type: true,
            primaryImageUrl: true,
            variants: {
                where: {
                    availabilityStatus: "ACTIVE", // ✅ CHỈ LẤY VARIANT ACTIVE
                },
                select: {
                    id: true,
                    price: true,
                    availabilityStatus: true,
                },
                orderBy: {
                    updatedAt: "desc",
                },
                take: 1,
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

export async function listAdminProducts(f: helper.AdminProductFilters) {
    const page = Math.max(1, f.page ?? 1);
    const pageSize = Math.max(1, Math.min(200, f.pageSize ?? DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const where = helper.buildWhere(f);
    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take,
            orderBy: helper.buildOrderBy(f.sort),
            select: {
                id: true,
                title: true,
                slug: true,
                priceVisibility: true,
                contentStatus: true,

                type: true,
                brand: { select: { id: true, name: true } },
                primaryImageUrl: true,
                createdAt: true,
                updatedAt: true,
                // Lấy min price từ variants + (tuỳ có stockQty hay không)
                variants: {
                    orderBy: { price: "asc" },
                    take: 1,
                    select: {
                        price: true,
                        availabilityStatus: true, /*, stockQty: true*/
                    }, // TODO: map field tồn kho nếu có
                },

                // Lấy bản ghi gần nhất của các lịch sử
                orderItems: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { createdAt: true },
                },
                maintenanceRecords: {
                    orderBy: { servicedAt: "desc" }, // TODO: map field ngày bảo trì
                    take: 1,
                    select: { servicedAt: true },
                },

                // Đếm số bản ghi liên quan
                _count: {
                    select: {
                        image: true,
                        variants: true,
                        orderItems: true,
                        maintenanceRecords: true,
                        InvoiceItem: true,
                        AcquisitionItem: true,
                        ServiceRequest: true,
                        Reservation: true,
                    },
                },
            },
        }),
        prisma.product.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

export async function updateProductVariantStt(
    tx: DB,
    params: {
        productId: string;
        status: AvailabilityStatus;
        fromStatuses?: AvailabilityStatus[]; // optional guard
    }
) {
    const { productId, status, fromStatuses } = params;

    const where: Prisma.ProductVariantWhereInput = {
        productId,
        ...(fromStatuses?.length
            ? { availabilityStatus: { in: fromStatuses } }
            : {}),
    };
    const db = dbOrTx(tx);
    const result = await db.productVariant.updateMany({
        where,
        data: {
            availabilityStatus: status,
        },
    });

    if (result.count === 0) {
        throw new Error(
            `Không thể cập nhật trạng thái sản phẩm (productId=${productId}). Có thể sản phẩm không AVAILABLE.`
        );
    }

    return result.count;
}

export async function markProductsShippedOrDelivered(
    // Tuỳ schema product status
    productIds: string[],
    status: AvailabilityStatus,
    tx: DB
) {
    const db = dbOrTx(tx);

    if (!productIds?.length) return { count: 0 };

    return db.productVariant.updateMany({
        where: {
            productId: { in: productIds },
        },
        data: {
            availabilityStatus: status,
        },
    });
}