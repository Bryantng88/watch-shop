export type ProductListSort =
    | "updatedDesc"
    | "updatedAsc"
    | "createdDesc"
    | "createdAsc"
    | "titleAsc"
    | "titleDesc";

export type ProductViewKey =
    | "draft"
    | "processing"
    | "ready"
    | "hold"
    | "sold"
    | "all";

export type ProductCatalogKey = "product" | "strap";

export type ProductListInput = {
    q?: string;
    brandId?: string;
    vendorId?: string;
    hasContent?: "yes" | "no";
    hasImages?: "yes" | "no";
    serviceState?: "DONE" | "IN_PROGRESS" | "PENDING" | "NOT_REQUIRED";
    hasSellPrice?: "yes" | "no";
    sort?: ProductListSort;
    view?: ProductViewKey;
    page?: number;
    pageSize?: number;
    catalog?: ProductCatalogKey;
};

function toStr(v: unknown) {
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" ? s : "";
}

function toInt(v: unknown, fallback: number) {
    const n = Number(toStr(v));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toView(value: string): ProductViewKey {
    const raw = (value || "").toLowerCase();

    if (
        raw === "draft" ||
        raw === "processing" ||
        raw === "ready" ||
        raw === "hold" ||
        raw === "sold" ||
        raw === "all"
    ) {
        return raw;
    }

    return "draft";
}

function toYesNo(value: string): "yes" | "no" | undefined {
    const raw = (value || "").toLowerCase();

    if (raw === "yes" || raw === "no") {
        return raw;
    }

    return undefined;
}

function toServiceState(
    value: string
): "DONE" | "IN_PROGRESS" | "PENDING" | "NOT_REQUIRED" | undefined {
    const raw = (value || "").toUpperCase();

    if (
        raw === "DONE" ||
        raw === "IN_PROGRESS" ||
        raw === "PENDING" ||
        raw === "NOT_REQUIRED"
    ) {
        return raw;
    }

    return undefined;
}

function toSort(value: string): ProductListSort {
    const raw = value as ProductListSort;

    if (
        raw === "updatedDesc" ||
        raw === "updatedAsc" ||
        raw === "createdDesc" ||
        raw === "createdAsc" ||
        raw === "titleAsc" ||
        raw === "titleDesc"
    ) {
        return raw;
    }

    return "updatedDesc";
}

export function parseProductListSearchParams(
    sp: URLSearchParams
): ProductListInput {
    const q = toStr(sp.get("q"));
    const brandId = toStr(sp.get("brandId"));
    const vendorId = toStr(sp.get("vendorId"));
    const hasContent = toYesNo(toStr(sp.get("hasContent")));
    const hasImages = toYesNo(toStr(sp.get("hasImages")));
    const serviceState = toServiceState(toStr(sp.get("serviceState")));
    const hasSellPrice = toYesNo(toStr(sp.get("hasSellPrice")));
    const view = toView(toStr(sp.get("view")));
    const sort = toSort(toStr(sp.get("sort")));
    const page = toInt(sp.get("page"), 1);
    const pageSize = toInt(sp.get("pageSize"), 20);
    const catalog: ProductCatalogKey =
        (toStr(sp.get("catalog")) || "product") === "strap" ? "strap" : "product";

    return {
        q: q || undefined,
        brandId: brandId || undefined,
        vendorId: vendorId || undefined,
        hasContent,
        hasImages,
        serviceState,
        hasSellPrice,
        sort,
        view,
        page,
        pageSize,
        catalog,
    };
}