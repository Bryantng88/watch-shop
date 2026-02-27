import { NextResponse } from "next/server";
import * as maintenanceService from "@/app/(admin)/admin/services/_server/maintenance.service";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const serviceRequestId = String(params?.id || "").trim();
        if (!serviceRequestId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const body = await req.json().catch(() => ({}));
        const vendorId = String(body?.vendorId || "").trim();
        const reason = body?.reason ? String(body.reason).trim() : null;

        if (!vendorId) return NextResponse.json({ error: "Missing vendorId" }, { status: 400 });

        const result = await maintenanceService.assignVendorForServiceRequest({
            serviceRequestId,
            vendorId,
            reason,
            setInProgress: true,
        });

        return NextResponse.json({ item: result });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}