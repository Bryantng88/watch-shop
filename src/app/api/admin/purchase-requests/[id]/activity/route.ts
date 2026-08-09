import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { recordPurchaseRequestActivity } from "@/domains/purchase-request/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

const allowedTypes = new Set(["CONTACT_ATTEMPT", "NOTE", "FOLLOW_UP"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.ORDER_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const type = String(body?.type ?? "");
    if (!allowedTypes.has(type)) throw new Error("Loại hoạt động không hợp lệ.");
    const followUpAt = body?.followUpAt ? new Date(String(body.followUpAt)) : null;
    if (followUpAt && Number.isNaN(followUpAt.getTime())) throw new Error("Thời gian liên hệ lại không hợp lệ.");
    return NextResponse.json(await recordPurchaseRequestActivity({
      id: (await context.params).id,
      type: type as "CONTACT_ATTEMPT" | "NOTE" | "FOLLOW_UP",
      note: String(body?.note ?? ""),
      followUpAt,
      actorUserId: auth.id,
    }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể lưu hoạt động." }, { status: 400 });
  }
}
