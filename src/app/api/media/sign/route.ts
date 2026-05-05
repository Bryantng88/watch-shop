import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { s3, S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/product-image-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getFileNameFromKey(key: string) {
    return key.split("/").pop() || "image.jpg";
}

function safeFileName(fileName: string) {
    return fileName.replace(/[^\w.\-()[\] ]+/g, "_");
}

function toJpegFileName(fileName: string) {
    const safe = safeFileName(fileName);
    return safe.replace(/\.[^.]+$/i, ".jpg");
}

async function bodyToBuffer(body: any) {
    const chunks: Buffer[] = [];

    for await (const chunk of body) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
}

export async function GET(req: NextRequest) {
    const rawKey = req.nextUrl.searchParams.get("key");
    const key = normalizeKey(rawKey);

    const download = req.nextUrl.searchParams.get("download") === "1";
    const format = req.nextUrl.searchParams.get("format");
    const shouldConvertToJpeg = download || format === "jpeg" || format === "jpg";

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
            return NextResponse.json(
                { error: "File not found", key },
                { status: 404 }
            );
        }

        const originalFileName = getFileNameFromKey(key);

        if (shouldConvertToJpeg) {
            const inputBuffer = await bodyToBuffer(obj.Body);

            const jpegBuffer = await sharp(inputBuffer, {
                failOn: "none",
            })
                .rotate()
                .jpeg({
                    quality: 92,
                    mozjpeg: true,
                })
                .toBuffer();

            const fileName = toJpegFileName(originalFileName);

            return new Response(new Uint8Array(jpegBuffer), {
                headers: {
                    "Content-Type": "image/jpeg",
                    "Content-Disposition": `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                    "Cache-Control": "no-store, no-cache, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                    "X-Resolved-Key": key,
                    "X-Converted-Format": "jpeg",
                },
            });
        }

        return new NextResponse(obj.Body as any, {
            headers: {
                "Content-Type": obj.ContentType ?? "application/octet-stream",
                "Content-Disposition": `inline; filename="${safeFileName(originalFileName)}"`,
                "Cache-Control": "public, max-age=3600",
                "X-Resolved-Key": key,
            },
        });
    } catch (error) {
        console.error("media-sign error", { key, error });

        return NextResponse.json(
            { error: "File not found", key },
            { status: 404 }
        );
    }
}