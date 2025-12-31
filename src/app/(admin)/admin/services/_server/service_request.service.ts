import { listServiceCatalogRepo } from "./service_request.repo";

export type ServiceCatalogItem = {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    detail: string;          // BASIC | OVERHAUL | SPA ...
    defaultPrice: number | null;
    durationMin: number | null;
};

export async function getServiceCatalogList() {
    const rows = await listServiceCatalogRepo(undefined, {
        isActive: true,
    });

    return rows.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        description: r.description,
        detail: r.detail,
        defaultPrice: r.defaultPrice
            ? Number(r.defaultPrice)
            : null,
        durationMin: r.durationMin,
    }));
}
