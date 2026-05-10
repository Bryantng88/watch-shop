import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { repairInlineChosenRoot } from "@/domains/media/server";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
    dryRun: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.MEDIA_VIEW);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await req.json().catch(() => ({})));

        const result = await repairInlineChosenRoot({
            dryRun: body.dryRun ?? true,
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể repair inline root.",
            },
            { status: 500 }
        );
    }
}