import { NextResponse } from "next/server";
import * as maintenanceService from "@/app/(admin)/admin/services/_server/maintenance.service";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const serviceRequestId = String(params?.id || "").trim();
        if (!serviceRequestId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const body = await req.json().catch(() => ({}));
        const vendorId = String(body?.vendorId || "").trim();
        const reason = body?.reason ? String(body.reason).trim() : null;
        const notes = body?.notes ? String(body.notes).trim() : null;

        if (!vendorId) return NextResponse.json({ error: "Missing vendorId" }, { status: 400 });

        const result = await maintenanceService.assignVendorForServiceRequest({
            serviceRequestId,
            vendorId,
            reason,
            notes,
            servicedAt: body?.servicedAt ? new Date(body.servicedAt) : null,
            totalCost: body?.totalCost ?? null,
            currency: body?.currency ?? null,
            paymentMethod: body?.paymentMethod ?? null,
            paymentStatus: body?.paymentStatus ?? null,
            paymentType: body?.paymentType ?? null,
            paymentPurpose: body?.paymentPurpose ?? null,
            setInProgress: true,
        });

        return NextResponse.json({ item: result });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}
