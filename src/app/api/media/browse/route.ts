import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "@/server/s3";

const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

function normalizePrefix(value: string | null | undefined) {
    return String(value ?? "").trim().replace(/^\/+/, "").replace(/\/+$/, "");
}

function withTrailingSlash(value: string) {
    const v = normalizePrefix(value);
    return v ? `${v}/` : "";
}

function getProfileRoot(profile: string) {
    switch (profile) {
        case "inline":
            return normalizePrefix(process.env.PRODUCT_INLINE_PREFIX);
        case "edit":
            return normalizePrefix(process.env.PRODUCT_EDIT_PREFIX);
        case "sold":
            return normalizePrefix(process.env.PRODUCT_SOLD_PREFIX);
        default:
            return "";
    }
}

function clampPrefix(requestedPrefix: string, profileRoot: string, allowedRoot: string) {
    const requested = normalizePrefix(requestedPrefix);
    const profile = normalizePrefix(profileRoot);
    const allowed = normalizePrefix(allowedRoot);

    if (profile) {
        if (!requested) return profile;
        if (requested === profile || requested.startsWith(withTrailingSlash(profile))) return requested;
        return profile;
    }

    if (allowed) {
        if (!requested) return allowed;
        if (requested === allowed || requested.startsWith(withTrailingSlash(allowed))) return requested;
        return allowed;
    }

    return requested;
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const profile = String(url.searchParams.get("profile") ?? "").trim().toLowerCase();
        const requestedPrefix = url.searchParams.get("prefix") ?? "";
        const token = url.searchParams.get("token") ?? undefined;

        const allowedRoot = normalizePrefix(process.env.S3_BROWSE_ROOT);
        const profileRoot = getProfileRoot(profile);
        const prefix = clampPrefix(requestedPrefix, profileRoot, allowedRoot);

        const out = await s3.send(
            new ListObjectsV2Command({
                Bucket: S3_BUCKET,
                Prefix: prefix ? withTrailingSlash(prefix) : undefined,
                Delimiter: "/",
                ContinuationToken: token,
                MaxKeys: 100,
            })
        );

        const folders = (out.CommonPrefixes ?? [])
            .map((p) => p.Prefix || "")
            .filter((p) => p)
            .filter((p) => !p.includes(".@__thumb") && !p.startsWith("._"))
            .map((p) => ({ prefix: p.replace(/\/+$/, "") }));

        const keys = (out.Contents ?? [])
            .map((o) => o.Key || "")
            .filter((k) => k)
            .filter((k) => !k.endsWith("/"))
            .filter((k) => !k.includes(".@__thumb") && !k.startsWith("._"))
            .filter((k) => IMG_EXT.test(k));

        const files = await Promise.all(
            keys.map(async (key) => {
                const signed = await getSignedUrl(
                    s3,
                    new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }),
                    { expiresIn: 600 }
                );
                return { key, url: signed };
            })
        );

        return NextResponse.json(
            {
                profile,
                rootPrefix: profileRoot || allowedRoot || "",
                prefix,
                folders,
                files,
                nextToken: out.IsTruncated ? out.NextContinuationToken : null,
            },
            {
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
