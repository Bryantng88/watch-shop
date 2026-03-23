import { NextRequest, NextResponse } from "next/server";
import { postAcquisition } from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let body: any = {};

    try {
        body = await req.json();
    } catch { }

    try {
        const data = await postAcquisition(id, body?.vendor ?? body?.vendorName ?? "");
        return NextResponse.json({ ok: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể duyệt phiếu nhập" },
            { status: 400 }
        );
    }
}
