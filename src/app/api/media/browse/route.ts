// src/app/api/media/browse/route.ts

import { NextRequest, NextResponse } from "next/server";

import { browseMediaFolder } from "@/domains/media/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        const result = await browseMediaFolder({
            profile: req.nextUrl.searchParams.get("profile"),
            segment: req.nextUrl.searchParams.get("segment"),
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
        console.error("[api/media/browse]", {
            name: error?.name,
            message: error?.message,
            code: error?.code,
            causeName: error?.cause?.name,
            causeMessage: error?.cause?.message,
            causeCode: error?.cause?.code,
        });

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Không thể duyệt thư mục ảnh",
                code: error?.code,
                causeCode: error?.cause?.code,
            },
            { status: 500 }
        );
    }
}
