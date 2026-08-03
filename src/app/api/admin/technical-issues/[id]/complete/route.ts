import { after, NextRequest, NextResponse } from "next/server";

import { completeTechnicalIssue } from "@/domains/service/server/issue-board";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);

        const { id } = await params;
        const body = await request.json().catch(() => ({}));

        await completeTechnicalIssue({
            id,
            supplyCatalogId: body.supplyCatalogId,
            mechanicalPartCatalogId: body.mechanicalPartCatalogId,
            actualCost: body.actualCost,
            resolutionNote: body.resolutionNote,
            actorId: actor.id,
            deferConsumers: (work) => after(work),
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Không hoàn tất được issue.";
        return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
}
