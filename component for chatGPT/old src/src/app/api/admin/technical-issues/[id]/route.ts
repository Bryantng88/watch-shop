import { NextResponse } from "next/server";
import {
    updateTechnicalIssue,
    removeTechnicalIssue,
} from "@/app/(admin)/admin/services/_server/technical-issues.service";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json().catch(() => ({}));

        const item = await updateTechnicalIssue({
            id,
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
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Internal error" },
            { status: 500 }
        );
    }
}

export async function DELETE(_: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const result = await removeTechnicalIssue(id);
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Internal error" },
            { status: 500 }
        );
    }
}