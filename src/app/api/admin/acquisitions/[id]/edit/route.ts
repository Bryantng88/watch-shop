import { NextResponse } from "next/server";

import { updateAcquisitionEditApplication } from "@/domains/acquisition/application/update-acquisition-edit.application";
import { getAcquisitionEditDetail } from "@/domains/acquisition/server/acquisition-edit.service";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await ctx.params;
        const detail = await getAcquisitionEditDetail(id);

        if (!detail) {
            return NextResponse.json({ error: "Không tìm thấy phiếu nhập." }, { status: 404 });
        }

        return NextResponse.json(detail);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể tải phiếu nhập." },
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
        const body = await req.json().catch(() => ({}));

        const result = await updateAcquisitionEditApplication({
            acquisitionId: id,
            notes: body?.notes ?? null,
            items: Array.isArray(body?.items) ? body.items : [],
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể cập nhật phiếu nhập." },
            { status: 400 },
        );
    }
}
