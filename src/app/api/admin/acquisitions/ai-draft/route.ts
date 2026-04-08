import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { generateAcquisitionDraft } from "@/app/(admin)/admin/acquisitions/_server/acquisition-ai.server";

const BodySchema = z.object({
    imageUrls: z.array(z.string()).min(1),
    vendorName: z.string().nullish(),
    cost: z.number().nullish(),
    titleHint: z.string().nullish(),
});

export async function POST(req: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await req.json());

        const result = await generateAcquisitionDraft({
            origin: req.nextUrl.origin,
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_PRODUCT_CONTENT_MODEL || "gpt-5-mini",
            imageUrls: body.imageUrls,
            vendorName: body.vendorName ?? null,
            cost: body.cost ?? null,
            titleHint: body.titleHint ?? null,
        });

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "AI draft acquisition failed" },
            { status: 400 }
        );
    }
}