import { after, NextRequest, NextResponse } from "next/server";

import { postAcquisitionApplication } from "@/domains/acquisition/application";
import { authorizeAcquisitionAccess } from "@/domains/acquisition/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const access = await authorizeAcquisitionAccess(id, "APPROVE");
        if (!access.ok) return NextResponse.json({ error: "Forbidden" }, { status: access.status });

        if (!id) {
            return NextResponse.json(
                { error: "Thiếu id phiếu nhập" },
                { status: 400 }
            );
        }

        if (body?.status !== "POSTED") {
            return NextResponse.json(
                { error: "Chỉ cho phép chuyển sang POSTED" },
                { status: 400 }
            );
        }

        const data = await postAcquisitionApplication({
            acquisitionId: id,
            vendorName: String(body?.vendor ?? body?.vendorName ?? "").trim(),
            deferConsumers: (work) => after(work),
        });

        return NextResponse.json({ ok: true, data });
    } catch (e: any) {
        return NextResponse.json(
            {
                error: e?.message || "Không thể cập nhật trạng thái",
            },
            { status: 500 }
        );
    }
}
