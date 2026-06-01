import { NextResponse } from "next/server";
import * as serviceRequest from "@/domains/service/server";
import { ServiceScope } from "@prisma/client";

export async function POST(req: Request) {
    try {
        type CreateServiceFromProductBody = {
            productId?: string;
            productIds?: string[];
            scope?: ServiceScope;
            notes?: string | null;
        };

        const body = (await req.json().catch(() => ({}))) as Partial<CreateServiceFromProductBody>;

        const productIds = Array.isArray(body.productIds)
            ? body.productIds.map((x) => String(x || "").trim()).filter(Boolean)
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