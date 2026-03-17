import { DB, dbOrTx } from "@/server/db/client";
import {
    ProductType,
    Prisma,
    AvailabilityStatus,
    ProductStatus,
} from "@prisma/client";
import type {
    ProductListInput,
    ProductListSort,
    ProductCatalogKey,
} from "../_helper/search-params";

const DEFAULT_PAGE_SIZE = 50;

type ProductViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "sold";

type AdminProductListRepoInput = ProductListInput & {
    page?: number;
    pageSize?: number;
    updatedFrom?: Date;
    updatedTo?: Date;
    catalog?: ProductCatalogKey;
};

function startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function endOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

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

function buildWhereBase(input?: AdminProductListRepoInput): Prisma.ProductWhereInput {
    const q = (input?.q || "").trim();
    const and: Prisma.ProductWhereInput[] = [];

    if (input?.catalog === "strap") {
        and.push({ type: ProductType.WATCH_STRAP });
    } else {
        and.push({
            NOT: {
                type: ProductType.WATCH_STRAP,
            },
        });
    }

    if (q) {
        and.push({
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
                { brand: { name: { contains: q, mode: "insensitive" } } },
            ],
        });
    }

    if (input?.type) {
        and.push({ type: input.type as any });
    }

    if (input?.brandId) {
        and.push({ brandId: input.brandId });
    }

    if (input?.hasImages === "yes") {
        and.push({
            NOT: {
                OR: [{ primaryImageUrl: null }, { primaryImageUrl: "" }],
            },
        });
    }

    if (input?.hasImages === "no") {
        and.push({
            OR: [{ primaryImageUrl: null }, { primaryImageUrl: "" }],
        });
    }

    if (input?.updatedFrom || input?.updatedTo) {
        and.push({
            updatedAt: {
                ...(input.updatedFrom ? { gte: startOfDay(input.updatedFrom) } : {}),
                ...(input.updatedTo ? { lte: endOfDay(input.updatedTo) } : {}),
            },
        });
    }

    return and.length ? { AND: and } : {};
}

function buildWhereForView(
    whereBase: Prisma.ProductWhereInput,
    view?: ProductViewKey
): Prisma.ProductWhereInput {
    switch (view) {
        case "draft":
            return { AND: [whereBase, { status: ProductStatus.DRAFT }] };
        case "posted":
            return { AND: [whereBase, { status: ProductStatus.POSTED }] };
        case "in_service":
            return { AND: [whereBase, { status: ProductStatus.IN_SERVICE }] };
        case "hold":
            return {
                AND: [
                    whereBase,
                    {
                        status: {
                            in: [
                                ProductStatus.HOLD,
                                ProductStatus.CONSIGNED_FROM,
                                ProductStatus.CONSIGNED_TO,
                            ],
                        },
                    },
                ],
            };
        case "sold":
            return { AND: [whereBase, { status: ProductStatus.SOLD }] };
        case "all":
        default:
            return whereBase;
    }
}

