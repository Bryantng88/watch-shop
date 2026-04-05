import { NextResponse } from "next/server";
import { createTechnicalIssue } from "@/app/(admin)/admin/services/_server/technical-issues.service";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const item = await createTechnicalIssue({
            assessmentId: body.assessmentId,
            serviceRequestId: body.serviceRequestId,
            area: body.area,
            issueType: body.issueType,
            actionMode: body.actionMode,
            note: body.note ?? null,
            summary: body.summary ?? null,
            estimatedCost: body.estimatedCost ?? null,
            vendorId: body.vendorId ?? null,
            technicianId: body.technicianId ?? null,
            serviceCatalogId: body.serviceCatalogId ?? null,
            supplyCatalogId: body.supplyCatalogId ?? null,
            mechanicalPartCatalogId: body.mechanicalPartCatalogId ?? null,
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Internal error" },
            { status: 500 }
        );
    }
}