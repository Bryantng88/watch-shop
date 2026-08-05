import { NextResponse } from "next/server";

import { updateAcquisitionEditApplication } from "@/domains/acquisition/application/update-acquisition-edit.application";
import { getAcquisitionEditDetail } from "@/domains/acquisition/server/acquisition-edit.service";
import { authorizeAcquisitionAccess } from "@/domains/acquisition/server";
import { authorizeAcquisitionScope } from "@/domains/acquisition/server/acquisition-access.service";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await ctx.params;
        const access = await authorizeAcquisitionAccess(id, "VIEW");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
        const detail = await getAcquisitionEditDetail(id);

        if (!detail) {
            return NextResponse.json({ error: "Không tìm thấy phiếu nhập." }, { status: 404 });
        }

        return NextResponse.json(detail);
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Không thể tải phiếu nhập." },
            { status: 400 },
        );
    }
}

export async function PUT(
    req: Request,
    ctx: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await ctx.params;
        const access = await authorizeAcquisitionAccess(id, "UPDATE");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
        const body = await req.json().catch(() => ({}));
        const targetItems = Array.isArray(body?.items) ? body.items : [];
        const targetAccess = await authorizeAcquisitionScope(targetItems.map((item: { productType?: unknown }) => item.productType), "UPDATE");
        if (!targetAccess.ok) return NextResponse.json({ error: "Forbidden" }, { status: targetAccess.status });

        const result = await updateAcquisitionEditApplication({
            acquisitionId: id,
            notes: body?.notes ?? null,
            items: targetItems,
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Không thể cập nhật phiếu nhập." },
            { status: 400 },
        );
    }
}
