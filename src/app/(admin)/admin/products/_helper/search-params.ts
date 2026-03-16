export type ProductListSort =
    | "updatedDesc"
    | "updatedAsc"
    | "createdDesc"
    | "createdAsc"
    | "titleAsc"
    | "titleDesc";

export type ProductViewKey =
    | "all"
    | "draft"
    | "posted"
    | "in_service"
    | "hold"
    | "sold";

export type ProductCatalogKey = "product" | "strap";

export type ProductListInput = {
    q?: string;
    type?: string;
    brandId?: string;
    hasImages?: string;
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
    const hasImages = toStr(sp.get("hasImages"));
    const view = (toStr(sp.get("view")) || "all") as ProductViewKey;
    const sort = (toStr(sp.get("sort")) as ProductListSort) || "updatedDesc";
    const page = toInt(sp.get("page"), 1);
    const pageSize = toInt(sp.get("pageSize"), 20);

    const rawCatalog = (toStr(sp.get("catalog")) || "product").toLowerCase();
    const catalog: ProductCatalogKey = rawCatalog === "strap" ? "strap" : "product";

    return {
        q: q || undefined,
        type: type || undefined,
        brandId: brandId || undefined,
        hasImages: hasImages || undefined,
        view,
        sort,
        page,
        pageSize,
        catalog,
    };
}