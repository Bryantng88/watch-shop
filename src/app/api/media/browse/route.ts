import { NextRequest, NextResponse } from "next/server";
import { browseMediaFolder } from "@/domains/media/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const result = await browseMediaFolder({
            profile: req.nextUrl.searchParams.get("profile"),
            prefix: req.nextUrl.searchParams.get("prefix"),
            maxKeys: Number(req.nextUrl.searchParams.get("maxKeys") ?? 1000),
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || "Không thể duyệt thư mục ảnh" },
            { status: 500 }
        );
    }
}