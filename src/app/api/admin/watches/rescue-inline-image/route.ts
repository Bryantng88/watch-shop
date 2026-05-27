// src/app/api/admin/watches/rescue-inline-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { rescueInlineImageFromMediaAsset } from "@/domains/acquisition/server/acquisition-media.service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const productIds = Array.isArray(body?.productIds)
            ? body.productIds.filter(
                (x: unknown): x is string =>
                    typeof x === "string" && x.trim().length > 0
            )
            : [];
        if (!productIds.length) {
            return NextResponse.json(
                { ok: false, error: "Thiếu productIds", rescued: [], failed: [] },
                { status: 400 }
            );
        }

        const rescued: any[] = [];
        const failed: any[] = [];

        for (const productId of productIds) {
            try {
                rescued.push(await rescueInlineImageFromMediaAsset({ productId }));
            } catch (error: any) {
                failed.push({
                    productId,
                    error: error?.message || "Rescue inline image failed",
                });
            }
        }

        return NextResponse.json({
            ok: failed.length === 0,
            rescued,
            failed,
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || "Rescue failed" },
            { status: 500 }
        );
    }
}