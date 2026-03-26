import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { ImageRole } from "@prisma/client";
import { toStoredProductImageKey } from "@/server/lib/product-image-storage";

type Body = { files: { key: string; alt?: string }[] };

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;
    const body = (await req.json()) as Body;
    console.log(' in ra body img + ' + JSON.stringify(body))
    if (!Array.isArray(body.files) || body.files.length === 0) {
        return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const normalizedFiles = body.files
        .map((f) => ({ ...f, key: toStoredProductImageKey(f.key) }))
        .filter((f) => !!f.key);

    if (!normalizedFiles.length) {
        return NextResponse.json({ error: "No valid files" }, { status: 400 });
    }

    const data = normalizedFiles.map((f, i) => ({
        productId,
        fileKey: f.key,             // key trong bucket
        alt: f.alt ?? null,
        role: i === 0 ? ImageRole.COVER : ImageRole.GALLERY,  // enum ImageRole { COVER, GALLERY }
        sortOrder: i,
    }));

    const primaryUrl = normalizedFiles[0].key;

    await prisma.$transaction(async (tx) => {
        await tx.productImage.createMany({ data });
        await tx.product.update({ where: { id: productId }, data: { primaryImageUrl: primaryUrl } });
    });

    return NextResponse.json({ ok: true, primaryImageUrl: primaryUrl });
}
