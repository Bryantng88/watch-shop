import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import * as acquisitionAiService from "@/app/(admin)/admin/acquisitions/_server/acquisition-ai.service";

const BodySchema = z.object({
    imageUrls: z.array(z.string()).min(1),
    quickInput: z.string().nullish(),
    hintText: z.string().nullish(),
    vendorName: z.string().nullish(),
    cost: z.number().nullish(),
});

export async function POST(req: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await req.json());

        const result = await acquisitionAiService.generateAcquisitionDraft({
            origin: req.nextUrl.origin,
            imageUrls: body.imageUrls,
            titleHint: body.quickInput ?? null,
            hintText: body.hintText ?? null,
            vendorName: body.vendorName ?? null,
            cost: body.cost ?? null,
        });

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Line AI draft failed" },
            { status: 400 }
        );
    }
}