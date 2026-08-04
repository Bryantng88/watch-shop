"use server";

import { createBrandQuick } from "@/domains/shared/brand/server/brand.service";
import { searchBrandOptions as searchAllBrandOptions } from "@/domains/shared/brand/server/brand.service";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";

export async function createQuickBrand(name: string) {
    await requirePermission(PERMISSIONS.PRODUCT_CREATE);
    return createBrandQuick({ name });
}

export async function searchBrandOptions(query: string) {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);
    return searchAllBrandOptions(query);
}
