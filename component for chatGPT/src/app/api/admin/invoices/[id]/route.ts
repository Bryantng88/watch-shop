import { NextRequest, NextResponse } from "next/server";
import prisma from "@/server/db/client";

type RouteContext = { params: { id: string } };

export async function GET(_req: NextRequest, ctx: RouteContext) {
    const { id } = ctx.params;

    const invoice = await prisma.invoice.findUnique({
        where: { id },
        select: {
            items: {
                select: {
                    id: true,
                    title: true,
                    quantity: true,
                    unitPrice: true,
                    discount: true,
                    taxRate: true,
                    lineTotal: true,
                },
            },
        },
    });

    if (!invoice) {
        return NextResponse.json({ items: [] }, { status: 404 });
    }

    return NextResponse.json({
        items: invoice.items.map((it) => ({
            id: it.id,
            title: it.title,
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice),
            discount: Number(it.discount ?? 0),
            taxRate: Number(it.taxRate ?? 0),
            lineTotal: Number(it.lineTotal),
        })),
    });
}
