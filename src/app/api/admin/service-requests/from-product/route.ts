
import { NextResponse } from "next/server";
import * as serviceRequest from "@/app/(admin)/admin/services/_server/service_request.service";
import { ServiceScope } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const productId = String(body.productId || '').trim();
        if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
        const services = Array.isArray(body.services) ? body.services : [];
        if (!services.length) return NextResponse.json({ error: 'Missing services' }, { status: 400 });
        const created = [];
        for (const s of services) {
            const item = await serviceRequest.createFromProduct({
                productId,
                customerId: body.customerId ?? null,
                scope: (body.scope ?? ServiceScope.CUSTOMER_OWNED) as ServiceScope,
                serviceCatalogId: s?.serviceCatalogId ? String(s.serviceCatalogId).trim() : null,
                notes: s?.notes ?? null,
            });
            created.push(item);
        }
        return NextResponse.json({ ok: true, items: created });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Create service request failed' }, { status: 500 });
    }
}
