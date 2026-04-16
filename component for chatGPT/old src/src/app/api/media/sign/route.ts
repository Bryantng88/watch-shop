import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/product-image-storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const rawKey = req.nextUrl.searchParams.get("key");
    const key = normalizeKey(rawKey);

    if (!key) {
        return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    try {
        const obj = await s3.send(
            new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
            })
        );

        if (!obj.Body) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        return new NextResponse(obj.Body as any, {
            headers: {
                "Content-Type": obj.ContentType ?? "image/*",
                "Cache-Control": "public, max-age=3600",
                "X-Resolved-Key": key,
            },
        });
    } catch (error) {
        console.error("media-sign error", { key, error });
        return NextResponse.json({ error: "File not found", key }, { status: 404 });
    }
}
