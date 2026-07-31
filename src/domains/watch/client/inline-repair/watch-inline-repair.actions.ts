"use server";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { repairWatchInlineMedia } from "@/domains/watch/application/repair-watch-inline-media.application";

export async function repairWatchInlineMediaAction(input: {
  productId: string;
  storageKey: string;
}) {
  const user = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const productId = String(input.productId ?? "").trim();
  const storageKey = String(input.storageKey ?? "").trim();
  if (!productId || !storageKey) throw new Error("Thiếu Watch hoặc ảnh INLINE cần chọn.");

  return repairWatchInlineMedia({
    productId,
    storageKey,
    actorUserId: user.id,
  });
}
