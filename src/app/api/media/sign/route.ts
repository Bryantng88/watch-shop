// app/api/media/file/route.ts
import { NextRequest, NextResponse } from "next/server";
import { s3, S3_BUCKET } from "@/server/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key");
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
    const obj = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return new NextResponse(obj.Body as any, {
        headers: {
            "Content-Type": obj.ContentType ?? "image/*",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
