// app/(admin)/admin/orders/utils/search-params.ts

export type OrderViewKey =
    | "all"
    | "web_pending"
    | "need_action"
    | "processing"
    | "delivered"
    | "completed"
    | "cancelled";

export type OrderListSort =
    | "updatedDesc"
    | "updatedAsc"
    | "createdDesc"
    | "createdAsc";

export type OrderSearchInput = {
    page: number;
    pageSize: number;
    q?: string;
    view?: OrderViewKey;
    sort?: OrderListSort;
};

function toStr(v: unknown) {
    return typeof v === "string" ? v : "";
}

function toInt(v: unknown, fallback: number) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function parseOrderSearchParams(sp: URLSearchParams): OrderSearchInput {
    const page = toInt(sp.get("page"), 1);
    const pageSize = toInt(sp.get("pageSize"), 20);
    const q = toStr(sp.get("q")).trim();
    const view = (toStr(sp.get("view")) || "all") as OrderViewKey;
    const sort = (toStr(sp.get("sort")) || "updatedDesc") as OrderListSort;

    return {
        page,
        pageSize,
        q: q || undefined,
        view,
        sort,
    };
}