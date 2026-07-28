import { after, NextResponse } from "next/server";
import {
    updateTechnicalIssue,
    removeTechnicalIssue,
} from "@/domains/service/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
        const { id } = await context.params;
        const body = await req.json().catch(() => ({}));

        const item = await updateTechnicalIssue({
            id,
            actorId: actor.id,
            note: body.note,
            summary: body.summary,
            estimatedCost: body.estimatedCost,
            actualCost: body.actualCost,
            resolutionNote: body.resolutionNote,
            actionMode: body.actionMode,
            vendorId: body.vendorId,
            technicianId: body.technicianId,
            serviceCatalogId: body.serviceCatalogId,
            supplyCatalogId: body.supplyCatalogId,
            mechanicalPartCatalogId: body.mechanicalPartCatalogId,
            deferConsumers: (work) => after(work),
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Internal error" },
            { status: 500 }
        );
    }
}

export async function DELETE(_: Request, context: RouteContext) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
        const { id } = await context.params;
        const result = await removeTechnicalIssue(id);
        return NextResponse.json(result);
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Internal error" },
            { status: 500 }
        );
    }
}
