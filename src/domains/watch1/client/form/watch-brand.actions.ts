"use server";

import { createBrandQuick } from "@/domains/shared/brand/server/brand.service";
export async function createQuickBrand(name: string) {
    return createBrandQuick({ name });
}