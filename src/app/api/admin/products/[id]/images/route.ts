import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/client";
import { ImageRole } from "@prisma/client";
import { toStoredProductImageKey } from "@/server/lib/product-image-storage";

type Body = {
    files: { key: string; alt?: string }[];
    mode?: "primary-inline" | "gallery";
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;
    const body = (await req.json()) as Body;

    if (!Array.isArray(body.files) || body.files.length === 0) {
        return NextResponse.json({ error: "No files" }, { status: 400 });
    }

    const normalizedFiles = body.files
        .map((f) => ({ ...f, key: toStoredProductImageKey(f.key) }))
        .filter((f) => !!f.key);

    if (!normalizedFiles.length) {
        return NextResponse.json({ error: "No valid files" }, { status: 400 });
    }

    const mode = body.mode || (normalizedFiles.length === 1 ? "primary-inline" : "gallery");
    const primaryUrl = normalizedFiles[0].key;

    if (mode === "primary-inline") {
        await prisma.$transaction(async (tx) => {
            const existingCover = await tx.productImage.findFirst({
                where: { productId, role: ImageRole.COVER },
                orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
                select: { id: true },
            });

            if (existingCover?.id) {
                await tx.productImage.update({
                    where: { id: existingCover.id },
                    data: {
                        fileKey: primaryUrl,
                        alt: normalizedFiles[0].alt ?? null,
                        sortOrder: 0,
                        role: ImageRole.COVER,
                    },
                });
            } else {
                await tx.productImage.create({
                    data: {
                        productId,
                        fileKey: primaryUrl,
                        alt: normalizedFiles[0].alt ?? null,
                        role: ImageRole.COVER,
                        sortOrder: 0,
                    },
                });
            }

            await tx.product.update({
                where: { id: productId },
                data: { primaryImageUrl: primaryUrl },
            });
        });

        return NextResponse.json({
            ok: true,
            primaryImageUrl: primaryUrl,
            message:
                "Đã cập nhật ảnh đại diện. Nếu NAS/S3 đang đồng bộ, ảnh mới có thể cần vài giây để hiển thị.",
        });
    }

    const data = normalizedFiles.map((f, i) => ({
        productId,
        fileKey: f.key,
        alt: f.alt ?? null,
        role: i === 0 ? ImageRole.COVER : ImageRole.GALLERY,
        sortOrder: i,
    }));

    await prisma.$transaction(async (tx) => {
        await tx.productImage.createMany({ data });
        await tx.product.update({ where: { id: productId }, data: { primaryImageUrl: primaryUrl } });
    });

    return NextResponse.json({
        ok: true,
        primaryImageUrl: primaryUrl,
        message: "Đã thêm ảnh sản phẩm thành công.",
    });
}
