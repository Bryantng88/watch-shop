import { NextResponse } from "next/server";
import * as maintenanceService from "@/app/(admin)/admin/services/_server/maintenance.service";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = String(params.id || "").trim();
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const panel = await maintenanceService.getMaintenancePanelByServiceRequest(id);
        return NextResponse.json({
            sr: panel?.sr ?? null,
            items: panel?.logs ?? [],
            logs: panel?.logs ?? [],
            serviceCatalogs: panel?.serviceCatalogs ?? [],
        });
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
            diagnosis: body.diagnosis ?? null,
            workSummary: body.workSummary ?? null,
            processingMode: body.processingMode ?? null,
            serviceCatalogId: body.serviceCatalogId ?? null,
            imageFileKey: body.imageFileKey ?? null,
            servicedAt: body.servicedAt ? new Date(body.servicedAt) : null,
            totalCost: body.totalCost ?? null,
            currency: body.currency ?? null,
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
