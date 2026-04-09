import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        {
            error: "Line AI draft đã bị tắt. Hệ thống chỉ chạy AI khi POST phiếu nhập.",
        },
        { status: 410 }
    );
}
