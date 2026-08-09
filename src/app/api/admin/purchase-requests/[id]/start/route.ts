import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/constants/permissions";
import { startPurchaseRequest } from "@/domains/purchase-request/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.ORDER_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    return NextResponse.json(await startPurchaseRequest((await context.params).id, auth.id));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể tiếp nhận yêu cầu." }, { status: 400 });
  }
}
