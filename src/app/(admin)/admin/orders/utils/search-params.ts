// app/(admin)/admin/orders/utils/search-params.ts

export type OrderListSort =
    | "updatedDesc"
    | "updatedAsc"
    | "createdDesc"
    | "createdAsc";

export type OrderViewKey =
    | "all"
    | "web_pending"
    | "need_action"
    | "processing"
    | "delivered"
    | "completed"
    | "cancelled";

export type OrderSearchInput = {
    page: number;
    pageSize: number;
    q?: string;
    sort?: OrderListSort;
    view?: OrderViewKey;
};

function toStr(v: unknown) {
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" ? s : "";
}

function toInt(v: unknown, fallback: number) {
    const n = Number(toStr(v));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toView(v: unknown): OrderViewKey | undefined {
    const s = toStr(v).toLowerCase();
    if (
        s === "all" ||
        s === "web_pending" ||
        s === "need_action" ||
        s === "processing" ||
        s === "delivered" ||
        s === "completed" ||
        s === "cancelled"
    ) {
        return s as OrderViewKey;
    }
    return undefined;
}

function toSort(v: unknown): OrderListSort {
    const s = toStr(v);
    if (
        s === "updatedDesc" ||
        s === "updatedAsc" ||
        s === "createdDesc" ||
        s === "createdAsc"
    ) {
        return s;
    }
    return "updatedDesc";
}

export function parseOrderSearchParams(sp: URLSearchParams): OrderSearchInput {
    const page = toInt(sp.get("page"), 1);
    const pageSize = toInt(sp.get("pageSize"), 20);
    const q = toStr(sp.get("q"));
    const sort = toSort(sp.get("sort"));
    const view = toView(sp.get("view")) ?? "all";

    return {
        page,
        pageSize,
        q: q || undefined,
        sort,
        view,
    };
}