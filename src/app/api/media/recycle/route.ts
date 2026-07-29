import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import {
    recycleMediaFiles,
    restoreRecycledMediaFiles,
} from "@/domains/media/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

const BodySchema = z.object({
    action: z.enum(["RECYCLE", "RESTORE"]),
    profile: z.string().optional(),
    segment: z.string().nullable().optional(),
    keys: z.array(z.string().min(1)).min(1).max(200),
    commandId: z.string().min(1),
});

function authUserId(auth: unknown) {
    if (!auth || typeof auth !== "object") return null;
    const value = auth as {
        id?: unknown;
        user?: { id?: unknown };
    };
    return String(value.user?.id ?? value.id ?? "").trim() || null;
}

export async function POST(request: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await request.json());
        const input = {
            profile: body.profile,
            segment: body.segment,
            keys: body.keys,
            commandId: body.commandId,
            requestedByUserId: authUserId(auth),
        };
        const result = body.action === "RESTORE"
            ? await restoreRecycledMediaFiles(input)
            : await recycleMediaFiles(input);
        return NextResponse.json({ ok: result.failed === 0, ...result });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: error instanceof Error
                    ? error.message
                    : "Không thể xử lý Recycle.",
            },
            { status: 400 },
        );
    }
}
