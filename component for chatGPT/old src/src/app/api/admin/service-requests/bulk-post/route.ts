import { NextResponse } from "next/server";
import { postServiceRequests } from "@/app/(admin)/admin/services/_server/service_request.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
    if (!ids.length) {
      return NextResponse.json({ error: "Missing ids" }, { status: 400 });
    }

    const result = await postServiceRequests(ids);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
