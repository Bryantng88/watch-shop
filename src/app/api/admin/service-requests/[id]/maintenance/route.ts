import { NextResponse } from "next/server";
import * as maintenanceService from "@/app/(admin)/admin/services/_server/maintenance.service";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = String(params.id || "").trim();
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const items = await maintenanceService.getMaintenanceLogsByServiceRequest(id);
        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}
