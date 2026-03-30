import { prisma } from "@/server/db/client";
import { ProductStatus, ProductType, DiscountType, ServiceRequestStatus, ContentStatus } from "@prisma/client";
import * as prodRepo from "./product.repo";
import { z } from "zod";
import { computeEffectivePrice } from "../helpers/price";
import { MIN_IMAGES, getRequiredWatchSpecFields, hasValue as hasRuleValue } from "./rules";

const firstValue = (v: unknown) => (Array.isArray(v) ? v[0] : v);

const asDate = (v: unknown) => {
    const raw = firstValue(v);
    if (raw == null || raw === "") return undefined;
    const d = new Date(String(raw));
    return Number.isNaN(d.getTime()) ? undefined : d;
};

const asNumber = (v: unknown) => {
    const raw = firstValue(v);
    if (raw == null || raw === "") return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
};

const asString = (v: unknown) => {
    const raw = firstValue(v);
    if (raw == null || raw === "") return undefined;
    return String(raw);
};

const arrayify = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.filter(Boolean).map(String);
    if (v == null || v === "") return [];
    return [String(v)];
};

function normalizeView(v: unknown) {
    const raw = String(firstValue(v) ?? "all").toLowerCase();
    if (
        raw === "all" ||
        raw === "draft" ||
        raw === "posted" ||
        raw === "in_service" ||
        raw === "hold" ||
        raw === "sold"
    ) {
        return raw;
    }
    return "draft";
}

function normalizeCatalog(v: unknown): "product" | "strap" {
    const raw = String(firstValue(v) ?? "product").toLowerCase();
    return raw === "strap" ? "strap" : "product";
}

const AdminListQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(200).default(50),
    q: z.string().optional(),
    sort: z
        .enum(["updatedDesc", "updatedAsc", "createdDesc", "createdAsc", "titleAsc", "titleDesc"])
        .optional(),
    type: z.array(z.string()).optional(),
    brandIds: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
    hasImages: z.enum(["yes", "no"]).optional(),
    vendorId: z.string().optional(),
    sku: z.string().optional(),
    updatedFrom: z.date().optional(),
    updatedTo: z.date().optional(),
});

const OPEN_SERVICE_REQUEST_STATUSES = [
    ServiceRequestStatus.DRAFT,
    ServiceRequestStatus.DIAGNOSING,
    ServiceRequestStatus.WAIT_APPROVAL,
    ServiceRequestStatus.IN_PROGRESS,
] as const;

function hasShallowValue(v: unknown) {
    return !(v == null || v === "");
}

function computeMissingVariantFields(item: any): string[] {
    const missing: string[] = [];

    if (!item?.variantId) {
        missing.push("variant");
    }

    if (item?.type === ProductType.WATCH_STRAP) {
        const s = item?.strapSpec ?? null;
        if (!s) return ["strap spec"];
        if (!hasShallowValue(s.material)) missing.push("chất liệu dây");
        if (!hasShallowValue(s.color)) missing.push("màu dây");
        if (!hasShallowValue(s.lugWidthMM)) missing.push("lug width");
        if (!hasShallowValue(s.buckleWidthMM)) missing.push("buckle width");
    }

    return Array.from(new Set(missing));
}

function computeMissingWatchSpecFields(item: any): string[] {
    if (item?.type === ProductType.WATCH_STRAP) return [];
    if (item?.type && item.type !== ProductType.WATCH) return [];

    const ws = item?.watchSpecSnapshot ?? null;
    if (!ws) return ["watch spec"];

    const missing: string[] = [];
    if (!hasShallowValue(ws.caseType)) missing.push("kiểu vỏ");
    if (!hasShallowValue(ws.movement)) missing.push("bộ máy");
    if (!hasShallowValue(ws.caseMaterial)) missing.push("chất liệu vỏ");
    if (!hasShallowValue(ws.strap)) missing.push("loại dây");
    if (!hasShallowValue(ws.glass)) missing.push("kính");

    return Array.from(new Set(missing));
}

