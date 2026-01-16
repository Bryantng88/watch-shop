import { NextRequest, NextResponse } from "next/server";
import { getOrderDraftForEdit, updateOrderDraft } from "@/app/(admin)/admin/orders/_servers/order.service";

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
    try {
        const data = await getOrderDraftForEdit(ctx.params.id);
        return NextResponse.json(data);
    } catch (e: any) {
        return new NextResponse(e?.message || "Not found", { status: 404 });
    }
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
    try {
        const body = await req.json();
        const updated = await updateOrderDraft(ctx.params.id, body);
        return NextResponse.json(updated);
    } catch (e: any) {
        return new NextResponse(e?.message || "Update order draft failed", {
            status: 400,
        });
    }
}
