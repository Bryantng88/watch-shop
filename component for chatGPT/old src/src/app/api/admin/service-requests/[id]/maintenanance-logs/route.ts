import { NextResponse } from "next/server";
import * as maintenanceService from "@/app/(admin)/admin/services/_server/maintenance.service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
    const { id } = await ctx.params;
    const items = await maintenanceService.getMaintenanceLogsByServiceRequest(id);

    return NextResponse.json({
        ok: true,
        items,
    });
}
