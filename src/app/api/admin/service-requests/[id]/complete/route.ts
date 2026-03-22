import { NextResponse } from "next/server";
import * as srService from "@/app/(admin)/admin/services/_server/service_request.service";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const serviceRequestId = String(params?.id || "").trim();
        if (!serviceRequestId) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));
        const result = await srService.completeServiceRequest({
            serviceRequestId,
            note: body?.note ?? null,
        });

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
    }
}
