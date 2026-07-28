import { after, NextResponse } from "next/server";

import { cancelTechnicalIssue } from "@/domains/service/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
        const { id } = await params;
        const body = await req.json().catch(() => ({}));

        const data = await cancelTechnicalIssue(id, {
            reason: body?.reason || null,
            actorId: actor.id,
            deferConsumers: (work) => after(work),
        });

        return NextResponse.json({ ok: true, data });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Không thể hủy issue" },
            { status: 400 }
        );
    }
}
