import { after, NextResponse } from "next/server";
import { confirmTechnicalIssue } from "@/domains/service/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
        const { id } = await context.params;
        const body = await req.json().catch(() => ({}));

        const item = await confirmTechnicalIssue({
            id,
            actorId: actor.id,
            actorName: body.actorName ?? null,
            summary: body.summary ?? null,
            note: body.note ?? null,
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
