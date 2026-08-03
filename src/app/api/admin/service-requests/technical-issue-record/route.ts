import { NextResponse } from "next/server";
import { createMaintenanceRecordForServiceRequest } from "@/domains/service/server";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const item = await createMaintenanceRecordForServiceRequest({
            serviceRequestId: body.id,
            notes: body.notes ?? null,
            diagnosis: body.diagnosis ?? null,
            workSummary: body.workSummary ?? null,
            totalCost: body.totalCost ?? null,
            servicedAt: body.servicedAt ?? null,
            serviceCatalogId: body.serviceCatalogId ?? null,
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Internal error" },
            { status: 500 }
        );
    }
}
