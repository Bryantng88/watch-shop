import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const acquisitionSpecJobId = url.searchParams.get("jobId")?.trim() || "";
        const acquisitionItemId = url.searchParams.get("itemId")?.trim() || "";
        const take = Math.max(
            1,
            Math.min(Number(url.searchParams.get("take") ?? 200), 500)
        );

        const logs = await prisma.acquisitionSpecJobLog.findMany({
            where: {
                ...(acquisitionSpecJobId
                    ? { acquisitionSpecJobId }
                    : {}),
                ...(acquisitionItemId
                    ? { acquisitionItemId }
                    : {}),
            },
            orderBy: {
                createdAt: "desc",
            },
            take,
        });

        return NextResponse.json({
            ok: true,
            items: logs,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                ok: false,
                error: error?.message || "Không thể tải acquisition spec logs",
            },
            { status: 500 }
        );
    }
}