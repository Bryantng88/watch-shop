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

export type ProductMissingKey =
    | "images"
    | "content"
    | "price";

export type ProductListInput = {
    q?: string;
    type?: string;
    brandId?: string;
    vendorId?: string;
    sku?: string;
    categoryId?: string;
    hasImages?: string;
    missing?: ProductMissingKey;
    view?: ProductViewKey;
    sort?: ProductListSort;
    page?: number;
    pageSize?: number;
    catalog?: ProductCatalogKey;
};

function toStr(v: any) {
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" ? s : "";
}

function toInt(v: any, fallback: number) {
    const n = Number(toStr(v));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function parseProductListSearchParams(sp: URLSearchParams): ProductListInput {
    const q = toStr(sp.get("q"));
    const type = toStr(sp.get("type"));
    const brandId = toStr(sp.get("brandId"));
    const categoryId = toStr(sp.get("categoryId"));
    const hasImages = toStr(sp.get("hasImages"));
    const vendorId = toStr(sp.get("vendorId"));
    const sku = toStr(sp.get("sku"));
    const missing = toStr(sp.get("missing")) as ProductMissingKey;
    const view = (toStr(sp.get("view")) || "not_ready") as ProductViewKey;
    const sort = (toStr(sp.get("sort")) as ProductListSort) || "updatedDesc";
    const page = toInt(sp.get("page"), 1);
    const pageSize = toInt(sp.get("pageSize"), 20);
    const catalog = (toStr(sp.get("catalog")) || "product") === "strap" ? "strap" : "product";

    return {
        q: q || undefined,
        type: type || undefined,
        brandId: brandId || undefined,
        vendorId: vendorId || undefined,
        sku: sku || undefined,
        categoryId: categoryId || undefined,
        hasImages: hasImages || undefined,
        missing: missing || undefined,
        view,
        sort,
        page,
        pageSize,
        catalog,
    };
}