import { NextResponse } from "next/server";
import { prisma } from "@/server/db/client";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));

        const data = await prisma.watchSpec.upsert({
            where: { productId: id },
            create: {
                productId: id,
                movement: body?.movement as any,
                caliber: body?.caliber || null,
                model: body?.model || null,
                ref: body?.ref || null,
                caseMaterial: body?.caseMaterial as any,
                glass: body?.glass as any,
                caseSize: body?.caseSize || null,
                dialColor: body?.dialColor || null,
            },
            update: {
                movement: body?.movement as any,
                caliber: body?.caliber || null,
                model: body?.model || null,
                ref: body?.ref || null,
                caseMaterial: body?.caseMaterial as any,
                glass: body?.glass as any,
                caseSize: body?.caseSize || null,
                dialColor: body?.dialColor || null,
            },
        });

        return NextResponse.json({ ok: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể lưu watch spec" },
            { status: 400 }
        );
    }
}