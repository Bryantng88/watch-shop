import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command, GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/server/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PUBLIC_BASE =
    process.env.S3_PUBLIC_BASE // ví dụ: https://longnd.myqnapcloud.com:8010/watch-shop
    ?? `${process.env.S3_ENDPOINT}/${S3_BUCKET}`; // fallback

const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
// Chỉ cho phép duyệt trong thư mục gốc nhất định để tránh lộ dữ liệu khác
const ALLOWED_ROOT = process.env.S3_BROWSE_ROOT ?? ""; // ví dụ "products/"
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        let prefix = (url.searchParams.get("prefix") ?? "").replace(/^\/+/, "");
        const token = url.searchParams.get("token") ?? undefined;

        // chặn “traversal”: chỉ cho phép trong ALLOWED_ROOT
        if (ALLOWED_ROOT && !prefix.startsWith(ALLOWED_ROOT)) {
            prefix = ALLOWED_ROOT;
        }

        const out = await s3.send(new ListObjectsV2Command({
            Bucket: S3_BUCKET,
            Prefix: prefix || undefined,
            Delimiter: "/",
            ContinuationToken: token,
            MaxKeys: 100,
        }));

        const folders = (out.CommonPrefixes ?? [])
            .map(p => p.Prefix!)
            .filter(p => !p.includes(".@__thumb") && !p.startsWith("._"))
            .map(prefix => ({ prefix }));

        // lọc key ảnh và sinh presigned url (hết hạn sau 10 phút)
        const keys = (out.Contents ?? [])
            .map(o => o.Key!)
            .filter(k => k && k !== prefix && !k.endsWith("/"))
            .filter(k => !k.includes(".@__thumb") && !k.startsWith("._"))
            .filter(k => IMG_EXT.test(k));

        const files = await Promise.all(
            keys.map(async (key) => {
                const url = await getSignedUrl(
                    s3,
                    new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
                    { expiresIn: 600 } // 10 phút
                );
                return { key, url };
            })
        );

        return NextResponse.json(
            {
                prefix,
                folders,
                files,
                nextToken: out.IsTruncated ? out.NextContinuationToken : null,
            },
            {
                // cho phép cache phía browser 1 phút để giảm tải
                headers: {
                    "Cache-Control": "private, max-age=60",
                },
            }
        );
    } catch (err) {
        console.error("image-browsing", err);
        return NextResponse.json({ error: "Browse failed" }, { status: 500 });
    }
}

