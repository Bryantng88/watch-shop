import { NextRequest, NextResponse } from "next/server";

import {
    createQuickIssueForActiveWatchService,
    getActiveWatchService,
    getOrCreateActiveWatchService,
} from "@/domains/service/server/watch-quick";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
function issueAreaLabel(area: unknown) {
    const key = String(area ?? "").trim().toUpperCase();

    const map: Record<string, string> = {
        GENERAL: "tổng quát",
        MOVEMENT: "máy",
        CASE: "vỏ",
        CRYSTAL: "kính",
        DIAL: "mặt số",
        CROWN: "núm",
        BRACELET: "dây",
    };

    return map[key] ?? "kỹ thuật";
}
function ok(data: unknown) {
    return NextResponse.json({ ok: true, data });
}

function fail(error: unknown, status = 400) {
    const message = error instanceof Error ? error.message : "Không xử lý được yêu cầu.";
    return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

        const productId = request.nextUrl.searchParams.get("productId");
        if (!productId) throw new Error("Missing productId");

        // Preview only: không tạo SR khi chỉ mở modal từ Watch.
        const data = await getActiveWatchService({ productId });
        return ok(data);
    } catch (error) {
        return fail(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

        const body = await request.json().catch(() => ({}));
        if (!body?.productId) throw new Error("Missing productId");

        // Giữ tương thích nếu nơi cũ còn gọi POST để mở modal.
        // Mặc định POST cũng chỉ preview, trừ khi gọi forceCreate rõ ràng.
        const data = body?.forceCreate
            ? await getOrCreateActiveWatchService({ productId: body.productId })
            : await getActiveWatchService({ productId: body.productId });

        return ok(data);
    } catch (error) {
        return fail(error);
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

        const body = await request.json().catch(() => ({}));
        if (!body?.productId) throw new Error("Missing productId");
        if (!body?.area) throw new Error("Missing issue area");

        const fallbackNote = `Issue ${issueAreaLabel(body.area)}`;
        const finalNote = String(body.note ?? "").trim() || fallbackNote;
        const finalSummary = String(body.summary ?? "").trim() || finalNote;

        const data = await createQuickIssueForActiveWatchService({
            productId: body.productId,
            serviceRequestId: body.serviceRequestId,
            area: body.area,
            summary: finalSummary,
            note: finalNote,
            issueType: body.issueType,
            priority: body.priority,
        });

        return ok(data);
    } catch (error) {
        return fail(error);
    }
}