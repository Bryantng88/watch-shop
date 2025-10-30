import { PrismaClient, Prisma, ProductType, PriceVisibility } from "@prisma/client";
import prisma from "@/server/db/client";
type Db = typeof prisma | Tx;

export type AdminSort =
    | "updatedDesc" | "updatedAsc"
    | "createdDesc" | "createdAsc"
    | "titleAsc" | "titleDesc";

export interface AdminProductFilters {
    page?: number;
    pageSize?: number;
    q?: string;

    status?: Prisma.ProductWhereInput["status"][]; // ['ACTIVE','DRAFT','INACTIVE']
    type?: Prisma.ProductWhereInput["type"][];     // ['PRE_OWNED',...]
    brandIds?: string[];
    hasImages?: "yes" | "no";
    updatedFrom?: Date | string;
    updatedTo?: Date | string;
    sort?: AdminSort;
}
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

const DEFAULT_PAGE_SIZE = 50;

function buildWhere(f: AdminProductFilters): Prisma.ProductWhereInput {
    return {
        ...(f.q
            ? {
                OR: [
                    { title: { contains: f.q, mode: "insensitive" } },
                    { slug: { contains: f.q, mode: "insensitive" } },
                    { seoTitle: { contains: f.q, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(f.status?.length ? { status: { in: f.status as any } } : {}),
        ...(f.type?.length ? { type: { in: f.type as any } } : {}),
        ...(f.brandIds?.length ? { brandId: { in: f.brandIds } } : {}),
        ...(f.hasImages === "yes" ? { primaryImageUrl: { not: null } } : {}),
        ...(f.hasImages === "no" ? { primaryImageUrl: null } : {}),
        ...(f.updatedFrom || f.updatedTo
            ? {
                updatedAt: {
                    ...(f.updatedFrom ? { gte: new Date(f.updatedFrom) } : {}),
                    ...(f.updatedTo ? { lte: new Date(f.updatedTo) } : {}),
                },
            }
            : {}),
    };
}

function buildOrderBy(sort: AdminSort | undefined): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
        case "updatedAsc": return [{ updatedAt: "asc" }];
        case "updatedDesc": return [{ updatedAt: "desc" }];
        case "createdAsc": return [{ createdAt: "asc" }];
        case "createdDesc": return [{ createdAt: "desc" }];
        case "titleAsc": return [{ title: "asc" }];
        case "titleDesc": return [{ title: "desc" }];
        default: return [{ updatedAt: "desc" }];
    }
}

/**
 * Danh sách cho Admin Table + vài KPI vận hành
 * - variants: lấy min price & tổng tồn (nếu bạn có cột stockQty)
 * - _count: đếm số bản ghi liên quan
 * - lastSoldAt: lấy OrderItem gần nhất
 * - lastServicedAt: lấy MaintenanceRecord gần nhất
 */
export async function listAdminProducts(f: AdminProductFilters) {
    const page = Math.max(1, f.page ?? 1);
    const pageSize = Math.max(1, Math.min(200, f.pageSize ?? DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = buildWhere(f);

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take,
            orderBy: buildOrderBy(f.sort),
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
                        availabilityStatuts: true, /*, stockQty: true*/
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

    const rows = items.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        avaibilityStatus: p.variants[0]?.availabilityStatuts,
        contentStatus: p.contentStatus,
        priceVisibility: p.priceVisibility,
        type: p.type,
        brand: p.brand?.name ?? null,
        image: p.primaryImageUrl ?? null,

        minPrice: p.variants[0]?.price ?? null,
        variantsCount: p._count.variants,
        imagesCount: p._count.image,

        ordersCount: p._count.orderItems,
        lastSoldAt: p.orderItems[0]?.createdAt ?? null,

        maintenanceCount: p._count.maintenanceRecords,
        lastServicedAt: p.maintenanceRecords[0]?.servicedAt ?? null,

        invoicesCount: p._count.InvoiceItem,
        acquisitionsCount: p._count.AcquisitionItem,

        serviceRequests: p._count.ServiceRequest,
        reservations: p._count.Reservation,

        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    }));

    return { items: rows, total, page, pageSize };
}

/**
 * Chi tiết admin: include đầy đủ để mở tab
 */
export async function getAdminProductDetail(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            brand: true,
            vendor: true,
            watchSpec: {
                include: {
                    complication: true,
                    marketSegment: true, // nếu có
                },
            },
            image: true,
            variants: { orderBy: { price: "asc" } },
        },
    });
    return product;
}

