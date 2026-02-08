// src/app/api/admin/service-requests/bulk-assign-vendor/route.ts
import { NextResponse } from "next/server";
import * as srService from "@/app/(admin)/admin/services/_server/service_request.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const ids = Array.isArray(body.ids) ? body.ids : [];
        const vendorId = body.vendorId ? String(body.vendorId) : null;

        if (!ids.length) {
            return NextResponse.json({ error: "Missing ids" }, { status: 400 });
        }

        const result = await srService.bulkAssignVendor({ ids, vendorId });
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}
