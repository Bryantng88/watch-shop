import { NextRequest, NextResponse } from "next/server";

import { getAdminWatchList } from "@/domains/watch/server";
import { listAdminWatches } from "@/domains/watch/server/list/watch-list.repo";
import type { WatchListSubFilter } from "@/domains/watch/ui/list/types";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { scrubWatchListSensitivePrices } from "@/domains/watch/server/list/watch-list-visibility";

export const dynamic = "force-dynamic";

function firstValue(params: URLSearchParams, key: string) {
    return params.get(key) ?? "";
}

function toPositiveInt(value: string | null | undefined, fallback: number) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function toBoolean(value: string | null, fallback: boolean) {
    if (value === null || value === "") return fallback;
    return value.trim().toLowerCase() === "true";
}

function serialize(obj: unknown) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}
function buildWatchListInput(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const requestedSegment = firstValue(params, "segment").toUpperCase();
    const audienceSegment =
        requestedSegment === "WOMEN" || requestedSegment === "UNISEX"
            ? requestedSegment
            : "MEN";

    const view = "all" as
        | "draft"
        | "processing"
        | "ready"
        | "hold"
        | "sold"
        | "all";
    const galleryFilter = firstValue(params, "hasImages").toLowerCase();

    return {
        view,
        audienceSegment: audienceSegment as "MEN" | "WOMEN" | "UNISEX",
        subFilter: "" as WatchListSubFilter,

        q: firstValue(params, "q"),
        sku: firstValue(params, "sku"),
        brandId: firstValue(params, "brandId"),
        vendorId: firstValue(params, "vendorId"),

        hasContent: "" as "" | "yes" | "no",
        hasImages: (galleryFilter === "yes" || galleryFilter === "no"
            ? galleryFilter
            : "") as "" | "yes" | "no",

        saleStage: "",
        opsStage: "",
        mediaStatus: firstValue(params, "mediaStatus"),
        storefrontStatus: firstValue(params, "storefrontStatus"),
        serviceStatus: firstValue(params, "serviceStatus"),
        saleStatus: firstValue(params, "saleStatus"),
        priceStatus: firstValue(params, "priceStatus"),
        pricePreset: firstValue(params, "pricePreset"),
        priceMin: firstValue(params, "priceMin"),
        priceMax: firstValue(params, "priceMax"),
        duplicateScope: firstValue(params, "duplicates") === "1" ? "DUPLICATE" as const : "ACTIVE" as const,

        sort: firstValue(params, "sort") || "updatedDesc",
        page: toPositiveInt(firstValue(params, "page"), 1),
        pageSize: toPositiveInt(firstValue(params, "pageSize"), 20),
        withTotal: toBoolean(params.get("withTotal"), true),
        meta: firstValue(params, "meta") || "lite",
    };
}

export async function GET(req: NextRequest) {
    try {
        const user = await requirePermission(PERMISSIONS.PRODUCT_VIEW);

        const input = buildWatchListInput(req);
        const consistency = req.nextUrl.searchParams.get("consistency");
        const result = consistency === "source"
            ? await listAdminWatches(input)
            : await getAdminWatchList(input);

        const canViewCost =
            user.roles.includes("ADMIN") ||
            user.permissions.includes(PERMISSIONS.PRODUCT_COST_VIEW);

        return NextResponse.json({
            ok: true,
            data: serialize(canViewCost ? result : scrubWatchListSensitivePrices(result)),
        });
    } catch (error) {
        console.error("[WATCH_LIST_API_ERROR]", error);

        return NextResponse.json(
            {
                ok: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể tải danh sách watch",
            },
            { status: 500 }
        );
    }
}
