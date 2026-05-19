import { NextRequest, NextResponse } from "next/server";
import { listShipmentsApplication } from "@/domains/shipment/application";

function toPositiveInt(value: string | null, fallback: number) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const data = await listShipmentsApplication({
            page: toPositiveInt(searchParams.get("page"), 1),
            pageSize: toPositiveInt(searchParams.get("pageSize"), 20),
            q: searchParams.get("q"),
            status: searchParams.get("status"),
        });
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Không thể tải danh sách shipment." }, { status: 500 });
    }
}
