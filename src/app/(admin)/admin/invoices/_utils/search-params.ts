// _utils/search-params.ts
export type InvoiceSort =
    | "updatedDesc"
    | "updatedAsc"
    | "createdDesc"
    | "createdAsc";

export type InvoiceListInput = {
    page: number;
    pageSize: number;
    q?: string;
    sort: InvoiceSort;
    status?: string;
    type?: string;
    customerId?: string;
    vendorId?: string;
};

const DEFAULT_PAGE_SIZE = 20;

export function parseInvoiceSearchParams(sp: URLSearchParams): InvoiceListInput {
    const page = Math.max(1, Number(sp.get("page") ?? "1") || 1);
    const pageSize = Math.max(
        1,
        Number(sp.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE
    );

    const q = sp.get("q") || undefined;
    const sort = (sp.get("sort") as InvoiceSort) || "updatedDesc";
    const status = sp.get("status") || undefined;
    const type = sp.get("type") || undefined;
    const customerId = sp.get("customerId") || undefined;
    const vendorId = sp.get("vendorId") || undefined;

    return {
        page,
        pageSize,
        q,
        sort,
        status,
        type,
        customerId,
        vendorId,
    };
}
