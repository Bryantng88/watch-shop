// src/app/api/media/browse/route.ts

import { NextRequest, NextResponse } from "next/server";

import { browseMediaFolder } from "@/domains/media/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        const result = await browseMediaFolder({
            profile: req.nextUrl.searchParams.get("profile"),
            prefix: req.nextUrl.searchParams.get("prefix"),
            maxKeys: Number(
                req.nextUrl.searchParams.get("maxKeys") ??
                req.nextUrl.searchParams.get("limit") ??
                1000
            ),
            continuationToken:
                req.nextUrl.searchParams.get("continuationToken") ||
                req.nextUrl.searchParams.get("cursor"),
        });

        return NextResponse.json(result, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Không thể duyệt thư mục ảnh",
            },
            { status: 500 }
        );
    }
}
