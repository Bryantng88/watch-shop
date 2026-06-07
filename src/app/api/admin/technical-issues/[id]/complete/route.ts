import { NextRequest, NextResponse } from "next/server";

import { completeTechnicalIssue } from "@/domains/service/server/issue-board";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

        const { id } = await params;
        const body = await request.json().catch(() => ({}));

        await completeTechnicalIssue({
            id,
            technicalDetailCatalogId: body.technicalDetailCatalogId,
            supplyCatalogId: body.supplyCatalogId,
            mechanicalPartCatalogId: body.mechanicalPartCatalogId,
            actionMode: body.actionMode,
            vendorId: body.vendorId,
            actualCost: body.actualCost,
            resolutionNote: body.resolutionNote,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Không hoàn tất được issue.";
        return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
}
