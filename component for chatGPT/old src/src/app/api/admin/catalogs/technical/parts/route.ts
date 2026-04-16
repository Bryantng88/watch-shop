import { NextResponse } from "next/server";
import { createPartCatalog } from "@/app/(admin)/admin/catalogs/technical/_server/part-catalog.service";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));

        const data = await createPartCatalog({
            name: body?.name || "",
            appliesTo: body?.appliesTo || "MECHANICAL",
            group: body?.group || "MOVEMENT",
            sortOrder: body?.sortOrder ?? 0,
            note: body?.note || "",
            isActive: Boolean(body?.isActive ?? true),
        });

        return NextResponse.json({ ok: true, data });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Không thể tạo part catalog" },
            { status: 400 }
        );
    }
}