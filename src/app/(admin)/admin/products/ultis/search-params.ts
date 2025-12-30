// app/(admin)/admin/products/utils/search-params.ts
export type ProductSearchInput = {
    page: number;
    pageSize: number;
    q?: string;
    sort?: "createdDesc" | "createdAsc" | "updatedDesc" | "updatedAsc";
};

export function parseProductSearchParams(sp: URLSearchParams): ProductSearchInput {
    return {
        page: Number(sp.get("page") ?? 1),
        pageSize: Number(sp.get("pageSize") ?? 20),
        q: sp.get("q") || undefined,
        sort: (sp.get("sort") as any) ?? "updatedDesc",
    };
}
