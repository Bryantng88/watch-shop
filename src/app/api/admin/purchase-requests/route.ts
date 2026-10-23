import { PurchaseRequestContactPreference } from "@prisma/client";
import { NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { createInternalPurchaseRequest } from "@/domains/purchase-request/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function POST(request: Request) {
  const auth = await requirePermissionApi(PERMISSIONS.ORDER_CREATE);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const followUpAt = body.followUpAt ? new Date(String(body.followUpAt)) : null;
    if (followUpAt && Number.isNaN(followUpAt.getTime())) {
      return NextResponse.json({ error: "Ngày follow-up không hợp lệ." }, { status: 400 });
    }
    const created = await createInternalPurchaseRequest({
      productIds: Array.isArray(body.productIds) ? body.productIds.map(String) : [],
      customerName: String(body.customerName ?? ""),
      phone: String(body.phone ?? ""),
      customerEmail: body.customerEmail ? String(body.customerEmail) : null,
      contactPreference: Object.values(PurchaseRequestContactPreference).includes(body.contactPreference)
        ? body.contactPreference
        : PurchaseRequestContactPreference.PHONE,
      contactHandle: body.contactHandle ? String(body.contactHandle) : null,
      note: body.note ? String(body.note) : null,
      followUpAt,
      idempotencyKey: String(body.idempotencyKey ?? ""),
      actorUserId: auth.id,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể tạo yêu cầu xử lý đơn hàng." },
      { status: 400 },
    );
  }
}
