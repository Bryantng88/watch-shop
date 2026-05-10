// src/app/api/media/batches/latest/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getLatestActiveBatchPrefix } from "@/domains/media/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest) {
    try {
        const result = await getLatestActiveBatchPrefix();

        return NextResponse.json(result, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể lấy batch mới nhất.",
            },
            { status: 500 }
        );
    }
}
