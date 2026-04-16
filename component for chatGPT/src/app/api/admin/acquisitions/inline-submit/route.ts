import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";
import * as acquisitionService from "@/app/(admin)/admin/acquisitions/_server/core/acquisition.service";

const WatchLineSchema = z.object({
    id: z.string(),
    kind: z.literal("WATCH"),
    quickInput: z.string(),
    aiHint: z.string(),
    quantity: z.number(),
    cost: z.union([z.number(), z.literal("")]),
    receiveService: z.boolean(),
    imageKey: z.string().nullable(),
    imageUrl: z.string().nullable(),
});

const BodySchema = z.object({
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

        const result = await acquisitionService.createAcquisitionWithItem({
            vendorId: body.vendorId,
            currency: body.currency,
            type: body.type as any,
            createdAt: body.createdAt,
            notes: body.notes ?? null,
            quickVendorName: "",
            items: body.items.map((line, index) => {
                const quickTitle = String(line.quickInput ?? "").trim();
                const title = quickTitle || `Untitled watch ${index + 1}`;

                return {
                    id: `tmp-${line.id}`,
                    title,
                    productType: "WATCH",
                    quantity: Number(line.quantity || 1),
                    unitCost: Number(line.cost === "" ? 0 : line.cost),
                    productId: null,
                    variantId: null,
                    watchFlags: {
                        needService: Boolean(line.receiveService),
                    },
                    aiMeta: {
                        images:
                            line.imageKey || line.imageUrl
                                ? [{ key: line.imageKey, url: line.imageUrl }]
                                : [],
                        aiHint: String(line.aiHint ?? "").trim() || null,
                    },
                };
            }),
        } as any);

        return NextResponse.json({ success: true, ...result });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Inline submit failed" },
            { status: 400 }
        );
    }
}
