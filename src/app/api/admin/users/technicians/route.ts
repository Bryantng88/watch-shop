import { NextResponse } from "next/server";
import { getTechnicianOptions } from "@/app/(admin)/admin/services/_server/service_request.service";


export async function GET() {
    try {
        const items = await getTechnicianOptions();
        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error", items: [] }, { status: 500 });
    }
}
