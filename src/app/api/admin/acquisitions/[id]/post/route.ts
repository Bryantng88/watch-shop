import { NextResponse } from "next/server";
import { postAcquisition } from "@/domains/acquisition/server/core/write/acquisition-write.service";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Thiếu id phiếu nhập" }, { status: 400 });
        }

        const data = await postAcquisition(id, "");
        return NextResponse.json({ ok: true, data });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Không thể duyệt phiếu" },
            { status: 500 }
        );
    }
}