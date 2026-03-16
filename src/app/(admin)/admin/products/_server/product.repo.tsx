import { DB, dbOrTx } from "@/server/db/client";
import {
    ProductType,
    Prisma,
    AvailabilityStatus,
    ProductStatus,
    DiscountType,
} from "@prisma/client";
import type {
    ProductListInput,
    ProductListSort,
    ProductCatalogKey,
} from "../_helper/search-params";
import { computeDiscountPercent } from "../helpers/price";

const DEFAULT_PAGE_SIZE = 50;

type ProductViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "sold";

type AdminProductListRepoInput = ProductListInput & {
    page?: number;
    pageSize?: number;
    updatedFrom?: Date;
    updatedTo?: Date;
    catalog?: ProductCatalogKey;
    includeCost?: boolean;
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
            type: {
                not: ProductType.WATCH_STRAP,
            } as any,
        });
    }

    if (q) {
        and.push({
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
                { sku: { contains: q, mode: "insensitive" } } as any,
                { code: { contains: q, mode: "insensitive" } } as any,
            ],
        });
    }

    if (input?.type) {
        and.push({ type: input.type as any });
    }

    if (input?.brandId) {
        and.push({ brandId: input.brandId });
    }

    if (input?.categoryId) {
        and.push({ categoryId: input.categoryId });
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
    input?: ProductListInput & {
        page?: number;
        pageSize?: number;
        catalog?: "product" | "strap";
        includeCost?: boolean;
    }
) {
    const db = dbOrTx(tx);

    const safeInput = {
        q: input?.q,
        type: input?.type,
        brandId: input?.brandId,
        categoryId: input?.categoryId,
        hasImages: input?.hasImages,
        view: (input?.view ?? "all") as ProductViewKey,
        sort: (input?.sort ?? "updatedDesc") as ProductListSort,
        page: Math.max(1, Number(input?.page ?? 1)),
        pageSize: Math.max(1, Number(input?.pageSize ?? 20)),
        catalog: input?.catalog ?? "product",
        includeCost: !!input?.includeCost,
    };

    const baseWhere = buildWhereBase({
        ...safeInput,
        type: safeInput.catalog === "strap" ? ("WATCH_STRAP" as any) : safeInput.type,
    } as any);

    if (safeInput.catalog === "product") {
        (baseWhere as any).NOT = {
            ...(baseWhere as any).NOT,
            type: "WATCH_STRAP",
        };
    }

    const whereList = buildWhereForView(baseWhere, safeInput.view);
    const skip = (safeInput.page - 1) * safeInput.pageSize;
    const take = safeInput.pageSize;
    const orderBy = buildOrderBy(safeInput.sort);

    const [totalAll, total, rows, cDraft, cPosted, cInService, cHold, cSold, brands, categories] =
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
                    ProductCategory: { select: { id: true, name: true, code: true } },
                    variants: {
                        orderBy: { updatedAt: "desc" },
                        take: 1,
                        select: {
                            id: true,
                            stockQty: true,
                            price: true,
                            listPrice: true,
                            discountType: true,
                            discountValue: true,
                            salePrice: true,
                            saleStartsAt: true,
                            saleEndsAt: true,
                            costPrice: true,
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
                    AcquisitionItem: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: {
                            unitCost: true,
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
            db.productCategory.findMany({
                where: {
                    isActive: true,
                    scope: safeInput.catalog === "strap" ? { in: ["WATCH_STRAP", "ALL"] as any } : { in: ["WATCH", "ALL"] as any },
                },
                orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
                select: { id: true, name: true, code: true, scope: true },
            }),
        ]);

    const items = rows.map((p: any) => {
        const v = p.variants?.[0] ?? null;
        const effectivePrice = v?.price != null ? Number(v.price) : null;
        const listPrice = v?.listPrice != null ? Number(v.listPrice) : effectivePrice;
        const discountValue = v?.discountValue != null ? Number(v.discountValue) : null;
        const purchaseFallback = p.AcquisitionItem?.[0]?.unitCost != null ? Number(p.AcquisitionItem[0].unitCost) : null;
        const purchasePrice = v?.costPrice != null ? Number(v.costPrice) : purchaseFallback;
        const discountPercent = computeDiscountPercent({
            listPrice,
            effectivePrice,
        });

        return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            type: p.type,
            status: p.status,
            primaryImageUrl: p.primaryImageUrl,
            minPrice: effectivePrice,
            effectivePrice,
            listPrice,
            discountType: (v?.discountType ?? null) as DiscountType | null,
            discountValue,
            salePrice: v?.salePrice != null ? Number(v.salePrice) : null,
            saleStartsAt: v?.saleStartsAt ?? null,
            saleEndsAt: v?.saleEndsAt ?? null,
            discountPercent,
            stockQty: Number(v?.stockQty ?? 0),
            purchasePrice: safeInput.includeCost ? purchasePrice : null,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            brand: p.brand?.name ?? null,
            brandId: p.brand?.id ?? null,
            vendorName: p.vendor?.name ?? null,
            vendorId: p.vendor?.id ?? null,
            categoryId: p.category?.id ?? null,
            categoryName: p.category?.name ?? null,
            categoryCode: p.category?.code ?? null,
            strapSpec: v?.strapSpec ?? null,
            variantsCount: p._count?.variants ?? 0,
            imagesCount: p._count?.image ?? 0,
            ordersCount: p._count?.orderItems ?? 0,
            serviceRequests: p._count?.ServiceRequest ?? 0,
            reservations: p._count?.Reservation ?? 0,
        };
    });

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
        categories,
        productTypes,
    };
}

export async function getLatestVariantForAdmin(tx: DB, productId: string) {
    const db = dbOrTx(tx);
    return db.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            variants: {
                orderBy: { updatedAt: "desc" },
                take: 1,
                select: {
                    id: true,
                    price: true,
                    listPrice: true,
                    discountType: true,
                    discountValue: true,
                    salePrice: true,
                    saleStartsAt: true,
                    saleEndsAt: true,
                    costPrice: true,
                    availabilityStatus: true,
                },
            },
        },
    });
}

export async function updateProductBase(
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
            ProductCategory: {
                select: { id: true, name: true, code: true },
            },
            variants: {
                select: {
                    id: true,
                    availabilityStatus: true,
                    price: true,
                    listPrice: true,
                    discountType: true,
                    discountValue: true,
                    salePrice: true,
                    saleStartsAt: true,
                    saleEndsAt: true,
                    costPrice: true,
                },
                orderBy: { updatedAt: "desc" },
                take: 1,
            },
            updatedAt: true,
            createdAt: true,
        },
    });
}

export async function updateLatestVariantPricing(
    tx: DB,
    productId: string,
    data: Prisma.ProductVariantUpdateInput
) {
    const db = dbOrTx(tx);
    const latest = await getLatestVariantForAdmin(db, productId);
    const variantId = latest?.variants?.[0]?.id;
    if (!variantId) {
        throw new Error("Product chưa có variant để cập nhật giá.");
    }

    return db.productVariant.update({
        where: { id: variantId },
        data,
        select: {
            id: true,
            price: true,
            listPrice: true,
            discountType: true,
            discountValue: true,
            salePrice: true,
            saleStartsAt: true,
            saleEndsAt: true,
            costPrice: true,
            availabilityStatus: true,
            updatedAt: true,
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
        fromStatuses?: AvailabilityStatus[];
    }
) {
    const { productId, status, fromStatuses } = params;

    const where: Prisma.ProductVariantWhereInput = {
        productId,
        ...(fromStatuses?.length ? { availabilityStatus: { in: fromStatuses } } : {}),
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