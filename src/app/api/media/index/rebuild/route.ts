import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import {
    type MediaProfile,
    getProfileRoot,
    normalizeKey,
} from "@/server/lib/product-image-storage";
import {
    syncMediaIndexByPrefix,
    syncMediaIndexByProfile,
} from "@/server/lib/media-index";

export const dynamic = "force-dynamic";

function getProfile(value: string | null): MediaProfile | null {
    if (value === "edit") return "edit";
    if (value === "sold") return "sold";
    if (value === "storefront-active") return "storefront-active";
    if (value === "storefront-chosen") return "storefront-chosen";
    if (value === "inline") return "inline";
    return null;
}

export async function POST(req: NextRequest) {
    //const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    //if (auth instanceof Response) return auth;

    try {
        const body = await req.json().catch(() => ({}));
        const profile = getProfile(
            typeof body?.profile === "string" ? body.profile : null
        );

        const rawPrefix =
            typeof body?.prefix === "string" ? normalizeKey(body.prefix) : "";

        if (profile) {
            const result = await syncMediaIndexByProfile(profile);

            return NextResponse.json({
                success: true,
                mode: "profile",
                profile,
                root: normalizeKey(getProfileRoot(profile)),
                count: result.count,
            });
        }

        if (rawPrefix) {
            const result = await syncMediaIndexByPrefix(rawPrefix);

            return NextResponse.json({
                success: true,
                mode: "prefix",
                root: result.root,
                count: result.count,
            });
        }

        return NextResponse.json(
            { error: "Thiếu profile hoặc prefix để rebuild index" },
            { status: 400 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không rebuild được media index" },
            { status: 500 }
        );
    }
}