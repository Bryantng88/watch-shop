import { NextRequest, NextResponse } from "next/server";
import * as service from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";

export async function POST(req: NextRequest) {
    const { items } = await req.json();

    console.log('in ra acqs ' + items)

    if (!Array.isArray(items) || !items.length) return NextResponse.json({ error: "No data" }, { status: 400 });
    const result = await service.postMultipleAcquisitions(items);
    return NextResponse.json({ result });
}