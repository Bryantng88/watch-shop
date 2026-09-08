import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { disposeWatchPoolMedia } from "@/domains/media/application";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

const BodySchema = z.object({
  disposition: z.enum(["RECYCLE", "DELETE"]),
  storageKeys: z.array(z.string().min(1)).min(1).max(100),
  commandId: z.string().min(1),
});

function authUserId(auth: unknown) {
  if (!auth || typeof auth !== "object") return null;
  const value = auth as { id?: unknown; user?: { id?: unknown } };
  return String(value.user?.id ?? value.id ?? "").trim() || null;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const { id: productId } = await context.params;
    const body = BodySchema.parse(await request.json());
    const result = await disposeWatchPoolMedia({
      productId,
      ...body,
      requestedByUserId: authUserId(auth),
    });
    return NextResponse.json({ ok: result.failed === 0, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Không thể xử lý ảnh kho tạm." },
      { status: 400 },
    );
  }
}
