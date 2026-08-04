import { after, NextResponse } from "next/server";
import { startTechnicalIssue } from "@/domains/service/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const actor = await requirePermission(PERMISSIONS.SERVICE_UPDATE);
        const { id } = await context.params;
        const body = await req.json().catch(() => ({}));

        const item = await startTechnicalIssue({
            id,
            actorId: actor.id,
            actorName: body.actorName ?? null,
            technicalDetailCatalogId: body.technicalDetailCatalogId ?? null,
            actionMode: body.actionMode ?? "INTERNAL",
            vendorId: body.vendorId ?? null,
            deferConsumers: (work) => after(work),
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Internal error" },
            { status: 500 },
        );
    }
}
