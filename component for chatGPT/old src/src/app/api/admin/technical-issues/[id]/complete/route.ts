import { NextResponse } from "next/server";
import { completeTechnicalIssue } from "@/app/(admin)/admin/services/_server/technical-issues.service";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json().catch(() => ({}));

        const item = await completeTechnicalIssue({
            id,
            actorName: body.actorName ?? null,
            actualCost: body.actualCost ?? null,
            resolutionNote: body.resolutionNote ?? null,
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Internal error" },
            { status: 500 }
        );
    }
}