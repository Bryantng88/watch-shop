import { NextResponse } from "next/server";
import { cancelAcquisition } from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const data = await cancelAcquisition(id);
        return NextResponse.json({ ok: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể hủy phiếu nhập" },
            { status: 400 }
        );
    }
}
