import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/server/s3";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key")?.trim();

    if (!key) {
        return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    try {
        const obj = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
        if (!obj.Body) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        return new NextResponse(obj.Body as any, {
            headers: {
                "Content-Type": obj.ContentType ?? "application/octet-stream",
                "Content-Length": obj.ContentLength ? String(obj.ContentLength) : "",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("media-sign", error);
        return NextResponse.json({ error: "Cannot load file" }, { status: 404 });
    }
}
