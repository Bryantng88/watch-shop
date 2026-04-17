"use server";

import { getCurrentUser } from "@/server/auth/getCurrentUser";
import {
    saveWatchContent,
    updateWatchCore,
    updateWatchPricing,
    updateWatchSpec,
    getWatchPricing,
    getWatchDetail,
} from "../server";
import { buildWatchSubmitPayload } from "./watch-form.submit";
import type { WatchFormValues } from "./watch-form.types";
import { notifyUsersByRole } from "@/app/(admin)/admin/notifications/notification.service";

function normalizeMoney(value?: string | number | null) {
    if (value == null || value === "") return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function moneyChanged(a?: string | number | null, b?: string | number | null) {
    return normalizeMoney(a) !== normalizeMoney(b);
}

function formatMoney(value?: string | number | null) {
    const n = normalizeMoney(value);
    if (n == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(n) + " VND";
}

async function notifyWatchPricingChanged(input: {
    productId: string;
    before: Record<string, string | number | null | undefined>;
    after: Record<string, string | number | null | undefined>;
}) {
    const changedKeys = ["salePrice", "listPrice", "costPrice", "minPrice"] as const;
    const changed = changedKeys.filter((key) => moneyChanged(input.before[key], input.after[key]));
    if (!changed.length) return;

    const detail = await getWatchDetail(input.productId).catch(() => null);
    const actor = await getCurrentUser().catch(() => null);

    const title = detail?.title || "Watch";
    const sku = detail?.sku || "-";
    const actorName =
        (actor as any)?.name ||
        (actor as any)?.fullName ||
        (actor as any)?.email ||
        "Một tài khoản admin";

    const message = [
        `${actorName} vừa cập nhật giá cho ${title}.`,
        `SKU: ${sku}.`,
        changed
            .map((key) => {
                const label =
                    key === "salePrice"
                        ? "Giá bán"
                        : key === "listPrice"
                            ? "Giá niêm yết"
                            : key === "costPrice"
                                ? "Giá mua"
                                : "Giá tối thiểu";
                return `${label}: ${formatMoney(input.before[key])} → ${formatMoney(input.after[key])}`;
            })
            .join(" | "),
    ].join(" ");

    await notifyUsersByRole({
        role: ["SALE", "TECHNICIAN"],
        type: "WATCH_PRICE_UPDATED",
        title: `Cập nhật giá watch · ${title}`,
        message,
        priority: "HIGH",
        metadata: {
            productId: input.productId,
            watchId: detail?.watchId ?? null,
            title,
            sku,
            before: input.before,
            after: input.after,
            changedFields: changed,
            source: "watch_edit_form",
        },
    });
}

export async function submitWatchForm(values: WatchFormValues, previous?: WatchFormValues) {
    const payload = buildWatchSubmitPayload(values);
    const currentPricing = await getWatchPricing(values.productId).catch(() => null);

    await updateWatchCore(values.productId, payload.core);
    await updateWatchSpec(payload.spec);
    await updateWatchPricing(values.productId, payload.pricing);
    await saveWatchContent(values.productId, payload.content);

    const before = {
        costPrice: previous?.pricing.costPrice ?? currentPricing?.price?.costPrice?.toString?.() ?? null,
        listPrice: previous?.pricing.listPrice ?? currentPricing?.price?.listPrice?.toString?.() ?? null,
        salePrice: previous?.pricing.salePrice ?? currentPricing?.price?.salePrice?.toString?.() ?? null,
        minPrice: previous?.pricing.minPrice ?? currentPricing?.price?.minPrice?.toString?.() ?? null,
    };

    const after = {
        costPrice: values.pricing.costPrice,
        listPrice: values.pricing.listPrice,
        salePrice: values.pricing.salePrice,
        minPrice: values.pricing.minPrice,
    };

    await notifyWatchPricingChanged({
        productId: values.productId,
        before,
        after,
    });

    return {
        ok: true,
        message: "Đã lưu watch. Nếu giá thay đổi, notification đã được gửi.",
    };
}
