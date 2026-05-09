import { NextRequest, NextResponse } from "next/server";

import { moveMediaFile } from "@/domains/media/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const fromKey = String(
            body?.fromKey || body?.key || ""
        ).trim();

        const toKey = String(
            body?.toKey || ""
        ).trim();

        if (!fromKey || !toKey) {
            return NextResponse.json(
                {
                    error: "Thiếu fromKey hoặc toKey.",
                },
                { status: 400 }
            );
        }

        const result = await moveMediaFile({
            fromKey,
            toKey,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            {
                error:
                    error?.message ||
                    "Không thể move media.",
            },
            { status: 500 }
        );
    }
}