function computePublishReadiness(item: any) {
    if (item?.type === ProductType.WATCH_STRAP) {
        const price = Number(item?.variantSnapshot?.price ?? item?.minPrice ?? 0);
        const hasSellableVariant = Number.isFinite(price) && price > 0;
        const missing = [
            Number(item?.imagesCount ?? 0) >= 1 ? null : "images",
            item?.brandId ? null : "brandId",
            hasSellableVariant ? null : "variant",
        ].filter(Boolean) as string[];

        return {
            isReadyToPublish: missing.length === 0,
            publishMissing: missing,
        };
    }

    const imageCount = Number(item?.imagesCount ?? 0);
    const variantPrice = Number(item?.variantSnapshot?.price ?? item?.minPrice ?? 0);
    const variantAvailability = String(item?.variantSnapshot?.availabilityStatus ?? "").toUpperCase();
    const variantStockQty = Number(item?.variantSnapshot?.stockQty ?? 0);
    const hasSellableVariant =
        Number.isFinite(variantPrice) &&
        variantPrice > 0 &&
        (variantAvailability === "ACTIVE" || variantStockQty > 0);

    const missing: string[] = [];

    if (imageCount < MIN_IMAGES) missing.push("images");
    if (!item?.brandId) missing.push("brandId");
    if (!hasSellableVariant) missing.push("variant");

    const ws = item?.watchSpecSnapshot ?? null;
    if (!ws) {
        missing.push("watchSpec");
    } else {
        const missingSpecFields = getRequiredWatchSpecFields(ws)
            .filter((field) => !hasRuleValue((ws as any)?.[field.key]))
            .map((field) => field.label);

        if (missingSpecFields.length) {
            missing.push(...missingSpecFields);
        }
    }

    return {
        isReadyToPublish: missing.length === 0,
        publishMissing: Array.from(new Set(missing)),
    };
}

export async function createProductDraft(title: string) {
    return prisma.$transaction(async (tx) => {
        return prodRepo.createProductDraft(
            tx,
            title,
            ProductType.WATCH,
            1,
            null as any
        );
    });
}

export async function detail(id: string) {
    return prisma.product.findUnique({
        where: { id },
        include: {
            brand: true,
            vendor: true,
            watchSpec: {
                include: {
                    complication: true,
                },
            },
            image: {
                where: { role: { in: ["PRIMARY", "GALLERY"] } },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
            },
            variants: {
                orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
                include: {
                    acquisitionItem: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: {
                            unitCost: true,
                        },
                    },
                },
            },
        },
    });
}

