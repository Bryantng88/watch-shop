import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PERMISSIONS } from "@/constants/permissions";
import { disposeWatchPoolMedia } from "@/domains/media/application";
import { createMediaPost } from "@/domains/media-post/server";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { prisma } from "@/server/db/client";

const BodySchema = z.object({
  disposition: z.enum(["MOVE_TO_POST", "RETURN_TO_NAS", "RECYCLE", "DELETE"]),
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
    const actorUserId = authUserId(auth);
    const watch = body.disposition === "MOVE_TO_POST"
      ? await prisma.watch.findUnique({ where: { productId }, select: { id: true, product: { select: { title: true } } } })
      : null;
    if (body.disposition === "MOVE_TO_POST" && !watch) throw new Error("Không tìm thấy Watch.");
    const post = watch
      ? await createMediaPost({
          brief: `Ảnh chuyển từ kho tạm của ${watch.product.title}`,
          watchIds: [watch.id],
          createdByUserId: actorUserId,
        })
      : null;
    const result = await disposeWatchPoolMedia({
      productId,
      ...body,
      destinationMediaPostId: post?.id ?? null,
      requestedByUserId: actorUserId,
    });
    return NextResponse.json({ ok: result.failed === 0, ...result, postId: post?.id ?? null, postRefNo: post?.refNo ?? null });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Không thể xử lý ảnh kho tạm." },
      { status: 400 },
    );
  }
}
