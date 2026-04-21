export type AcquisitionListView =
    | "all"
    | "draft"
    | "open"
    | "posted"
    | "returned"
    | "cancelled";

export type AcquisitionListFilters = {
    view?: AcquisitionListView;
    q?: string;
    vendorId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
};

function toPositiveInt(value: any, fallback: number) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeView(value?: string): AcquisitionListView {
    const v = String(value ?? "").trim().toLowerCase();

    if (
        v === "all" ||
        v === "draft" ||
        v === "open" ||
        v === "posted" ||
        v === "returned" ||
        v === "cancelled"
    ) {
        return v;
    }

    return "all";
}

export function parseAcquisitionListSearchParams(input: {
    view?: string;
    q?: string;
    vendorId?: string;
    status?: string;
    page?: string;
    pageSize?: string;
}): AcquisitionListFilters {
    return {
        view: normalizeView(input.view),
        q: input.q?.trim() ?? "",
        vendorId: input.vendorId?.trim() ?? "",
        status: input.status?.trim() ?? "",
        page: toPositiveInt(input.page, 1),
        pageSize: toPositiveInt(input.pageSize, 20),
    };
}