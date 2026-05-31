import { NextResponse } from "next/server";
import { getTechnicalAssessmentPanel } from "@/domains/service/server";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const serviceRequestId = String(id || "").trim();

        if (!serviceRequestId) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const data = await getTechnicalAssessmentPanel(serviceRequestId);

        return NextResponse.json({
            ok: true,
            data,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error?.message ?? "Load technical panel failed" },
            { status: 500 }
        );
    }
}