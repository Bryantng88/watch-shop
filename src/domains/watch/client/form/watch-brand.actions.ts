"use server";

import { createBrandQuick } from "@/domains/shared/brand/server/brand.service";
import { searchActiveBrandOptions } from "@/domains/shared/brand/server/brand.service";

export async function createQuickBrand(name: string) {
    return createBrandQuick({ name });
}

export async function searchBrandOptions(query: string) {
    return searchActiveBrandOptions(query);
}
