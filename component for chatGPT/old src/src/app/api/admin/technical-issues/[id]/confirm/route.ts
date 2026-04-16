import { NextResponse } from "next/server";
import { confirmTechnicalIssue } from "@/app/(admin)/admin/services/_server/technical-issues.service";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const body = await req.json().catch(() => ({}));

        const item = await confirmTechnicalIssue({
            id,
            actorId: body.actorId ?? null,
            actorName: body.actorName ?? null,
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Internal error" },
            { status: 500 }
        );
    }
}