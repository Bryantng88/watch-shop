import { NextRequest, NextResponse } from "next/server";
import { postAcquisition } from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
    }

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Thiếu id phiếu nhập" }, { status: 400 });

    // Chỉ cho phép chuyển sang POSTED (bảo vệ thêm nếu cần)
    if (body.status !== "POSTED") {
        return NextResponse.json({ error: "Chỉ cho phép chuyển sang POSTED" }, { status: 400 });
    }

    try {
        const updated = await postAcquisition(id)

        return NextResponse.json({ ok: true, data: updated });
    } catch (e) {
        return NextResponse.json({ error: "Không thể cập nhật trạng thái", detail: String(e) }, { status: 500 });
    }
}
