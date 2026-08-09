import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { updatePurchaseRequestItems } from "@/domains/purchase-request/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

const decisions = new Set(["PENDING", "SELECTED", "DECLINED", "UNAVAILABLE"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.ORDER_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items.map((item: Record<string, unknown>) => ({
      id: String(item.id ?? ""),
      decision: String(item.decision ?? ""),
      agreedPrice: item.agreedPrice == null ? null : Number(item.agreedPrice),
      reason: item.reason == null ? null : String(item.reason),
    })) : [];
    if (!items.length || items.some((item: { id: string; decision: string }) => !item.id || !decisions.has(item.decision))) {
      throw new Error("Danh sách xử lý sản phẩm không hợp lệ.");
    }
    return NextResponse.json(await updatePurchaseRequestItems({
      id: (await context.params).id,
      items: items as Array<{ id: string; decision: "PENDING" | "SELECTED" | "DECLINED" | "UNAVAILABLE"; agreedPrice?: number | null; reason?: string | null }>,
    }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể cập nhật sản phẩm." }, { status: 400 });
  }
}
