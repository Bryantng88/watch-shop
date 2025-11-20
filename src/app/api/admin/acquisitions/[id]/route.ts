import * as service from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";
import { NextResponse, NextRequest } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Body không hợp lệ (không phải JSON)" }, { status: 400 });
    }

    // Lấy id đúng từ params
    const { id } = params;

    // Gọi service với id đã lấy, và return về dạng Response
    try {
        const result = await service.updateAcquisitionWithItems(id, body);
        return NextResponse.json(result); // Đảm bảo trả về Response object
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Update failed" }, { status: 500 });
    }
}