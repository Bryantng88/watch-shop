import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command, ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/server/s3";

const PUBLIC_BASE =
    process.env.S3_PUBLIC_BASE // ví dụ: https://longnd.myqnapcloud.com:8010/watch-shop
    ?? `${process.env.S3_ENDPOINT}/${S3_BUCKET}`; // fallback

const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const prefix = (url.searchParams.get("prefix") ?? "").replace(/^\/+/, ""); // ví dụ: "watches/rolex/"
    const token = url.searchParams.get("token") ?? undefined;

    const out = await s3.send(new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: prefix || undefined,
        Delimiter: "/",                  // tách "thư mục"
        ContinuationToken: token,
        MaxKeys: 100,
    }));


    const folders = (out.CommonPrefixes ?? [])
        .map(p => p.Prefix!)
        .filter(p => !p.includes(".@__thumb") && !p.startsWith("._"))
        .map(prefix => ({ prefix }));

    // Tạo URL ảnh an toàn + lọc file ảnh
    const files = (out.Contents ?? [])
        .filter(o => o.Key && o.Key !== prefix)               // bỏ chính thư mục
        .map(o => o.Key!)
        .filter(k => !k.endsWith("/"))                        // bỏ “thư mục”
        .filter(k => !k.includes(".@__thumb") && !k.startsWith("._"))
        .filter(k => IMG_EXT.test(k))                         // chỉ hiện ảnh
        .map(k => {
            // encode từng segment để tránh lỗi khoảng trắng, #, ?
            const keyEscaped = k.split("/").map(encodeURIComponent).join("/");
            return {
                key: k,
                url: `${PUBLIC_BASE}/${keyEscaped}`,
            };
        });

    return NextResponse.json({
        prefix,
        folders,
        files,
        nextToken: out.IsTruncated ? out.NextContinuationToken : null,
    });
}
