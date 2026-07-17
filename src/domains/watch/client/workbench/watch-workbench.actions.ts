"use server";

import { revalidatePath } from "next/cache";
import { PERMISSIONS } from "@/constants/permissions";
import { rebuildWatchListProjectionRows } from "@/domains/projection/server/watch-list";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { updateWatchPricingWithDiff } from "../../server/pricing";
import type { WatchWorkbenchValues } from "./types";

type AuthLike = {
    id?: string | null;
    userId?: string | null;
    user?: {
        id?: string | null;
        roles?: Array<string | { name?: string | null; code?: string | null; key?: string | null; slug?: string | null }> | null;
    } | null;
    roles?: Array<string | { name?: string | null; code?: string | null; key?: string | null; slug?: string | null }> | null;
};

function authHasRole(auth: AuthLike, role: string) {
    const roles = auth?.roles ?? auth?.user?.roles ?? [];
    const target = role.toUpperCase();

    return Array.isArray(roles) && roles.some((item) => {
        if (typeof item === "string") return item.toUpperCase() === target;
        const value = item?.name ?? item?.code ?? item?.key ?? item?.slug ?? "";
        return String(value).toUpperCase() === target;
    });
}

function priceSnapshot(value: unknown) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;

    return {
        salePrice: row.salePrice == null ? null : String(row.salePrice),
        minPrice: row.minPrice == null ? null : String(row.minPrice),
        costPrice: row.costPrice == null ? null : String(row.costPrice),
        serviceCost: row.serviceCost == null ? null : String(row.serviceCost),
        landedCost: row.landedCost == null ? null : String(row.landedCost),
        pricingNote: row.pricingNote == null ? null : String(row.pricingNote),
    };
}

export async function saveWatchWorkbenchPricingAction(input: {
    productId: string;
    pricing: WatchWorkbenchValues["pricing"];
    title?: string | null;
    sku?: string | null;
}) {
    const auth = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
    if (!authHasRole(auth, "ADMIN")) {
        throw new Error("Ban khong co quyen cap nhat gia watch.");
    }

    const productId = String(input.productId ?? "").trim();
    if (!productId) throw new Error("Missing productId.");

    const result = await updateWatchPricingWithDiff(productId, {
        salePrice: input.pricing.salePrice,
        minPrice: input.pricing.minPrice,
        costPrice: input.pricing.costPrice,
        serviceCost: input.pricing.serviceCost,
        landedCost: input.pricing.landedCost,
        pricingNote: input.pricing.pricingNote,
    });

    await rebuildWatchListProjectionRows(prisma, {
        watchIds: [result.watchId],
        limit: 1,
    });
    revalidatePath("/admin/watches");
    revalidatePath(`/admin/watches/${productId}`);

    return {
        ok: true,
        changedFields: result.changedFields,
        pricing: priceSnapshot(result.after),
    };
}
