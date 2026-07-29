import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import {
    getQuickOrderProductForOrderForm,
    getServiceCatalogOptions,
} from "@/domains/order/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function GET(request: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.ORDER_CREATE);
    if (auth instanceof Response) return auth;

    const productId = request.nextUrl.searchParams.get("productId")?.trim() ?? "";
    if (!productId) {
        return NextResponse.json({ error: "Thiếu productId." }, { status: 400 });
    }

    try {
        const [quickProduct, services] = await Promise.all([
            getQuickOrderProductForOrderForm(productId),
            getServiceCatalogOptions(),
        ]);
        if (!quickProduct) {
            return NextResponse.json(
                { error: "Watch không còn đủ điều kiện tạo đơn hàng." },
                { status: 409 },
            );
        }
        return NextResponse.json({ quickProduct, services });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Không thể tải form tạo đơn hàng.",
            },
            { status: 400 },
        );
    }
}
