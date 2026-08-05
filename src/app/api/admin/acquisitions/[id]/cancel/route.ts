import { NextResponse } from "next/server";

import { cancelAcquisitionApplication } from "@/domains/acquisition/application";
import { authorizeAcquisitionAccess } from "@/domains/acquisition/server";

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const access = await authorizeAcquisitionAccess(id, "DELETE");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

        if (!id) {
            return NextResponse.json(
                { error: "Thiếu id phiếu nhập" },
                { status: 400 }
            );
        }

        const data = await cancelAcquisitionApplication({ acquisitionId: id });

        return NextResponse.json({ ok: true, data });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Không thể hủy phiếu" },
            { status: 500 }
        );
    }
}
