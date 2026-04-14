export type ProductListSort =
    | "updatedDesc"
    | "updatedAsc"
    | "createdDesc"
    | "createdAsc"
    | "titleAsc"
    | "titleDesc";

export type ProductViewKey =
    | "all"
    | "not_ready"
    | "ready_to_post"
    | "live"
    | "in_service"
    | "sold";

export type ProductCatalogKey = "product" | "strap";

export type ProductSaleStageFilter =
    | "NOT_READY"
    | "READY_TO_POST"
    | "LIVE"
    | "HOLD"
    | "SOLD";

export type ProductOpsStageFilter =
    | "NORMAL"
    | "IN_SERVICE"
    | "BLOCKED"
    | "SOLD";

export type ProductMissingFilter = "images" | "content" | "price";

export type ProductListInput = {
    q?: string;
    type?: string;
    brandId?: string;
    vendorId?: string;
    sku?: string;
    categoryId?: string;
    hasImages?: string;
    view?: ProductViewKey;
    sort?: ProductListSort;
    page?: number;
    pageSize?: number;
    catalog?: ProductCatalogKey;

    saleStage?: ProductSaleStageFilter;
    opsStage?: ProductOpsStageFilter;
    missing?: ProductMissingFilter;
};

function toStr(v: any) {
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" ? s : "";
}

function toInt(v: any, fallback: number) {
    const n = Number(toStr(v));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toView(value: string): ProductViewKey {
    const raw = (value || "").toLowerCase();
    if (
        raw === "all" ||
        raw === "not_ready" ||
        raw === "ready_to_post" ||
        raw === "live" ||
        raw === "in_service" ||
        raw === "sold"
    ) {
        return raw;
    }
    return "all";
}

function toSaleStage(value: string): ProductSaleStageFilter | undefined {
    const raw = (value || "").toUpperCase();
    if (
        raw === "NOT_READY" ||
        raw === "READY_TO_POST" ||
        raw === "LIVE" ||
        raw === "HOLD" ||
        raw === "SOLD"
    ) {
        return raw;
    }
    return undefined;
}

function toOpsStage(value: string): ProductOpsStageFilter | undefined {
    const raw = (value || "").toUpperCase();
    if (
        raw === "NORMAL" ||
        raw === "IN_SERVICE" ||
        raw === "BLOCKED" ||
        raw === "SOLD"
    ) {
        return raw;
    }
    return undefined;
}

function toMissing(value: string): ProductMissingFilter | undefined {
    const raw = (value || "").toLowerCase();
    if (raw === "images" || raw === "content" || raw === "price") {
        return raw;
    }
    return undefined;
}

export function parseProductListSearchParams(
    sp: URLSearchParams
): ProductListInput {
    const q = toStr(sp.get("q"));
    const type = toStr(sp.get("type"));
    const brandId = toStr(sp.get("brandId"));
    const categoryId = toStr(sp.get("categoryId"));
    const hasImages = toStr(sp.get("hasImages"));
    const vendorId = toStr(sp.get("vendorId"));
    const sku = toStr(sp.get("sku"));
    const view = toView(toStr(sp.get("view")));
    const sort = (toStr(sp.get("sort")) as ProductListSort) || "updatedDesc";
    const page = toInt(sp.get("page"), 1);
    const pageSize = toInt(sp.get("pageSize"), 20);
    const catalog =
        (toStr(sp.get("catalog")) || "product") === "strap" ? "strap" : "product";

    const saleStage = toSaleStage(toStr(sp.get("saleStage")));
    const opsStage = toOpsStage(toStr(sp.get("opsStage")));
    const missing = toMissing(toStr(sp.get("missing")));

    return {
        q: q || undefined,
        type: type || undefined,
        brandId: brandId || undefined,
        vendorId: vendorId || undefined,
        sku: sku || undefined,
        categoryId: categoryId || undefined,
        hasImages: hasImages || undefined,
        view,
        sort,
        page,
        pageSize,
        catalog,
        saleStage,
        opsStage,
        missing,
    };
}