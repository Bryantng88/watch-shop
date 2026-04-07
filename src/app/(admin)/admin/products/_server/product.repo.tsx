import { DB, dbOrTx } from "@/server/db/client";
import {
    ProductType,
    Prisma,
    AvailabilityStatus,
    ProductStatus,
    ContentStatus,
    ServiceRequestStatus,
    ImageRole
} from "@prisma/client";
import type {
    ProductListInput,
    ProductListSort,
    ProductCatalogKey,
} from "../helpers/search-params";
import { genUniqueProductSku } from "./helper";
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const OPEN_SERVICE_REQUEST_STATUSES = [
    ServiceRequestStatus.DRAFT,
    ServiceRequestStatus.DIAGNOSING,
    ServiceRequestStatus.WAIT_APPROVAL,
    ServiceRequestStatus.IN_PROGRESS,
];

type ProductViewKey = "all" | "draft" | "posted" | "in_service" | "hold" | "sold";

type AdminProductListRepoInput = ProductListInput & {
    page?: number;
    pageSize?: number;
    updatedFrom?: Date;
    updatedTo?: Date;
    catalog?: ProductCatalogKey;
};

const STRAP_ATTACHMENT_PREFIX = "__STRAP_LINK__:";
type ReadBatchFactory<T = unknown> = () => Promise<T>;
type StoredStrapAttachment = {
    productId: string;
    variantId: string;
    title?: string | null;
    vendorName?: string | null;
    costPrice?: number | null;
    price?: number | null;
    strapSpec?: {
        lugWidthMM?: number | null;
        buckleWidthMM?: number | null;
        color?: string | null;
        material?: string | null;
        quickRelease?: boolean | null;
    } | null;
    baseName?: string | null;
};

export const productForBulkPostArgs = Prisma.validator<Prisma.ProductDefaultArgs>()({
    select: {
        id: true,
        title: true,
        status: true,
        contentStatus: true,
        type: true,
        brandId: true,
        categoryId: true,
        primaryImageUrl: true,
        image: {
            where: { role: { in: [ImageRole.PRIMARY, ImageRole.GALLERY] } },
            select: { id: true },
        },
        variants: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: {
                sku: true,
                price: true,
                stockQty: true,
                availabilityStatus: true,
            },
        },
        watchSpec: {
            select: {
                ref: true,
                model: true,
                year: true,
                caseType: true,
                movement: true,
                caseMaterial: true,
                goldKarat: true,
                goldColor: true,
                length: true,
                width: true,
                thickness: true,
                dialColor: true,
                strap: true,
                glass: true,
                boxIncluded: true,
                bookletIncluded: true,
                cardIncluded: true,
            },
        },
    },
});

export type ProductForBulkPost = Prisma.ProductGetPayload<typeof productForBulkPostArgs>;

function parseStoredStrapAttachment(raw: unknown): StoredStrapAttachment | null {
    if (typeof raw !== "string" || !raw.startsWith(STRAP_ATTACHMENT_PREFIX)) return null;

    try {
        const parsed = JSON.parse(raw.slice(STRAP_ATTACHMENT_PREFIX.length));
        if (!parsed || typeof parsed !== "object") return null;
        if (!(parsed as any).variantId || !(parsed as any).productId) return null;
        return parsed as StoredStrapAttachment;
    } catch {
        return null;
    }
}

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


function toPlainText(value: unknown): string | null {
    if (value == null) return null;
    const s = String(value).trim();
    return s ? s : null;
}