export async function listAdminProducts(
    tx: DB,
    input?: ProductListInput & { page?: number; pageSize?: number; catalog?: "product" | "strap" }
) {
    const db = dbOrTx(tx);

    const safeInput = {
        q: input?.q,
        type: input?.type,
        brandId: input?.brandId,
        hasImages: input?.hasImages,
        view: (input?.view ?? "all") as ProductViewKey,
        sort: (input?.sort ?? "updatedDesc") as ProductListSort,
        page: Math.max(1, Number(input?.page ?? 1)),
        pageSize: Math.max(1, Number(input?.pageSize ?? DEFAULT_PAGE_SIZE)),
        catalog: input?.catalog ?? "product",
    };

    const baseWhere = buildWhereBase({
        ...safeInput,
        type: safeInput.catalog === "strap" ? ("WATCH_STRAP" as any) : safeInput.type,
    } as any);

    const whereList = buildWhereForView(baseWhere, safeInput.view);
    const skip = (safeInput.page - 1) * safeInput.pageSize;
    const take = safeInput.pageSize;
    const orderBy = buildOrderBy(safeInput.sort);

    const [totalAll, total, rows, cDraft, cPosted, cInService, cHold, cSold, brands] =
        await Promise.all([
            db.product.count({ where: baseWhere }),
            db.product.count({ where: whereList }),
            db.product.findMany({
                where: whereList,
                orderBy,
                skip,
                take,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    type: true,
                    status: true,
                    primaryImageUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    brand: { select: { id: true, name: true } },
                    vendor: { select: { id: true, name: true } },
                    variants: {
                        orderBy: { updatedAt: "desc" },
                        take: 1,
                        select: {
                            id: true,
                            stockQty: true,
                            price: true,
                            salePrice: true,
                            costPrice: true,
                            acquisitionItem: {
                                orderBy: { createdAt: "desc" },
                                take: 1,
                                select: {
                                    unitCost: true,
                                },
                            },
                            strapSpec: {
                                select: {
                                    lugWidthMM: true,
                                    buckleWidthMM: true,
                                    color: true,
                                    material: true,
                                    quickRelease: true,
                                },
                            },
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
                },
            }),
            db.product.count({ where: buildWhereForView(baseWhere, "draft") }),
            db.product.count({ where: buildWhereForView(baseWhere, "posted") }),
            db.product.count({ where: buildWhereForView(baseWhere, "in_service") }),
            db.product.count({ where: buildWhereForView(baseWhere, "hold") }),
            db.product.count({ where: buildWhereForView(baseWhere, "sold") }),
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
        minPrice: p.variants?.[0]?.price != null ? Number(p.variants[0].price) : null,
        salePrice: p.variants?.[0]?.salePrice != null ? Number(p.variants[0].salePrice) : null,
        stockQty: Number(p.variants?.[0]?.stockQty ?? 0),
        purchasePrice:
            p.variants?.[0]?.costPrice != null
                ? Number(p.variants[0].costPrice)
                : p.variants?.[0]?.acquisitionItem?.[0]?.unitCost != null
                    ? Number(p.variants[0].acquisitionItem[0].unitCost)
                    : null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        brand: p.brand?.name ?? null,
        brandId: p.brand?.id ?? null,
        vendorName: p.vendor?.name ?? null,
        vendorId: p.vendor?.id ?? null,
        strapSpec: p.variants?.[0]?.strapSpec ?? null,
        variantsCount: p._count?.variants ?? 0,
        imagesCount: p._count?.image ?? 0,
        ordersCount: p._count?.orderItems ?? 0,
        serviceRequests: p._count?.ServiceRequest ?? 0,
        reservations: p._count?.Reservation ?? 0,
    }));

    const productTypes =
        safeInput.catalog === "strap"
            ? [{ label: "WATCH_STRAP", value: "WATCH_STRAP" }]
            : [
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
    vendorId: string | null
) {
    const db = dbOrTx(tx);

    return db.product.create({
        data: {
            title,
            vendorId: vendorId ?? undefined,
            status: ProductStatus.DRAFT,
            type,
            variants: {
                create: [
                    {
                        stockQty: quantity,
                    },
                ],
            },
        },
        select: { id: true, slug: true },
    });
}

export async function searchProductsRepo(tx: DB, q: string) {
    const db = dbOrTx(tx);

    const product = await db.product.findMany({
        where: {
            OR: [{ title: { contains: q, mode: "insensitive" } }],
            status: ProductStatus.DRAFT,
            variants: {
                some: {
                    availabilityStatus: AvailabilityStatus.ACTIVE,
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
                    availabilityStatus: AvailabilityStatus.ACTIVE,
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
        price: p.variants[0] ? Number(p.variants[0].price) : 0,
        vendorName: p.vendor?.name ?? null,
    }));
}

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
            image: true,
            primaryImageUrl: true,
            status: true,
            priceVisibility: true,
            variants: {
                select: {
                    availabilityStatus: true,
                },
            },
            updatedAt: true,
            createdAt: true,
        },
    });
}

