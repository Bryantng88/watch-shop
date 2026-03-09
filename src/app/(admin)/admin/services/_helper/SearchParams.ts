export type ServiceRequestViewKey =
    | "all"
    | "draft"
    | "in_progress"
    | "done"
    | "canceled";

export type ServiceRequestListSort =
    | "createdDesc"
    | "createdAsc"
    | "updatedDesc"
    | "updatedAsc";

export type ServiceRequestSearchInput = {
    page: number;
    pageSize: number;
    q?: string;
    sort?: ServiceRequestListSort;
    view?: ServiceRequestViewKey;
};

function toStr(v: unknown) {
    const s = Array.isArray(v) ? v[0] : v;
    return typeof s === "string" ? s : "";
}

function toInt(v: unknown, fallback: number) {
    const n = Number(toStr(v));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toSort(v: unknown): ServiceRequestListSort {
    const s = toStr(v);
    if (
        s === "createdDesc" ||
        s === "createdAsc" ||
        s === "updatedDesc" ||
        s === "updatedAsc"
    ) {
        return s;
    }
    return "updatedDesc";
}

function toView(v: unknown): ServiceRequestViewKey {
    const s = toStr(v).toLowerCase();
    if (
        s === "draft" ||
        s === "in_progress" ||
        s === "done" ||
        s === "canceled"
    ) {
        return s as ServiceRequestViewKey;
    }
    return "all";
}

export function parseServiceRequestSearchParams(
    sp: URLSearchParams
): ServiceRequestSearchInput {
    return {
        page: toInt(sp.get("page"), 1),
        pageSize: toInt(sp.get("pageSize"), 20),
        q: toStr(sp.get("q")) || undefined,
        sort: toSort(sp.get("sort")),
        view: toView(sp.get("view")),
    };
}