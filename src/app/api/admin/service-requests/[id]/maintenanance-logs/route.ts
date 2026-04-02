import { prisma } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
    const { id } = await ctx.params;

    const logs = await prisma.maintenanceLogs.findMany({
        where: { serviceRequestId: id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
        ok: true,
        items: logs,
    });
}