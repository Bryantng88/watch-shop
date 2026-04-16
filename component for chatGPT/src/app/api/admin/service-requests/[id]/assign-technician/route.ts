import { NextResponse } from "next/server";
import * as srService from "@/app/(admin)/admin/services/_server/service_request.service";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const serviceRequestId = String(params?.id || "").trim();
        if (!serviceRequestId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const body = await req.json().catch(() => ({}));
        const technicianId = String(body?.technicianId || "").trim();
        const note = body?.note ? String(body.note).trim() : null;

        if (!technicianId) return NextResponse.json({ error: "Missing technicianId" }, { status: 400 });

        const result = await srService.assignTechnicianForServiceRequest({
            serviceRequestId,
            technicianId,
            note,
        });

        return NextResponse.json({ item: result });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}
