import { NextRequest, NextResponse } from "next/server";
import {
    type MediaProfile,
    getProfileRoot,
    normalizeKey,
    sanitizeBrowsePrefix,
} from "@/server/lib/product-image-storage";
import { browseMediaIndex } from "@/server/lib/media-index";

export const dynamic = "force-dynamic";

function getProfile(value: string | null): MediaProfile {
    if (value === "edit") return "edit";
    if (value === "sold") return "sold";
    if (value === "storefront-active") return "storefront-active";
    if (value === "storefront-chosen") return "storefront-chosen";
    return "inline";
}

export async function GET(req: NextRequest) {
    const profile = getProfile(req.nextUrl.searchParams.get("profile"));
    const root = normalizeKey(getProfileRoot(profile));
    const requestedPrefix = req.nextUrl.searchParams.get("prefix");
    const prefix = sanitizeBrowsePrefix(requestedPrefix, profile) || root;

    const rawLimit = Number(req.nextUrl.searchParams.get("limit") || 48);
    const limit = Math.min(Math.max(rawLimit, 12), 96);
    const cursor = req.nextUrl.searchParams.get("cursor");

    try {
        const result = await browseMediaIndex({
            prefix,
            limit,
            cursor,
        });

        return NextResponse.json({
            profile,
            root,
            prefix,
            folders: result.folders,
            files: result.files,
            totalCount: result.totalCount,
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
        });
    } catch (error: any) {
        console.error("media-browse error", { profile, root, prefix, error });

        return NextResponse.json(
            { error: error?.message || "Không thể duyệt thư mục ảnh" },
            { status: 500 }
        );
    }
}