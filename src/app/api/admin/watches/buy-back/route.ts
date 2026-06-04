import { NextResponse } from "next/server";

import { buyBackFromWatch } from "@/domains/watch/server/bridge/watch-bridge.service";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

function fail(error: unknown, status = 400) {
    const message = error instanceof Error ? error.message : "Không xử lý được yêu cầu.";
    return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

        const body = await request.json().catch(() => ({}));
        const productId = String(body?.productId ?? "").trim();
        const unitCost = Number(body?.unitCost ?? 0);

        if (!productId) {
            return fail("Thiếu productId.");
        }

        if (!Number.isFinite(unitCost) || unitCost <= 0) {
            return fail("Giá mua lại phải lớn hơn 0.");
        }

        const result = await buyBackFromWatch({
            productId,
            unitCost,
            notes: body?.notes ?? null,
            customerId: body?.customerId ?? null,
        });

        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        return fail(error);
    }
}
