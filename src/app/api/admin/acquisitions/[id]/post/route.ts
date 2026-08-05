import { after, NextResponse } from "next/server";

import { postAcquisitionApplication } from "@/domains/acquisition/application";
import { authorizeAcquisitionAccess } from "@/domains/acquisition/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const access = await authorizeAcquisitionAccess(id, "APPROVE");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });
        const body = await req.json().catch(() => ({}));

        if (!id) {
            return NextResponse.json(
                { error: "Thiếu id phiếu nhập" },
                { status: 400 }
            );
        }

        const data = await postAcquisitionApplication({
            acquisitionId: id,
            vendorName: String(body?.vendorName ?? body?.vendor ?? "").trim(),
            deferConsumers: (work) => after(work),
        });

        return NextResponse.json({ ok: true, data });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || "Không thể duyệt phiếu" },
            { status: 500 }
        );
    }
}
