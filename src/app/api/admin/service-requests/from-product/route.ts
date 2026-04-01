import { NextResponse } from "next/server";
import * as serviceRequest from "@/app/(admin)/admin/services/_server/service_request.service";
import { ServiceScope } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const productIds = Array.isArray(body.productIds)
            ? body.productIds.map((x: unknown) => String(x || "").trim()).filter(Boolean)
            : [];

        const singleProductId = String(body.productId || "").trim();

        const ids = productIds.length
            ? Array.from(new Set(productIds))
            : singleProductId
                ? [singleProductId]
                : [];

        if (!ids.length) {
            return NextResponse.json({ error: "Missing productId(s)" }, { status: 400 });
        }

        const created = await serviceRequest.createTechnicalChecksFromProducts({
            productIds: ids,
            scope: (body.scope ?? ServiceScope.WITH_PURCHASE) as ServiceScope,
            notes: body.notes ? String(body.notes) : null,
        });

        return NextResponse.json({
            ok: true,
            count: created.length,
            items: created,
            message:
                created.length > 1
                    ? `Đã tạo ${created.length} service request`
                    : "Đã tạo service request",
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Create service request failed" },
            { status: 500 }
        );
    }
}