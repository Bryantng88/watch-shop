import { after, NextRequest, NextResponse } from "next/server";

import { createAcquisitionWithItemApplication } from "@/domains/acquisition/application";
import { authorizeAcquisitionScope } from "@/domains/acquisition/server/acquisition-access.service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const items: Array<Record<string, unknown>> = Array.isArray(body.items) ? body.items : [];
        const auth = await authorizeAcquisitionScope(items.map((item) => item.productType), "CREATE");
        if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: auth.status });

        if (!body.vendorId && !body.quickVendorName) {
            return NextResponse.json(
                { error: "Thiếu vendorId hoặc tên vendor mới" },
                { status: 400 }
            );
        }

        if (!items.length) {
            return NextResponse.json(
                { error: "Phải có ít nhất 1 sản phẩm" },
                { status: 400 }
            );
        }

        for (const [i, item] of items.entries()) {
            if (!item.title || typeof item.title !== "string") {
                return NextResponse.json(
                    { error: `Sản phẩm dòng ${i + 1} thiếu tên (title)` },
                    { status: 400 }
                );
            }

            if (Number(item.quantity ?? 0) < 1) {
                return NextResponse.json(
                    { error: `Sản phẩm dòng ${i + 1} số lượng phải > 0` },
                    { status: 400 }
                );
            }
        }

        const result = await createAcquisitionWithItemApplication(body, {
            actorUserId: auth.user.id ?? null,
            deferConsumers: (work) => after(work),
        });
        return NextResponse.json(result, { status: 201 });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Lỗi hệ thống" },
            { status: 400 }
        );
    }
}
