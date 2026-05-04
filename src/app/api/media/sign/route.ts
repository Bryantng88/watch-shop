import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { s3, S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/product-image-storage";

export const dynamic = "force-dynamic";

function getFileNameFromKey(key: string) {
    return key.split("/").pop() || "image.jpg";
}

function safeAsciiFileName(fileName: string) {
    return fileName.replace(/[^\w.\-()[\] ]+/g, "_");
}

function toJpegFileName(fileName: string) {
    return safeAsciiFileName(fileName).replace(/\.[^.]+$/i, ".jpg");
}

function getContentTypeFromFileName(fileName: string) {
    if (/\.(jpe?g)$/i.test(fileName)) return "image/jpeg";
    if (/\.png$/i.test(fileName)) return "image/png";
    if (/\.webp$/i.test(fileName)) return "image/webp";
    if (/\.gif$/i.test(fileName)) return "image/gif";
    if (/\.avif$/i.test(fileName)) return "image/avif";
    return "application/octet-stream";
}

async function streamToBuffer(body: any) {
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

        const originalFileName = getFileNameFromKey(key);

        if (format === "jpeg" || format === "jpg") {
            const inputBuffer = await streamToBuffer(obj.Body);
            const jpegBuffer = await sharp(inputBuffer)
                .rotate()
                .jpeg({
                    quality: 92,
                    mozjpeg: true,
                })
                .toBuffer();

            const fileName = toJpegFileName(originalFileName);

            return new NextResponse(jpegBuffer, {
                headers: {
                    "Content-Type": "image/jpeg",
                    "Content-Disposition": `${download ? "attachment" : "inline"
                        }; filename="${fileName}"`,
                    "Cache-Control": "public, max-age=3600",
                    "X-Resolved-Key": key,
                    "X-Converted-Format": "jpeg",
                },
            });
        }

        const fileName = safeAsciiFileName(originalFileName);
        const contentType =
            obj.ContentType || getContentTypeFromFileName(fileName);

        return new NextResponse(obj.Body as any, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `${download ? "attachment" : "inline"
                    }; filename="${fileName}"`,
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