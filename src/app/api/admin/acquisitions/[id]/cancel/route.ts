import { NextResponse } from "next/server";

import { cancelAcquisitionApplication } from "@/domains/acquisition/application";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Thiếu id phiếu nhập" },
                { status: 400 }
            );
        }

        const data = await cancelAcquisitionApplication({ acquisitionId: id });

        return NextResponse.json({ ok: true, data });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Không thể hủy phiếu" },
            { status: 500 }
        );
    }
}