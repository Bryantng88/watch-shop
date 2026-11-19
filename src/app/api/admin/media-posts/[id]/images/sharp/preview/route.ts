import { NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { previewMediaPostImageWithSharp } from "@/domains/media-post/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export const maxDuration = 30;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const bytes = await previewMediaPostImageWithSharp({
      mediaPostId: id,
      storageKey: String(body?.storageKey ?? "").trim(),
      preset: body?.preset,
    });
    return new NextResponse(new Uint8Array(bytes), {
      headers: { "content-type": "image/jpeg", "cache-control": "private, no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể tạo preview Sharp." },
      { status: 502 },
    );
  }
}
