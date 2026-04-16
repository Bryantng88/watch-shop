// app/(admin)/admin/_shared/search/parse-list-search-params.ts
export type ListSearchInput = {
    page: number;
    pageSize: number;
    q: string;
};

type Options = {
    defaultPageSize?: number; // default 20
    maxPageSize?: number;     // default 200
};

export function parseListSearchParams(
    sp: URLSearchParams,
    opts: Options = {}
): ListSearchInput {
    const defaultPageSize = opts.defaultPageSize ?? 20;
    const maxPageSize = opts.maxPageSize ?? 200;

    const page = Number(sp.get("page") ?? "1");
    const q = sp.get("q") ?? "";

    const pageSizeRaw = Number(sp.get("pageSize") ?? String(defaultPageSize));
    const pageSize =
        Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
            ? Math.min(pageSizeRaw, maxPageSize)
            : defaultPageSize;

    return {
        page: Number.isFinite(page) && page > 0 ? page : 1,
        pageSize,
        q,
    };
}
