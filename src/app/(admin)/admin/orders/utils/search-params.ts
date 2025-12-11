// app/(admin)/admin/orders/utils/search-params.ts

export type OrderSearchInput = {
    page: number;
    pageSize: number;
    q?: string;
};

export function parseOrderSearchParams(sp: URLSearchParams): OrderSearchInput {
    const page = Number(sp.get("page") ?? "1");
    const q = sp.get("q") ?? "";

    return {
        page: page > 0 ? page : 1,
        pageSize: 20,
        q,
    };
}
