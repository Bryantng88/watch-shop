import { after, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { revokeVendorPricingRequest } from "@/domains/acquisition/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.WATCH_ACQUISITION_CREATE);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await context.params;
    const data = await revokeVendorPricingRequest({
      requestId: id,
      actorUserId: auth.id ?? null,
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể thu hồi link báo giá." },
      { status: 400 },
    );
  }
}
