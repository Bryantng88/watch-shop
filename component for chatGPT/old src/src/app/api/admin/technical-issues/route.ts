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
            note: body.note,
            estimatedCost: body.estimatedCost,
            vendorId: body.vendorId,
            technicianId: body.technicianId,
            serviceCatalogId: body.serviceCatalogId,
            supplyCatalogId: body.supplyCatalogId,
            mechanicalPartCatalogId: body.mechanicalPartCatalogId,
            summary: body.summary,
        });

        return NextResponse.json({ ok: true, item });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Create technical issue failed" },
            { status: 500 }
        );
    }
}