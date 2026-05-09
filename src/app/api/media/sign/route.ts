// src/app/api/media/sign/route.ts

import { NextRequest, NextResponse } from "next/server";

import { signMediaUrl } from "@/domains/media/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const key = String(req.nextUrl.searchParams.get("key") || "").trim();
        const asJson = req.nextUrl.searchParams.get("format") === "json";

        if (!key) {
            return NextResponse.json(
                { error: "Thiếu key." },
                { status: 400 }
            );
        }

        const result = await signMediaUrl({ key });

        if (asJson) {
            return NextResponse.json(result);
        }

        return NextResponse.redirect(result.url, {
            status: 302,
            headers: {
                "Cache-Control": "private, max-age=300",
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Không thể sign media.",
            },
            { status: 500 }
        );
    }
}