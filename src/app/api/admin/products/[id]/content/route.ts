import { NextResponse } from "next/server";
import { saveContent } from "@/app/(admin)/admin/products/_server/core/product.service";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));

        const result = await saveContent(id, {
            generatedContent:
                typeof body?.generatedContent === "string" ? body.generatedContent : null,
            promptNote: typeof body?.promptNote === "string" ? body.promptNote : null,
            syncSnapshot: body?.syncSnapshot !== false,
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Save product content failed" },
            { status: 500 }
        );
    }
}
