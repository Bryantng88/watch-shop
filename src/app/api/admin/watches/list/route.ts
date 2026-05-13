import { NextRequest, NextResponse } from "next/server";

import { getAdminWatchList } from "@/domains/watch/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export const dynamic = "force-dynamic";

function firstValue(params: URLSearchParams, key: string) {
    return params.get(key) ?? "";
}

function toPositiveInt(value: string | null | undefined, fallback: number) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
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

    const view = (firstValue(params, "view") || "draft") as
        | "draft"
        | "processing"
        | "ready"
        | "hold"
        | "sold"
        | "all";

    return {
        view,
        subFilter: firstValue(params, "subFilter") as any,

        q: firstValue(params, "q"),
        sku: firstValue(params, "sku"),
        brandId: firstValue(params, "brandId"),
        vendorId: firstValue(params, "vendorId"),

        hasContent: firstValue(params, "hasContent") as "" | "yes" | "no",
        hasImages: firstValue(params, "hasImages") as "" | "yes" | "no",

        saleStage: firstValue(params, "saleStage"),
        opsStage: firstValue(params, "opsStage"),

        sort: firstValue(params, "sort") || "updatedDesc",
        page: toPositiveInt(firstValue(params, "page"), 1),
        pageSize: toPositiveInt(firstValue(params, "pageSize"), 20),
    };
}

export async function GET(req: NextRequest) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_VIEW);

        const input = buildWatchListInput(req);
        const result = await getAdminWatchList(input);

        return NextResponse.json({
            ok: true,
            data: serialize(result),
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