import { NextResponse } from "next/server";
import * as srService from "@/app/(admin)/admin/services/_server/service_request.service";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const ids = Array.isArray(body?.ids) ? body.ids : [];
        const technicianId = body?.technicianId ? String(body.technicianId) : null;
        const note = body?.note ? String(body.note) : null;

        if (!ids.length) {
            return NextResponse.json({ error: "Missing ids" }, { status: 400 });
        }
        if (!technicianId) {
            return NextResponse.json({ error: "Missing technicianId" }, { status: 400 });
        }

        const result = await srService.bulkAssignTechnicianAndCreateMaintenance({ ids, technicianId, note });
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}
