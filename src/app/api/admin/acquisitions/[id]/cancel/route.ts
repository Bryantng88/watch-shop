import { NextResponse } from "next/server";
import { cancelAcquisition } from "@/old_files/Acquisition_server/acquisition.service";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Thiếu id phiếu nhập" }, { status: 400 });
        }

        const data = await cancelAcquisition(id);
        return NextResponse.json({ ok: true, data });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Không thể hủy phiếu" },
            { status: 500 }
        );
    }
}