/** Lịch sử theo tab – có phân trang & lọc ngày */
export async function getProductOrders(id: string, page = 1, pageSize = 20, from?: Date, to?: Date) {
    return prisma.orderItem.findMany({
        where: {
            productId: id,
            ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        // select: { quantity: true, unitPrice: true, order: { select: { code: true, customerName: true } } },
    });
}

export async function getProductInvoices(id: string, page = 1, pageSize = 20) {
    return prisma.invoiceItem.findMany({
        where: { productId: id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
}

export async function getProductAcquisitions(id: string, page = 1, pageSize = 20) {
    return prisma.acquisitionItem.findMany({
        where: { productId: id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
}

export async function getProductMaintenance(id: string, page = 1, pageSize = 20, from?: Date, to?: Date) {
    return prisma.maintenanceRecord.findMany({
        where: {
            productId: id,
            ...(from || to ? { servicedAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
        },
        orderBy: { servicedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
}


{/*} export async function createAdminProduct(
    tx: Prisma.TransactionClient,
    data: {
        title: string;
        status: string;
        type: ProductType | string;
        brandId?: string;
        vendorId?: string;
        variant: { price?: number; stockQty?: number };
        watchSpec?: { caseType?: string; length?: number; width?: number; thickness?: number };
        gender?: string;
        length?: string;
        movement?: string;
    }
) {

    const { brandId, vendorId, title, status, gender, movement, caseType, type, price, seoTitle, primaryImageUrl, seoDescription } = data;
    const createData: Prisma.ProductCreateInput = {
        title,
        status,
        type,
        seoTitle,
        seoDescription,
        ...(brandId ? { brand: { connect: { id: brandId } } } : {}),
        variants: {
            create: [
                {
                    price,
                    stockQty: 1,
                    isActive: true
                }
            ]
        },
        watchSpec: {
            create: {
                caseType,
                movement,          // optional vì có @default
                gender,            // optional vì có @default
                category: [],      // khuyến nghị
                length: 46.5,      // ✅ BẮT BUỘC
                width: 39.7,       // ✅ BẮT BUỘC
                thickness: 12.0,   // ✅ BẮT BUỘC
            }

        },
        ...(vendorId ? { vendor: { connect: { id: vendorId } } } : {}),
        primaryImageUrl: primaryImageUrl ?? null,
    };
    return prisma.product.create({
        data: createData,
        select: { id: true, slug: true },
    });
*/}
export const createProduct = (db: Db) => ({
    create: (data: Prisma.ProductCreateInput) => db.product.create({ data, select: { id: true, slug: true } }),
});


export async function updateAdminProduct(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
        where: { id },
        data
    });

}
export async function deleteAdminProduct(id: string) {
    await prisma.product.delete({ where: { id } });
    return { ok: true };
}
export async function activateProduct(id: string) {
    return prisma.productVariant.update({ where: { id }, data: { availabilityStatus: "ACTIVE" } as any });
}
export async function hideProduct(id: string) {
    return prisma.productVariant.update({ where: { id }, data: { availabilityStatus: "HIDDEN" } as any });
}


export const adminProductRepo = {
    async update(productId: string, args: {
        productData?: Prisma.ProductUpdateInput;
        watchSpecData?: Prisma.WatchSpecUpsertWithoutProductInput | Prisma.WatchSpecUpdateWithoutProductInput;
        variantUpserts?: Array<{
            where?: { id: string };
            create: Prisma.ProductVariantCreateWithoutProductInput;
            update: Prisma.ProductVariantUpdateWithoutProductInput;
        }>;
    }) {
        return prisma.$transaction(async (tx) => {
            // Product base fields
            const updated = await tx.product.update({
                where: { id: productId },
                data: {
                    ...(args.productData ?? {}),
                    // Upsert / update watchSpec
                    watchSpec: args.watchSpecData
                        ? ("create" in (args.watchSpecData as any) || "update" in (args.watchSpecData as any)
                            ? { upsert: args.watchSpecData as Prisma.WatchSpecUpsertWithoutProductInput }
                            : { update: args.watchSpecData as Prisma.WatchSpecUpdateWithoutProductInput })
                        : undefined,
                },
                include: { variants: true, watchSpec: true },
            });


            // Variants upsert
            if (args.variantUpserts?.length) {
                for (const v of args.variantUpserts) {
                    if (v.where?.id) {
                        await tx.productVariant.upsert({
                            where: { id: v.where.id },
                            update: v.update,
                            create: { ...v.create, product: { connect: { id: productId } } },
                        });
                    } else {
                        await tx.productVariant.create({
                            data: { ...v.create, product: { connect: { id: productId } } },
                        });
                    }
                }
            }


            return updated;
        });
    },
}

