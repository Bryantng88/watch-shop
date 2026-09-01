import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { processWatchGalleryWithSharpApplication } from "@/domains/watch/application";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const maxDuration = 120;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await processWatchGalleryWithSharpApplication({
      productId: id,
      storageKey: String(body?.storageKey ?? "").trim(),
      preset: body?.preset,
      actorUserId: auth.id,
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể xử lý Gallery bằng Sharp.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
