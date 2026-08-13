import { after, NextRequest, NextResponse } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { returnWatchCoverApplication, setWatchCoverApplication } from "@/domains/watch/application";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await setWatchCoverApplication({
      productId: id,
      storageKey: String(body?.storageKey ?? body?.fileKey ?? "").trim(),
      entryPoint: body?.entryPoint === "WATCH_LIST_QUICK" ? "WATCH_LIST_QUICK" : null,
      actorUserId: auth.id ?? null,
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật ảnh Cover." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const result = await returnWatchCoverApplication({
      productId: id,
      actorUserId: auth.id ?? null,
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json({ ok: true, data: result });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Không thể trả ảnh về kho Cover." },
      { status: 400 },
    );
  }
}
