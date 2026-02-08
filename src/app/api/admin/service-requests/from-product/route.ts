import { NextResponse } from "next/server";
import * as  serviceRequest from "@/app/(admin)/admin/services/_server/service_request.service"
import { ServiceScope } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('test body ' + JSON.stringify(body))

        const productId = String(body.productId || "").trim();
        if (!productId) {
            return NextResponse.json({ error: "Missing productId" }, { status: 400 });
        }

        // services: [{ serviceCatalogId, notes? }, ...]
        const services = Array.isArray(body.services) ? body.services : [];
        if (!services.length) {
            return NextResponse.json({ error: "Missing services" }, { status: 400 });
        }


        const created = await serviceRequest.createFromProductMany({
            productId,
            customerId: body.customerId ?? null,
            scope: (body.scope ?? "INTERNAL") as ServiceScope,
            services: services.map((s: any) => ({
                serviceCatalogId: String(s.serviceCatalogId || "").trim(),
                notes: s.notes ?? null,
            })),
        });
        console.log('test created ' + JSON.stringify(created))

        return NextResponse.json({ items: created });
    } catch (e: any) {
        const msg = e?.message ?? "Internal error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }

}