import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { prepareAcquisitionInlineImages } from "@/app/(admin)/admin/acquisitions/_server/media/acquisition-media.service";

const BodySchema = z.object({
    fileKeys: z.array(z.string().min(1)).min(1),
});

export async function POST(req: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await req.json());
        const result = await prepareAcquisitionInlineImages(body.fileKeys);

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Prepare inline images failed",
            },
            { status: 400 }
        );
    }
}