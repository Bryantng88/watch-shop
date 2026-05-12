import { NextResponse } from "next/server";

import { updateAcquisitionItemsApplication } from "@/domains/acquisition/application";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Thiếu id phiếu nhập" },
                { status: 400 }
            );
        }

        const result = await updateAcquisitionItemsApplication({
            acquisitionId: id,
            items: body?.items ?? [],
        });

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message ?? "Failed to update acquisition items" },
            { status: 500 }
        );
    }
}