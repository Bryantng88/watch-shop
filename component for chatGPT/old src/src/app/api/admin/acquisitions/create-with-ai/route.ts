import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import * as acquisitionAiService from "@/app/(admin)/admin/acquisitions/_serverOld/acquisition-ai.service";

const BodySchema = z.object({
    imageUrls: z.array(z.string()).min(1),
    vendorId: z.string().min(1),
    vendorName: z.string().nullish(),
    cost: z.number(),
    note: z.string().nullish(),
    titleHint: z.string().nullish(),
    hintText: z.string().nullish(),
    categoryId: z.string().nullish(),
});

export async function POST(req: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await req.json());

        const result = await acquisitionAiService.createWithAi({
            origin: req.nextUrl.origin,
            imageUrls: body.imageUrls,
            vendorId: body.vendorId,
            vendorName: body.vendorName ?? null,
            cost: body.cost,
            note: body.note ?? null,
            titleHint: body.titleHint ?? null,
            hintText: body.hintText ?? null,
            categoryId: body.categoryId ?? null,
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Create acquisition with AI failed" },
            { status: 400 }
        );
    }
}