"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";

import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { setWatchInlineImageApplication } from "@/domains/watch/application";

export async function setWatchInlineImageAction(input: {
  productId: string;
  storageKey: string;
}) {
  const auth = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const actorUserId = auth?.user?.id ?? auth?.id ?? auth?.userId ?? null;
  const result = await setWatchInlineImageApplication({
    ...input,
    actorUserId,
    deferConsumers: (work) => after(work),
  });
  revalidatePath(`/admin/watches/${input.productId}`);
  return result;
}
