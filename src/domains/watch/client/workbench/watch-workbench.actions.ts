"use server";

import { revalidatePath } from "next/cache";
import { PERMISSIONS } from "@/constants/permissions";
import {
    emitWatchPriceUpdatedEvent,
    emitWatchSpecUpdatedEvent,
} from "@/domains/watch/server/events";
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

function authUserId(auth: AuthLike) {
    return String(auth?.userId ?? auth?.id ?? auth?.user?.id ?? "").trim() || null;
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
        throw new Error("Bạn không có quyền cập nhật giá watch.");
    }

    const productId = String(input.productId ?? "").trim();
    if (!productId) throw new Error("Missing productId.");

    const result = await prisma.$transaction(async (tx) => {
        const pricing = await updateWatchPricingWithDiff(productId, {
            salePrice: input.pricing.salePrice,
            minPrice: input.pricing.minPrice,
            costPrice: input.pricing.costPrice,
            serviceCost: input.pricing.serviceCost,
            landedCost: input.pricing.landedCost,
            pricingNote: input.pricing.pricingNote,
        }, tx);

        await emitWatchPriceUpdatedEvent(tx, {
            watch: {
                id: pricing.watchId,
                productId,
                product: pricing.product,
            },
            actorUserId: authUserId(auth),
            changedFields: pricing.changedFields,
            before: priceSnapshot(pricing.before),
            after: priceSnapshot(pricing.after),
        });

        return pricing;
    });
    revalidatePath("/admin/watches");
    revalidatePath(`/admin/watches/${productId}`);

    return {
        ok: true,
        changedFields: result.changedFields,
        pricing: priceSnapshot(result.after),
    };
}

export async function saveWatchWorkbenchTitleAction(input: {
    productId: string;
    title: string;
}) {
    const auth = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

    const productId = String(input.productId ?? "").trim();
    const title = String(input.title ?? "").trim().replace(/\s+/g, " ");
    if (!productId) throw new Error("Missing productId.");
    if (!title) throw new Error("Tên watch không được để trống.");
    if (title.length > 180) throw new Error("Tên watch không được dài quá 180 ký tự.");

    const watch = await prisma.watch.findUnique({
        where: { productId },
        select: { id: true },
    });
    if (!watch) throw new Error("Không tìm thấy watch cần cập nhật.");

    const product = await prisma.$transaction(async (tx) => {
        const updatedProduct = await tx.product.update({
            where: { id: productId },
            data: { title },
            select: { title: true, sku: true },
        });

        await emitWatchSpecUpdatedEvent(tx, {
            watch: {
                id: watch.id,
                productId,
                product: updatedProduct,
            },
            actorUserId: authUserId(auth),
            before: null,
            after: { title: updatedProduct.title },
        });

        return updatedProduct;
    });
    revalidatePath("/admin/watches");
    revalidatePath(`/admin/watches/${productId}`);

    return { ok: true, title: product.title };
}