function toNumberOrNull(value: unknown): number | null {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function buildSizeSnapshot(watchSpec?: {
    caseSize?: string | null;
    length?: unknown;
    width?: unknown;
    thickness?: unknown;
} | null) {
    if (!watchSpec) return null;

    const caseSize = toPlainText(watchSpec.caseSize);
    if (caseSize) return caseSize;

    const length = toNumberOrNull(watchSpec.length);
    const width = toNumberOrNull(watchSpec.width);
    const thickness = toNumberOrNull(watchSpec.thickness);

    const parts: string[] = [];
    if (length != null) parts.push(`Dài ${length}mm`);
    if (width != null) parts.push(`Ngang ${width}mm`);
    if (thickness != null) parts.push(`Dày ${thickness}mm`);

    return parts.length ? parts.join(" · ") : null;
}

function buildMovementSnapshot(movement?: unknown, caliber?: unknown) {
    const mv = toPlainText(movement);
    const cal = toPlainText(caliber);

    if (mv && cal) return `${mv} · Cal.${cal}`;
    return mv ?? cal ?? null;
}

function buildStrapClaspSnapshot(input?: {
    strap?: unknown;
    hasClasp?: boolean | null;
} | null) {
    if (!input) return null;

    const strap = toPlainText(input.strap);
    const clasp = input.hasClasp == null ? null : input.hasClasp ? "Có khóa" : "Không khóa";

    if (strap && clasp) return `${strap} · ${clasp}`;
    return strap ?? clasp ?? null;
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
    const sku = String((input as any)?.sku || "").trim();
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
                { variants: { some: { sku: { contains: q, mode: "insensitive" } } } },
            ],
        });
    }

    if (sku) {
        and.push({
            variants: {
                some: {
                    sku: { contains: sku, mode: "insensitive" },
                },
            },
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

    if ((input as any)?.vendorId) {
        and.push({ vendorId: (input as any).vendorId });
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
            return { AND: [whereBase, { contentStatus: ContentStatus.DRAFT }] };
        case "posted":
            return { AND: [whereBase, { contentStatus: ContentStatus.PUBLISHED }] };
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



async function runReadBatch<T extends unknown[]>(
    factories: { [K in keyof T]: ReadBatchFactory<T[K]> }
): Promise<T> {
    return (await Promise.all(factories.map((factory) => factory()))) as T;
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
    const db = dbOrTx(tx) as any;

    const safeInput = {
        q: input?.q,
        type: input?.type,
        brandId: input?.brandId,
        vendorId: (input as any)?.vendorId,
        categoryId: (input as any)?.categoryId,
        hasImages: input?.hasImages,
        view: (input?.view ?? "all") as ProductViewKey,
        sort: (input?.sort ?? "updatedDesc") as ProductListSort,
        page: Math.max(1, Number(input?.page ?? 1)),
        pageSize: Math.max(1, Math.min(MAX_PAGE_SIZE, Number(input?.pageSize ?? DEFAULT_PAGE_SIZE))),
        catalog: input?.catalog ?? "product",
        includeCost: input?.includeCost !== false,
    };

    const isStrapCatalog = safeInput.catalog === "strap";
    const baseWhere = buildWhereBase({
        ...safeInput,
        type: isStrapCatalog ? ("WATCH_STRAP" as any) : safeInput.type,
    } as any);

    const whereList = buildWhereForView(baseWhere, safeInput.view);
    const skip = (safeInput.page - 1) * safeInput.pageSize;
    const take = safeInput.pageSize;
    const orderBy = buildOrderBy(safeInput.sort);

    const variantSelect: any = {
        id: true,
        sku: true,
        name: true,
        stockQty: true,
        availabilityStatus: true,
        price: true,
        salePrice: true,
        costPrice: safeInput.includeCost,
        acquisitionItem: {
            orderBy: [{ createdAt: "desc" }],
            take: 1,
            select: {
                unitCost: true,
                acquisition: {
                    select: {
                        id: true,
                        refNo: true,
                    },
                },
            },
        },
        ...(isStrapCatalog
            ? {
                strapSpec: {
                    select: {
                        lugWidthMM: true,
                        buckleWidthMM: true,
                        color: true,
                        material: true,
                        quickRelease: true,
                    },
                },
            }
            : {}),
    };

    const rowSelect: any = {
        id: true,
        title: true,
        slug: true,
        type: true,
        status: true,
        contentStatus: true,
        categoryId: true,
        primaryImageUrl: true,
        createdAt: true,
        updatedAt: true,
        brand: { select: { id: true, name: true } },
        vendor: { select: { id: true, name: true } },
        variants: {
            orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
            take: 1,
            select: variantSelect,
        },
        _count: {
            select: {
                image: { where: { role: { in: [ImageRole.PRIMARY, ImageRole.GALLERY] } } } as any,
            },
        },
        image: {
            where: { role: ImageRole.COVER },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            take: 1,
            select: { fileKey: true },
        },
        ...(!isStrapCatalog
            ? {
                watchSpec: {
                    select: {
                        ref: true,
                        model: true,
                        year: true,
                        caseType: true,
                        movement: true,
                        caseMaterial: true,
                        goldKarat: true,
                        goldColor: true,
                        length: true,
                        width: true,
                        thickness: true,
                        strap: true,
                        glass: true,
                    },
                },
            }
            : {}),
    };

    const batchFactories: Array<ReadBatchFactory<any>> = [
        () =>
            db.product.groupBy({
                by: ["contentStatus"],
                where: baseWhere,
                _count: { _all: true },
            }),
        () =>
            db.product.count({
                where: {
                    AND: [baseWhere, { status: ProductStatus.IN_SERVICE }],
                },
            }),
        () =>
            db.product.count({
                where: {
                    AND: [
                        baseWhere,
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
                },
            }),
        () =>
            db.product.count({
                where: {
                    AND: [baseWhere, { status: ProductStatus.SOLD }],
                },
            }),
        () => db.product.count({ where: whereList }),
        () =>
            db.product.findMany({
                where: whereList,
                orderBy,
                skip,
                take,
                select: rowSelect,
            }),
    ];

    if (!isStrapCatalog) {
        batchFactories.push(() =>
            db.brand.findMany({
                orderBy: { name: "asc" },
                select: { id: true, name: true },
            })
        );
    }

    const batchResults = await runReadBatch<any[]>(batchFactories as any);
    const [
        contentStatusGroups,
        cInService,
        cHold,
        cSold,
        total,
        rows,
        brands = [],
    ] = batchResults;

    const groupedContentStatusCounts = new Map<string, number>();
    for (const row of contentStatusGroups ?? []) {
        groupedContentStatusCounts.set(String(row.contentStatus), Number(row._count?._all ?? 0));
    }

    const openServiceStatusMap = new Map<string, string>();
    if (!isStrapCatalog && (rows?.length ?? 0) > 0) {
        const pageProductIds = (rows ?? []).map((row: any) => row.id).filter(Boolean);

        const openServices = await db.serviceRequest.findMany({
            where: {
                productId: { in: pageProductIds },
                status: { in: OPEN_SERVICE_REQUEST_STATUSES as any },
            },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            select: {
                productId: true,
                status: true,
            },
        });

        for (const row of openServices ?? []) {
            if (!row?.productId || openServiceStatusMap.has(row.productId)) continue;
            openServiceStatusMap.set(row.productId, String(row.status));
        }
    }

    const totalAll = Array.from(groupedContentStatusCounts.values()).reduce(
        (sum, count) => sum + count,
        0
    );
    const cDraft = groupedContentStatusCounts.get(ContentStatus.DRAFT) ?? 0;
    const cPosted = groupedContentStatusCounts.get(ContentStatus.PUBLISHED) ?? 0;

    const strapVariantIdsInPage = isStrapCatalog
        ? (rows ?? [])
            .map((row: any) => row.variants?.[0]?.id)
            .filter((value: unknown): value is string => typeof value === "string" && value.length > 0)
        : [];

    const strapAttachmentUsageMap = new Map<
        string,
        {
            count: number;
            products: Array<{ id: string; title: string | null; status: string | null }>;
        }
    >();

    if (strapVariantIdsInPage.length) {
        const attachedVariantIdSet = new Set(strapVariantIdsInPage);
        const attachedRows = await db.productVariant.findMany({
            where: {
                AND: [
                    { name: { startsWith: STRAP_ATTACHMENT_PREFIX } },
                    {
                        OR: strapVariantIdsInPage.map((variantId) => ({
                            name: { contains: `"variantId":"${variantId}"` },
                        })),
                    },
                    {
                        product: {
                            NOT: {
                                type: ProductType.WATCH_STRAP,
                            },
                        },
                    },
                ],
            },
            select: {
                name: true,
                product: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        contentStatus: true,
                    },
                },
            },
        });

        for (const row of attachedRows) {
            const attachment = parseStoredStrapAttachment(row.name);
            if (!attachment?.variantId || !attachedVariantIdSet.has(attachment.variantId)) continue;

            const current =
                strapAttachmentUsageMap.get(attachment.variantId) ?? {
                    count: 0,
                    products: [],
                };

            current.count += 1;
            current.products.push({
                id: row.product?.id ?? "",
                title: row.product?.title ?? null,
                status: row.product?.status ?? null,
            });

            strapAttachmentUsageMap.set(attachment.variantId, current);
        }
    }

    const items = (rows ?? []).map((p: any) => {
        const latestVariant = p.variants?.[0] ?? null;
        const latestAcqItem = latestVariant?.acquisitionItem?.[0] ?? null;
        const attachedStrap = parseStoredStrapAttachment(latestVariant?.name ?? null);

        const purchasePrice =
            latestVariant?.costPrice != null
                ? Number(latestVariant.costPrice)
                : latestAcqItem?.unitCost != null
                    ? Number(latestAcqItem.unitCost)
                    : null;

        const strapAddedCost = attachedStrap?.costPrice != null ? Number(attachedStrap.costPrice) : 0;
        const basePurchasePrice =
            purchasePrice != null ? Math.max(Number(purchasePrice) - Number(strapAddedCost || 0), 0) : null;

        const strapUsage = latestVariant?.id ? strapAttachmentUsageMap.get(latestVariant.id) : undefined;
        const attachedCount = Number(strapUsage?.count ?? 0);
        const availableStockQty = Number(latestVariant?.stockQty ?? 0);
        const totalSystemStockQty = availableStockQty + attachedCount;
        const openServiceStatus = !isStrapCatalog ? openServiceStatusMap.get(p.id) ?? null : null;

        return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            type: p.type,

            // service/inventory status
            status: p.status,

            // publish/content status
            contentStatus: p.contentStatus,

            categoryId: p.categoryId ?? null,
            primaryImageUrl: p.image?.[0]?.fileKey ?? p.primaryImageUrl,
            minPrice: latestVariant?.price != null ? Number(latestVariant.price) : null,
            salePrice: latestVariant?.salePrice != null ? Number(latestVariant.salePrice) : null,
            variantId: latestVariant?.id ?? null,
            purchasePrice,
            basePurchasePrice,
            strapAddedCost,

            acquisitionId: latestAcqItem?.acquisition?.id ?? null,
            acquisitionRefNo: latestAcqItem?.acquisition?.refNo ?? null,

            ...(isStrapCatalog
                ? {
                    stockQty: availableStockQty,
                    attachedCount,
                    totalSystemStockQty,
                    attachedProducts: strapUsage?.products ?? [],
                    strapSpec: latestVariant?.strapSpec ?? null,
                }
                : {}),

            attachedStrap: attachedStrap
                ? {
                    productId: attachedStrap.productId,
                    variantId: attachedStrap.variantId,
                    title: attachedStrap.title ?? null,
                    vendorName: attachedStrap.vendorName ?? null,
                    costPrice:
                        attachedStrap.costPrice != null ? Number(attachedStrap.costPrice) : null,
                    price: attachedStrap.price != null ? Number(attachedStrap.price) : null,
                    strapSpec: attachedStrap.strapSpec
                        ? {
                            lugWidthMM:
                                attachedStrap.strapSpec.lugWidthMM != null
                                    ? Number(attachedStrap.strapSpec.lugWidthMM)
                                    : null,
                            buckleWidthMM:
                                attachedStrap.strapSpec.buckleWidthMM != null
                                    ? Number(attachedStrap.strapSpec.buckleWidthMM)
                                    : null,
                            color: attachedStrap.strapSpec.color ?? null,
                            material: attachedStrap.strapSpec.material ?? null,
                            quickRelease: attachedStrap.strapSpec.quickRelease ?? null,
                        }
                        : null,
                }
                : null,

            createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
            updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
            brand: p.brand?.name ?? null,
            brandId: p.brand?.id ?? null,
            vendorName: p.vendor?.name ?? null,
            vendorId: p.vendor?.id ?? null,
            variantSnapshot: latestVariant
                ? {
                    price: latestVariant.price != null ? Number(latestVariant.price) : null,
                    availabilityStatus: latestVariant.availabilityStatus ?? null,
                    stockQty: latestVariant.stockQty != null ? Number(latestVariant.stockQty) : 0,
                    sku: latestVariant.sku ?? null,
                }
                : null,
            watchSpecSnapshot: p.watchSpec ?? null,
            imagesCount: p._count?.image ?? 0,
            openServiceStatus,
        };
    });

    const productTypes = isStrapCatalog
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
    const sku = await genUniqueProductSku(db as any, type);

    return db.product.create({
        data: {
            title,
            sku,
            vendorId: vendorId ?? undefined,
            status: ProductStatus.AVAILABLE,
            contentStatus: ContentStatus.DRAFT,
            type,
            variants: {
                create: [
                    {
                        stockQty: quantity,
                        sku, // mirror tạm thời để không vỡ code cũ
                    },
                ],
            },
        },
        select: { id: true, slug: true, sku: true },
    });
}
export async function searchProductsRepo(tx: DB, q: string) {
    const db = dbOrTx(tx);

    const products = await db.product.findMany({
        where: {
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { sku: { contains: q, mode: "insensitive" } },
            ],
            status: ProductStatus.AVAILABLE,
            contentStatus: {
                in: [ContentStatus.DRAFT, ContentStatus.PUBLISHED],
            },
            variants: {
                some: {
                    availabilityStatus: AvailabilityStatus.ACTIVE,
                },
            },
        },
        select: {
            id: true,
            sku: true,
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
                    sku: true,
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
        orderBy: {
            updatedAt: "desc",
        },
    });

    return products.map((p) => ({
        id: p.id,
        sku: p.sku ?? p.variants?.[0]?.sku ?? null,
        title: p.title,
        type: p.type,
        primaryImageUrl: p.primaryImageUrl ?? null,
        price: p.variants[0] ? Number(p.variants[0].price) : 0,
        variantId: p.variants[0]?.id ?? null,
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
            contentStatus: true,
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
        price?: number | null;
        minPrice?: number | null;
        listPrice?: number | null;
        discountType?: Prisma.ProductVariantUpdateInput["discountType"] | null;
        discountValue?: number | null;
        salePrice?: number | null;
        saleStartsAt?: Date | null;
        saleEndsAt?: Date | null;
        costPrice?: number | null;
        availabilityStatus?: AvailabilityStatus;
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
            ...(patch.price !== undefined
                ? { price: patch.price }
                : patch.minPrice !== undefined
                    ? { price: patch.minPrice }
                    : {}),
            ...(patch.listPrice !== undefined ? { listPrice: patch.listPrice } : {}),
            ...(patch.discountType !== undefined ? { discountType: patch.discountType as any } : {}),
            ...(patch.discountValue !== undefined ? { discountValue: patch.discountValue } : {}),
            ...(patch.salePrice !== undefined ? { salePrice: patch.salePrice } : {}),
            ...(patch.saleStartsAt !== undefined ? { saleStartsAt: patch.saleStartsAt } : {}),
            ...(patch.saleEndsAt !== undefined ? { saleEndsAt: patch.saleEndsAt } : {}),
            ...(patch.costPrice !== undefined ? { costPrice: patch.costPrice } : {}),
            ...(patch.availabilityStatus !== undefined
                ? { availabilityStatus: patch.availabilityStatus }
                : {}),
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
            contentStatus: true,
            categoryId: true,
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
        contentStatus: p.contentStatus,
        categoryId: p.categoryId ?? null,
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
        brandId: p.brand?.id ?? null,
        vendorName: p.vendor?.name ?? null,
        vendorId: p.vendor?.id ?? null,
    };
}

export async function getAdminEditProductDetail(tx: DB, id: string) {
    const db = dbOrTx(tx);

    return db.product.findUnique({
        where: { id },
        include: {
            brand: true,
            vendor: true,
            watchSpec: {
                include: {
                    complication: true,
                    marketSegment: true,
                },
            },
            image: {
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
            variants: {
                orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
                include: {
                    strapSpec: true,
                },
            },
        },
    });
}

export async function listActiveProductCategories(tx: DB) {
    const db = dbOrTx(tx);

    return db.productCategory.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
            id: true,
            name: true,
            scope: true,
        },
    });
}

export async function listAvailableStrapInventory(
    tx: DB,
    attachedStrapVariantId?: string | null
) {
    const db = dbOrTx(tx);
    const keepVariantId = attachedStrapVariantId ? String(attachedStrapVariantId) : "";

    return db.product.findMany({
        where: {
            type: ProductType.WATCH_STRAP,
            variants: {
                some: keepVariantId
                    ? {
                        OR: [{ stockQty: { gt: 0 } }, { id: keepVariantId }],
                    }
                    : {
                        stockQty: { gt: 0 },
                    },
            },
        },
        orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
        take: 200,
        select: {
            id: true,
            title: true,
            vendor: {
                select: {
                    name: true,
                },
            },
            variants: {
                orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
                where: keepVariantId
                    ? {
                        OR: [{ stockQty: { gt: 0 } }, { id: keepVariantId }],
                    }
                    : {
                        stockQty: { gt: 0 },
                    },
                take: 5,
                select: {
                    id: true,
                    stockQty: true,
                    availabilityStatus: true,
                    price: true,
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
        contentStatus: p.contentStatus,
        type: p.type,
        brandId: p.brandId ?? null,
        categoryId: p.categoryId ?? null,
        primaryImageUrl: p.primaryImageUrl,
        imageCount: Array.isArray(p.image) ? p.image.length : 0,
        minPrice: p.variants?.[0]?.price != null ? Number(p.variants[0].price) : null,
        variantSnapshot: p.variants?.[0]
            ? {
                sku: p.variants[0].sku ?? null,
                price: p.variants[0].price != null ? Number(p.variants[0].price) : null,
                stockQty: p.variants[0].stockQty ?? null,
                availabilityStatus: p.variants[0].availabilityStatus ?? null,
            }
            : null,
        watchSpecSnapshot: p.watchSpec ?? null,
    }));
}

export async function getOpenServiceProducts(tx: DB, productIds: string[]) {
    const db = dbOrTx(tx);

    if (!productIds.length) {
        return [] as Array<{ productId: string; status: ServiceRequestStatus }>;
    }

    return db.serviceRequest.findMany({
        where: {
            productId: { in: productIds },
            status: { in: OPEN_SERVICE_REQUEST_STATUSES },
        },
        select: {
            productId: true,
            status: true,
        },
        distinct: ["productId"],
    });
}

export async function listDraftProductIdsForAutoBulkPost(tx: DB) {
    const db = dbOrTx(tx);

    const rows = await db.product.findMany({
        where: {
            status: ProductStatus.AVAILABLE,
            contentStatus: ContentStatus.DRAFT,
            NOT: {
                type: ProductType.WATCH_STRAP,
            },
        },
        select: { id: true },
        orderBy: { updatedAt: "asc" },
    });

    return rows.map((row) => row.id);
}

export async function markPostedMany(tx: DB, ids: string[]) {
    const db = dbOrTx(tx);

    return db.product.updateMany({
        where: { id: { in: ids }, contentStatus: ContentStatus.DRAFT },
        data: { contentStatus: ContentStatus.PUBLISHED, updatedAt: new Date() },
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
            sku: true,
            name: true,
            price: true,
            listPrice: true,
            discountType: true,
            discountValue: true,
            salePrice: true,
            saleStartsAt: true,
            saleEndsAt: true,
            costPrice: true,
            stockQty: true,
            availabilityStatus: true,
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

export async function upsertPrimaryVariantForAdmin(
    tx: DB,
    productId: string,
    patch: {
        id?: string;
        sku?: string | null;
        name?: string | null;
        stockQty?: number | null;
        availabilityStatus?: AvailabilityStatus;
        price?: number | null;
        listPrice?: number | null;
        discountType?: Prisma.ProductVariantUpdateInput["discountType"];
        discountValue?: number | null;
        salePrice?: number | null;
        saleStartsAt?: Date | null;
        saleEndsAt?: Date | null;
        costPrice?: number | null;
    }
) {
    const db = dbOrTx(tx);

    const existing = patch.id
        ? await db.productVariant.findUnique({ where: { id: patch.id }, select: { id: true } })
        : await db.productVariant.findFirst({
            where: { productId },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
            select: { id: true },
        });

    const data: any = {
        updatedAt: new Date(),
        ...(patch.sku !== undefined ? { sku: patch.sku || null } : {}),
        ...(patch.name !== undefined ? { name: patch.name || null } : {}),
        ...(patch.stockQty !== undefined ? { stockQty: Number(patch.stockQty ?? 0) } : {}),
        ...(patch.availabilityStatus !== undefined ? { availabilityStatus: patch.availabilityStatus } : {}),
        ...(patch.price !== undefined ? { price: patch.price } : {}),
        ...(patch.listPrice !== undefined ? { listPrice: patch.listPrice } : {}),
        ...(patch.discountType !== undefined ? { discountType: patch.discountType as any } : {}),
        ...(patch.discountValue !== undefined ? { discountValue: patch.discountValue } : {}),
        ...(patch.salePrice !== undefined ? { salePrice: patch.salePrice } : {}),
        ...(patch.saleStartsAt !== undefined ? { saleStartsAt: patch.saleStartsAt } : {}),
        ...(patch.saleEndsAt !== undefined ? { saleEndsAt: patch.saleEndsAt } : {}),
        ...(patch.costPrice !== undefined ? { costPrice: patch.costPrice } : {}),
    };

    if (existing?.id) {
        return db.productVariant.update({ where: { id: existing.id }, data });
    }

    return db.productVariant.create({
        data: {
            productId,
            sku: patch.sku ?? null,
            name: patch.name ?? null,
            stockQty: Number(patch.stockQty ?? 0),
            availabilityStatus: patch.availabilityStatus ?? AvailabilityStatus.ACTIVE,
            price: patch.price ?? patch.listPrice ?? null,
            listPrice: patch.listPrice ?? null,
            discountType: (patch.discountType as any) ?? null,
            discountValue: patch.discountValue ?? null,
            salePrice: patch.salePrice ?? null,
            saleStartsAt: patch.saleStartsAt ?? null,
            saleEndsAt: patch.saleEndsAt ?? null,
            costPrice: patch.costPrice ?? null,
            maxQtyPerOrder: 1,
        } as any,
    });
}

export async function replaceProductImages(
    tx: DB,
    productId: string,
    images: Array<{ fileKey: string; alt?: string | null; sortOrder?: number | null }>
) {
    const db = dbOrTx(tx);

    await db.productImage.deleteMany({
        where: {
            productId,
            role: { in: [ImageRole.PRIMARY, ImageRole.GALLERY] },
        },
    });

    const normalized = images.filter((img) => !!String(img.fileKey ?? "").trim()).slice(0, 4);

    if (normalized.length) {
        await db.productImage.createMany({
            data: normalized.map((img, index) => ({
                productId,
                fileKey: img.fileKey,
                alt: img.alt ?? null,
                sortOrder: img.sortOrder ?? index,
                role: index === 0 ? ImageRole.PRIMARY : ImageRole.GALLERY,
            })),
        });
    }

    return db.product.update({
        where: { id: productId },
        data: { primaryImageUrl: normalized[0]?.fileKey ?? null },
        select: { id: true, primaryImageUrl: true },
    });
}

export async function upsertWatchSpecForAdmin(
    tx: DB,
    productId: string,
    payload: {
        watchSpec?: Record<string, any>;
        complicationIds?: string[];
    }
) {
    const db = dbOrTx(tx);
    const raw = payload.watchSpec ?? {};

    const specData: any = {
        ...(raw.ref !== undefined ? { ref: raw.ref || null } : {}),
        ...(raw.model !== undefined ? { model: raw.model || null } : {}),
        ...(raw.year !== undefined ? { year: raw.year || null } : {}),
        ...(raw.caseType !== undefined ? { caseType: raw.caseType || null } : {}),
        ...(raw.gender !== undefined ? { gender: raw.gender || null } : {}),
        ...(raw.movement !== undefined ? { movement: raw.movement || null } : {}),
        ...(raw.caliber !== undefined ? { caliber: raw.caliber || null } : {}),
        ...(raw.caseMaterial !== undefined ? { caseMaterial: raw.caseMaterial || "OTHER" } : {}),
        ...(raw.goldKarat !== undefined ? { goldKarat: raw.goldKarat ?? null } : {}),
        ...(raw.goldColor !== undefined ? { goldColor: raw.goldColor || null } : {}),
        ...(raw.caseSize !== undefined ? { caseSize: raw.caseSize || null } : {}),
        ...(raw.length !== undefined ? { length: raw.length ?? null } : {}),
        ...(raw.width !== undefined ? { width: raw.width ?? null } : {}),
        ...(raw.thickness !== undefined ? { thickness: raw.thickness ?? null } : {}),
        ...(raw.dialColor !== undefined ? { dialColor: raw.dialColor || null } : {}),
        ...(raw.strap !== undefined ? { strap: raw.strap || null } : {}),
        ...(raw.glass !== undefined ? { glass: raw.glass || null } : {}),
        ...(raw.boxIncluded !== undefined ? { boxIncluded: !!raw.boxIncluded } : {}),
        ...(raw.bookletIncluded !== undefined ? { bookletIncluded: !!raw.bookletIncluded } : {}),
        ...(raw.cardIncluded !== undefined ? { cardIncluded: !!raw.cardIncluded } : {}),
    };

    const hasSpecFields = Object.keys(specData).length > 0;
    const hasComplications = Array.isArray(payload.complicationIds);
    if (!hasSpecFields && !hasComplications) return null;

    const existing = await db.watchSpec.findUnique({
        where: { productId },
        select: { productId: true },
    });

    if (existing) {
        return db.watchSpec.update({
            where: { productId },
            data: {
                ...specData,
                ...(hasComplications
                    ? { complication: { set: payload.complicationIds!.map((id) => ({ id })) } }
                    : {}),
            } as any,
            select: { productId: true },
        });
    }

    return db.watchSpec.create({
        data: {
            productId,
            caseMaterial: specData.caseMaterial ?? "OTHER",
            boxIncluded: specData.boxIncluded ?? false,
            bookletIncluded: specData.bookletIncluded ?? false,
            cardIncluded: specData.cardIncluded ?? false,
            ...specData,
            ...(hasComplications
                ? { complication: { connect: payload.complicationIds!.map((id) => ({ id })) } }
                : {}),
        } as any,
        select: { productId: true },
    });
}


export async function getAdminProductDetail(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    return db.product.findUnique({
        where: { id: productId },
        include: {
            brand: true,
            vendor: true,
            ProductCategory: true,
            content: true,
            watchSpec: {
                include: {
                    complication: true,
                },
            },
            image: {
                where: { role: { in: [ImageRole.PRIMARY, ImageRole.GALLERY] } },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
            variants: {
                orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
                include: {
                    strapSpec: true,
                    acquisitionItem: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: {
                            unitCost: true,
                            acquisition: {
                                select: {
                                    id: true,
                                    refNo: true,
                                    acquiredAt: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}

export async function getProductTradeHistory(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    const [acquisitionRows, orderRows] = await Promise.all([
        db.acquisitionItem.findMany({
            where: { productId },
            orderBy: [
                { acquisition: { acquiredAt: "desc" } },
                { createdAt: "desc" },
            ],
            select: {
                id: true,
                quantity: true,
                unitCost: true,
                currency: true,
                status: true,
                productTitle: true,
                createdAt: true,
                returnedAt: true,
                acquisition: {
                    select: {
                        id: true,
                        refNo: true,
                        type: true,
                        accquisitionStt: true,
                        acquiredAt: true,
                        vendor: {
                            select: { id: true, name: true },
                        },
                        customer: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        }),

        db.orderItem.findMany({
            where: { productId },
            orderBy: [
                { order: { createdAt: "desc" } },
                { createdAt: "desc" },
            ],
            select: {
                id: true,
                title: true,
                quantity: true,
                unitPriceAgreed: true,
                subtotal: true,
                kind: true,
                productType: true,
                createdAt: true,
                order: {
                    select: {
                        id: true,
                        refNo: true,
                        status: true,
                        paymentStatus: true,
                        source: true,
                        customerName: true,
                        createdAt: true,
                    },
                },
            },
        }),
    ]);

    return {
        acquisitions: acquisitionRows.map((row: any) => ({
            id: row.id,
            quantity: row.quantity ?? 0,
            unitCost: row.unitCost != null ? Number(row.unitCost) : null,
            currency: row.currency ?? "VND",
            status: row.status ?? null,
            productTitle: row.productTitle ?? null,
            createdAt: row.createdAt?.toISOString?.() ?? null,
            returnedAt: row.returnedAt?.toISOString?.() ?? null,
            acquisition: row.acquisition
                ? {
                    id: row.acquisition.id,
                    refNo: row.acquisition.refNo ?? null,
                    type: row.acquisition.type ?? null,
                    accquisitionStt: row.acquisition.accquisitionStt ?? null,
                    acquiredAt: row.acquisition.acquiredAt?.toISOString?.() ?? null,
                    vendor: row.acquisition.vendor
                        ? {
                            id: row.acquisition.vendor.id,
                            name: row.acquisition.vendor.name,
                        }
                        : null,
                    customer: row.acquisition.customer
                        ? {
                            id: row.acquisition.customer.id,
                            name: row.acquisition.customer.name,
                        }
                        : null,
                }
                : null,
        })),

        orders: orderRows.map((row: any) => ({
            id: row.id,
            title: row.title,
            quantity: row.quantity ?? 0,
            unitPriceAgreed: row.unitPriceAgreed != null ? Number(row.unitPriceAgreed) : null,
            subtotal: row.subtotal != null ? Number(row.subtotal) : null,
            kind: row.kind ?? null,
            productType: row.productType ?? null,
            createdAt: row.createdAt?.toISOString?.() ?? null,
            order: row.order
                ? {
                    id: row.order.id,
                    refNo: row.order.refNo ?? null,
                    status: row.order.status ?? null,
                    paymentStatus: row.order.paymentStatus ?? null,
                    source: row.order.source ?? null,
                    customerName: row.order.customerName ?? null,
                    createdAt: row.order.createdAt?.toISOString?.() ?? null,
                }
                : null,
        })),
    };
}

export async function syncProductContentSnapshot(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    const product = await db.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            title: true,
            brand: {
                select: {
                    name: true,
                },
            },
            watchSpec: {
                select: {
                    ref: true,
                    caseSize: true,
                    length: true,
                    width: true,
                    thickness: true,
                    movement: true,
                    caliber: true,
                    glass: true,
                    strap: true,
                    hasClasp: true,
                    model: true,
                    year: true,
                },
            },
        },
    });

    if (!product) {
        throw new Error("Không tìm thấy sản phẩm.");
    }

    const sizeSnapshot = buildSizeSnapshot(product.watchSpec);
    const movementSnapshot = buildMovementSnapshot(
        product.watchSpec?.movement,
        product.watchSpec?.caliber
    );
    const strapClaspSnapshot = buildStrapClaspSnapshot({
        strap: product.watchSpec?.strap,
        hasClasp: product.watchSpec?.hasClasp,
    });

    return db.productContent.upsert({
        where: { productId },
        create: {
            productId,
            titleSnapshot: toPlainText(product.title),
            brandSnapshot: toPlainText(product.brand?.name),
            refSnapshot: toPlainText(product.watchSpec?.ref),
            sizeSnapshot,
            movementSnapshot,
            glassSnapshot: toPlainText(product.watchSpec?.glass),
            strapClaspSnapshot,
            modelSnapshot: toPlainText(product.watchSpec?.model),
            yearSnapshot: toPlainText(product.watchSpec?.year),
        },
        update: {
            titleSnapshot: toPlainText(product.title),
            brandSnapshot: toPlainText(product.brand?.name),
            refSnapshot: toPlainText(product.watchSpec?.ref),
            sizeSnapshot,
            movementSnapshot,
            glassSnapshot: toPlainText(product.watchSpec?.glass),
            strapClaspSnapshot,
            modelSnapshot: toPlainText(product.watchSpec?.model),
            yearSnapshot: toPlainText(product.watchSpec?.year),
        },
        select: {
            productId: true,
            titleSnapshot: true,
            brandSnapshot: true,
            refSnapshot: true,
            sizeSnapshot: true,
            movementSnapshot: true,
            glassSnapshot: true,
            strapClaspSnapshot: true,
            modelSnapshot: true,
            yearSnapshot: true,
            generatedContent: true,
            promptNote: true,
            generatedAt: true,
            updatedAt: true,
        },
    });
}

export async function saveProductContent(
    tx: DB,
    productId: string,
    payload: {
        generatedContent?: string | null;
        promptNote?: string | null;
    }
) {
    const db = dbOrTx(tx);

    const generatedContent = toPlainText(payload.generatedContent);
    const promptNote = toPlainText(payload.promptNote);
    const generatedAt = generatedContent ? new Date() : null;

    const content = await db.productContent.upsert({
        where: { productId },
        create: {
            productId,
            generatedContent,
            promptNote,
            generatedAt,
        },
        update: {
            generatedContent,
            promptNote,
            generatedAt,
        },
        select: {
            productId: true,
            titleSnapshot: true,
            brandSnapshot: true,
            refSnapshot: true,
            sizeSnapshot: true,
            movementSnapshot: true,
            glassSnapshot: true,
            strapClaspSnapshot: true,
            modelSnapshot: true,
            yearSnapshot: true,
            generatedContent: true,
            promptNote: true,
            generatedAt: true,
            updatedAt: true,
        },
    });

    await db.product.update({
        where: { id: productId },
        data: {
            postContent: generatedContent,
            aiPromptUsed: promptNote,
            aiGeneratedAt: generatedAt,
            contentStatus: ContentStatus.DRAFT,
        },
        select: { id: true },
    });

    return content;
}

export async function getProductServiceHistory(tx: DB, productId: string) {
    const db = dbOrTx(tx);

    const rows = await db.serviceRequest.findMany({
        where: { productId },
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        select: {
            id: true,
            refNo: true,
            status: true,
            scope: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            vendorNameSnap: true,
            skuSnapshot: true,
            primaryImageUrlSnapshot: true,
            //ServiceCatalog: {
            //select: { id: true, code: true, name: true },
            //},
            orderItem: {
                select: {
                    id: true,
                    order: { select: { id: true, refNo: true } },
                },
            },
            _count: { select: { maintenance: true } },
            maintenance: {
                orderBy: { createdAt: "desc" },
                take: 3,
                select: {
                    id: true,
                    eventType: true,
                    vendorName: true,
                    notes: true,
                    totalCost: true,
                    currency: true,
                    servicedAt: true,
                    createdAt: true,
                },
            },
        },
    });

    return rows.map((row: any) => ({
        id: row.id,
        refNo: row.refNo ?? null,
        status: row.status ?? null,
        scope: row.scope ?? null,
        notes: row.notes ?? null,
        skuSnapshot: row.skuSnapshot ?? null,
        primaryImageUrlSnapshot: row.primaryImageUrlSnapshot ?? null,
        createdAt: row.createdAt?.toISOString?.() ?? null,
        updatedAt: row.updatedAt?.toISOString?.() ?? null,
        vendorName: row.vendorNameSnap ?? null,
        serviceCatalog: row.ServiceCatalog
            ? {
                id: row.ServiceCatalog.id,
                code: row.ServiceCatalog.code ?? null,
                name: row.ServiceCatalog.name,
            }
            : null,
        order: row.orderItem?.order
            ? { id: row.orderItem.order.id, refNo: row.orderItem.order.refNo ?? null }
            : null,
        maintenanceCount: row._count?.maintenance ?? row.maintenance?.length ?? 0,
        latestLogs: (row.maintenance ?? []).map((log: any) => ({
            id: log.id,
            eventType: log.eventType ?? null,
            vendorName: log.vendorName ?? null,
            notes: log.notes ?? null,
            totalCost: log.totalCost != null ? Number(log.totalCost) : null,
            currency: log.currency ?? null,
            servicedAt: log.servicedAt?.toISOString?.() ?? null,
            createdAt: log.createdAt?.toISOString?.() ?? null,
        })),
    }));
}