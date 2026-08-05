import { NextResponse } from "next/server";

import { updateAcquisitionItemsApplication } from "@/domains/acquisition/application";
import { authorizeAcquisitionAccess } from "@/domains/acquisition/server";
import { authorizeAcquisitionScope } from "@/domains/acquisition/server/acquisition-access.service";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const access = await authorizeAcquisitionAccess(id, "UPDATE");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
        const items = Array.isArray(body?.items) ? body.items : [];
        const targetAccess = await authorizeAcquisitionScope(items.map((item: { productType?: unknown }) => item.productType), "UPDATE");
        if (!targetAccess.ok) return NextResponse.json({ error: "Forbidden" }, { status: targetAccess.status });

        if (!id) {
            return NextResponse.json(
                { error: "Thiếu id phiếu nhập" },
                { status: 400 }
            );
        }

        const result = await updateAcquisitionItemsApplication({
            acquisitionId: id,
            items,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message ?? "Failed to update acquisition items" },
            { status: 500 }
        );
    }
}
