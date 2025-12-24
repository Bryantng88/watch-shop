import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { PUBLIC_BASE } from "@/server/s3";
import { ImageRole } from "@prisma/client";

type Body = { files: { key: string; alt?: string }[] };

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;
    const body = (await req.json()) as Body;
    console.log(' in ra body img + ' + JSON.stringify(body))
    if (!Array.isArray(body.files) || body.files.length === 0) {
        return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const data = body.files.map((f, i) => ({
        productId,
        fileKey: f.key,             // key trong bucket
        alt: f.alt ?? null,
        role: i === 0 ? ImageRole.COVER : ImageRole.GALLERY,  // enum ImageRole { COVER, GALLERY }
        sortOrder: i,
    }));

    const primaryUrl = body.files[0].key;

    await prisma.$transaction(async (tx) => {
        await tx.productImage.createMany({ data });
        await tx.product.update({ where: { id: productId }, data: { primaryImageUrl: primaryUrl } });
    });

    return NextResponse.json({ ok: true, primaryImageUrl: primaryUrl });
}
