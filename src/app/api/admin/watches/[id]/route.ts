import { NextRequest, NextResponse } from "next/server";
import {
    getWatchImages,
} from "@/domains/watch/server";
import { replaceWatchGalleryImages } from "@/domains/watch/server/media/watch-media.service";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const items = await getWatchImages((await params).id);
    return NextResponse.json({ ok: true, items });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const body = await req.json();

    const items = await replaceWatchGalleryImages({
        productId: (await params).id,
        images: Array.isArray(body?.images) ? body.images : [],
    });

    return NextResponse.json({ ok: true, items });
}
