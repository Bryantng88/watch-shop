import { NextResponse } from "next/server";
import { completeServiceRequestById } from "@/app/(admin)/admin/services/_server/technical_assessment.serivce";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await completeServiceRequestById(id);
        return NextResponse.json({ ok: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể đóng service request" },
            { status: 400 }
        );
    }
}