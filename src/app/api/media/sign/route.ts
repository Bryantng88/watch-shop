// src/app/api/media/sign/route.ts

import { NextRequest, NextResponse } from "next/server";

import { signMediaUrl } from "@/domains/media/server";
import { mediaStorage } from "@/domains/media/storage";

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

        if (asJson) {
            const result = await signMediaUrl({ key });
            return NextResponse.json(result);
        }

        const media = await mediaStorage.read(key);
        return new NextResponse(Buffer.from(media.bytes), {
            status: 200,
            headers: {
                "Content-Type": media.contentType || "application/octet-stream",
                "Content-Length": String(media.bytes.byteLength),
                "Content-Disposition": "inline",
                "Cache-Control": "private, max-age=300, must-revalidate",
                ...(media.etag ? { ETag: `"${media.etag}"` } : {}),
            },
        });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Không thể sign media.",
            },
            { status: 500 }
        );
    }
}

export async function HEAD(req: NextRequest) {
    try {
        const key = String(req.nextUrl.searchParams.get("key") || "").trim();
        if (!key) return new NextResponse(null, { status: 400 });
        const media = await mediaStorage.stat(key);
        if (!media) return new NextResponse(null, { status: 404 });
        return new NextResponse(null, {
            status: 200,
            headers: {
                "Content-Type": media.contentType || "application/octet-stream",
                ...(media.sizeBytes == null ? {} : { "Content-Length": String(media.sizeBytes) }),
                "Cache-Control": "private, max-age=300, must-revalidate",
                ...(media.etag ? { ETag: `"${media.etag}"` } : {}),
            },
        });
    } catch {
        return new NextResponse(null, { status: 500 });
    }
}
