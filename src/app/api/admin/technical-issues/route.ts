import { after, NextResponse } from "next/server";
import { createTechnicalIssue } from "@/domains/service/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST(req: Request) {
    try {
        const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
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
            actorUserId: actor.id,
            deferConsumers: (work) => after(work),
        });

        return NextResponse.json({ ok: true, item });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Create technical issue failed" },
            { status: 500 }
        );
    }
}
