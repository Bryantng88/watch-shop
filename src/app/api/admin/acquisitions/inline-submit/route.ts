import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { AcquisitionType } from "@prisma/client";

import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import { createAcquisitionWithItemApplication } from "@/domains/acquisition/application";
const WatchLineSchema = z.object({
    id: z.string(),
    audienceSegment: z.enum(["MEN", "WOMEN"]).optional(),
    quickInput: z.string(),
    aiHint: z.string(),
    cost: z.union([z.number(), z.literal("")]),
    salePrice: z.union([z.number().nonnegative(), z.literal("")]).optional(),
    imageKey: z.string().nullable(),
    imageUrl: z.string().nullable(),
});

const BodySchema = z.object({
    audienceSegment: z.enum(["MEN", "WOMEN"]).default("MEN"),
    vendorId: z.string().min(1),
    currency: z.string(),
    type: z.string(),
    createdAt: z.string(),
    notes: z.string().nullish(),
    items: z.array(WatchLineSchema).min(1),
});

export async function POST(req: NextRequest) {
    const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_CREATE);
    if (auth instanceof Response) return auth;

    try {
        const body = BodySchema.parse(await req.json());

        const result = await createAcquisitionWithItemApplication({
            vendorId: body.vendorId,
            audienceSegment: body.audienceSegment,
            currency: body.currency,
            type: body.type as AcquisitionType,
            createdAt: body.createdAt,
            notes: body.notes ?? null,
            quickVendorName: "",
            items: body.items.map((line, index) => {
                const quickTitle = String(line.quickInput ?? "").trim();
                const title = quickTitle || `Untitled watch ${index + 1}`;

                return {
                    id: `tmp-${line.id}`,
                    audienceSegment: line.audienceSegment ?? body.audienceSegment,
                    title,
                    productTitle: title,
                    unitCost: Number(line.cost === "" ? 0 : line.cost),
                    salePrice: line.salePrice === "" || line.salePrice == null
                        ? null
                        : Number(line.salePrice),
                    aiMeta: {
                        images:
                            line.imageKey || line.imageUrl
                                ? [{ key: line.imageKey, url: line.imageUrl }]
                                : [],
                        aiHint: String(line.aiHint ?? "").trim() || null,
                    },
                };
            }),
        });

        return NextResponse.json({ success: true, ...result });
    } catch (e: unknown) {
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Inline submit failed" },
            { status: 400 }
        );
    }
}
