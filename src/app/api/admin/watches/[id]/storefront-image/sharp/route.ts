import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { recreateWatchCoverWithSharpApplication } from "@/domains/watch/application";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const maxDuration = 120;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await recreateWatchCoverWithSharpApplication({
      productId: id,
      storageKey: String(body?.storageKey ?? "").trim(),
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Không thể tạo lại ảnh bằng Sharp.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
