import { NextRequest, NextResponse } from "next/server";
import {
    getOrderDraftForEdit,
    updateOrderDraft,
} from "@/app/(admin)/admin/orders/_servers/order.service";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await getOrderDraftForEdit(id);
        return NextResponse.json(data);
    } catch (e: any) {
        return new NextResponse(e?.message || "Not found", { status: 404 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await updateOrderDraft(id, body);
        return NextResponse.json(updated);
    } catch (e: any) {
        return new NextResponse(
            e?.message || "Update order draft failed",
            { status: 400 }
        );
    }
}