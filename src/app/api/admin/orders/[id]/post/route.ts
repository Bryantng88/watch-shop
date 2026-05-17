import { NextRequest, NextResponse } from "next/server";
import { postOneOrder } from "@/domains/order/server";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    try {
        const orderId = ctx.params.id;
        const body = await req.json().catch(() => ({}));


        const result = await postOneOrder(orderId);



        return NextResponse.json(result);
    } catch (e: any) {
        return new NextResponse(e?.message || "Post order failed", { status: 400 });
    }
}