export async function getAdminProductList(
    raw: Record<string, unknown>,
    opts?: { canViewCost?: boolean }
) {
    const parsedResult = AdminListQuerySchema.safeParse({
        page: asNumber(raw.page) ?? 1,
        pageSize: asNumber(raw.pageSize) ?? 50,
        q: asString(raw.q),
        sort: asString(raw.sort),
        type: arrayify(raw.type),
        brandIds: arrayify(raw.brandIds ?? raw.brandId),
        categoryIds: arrayify(raw.categoryIds ?? raw.categoryId),
        hasImages: asString(raw.hasImages),
        vendorId: asString(raw.vendorId),
        sku: asString(raw.sku),
        updatedFrom: asDate(raw.updatedFrom),
        updatedTo: asDate(raw.updatedTo),
    });

    const parsed = parsedResult.success
        ? parsedResult.data
        : {
            page: 1,
            pageSize: 50,
            q: undefined,
            sort: undefined,
            type: undefined,
            brandIds: undefined,
            categoryIds: undefined,
            hasImages: undefined,
            vendorId: undefined,
            sku: undefined,
            updatedFrom: undefined,
            updatedTo: undefined,
        };

    const catalog = normalizeCatalog(raw.catalog);
    const view = normalizeView(raw.view);

    const result = await prodRepo.listAdminProducts(prisma, {
        q: parsed.q,
        sort: parsed.sort as any,
        page: parsed.page,
        pageSize: parsed.pageSize,
        view: view as any,
        type: parsed.type?.[0],
        brandId: parsed.brandIds?.[0],
        categoryId: parsed.categoryIds?.[0],
        vendorId: parsed.vendorId,
        sku: parsed.sku,
        hasImages: parsed.hasImages,
        catalog,
        includeCost: !!opts?.canViewCost,
    } as any);

    const itemIds = (result.items ?? []).map((item: any) => item.id).filter(Boolean);

    const latestServices = itemIds.length
        ? await prisma.serviceRequest.findMany({
            where: {
                productId: { in: itemIds },
            },
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            select: {
                productId: true,
                status: true,
            },
        })
        : [];

    const latestServiceMap = new Map<string, string>();
    const openServiceMap = new Map<string, string>();
    for (const row of latestServices) {
        if (!row.productId) continue;
        if (!latestServiceMap.has(row.productId)) {
            latestServiceMap.set(row.productId, String(row.status));
        }
        if (
            !openServiceMap.has(row.productId) &&
            OPEN_SERVICE_REQUEST_STATUSES.includes(row.status as any)
        ) {
            openServiceMap.set(row.productId, String(row.status));
        }
    }

    const items = (result.items ?? []).map((item: any) => {
        const missingVariantFields = computeMissingVariantFields(item);
        const missingWatchSpecFields = computeMissingWatchSpecFields(item);
        const isVariantInfoComplete = missingVariantFields.length === 0;
        const isWatchSpecComplete = missingWatchSpecFields.length === 0;
        const publishReadiness = computePublishReadiness(item);

        return {
            ...item,
            hasOpenService: openServiceMap.has(item.id),
            openServiceStatus: openServiceMap.get(item.id) ?? null,
            latestServiceStatus: latestServiceMap.get(item.id) ?? null,
            missingVariantFields,
            missingWatchSpecFields,
            isVariantInfoComplete,
            isWatchSpecComplete,
            isInfoComplete: isVariantInfoComplete && isWatchSpecComplete,
            isReadyToPublish: publishReadiness.isReadyToPublish,
            publishMissing: publishReadiness.publishMissing,
        };
    });

    return {
        ...result,
        items,
        page: parsed.page,
        pageSize: parsed.pageSize,
    };
}

export async function updateProduct(
    id: string,
    patch: {
        title?: string;
        categoryId?: string | null;
        minPrice?: number | null;
        listPrice?: number | null;
        discountType?: DiscountType | null;
        discountValue?: number | null;
        salePrice?: number | null;
        saleStartsAt?: Date | null;
        saleEndsAt?: Date | null;
        purchasePrice?: number | null;
        primaryImageUrl?: string | null;
        status?: string;
        priceVisibility?: "SHOW" | "HIDE";
        availabilityStatus?: "ACTIVE" | "HIDDEN";
    }
) {
    return prisma.$transaction(async (tx) => {
        const current = await prodRepo.getLatestVariantForAdmin(tx, id);
        if (!current) {
            throw new Error("Không tìm thấy product.");
        }

        const variant = current.variants?.[0] ?? null;
        const currentList = variant?.listPrice != null ? Number(variant.listPrice) : Number(variant?.price ?? 0);

        const nextListPrice =
            patch.listPrice !== undefined
                ? patch.listPrice
                : patch.minPrice !== undefined
                    ? patch.minPrice
                    : currentList;

        const nextDiscountType =
            patch.discountType !== undefined ? patch.discountType : (variant?.discountType ?? null);
        const nextDiscountValue =
            patch.discountValue !== undefined
                ? patch.discountValue
                : variant?.discountValue != null
                    ? Number(variant.discountValue)
                    : null;
        const nextSalePrice =
            patch.salePrice !== undefined
                ? patch.salePrice
                : variant?.salePrice != null
                    ? Number(variant.salePrice)
                    : null;
        const nextSaleStartsAt =
            patch.saleStartsAt !== undefined ? patch.saleStartsAt : (variant?.saleStartsAt ?? null);
        const nextSaleEndsAt =
            patch.saleEndsAt !== undefined ? patch.saleEndsAt : (variant?.saleEndsAt ?? null);
        const nextCostPrice =
            patch.purchasePrice !== undefined
                ? patch.purchasePrice
                : variant?.costPrice != null
                    ? Number(variant.costPrice)
                    : null;

        const shouldTouchPricing =
            patch.minPrice !== undefined ||
            patch.listPrice !== undefined ||
            patch.discountType !== undefined ||
            patch.discountValue !== undefined ||
            patch.salePrice !== undefined ||
            patch.saleStartsAt !== undefined ||
            patch.saleEndsAt !== undefined ||
            patch.purchasePrice !== undefined ||
            patch.availabilityStatus !== undefined;

        if (shouldTouchPricing) {
            const effectivePrice = computeEffectivePrice({
                listPrice: nextListPrice,
                discountType: nextDiscountType,
                discountValue: nextDiscountValue,
                salePrice: nextSalePrice,
                saleStartsAt: nextSaleStartsAt,
                saleEndsAt: nextSaleEndsAt,
                fallbackPrice: variant?.price,
            });

            await prodRepo.updatePrimaryVariantPricing(tx, id, {
                price: effectivePrice,
                listPrice: nextListPrice,
                discountType: nextDiscountType,
                discountValue: nextDiscountValue,
                salePrice: nextSalePrice,
                saleStartsAt: nextSaleStartsAt,
                saleEndsAt: nextSaleEndsAt,
                costPrice: nextCostPrice,
                ...(patch.availabilityStatus ? { availabilityStatus: patch.availabilityStatus as any } : {}),
            } as any);
        }

        const data: any = {};
        if (patch.title !== undefined) data.title = patch.title;
        if (patch.categoryId !== undefined) data.categoryId = patch.categoryId || null;
        if (patch.primaryImageUrl !== undefined) data.primaryImageUrl = patch.primaryImageUrl;
        if (patch.status !== undefined) data.status = patch.status;
        if (patch.priceVisibility !== undefined) data.priceVisibility = patch.priceVisibility;

        return prodRepo.updateProduct(tx, id, data);
    });
}

