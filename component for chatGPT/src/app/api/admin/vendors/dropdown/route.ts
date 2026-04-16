import { NextResponse } from "next/server";
import { listVendor } from "@/features/vendors/server/vendor.repo";

export async function GET() {
    try {
        const items = await listVendor();
        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error", items: [] }, { status: 500 });
    }
}
