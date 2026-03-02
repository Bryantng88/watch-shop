import { NextResponse } from "next/server";
import { getAdminPaymentList } from "@/app/(admin)/admin/payments/_server/payment.service";
import { parsePaymentListSearchParams } from "@/app/(admin)/admin/payments/_helper/SearchParams";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const input = parsePaymentListSearchParams(url.searchParams);
        const data = await getAdminPaymentList(input);
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}