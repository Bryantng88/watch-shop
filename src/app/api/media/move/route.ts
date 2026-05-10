// src/app/api/media/move/route.ts

import { NextRequest, NextResponse } from "next/server";

import { moveMediaToChosen } from "@/domains/media/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const fromKey = String(body?.fromKey || body?.key || "").trim();
        const productId = String(body?.productId || "").trim();
        const role = String(body?.role || "GALLERY").trim();

        if (!fromKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Thiếu fromKey.",
                },
                { status: 400 }
            );
        }

        const result = await moveMediaToChosen({
            fromKey,
            productId: productId || null,
            role,
        });

        return NextResponse.json({
            success: true,
            item: result,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Không thể move media.",
            },
            { status: 500 }
        );
    }
}