import { NextResponse } from "next/server";
import { getListVendors as listVendor } from "@/app/(admin)/admin/vendors/_server/vendor.repo";

export async function GET() {
    try {
        const items = await listVendor();
        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error", items: [] }, { status: 500 });
    }
}
