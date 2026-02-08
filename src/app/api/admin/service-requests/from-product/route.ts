// src/app/api/admin/service-requests/from-product/route.ts
import { NextResponse } from "next/server";
import { ServiceScope } from "@prisma/client";
import * as srService from "@/app/(admin)/admin/services/_server/service_request.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ accept multiple services
    // services: [{ serviceCatalogId, notes? }]
    const productId = String(body.productId || "");
    if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

    const services = Array.isArray(body.services) ? body.services : [];
    if (!services.length) {
      return NextResponse.json({ error: "Missing services[]" }, { status: 400 });
    }

    const created = await srService.createFromProductMany({
      productId,
      customerId: body.customerId ?? null,
      scope: (body.scope ?? "INTERNAL") as ServiceScope,
      services: services.map((x: any) => ({
        serviceCatalogId: String(x.serviceCatalogId),
        notes: (x.notes ?? body.notes ?? null) as string | null, // notes chung hoặc theo item
      })),
    });

    return NextResponse.json({ items: created });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

// (optional) tránh lỗi preflight khi bạn dùng fetch cross-origin / custom headers
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
