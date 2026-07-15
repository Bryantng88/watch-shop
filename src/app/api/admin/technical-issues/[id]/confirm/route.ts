import { NextResponse } from "next/server";
import { confirmTechnicalIssue } from "@/domains/service/server";

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
            summary: body.summary ?? null,
            note: body.note ?? null,
        });

        return NextResponse.json({ ok: true, item });
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Internal error" },
            { status: 500 }
        );
    }
}
