
import { DB, dbOrTx, prisma } from "@/server/db/client";
import { ProductType, Prisma, AvailabilityStatus, ProductStatus } from "@prisma/client";
import * as helper from "./helper";
import type { ProductListInput, ProductListSort } from "../_helper/search-params";
const DEFAULT_PAGE_SIZE = 50;

type ProductViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "sold";

function buildOrderBy(sort?: ProductListSort): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
        case "updatedAsc":
            return { updatedAt: "asc" };
        case "createdDesc":
            return { createdAt: "desc" };
        case "createdAsc":
            return { createdAt: "asc" };
        case "titleAsc":
            return { title: "asc" };
        case "titleDesc":
            return { title: "desc" };
        case "updatedDesc":
        default:
            return { updatedAt: "desc" };
    }
}

function buildWhereBase(input?: ProductListInput): Prisma.ProductWhereInput {
    const q = (input?.q || "").trim();

    const where: Prisma.ProductWhereInput = {};

    if (q) {
        where.OR = [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } } as any,
            { code: { contains: q, mode: "insensitive" } } as any,
        ];
    }

    if (input?.type) {
        where.type = input.type as any;
    }

    if (input?.brandId) {
        where.brandId = input.brandId;
    }

    if (input?.hasImages === "yes") {
        where.NOT = {
            OR: [
                { primaryImageUrl: null },
                { primaryImageUrl: "" },
            ],
        };
    }

    if (input?.hasImages === "no") {
        where.OR = [
            { primaryImageUrl: null },
            { primaryImageUrl: "" },
        ];
    }

    return where;
}

function buildWhereForView(
    whereBase: Prisma.ProductWhereInput,
    view?: ProductViewKey
): Prisma.ProductWhereInput {
    switch (view) {
        case "draft":
            return {
                AND: [whereBase, { status: "DRAFT" as any }],
            };

        case "posted":
            return {
                AND: [whereBase, { status: "POSTED" as any }],
            };

        case "in_service":
            return {
                AND: [whereBase, { status: "IN_SERVICE" as any }],
            };

        case "hold":
            return {
                AND: [
                    whereBase,
                    {
                        status: {
                            in: ["HOLD", "CONSIGNED", "RESERVED"] as any,
                        },
                    },
                ],
            };

        case "sold":
            return {
                AND: [whereBase, { status: "SOLD" as any }],
            };

        case "all":
        default:
            return whereBase;
    }
}

export async function listAdminProducts(
    tx: DB,
    input: ProductListInput & { page: number; pageSize: number }
) {
    const db = dbOrTx(tx);
    const safeInput = {
        q: input?.q,
        type: input?.type,
        brandId: input?.brandId,
        hasImages: input?.hasImages,
        view: input?.view ?? "all",
        sort: input?.sort ?? "updatedDesc",
        page: Math.max(1, Number(input?.page ?? 1)),
        pageSize: Math.max(1, Number(input?.pageSize ?? 20)),
    };
    const whereBase = buildWhereBase(safeInput);
    const whereList = buildWhereForView(whereBase, safeInput.view as ProductViewKey);

    const skip = (safeInput.page - 1) * safeInput.pageSize;
    const take = safeInput.pageSize;

    const orderBy = buildOrderBy(safeInput.sort);

    const productSelect: Prisma.ProductSelect = {
        id: true,
        title: true,
        slug: true,
        type: true,
        status: true,
        primaryImageUrl: true,
        //minPrice: true as any,
        createdAt: true,
        updatedAt: true,
        brand: {
            select: {
                id: true,
                name: true,
            },
        },
        vendor: {
            select: {
                id: true,
                name: true,
            },
        },
        _count: {
            select: {
                variants: true,
                Reservation: true as any,
                ServiceRequest: true as any,
                orderItems: true,
                image: true as any,
            },
        },
    };

    const [
        totalAll,
        total,
        rows,
        cDraft,
        cPosted,
        cInService,
        cHold,
        cSold,
        brands,
    ] = await Promise.all([
        db.product.count({ where: whereBase }),
        db.product.count({ where: whereList }),
        db.product.findMany({
            where: whereList,
            orderBy,
            skip,
            take,
            select: productSelect,
        }),

        db.product.count({
            where: {
                AND: [whereBase, { status: "DRAFT" as any }],
            },
        }),

        db.product.count({
            where: {
                AND: [whereBase, { status: "POSTED" as any }],
            },
        }),

        db.product.count({
            where: {
                AND: [whereBase, { status: "IN_SERVICE" as any }],
            },
        }),

        db.product.count({
            where: {
                AND: [
                    whereBase,
                    {
                        status: {
                            in: ["HOLD", "CONSIGNED", "RESERVED"] as any,
                        },
                    },
                ],
            },
        }),

        db.product.count({
            where: {
                AND: [whereBase, { status: "SOLD" as any }],
            },
        }),

        db.brand.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        }),
    ]);

    const items = rows.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: p.type,
        status: p.status,
        primaryImageUrl: p.primaryImageUrl,
        minPrice: p.minPrice,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        brand: p.brand?.name ?? null,
        brandId: p.brand?.id ?? null,
        vendorName: p.vendor?.name ?? null,
        vendorId: p.vendor?.id ?? null,
        variantsCount: p._count?.variants ?? 0,
        imagesCount: p._count?.image ?? 0,
        ordersCount: p._count?.orderItems ?? 0,
        serviceRequests: p._count?.ServiceRequest ?? 0,
        reservations: p._count?.Reservation ?? 0,
    }));

    const productTypes = [
        { label: "WATCH", value: "WATCH" },
        { label: "ACCESSORY", value: "ACCESSORY" },
        { label: "OTHER", value: "OTHER" },
    ];

    return {
        items,
        total,
        counts: {
            all: totalAll,
            draft: cDraft,
            posted: cPosted,
            in_service: cInService,
            hold: cHold,
            sold: cSold,
        },
        brands,
        productTypes,
    };
}

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
            status: "DRAFT",
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
            status: "DRAFT", // admin search

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
            vendor: {
                select: {

                    name: true,
                }
            }

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
        vendorName: p.vendor?.name ?? null,
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
            status: true,
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

export const productForBulkPostArgs = Prisma.validator<Prisma.ProductDefaultArgs>()({
    select: {
        id: true,
        title: true,
        status: true,
        primaryImageUrl: true,

        // ⚠️ CHỈ ĐỂ minPrice nếu Product thật sự có field này trong prisma schema
        // minPrice: true,
    },
});

// ✅ 2) Type lấy từ args => auto khớp schema
export type ProductForBulkPost = Prisma.ProductGetPayload<typeof productForBulkPostArgs>;

export async function getProductsForBulkPost(tx: DB, ids: string[]) {
    const db = dbOrTx(tx);

    return db.product.findMany({
        where: { id: { in: ids } },
        ...productForBulkPostArgs,
    });
}

export async function markPostedMany(tx: DB, ids: string[]) {
    const db = dbOrTx(tx);

    return db.product.updateMany({
        where: { id: { in: ids }, status: ProductStatus.DRAFT },
        data: { status: ProductStatus.POSTED, updatedAt: new Date() },
    });
}