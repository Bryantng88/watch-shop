import { prisma } from "@/server/db/client";
import { ProductStatus, ProductType, DiscountType } from "@prisma/client";
import * as prodRepo from "./product.repo";
import { AdminFiltersSchema } from "./product.dto";
import { computeEffectivePrice } from "../helpers/price";

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
    return "all";
}

function normalizeCatalog(v: unknown): "product" | "strap" {
    const raw = String(firstValue(v) ?? "product").toLowerCase();
    return raw === "strap" ? "strap" : "product";
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
    });
}

export async function getAdminProductList(
    raw: Record<string, unknown>,
    opts?: { canViewCost?: boolean }
) {
    const parsed = AdminFiltersSchema.parse({
        page: asNumber(raw.page) ?? 1,
        pageSize: asNumber(raw.pageSize) ?? 50,
        q: raw.q ?? undefined,
        sort: raw.sort ?? undefined,
        type: arrayify(raw.type),
        brandIds: arrayify(raw.brandIds ?? raw.brandId),
        categoryIds: arrayify(raw.categoryIds ?? raw.categoryId),
        hasImages: raw.hasImages ?? undefined,
        updatedFrom: asDate(raw.updatedFrom),
        updatedTo: asDate(raw.updatedTo),
    });

    const catalog = String(raw.catalog ?? "product") === "strap" ? "strap" : "product";

    const result = await prodRepo.listAdminProducts(prisma, {
        q: parsed.q,
        sort: parsed.sort as any,
        page: parsed.page,
        pageSize: parsed.pageSize,
        view: String(raw.view ?? "all") as any,
        type: parsed.type?.[0],
        brandId: parsed.brandIds?.[0],
        categoryId: parsed.categoryIds?.[0],
        hasImages: parsed.hasImages,
        catalog,
        includeCost: !!opts?.canViewCost,
    } as any);

    return {
        ...result,
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

            await prodRepo.updateLatestVariantPricing(tx, id, {
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

        return prodRepo.updateProductBase(tx, id, data);
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

            if (p.status !== ProductStatus.DRAFT) {
                reasons.push(`STATUS_NOT_ALLOWED:${p.status}`);
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