export async function updatePrimaryVariantPricing(
    tx: DB,
    productId: string,
    patch: {
        minPrice?: number | null;
        salePrice?: number | null;
    }
) {
    const db = dbOrTx(tx);

    const variant = await db.productVariant.findFirst({
        where: { productId },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
        select: { id: true },
    });

    if (!variant) {
        throw new Error("Sản phẩm chưa có variant để cập nhật giá");
    }

    return db.productVariant.update({
        where: { id: variant.id },
        data: {
            ...(patch.minPrice !== undefined ? { price: patch.minPrice } : {}),
            ...(patch.salePrice !== undefined ? { salePrice: patch.salePrice } : {}),
            updatedAt: new Date(),
        },
    });
}

export async function bulkSetSalePrice(
    tx: DB,
    productIds: string[],
    salePrice: number | null
) {
    const db = dbOrTx(tx);

    return db.productVariant.updateMany({
        where: { productId: { in: productIds } },
        data: {
            salePrice,
            updatedAt: new Date(),
        },
    });
}

export async function getAdminProductRow(tx: DB, id: string) {
    const db = dbOrTx(tx);

    const p: any = await db.product.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            status: true,
            primaryImageUrl: true,
            createdAt: true,
            updatedAt: true,
            brand: { select: { id: true, name: true } },
            vendor: { select: { id: true, name: true } },
            variants: {
                orderBy: { updatedAt: "desc" },
                take: 1,
                select: {
                    id: true,
                    stockQty: true,
                    price: true,
                    salePrice: true,
                    costPrice: true,
                    acquisitionItem: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: { unitCost: true },
                    },
                },
            },
        },
    });

    if (!p) throw new Error("Không tìm thấy sản phẩm");

    return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: p.type,
        status: p.status,
        primaryImageUrl: p.primaryImageUrl,
        minPrice: p.variants?.[0]?.price != null ? Number(p.variants[0].price) : null,
        salePrice: p.variants?.[0]?.salePrice != null ? Number(p.variants[0].salePrice) : null,
        purchasePrice:
            p.variants?.[0]?.costPrice != null
                ? Number(p.variants[0].costPrice)
                : p.variants?.[0]?.acquisitionItem?.[0]?.unitCost != null
                    ? Number(p.variants[0].acquisitionItem[0].unitCost)
                    : null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        brand: p.brand?.name ?? null,
        vendorName: p.vendor?.name ?? null,
    };
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
        fromStatuses?: AvailabilityStatus[];
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
        variants: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: {
                price: true,
            },
        },
    },
});

export type ProductForBulkPost = Prisma.ProductGetPayload<typeof productForBulkPostArgs>;

export async function getProductsForBulkPost(tx: DB, ids: string[]) {
    const db = dbOrTx(tx);

    const rows = await db.product.findMany({
        where: { id: { in: ids } },
        ...productForBulkPostArgs,
    });

    return rows.map((p: any) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        primaryImageUrl: p.primaryImageUrl,
        minPrice: p.variants?.[0]?.price != null ? Number(p.variants[0].price) : null,
    }));
}

export async function markPostedMany(tx: DB, ids: string[]) {
    const db = dbOrTx(tx);

    return db.product.updateMany({
        where: { id: { in: ids }, status: ProductStatus.DRAFT },
        data: { status: ProductStatus.POSTED, updatedAt: new Date() },
    });
}

export async function getLatestVariantForAdmin(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    return db.productVariant.findFirst({
        where: { productId },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
        select: {
            id: true,
            productId: true,
            price: true,
            salePrice: true,
            costPrice: true,
            stockQty: true,
            updatedAt: true,
            createdAt: true,
            acquisitionItem: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: {
                    unitCost: true,
                },
            },
        },
    });
}