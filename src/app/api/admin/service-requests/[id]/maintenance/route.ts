import { NextResponse } from "next/server";
import * as maintenanceService from "@/app/(admin)/admin/services/_server/maintenance.service";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = String(params.id || "").trim();
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const items = await maintenanceService.getMaintenanceLogsByServiceRequest(id);
        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const serviceRequestId = String(params?.id || "").trim();
        if (!serviceRequestId) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));

        const created = await maintenanceService.createMaintenanceLogForServiceRequest({
            serviceRequestId,
            vendorId: body.vendorId ?? null,
            notes: body.notes ?? null,
            servicedAt: body.servicedAt ? new Date(body.servicedAt) : null,
            totalCost: body.totalCost ?? null,
            currency: body.currency ?? null,

            // optional (nếu bạn muốn set payment method/status từ UI)
            paymentMethod: body.paymentMethod ?? null,
            paymentStatus: body.paymentStatus ?? null,
            paymentType: body.paymentType ?? null,
            paymentPurpose: body.paymentPurpose ?? null,
        });

        return NextResponse.json({ item: created });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}