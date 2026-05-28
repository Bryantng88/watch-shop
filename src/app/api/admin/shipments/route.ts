import { NextRequest, NextResponse } from "next/server";
import { createManualShipmentApplication, listShipmentsApplication } from "@/domains/shipment/application";

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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const data = await createManualShipmentApplication({
            orderId: String(body.orderId ?? ""),
            shipPhone: body.shipPhone ?? null,
            shipAddress: body.shipAddress ?? null,
            shipCity: body.shipCity ?? null,
            shipDistrict: body.shipDistrict ?? null,
            shipWard: body.shipWard ?? null,
            carrier: body.carrier ?? null,
            trackingCode: body.trackingCode ?? null,
            notes: body.notes ?? null,
        });
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Không thể tạo shipment." }, { status: 400 });
    }
}
