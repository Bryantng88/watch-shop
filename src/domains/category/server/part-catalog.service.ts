import {
    createPartCatalogRepo,
    updatePartCatalogRepo,
} from "./part-catalog.repo";

export async function createPartCatalog(input: {
    name: string;
    appliesTo: string;
    group: string;
    sortOrder?: number | null;
    note?: string | null;
    isActive?: boolean;
}) {
    if (!input.name?.trim()) {
        throw new Error("Thiếu tên linh kiện");
    }

    return createPartCatalogRepo({
        name: input.name,
        appliesTo: input.appliesTo,
        group: input.group,
        sortOrder: input.sortOrder,
        note: input.note,
        isActive: input.isActive,
    });
}

export async function updatePartCatalog(
    id: string,
    input: {
        name: string;
        appliesTo: string;
        group: string;
        sortOrder?: number | null;
        note?: string | null;
        isActive?: boolean;
    }
) {
    if (!id) {
        throw new Error("Thiếu id linh kiện");
    }

    if (!input.name?.trim()) {
        throw new Error("Thiếu tên linh kiện");
    }

    return updatePartCatalogRepo(id, {
        name: input.name,
        appliesTo: input.appliesTo,
        group: input.group,
        sortOrder: input.sortOrder,
        note: input.note,
        isActive: input.isActive,
    });
}