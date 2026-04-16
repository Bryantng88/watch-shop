import { NextRequest, NextResponse } from "next/server";
import {
    getWatchImages,
    replaceWatchImages,
} from "@/domains/watch/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const items = await getWatchImages(params.id);
    return NextResponse.json({ ok: true, items });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const body = await req.json();

    const items = await replaceWatchImages({
        productId: params.id,
        images: Array.isArray(body?.images) ? body.images : [],
    });

    return NextResponse.json({ ok: true, items });
}