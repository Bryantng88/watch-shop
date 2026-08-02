import { NextRequest, NextResponse } from "next/server";

import { createAcquisitionWithItemApplication } from "@/domains/acquisition/application";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const items: Array<Record<string, unknown>> = Array.isArray(body.items) ? body.items : [];
        const isAccessoryOnly = items.length > 0 && items.every((item) => item.productType === "WATCH_STRAP" || item.productType === "WATCH_CLASP");
        const auth = await requirePermissionApi(
            isAccessoryOnly ? PERMISSIONS.STRAP_ACQUISITION_CREATE : PERMISSIONS.ACQUISITION_CREATE,
        );
        if (auth instanceof Response) return auth;

        if (!body.vendorId && !body.quickVendorName) {
            return NextResponse.json(
                { error: "Thiếu vendorId hoặc tên vendor mới" },
                { status: 400 }
            );
        }

        if (!items.length) {
            return NextResponse.json(
                { error: "Phải có ít nhất 1 sản phẩm" },
                { status: 400 }
            );
        }

        for (const [i, item] of items.entries()) {
            if (!item.title || typeof item.title !== "string") {
                return NextResponse.json(
                    { error: `Sản phẩm dòng ${i + 1} thiếu tên (title)` },
                    { status: 400 }
                );
            }

            if (!item.quantity || item.quantity < 1) {
                return NextResponse.json(
                    { error: `Sản phẩm dòng ${i + 1} số lượng phải > 0` },
                    { status: 400 }
                );
            }
        }

        const result = await createAcquisitionWithItemApplication(body, {
            actorUserId: auth.id ?? null,
        });
        return NextResponse.json(result, { status: 201 });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Lỗi hệ thống" },
            { status: 400 }
        );
    }
}
