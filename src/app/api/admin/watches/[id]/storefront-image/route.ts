import { NextRequest, NextResponse } from "next/server";
import { setWatchStorefrontImage } from "@/domains/watch/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await req.json();

    const image = await setWatchStorefrontImage({
        productId: params.id,
        imageId: body?.imageId ?? null,
    });

    return NextResponse.json({ ok: true, image });
}