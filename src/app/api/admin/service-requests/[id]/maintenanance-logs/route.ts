import { NextResponse } from "next/server";
import * as maintenanceService from "@/domains/service/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
    const { id } = await ctx.params;
    const items = await maintenanceService.getMaintenanceLogsByServiceRequest(id);

    return NextResponse.json({
        ok: true,
        items,
    });
}
