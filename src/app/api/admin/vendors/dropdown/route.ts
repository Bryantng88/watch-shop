// src/app/api/admin/vendors/dropdown/route.ts
import { NextResponse } from "next/server";
import * as srService from "@/app/(admin)/admin/services/_server/service_request.service";

export async function GET() {
    try {
        const items = await srService.getVendorDropdown();
        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}