export async function remove(id: string) {
    return prisma.$transaction(async (tx) => {
        await prodRepo.deleteProduct(tx, id);
        return { success: true };
    });
}

export async function searchProductService(q: string) {
    return prisma.$transaction(async (tx) => {
        return prodRepo.searchProductsRepo(tx, q);
    });
}

export type BulkPostProductsResult = {
    count: number;
    postedIds: string[];
    failed: Array<{
        id: string;
        title?: string | null;
        reasons: string[];
    }>;
};

function toNumberPrice(v: unknown): number {
    if (v == null) return 0;
    if (typeof v === "number") return v;

    const anyV = v as any;
    if (typeof anyV?.toNumber === "function") return anyV.toNumber();

    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function hasPrice(p: { minPrice: unknown }) {
    return toNumberPrice(p.minPrice) > 0;
}

function hasImage(p: { primaryImageUrl: string | null }) {
    return !!p.primaryImageUrl && p.primaryImageUrl.trim().length > 0;
}

export async function bulkPostProducts(productIds: string[]): Promise<BulkPostProductsResult> {
    const ids = Array.from(new Set((productIds ?? []).filter(Boolean)));

    if (!ids.length) {
        return { count: 0, postedIds: [], failed: [] };
    }

    return prisma.$transaction(async (tx) => {
        const rows = await prodRepo.getProductsForBulkPost(tx, ids);

        const found = new Set(rows.map((x) => x.id));
        const notFound = ids.filter((id) => !found.has(id));

        const failed: BulkPostProductsResult["failed"] = [];

        for (const id of notFound) {
            failed.push({ id, title: null, reasons: ["NOT_FOUND"] });
        }

        const eligibleIds: string[] = [];

        for (const p of rows as Array<any>) {
            const reasons: string[] = [];

            if (p.contentStatus !== ContentStatus.DRAFT) {
                reasons.push(`STATUS_NOT_ALLOWED:${p.contentStatus}`);
            }
            if (!hasPrice(p)) reasons.push("MISSING_PRICE");
            if (!hasImage(p)) reasons.push("MISSING_IMAGE");

            if (reasons.length) {
                failed.push({ id: p.id, title: p.title ?? null, reasons });
            } else {
                eligibleIds.push(p.id);
            }
        }

        if (eligibleIds.length) {
            await prodRepo.markPostedMany(tx, eligibleIds);
        }

        return {
            count: eligibleIds.length,
            postedIds: eligibleIds,
            failed,
        };
    });
}