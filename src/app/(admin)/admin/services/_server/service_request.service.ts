import { listServiceCatalogRepo } from "./service_request.repo";
import * as sevRepo from "./service_request.repo"
import { Prisma } from "@prisma/client";

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


export async function createFromOrder(
    tx: Prisma.TransactionClient,
    order: {
        items: Array<{
            id: string;
            kind: string;
            title: string;
            quantity: number;
            unitPriceAgreed: number;
        }>;
    }
) {
    const serviceItems = order.items.filter(
        (i) => i.kind === "SERVICE"
    );

    if (serviceItems.length === 0) return;

    for (const item of serviceItems) {
        await sevRepo.createServiceRequest(tx, {
            orderItemId: item.id,
            title: item.title,
            quantity: item.quantity,
            unitPrice: item.unitPriceAgreed,
        });
    }
}
