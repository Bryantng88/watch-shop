import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/server/s3";
import {
    type MediaProfile,
    getProfileRoot,
    normalizeKey,
    sanitizeBrowsePrefix,
} from "@/server/lib/product-image-storage";

export const dynamic = "force-dynamic";

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

function getProfile(value: string | null): MediaProfile {
    if (value === "edit") return "edit";
    if (value === "sold") return "sold";
    if (value === "storefront-active") return "storefront-active";
    if (value === "storefront-chosen") return "storefront-chosen";
    return "inline";
}

function nameFromKey(key: string) {
    const normalized = normalizeKey(key);
    const parts = normalized.split("/");
    return parts[parts.length - 1] || "";
}

function shouldHideName(name: string) {
    return !name || name.startsWith("@") || name.startsWith(".") || name === "Thumbs.db";
}

export async function GET(req: NextRequest) {
    const profile = getProfile(req.nextUrl.searchParams.get("profile"));
    const root = getProfileRoot(profile);
    const prefix = sanitizeBrowsePrefix(req.nextUrl.searchParams.get("prefix"), profile);

    try {
        const result = await s3.send(
            new ListObjectsV2Command({
                Bucket: S3_BUCKET,
                Prefix: prefix ? `${prefix}/` : undefined,
                Delimiter: "/",
                MaxKeys: 1000,
            })
        );

        const folders = (result.CommonPrefixes || [])
            .map((item) => normalizeKey(item.Prefix))
            .filter(Boolean)
            .filter((item) => item !== prefix)
            .filter((item) => !shouldHideName(nameFromKey(item)))
            .map((item) => ({ prefix: item }))
            .sort((a, b) => a.prefix.localeCompare(b.prefix));

        const dedup = new Set<string>();
        const files = (result.Contents || [])
            .map((item) => ({
                key: normalizeKey(item.Key),
                lastModified: item.LastModified?.getTime() ?? 0,
            }))
            .filter((item) => item.key && item.key !== prefix && item.key !== `${prefix}/`)
            .filter((item) => !shouldHideName(nameFromKey(item.key)))
            .filter((item) => IMAGE_EXT_RE.test(item.key))
            .filter((item) => {
                if (dedup.has(item.key)) return false;
                dedup.add(item.key);
                return true;
            })
            .sort((a, b) => b.lastModified - a.lastModified)
            .map((item) => ({
                key: item.key,
                url: `/api/media/sign?key=${encodeURIComponent(item.key)}`,
            }));

        return NextResponse.json({
            profile,
            root,
            prefix,
            folders,
            files,
        });
    } catch (error: any) {
        console.error("media-browse error", { profile, root, prefix, error });
        return NextResponse.json(
            { error: error?.message || "Không thể duyệt thư mục ảnh" },
            { status: 500 }
        );
    }
}