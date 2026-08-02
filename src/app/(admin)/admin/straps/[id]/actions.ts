"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { PERMISSIONS } from "@/constants/permissions";
import { requestStrapProcessing } from "@/domains/strap/server";
import { requirePermission } from "@/server/auth/requirePermission";

export async function requestStrapProcessingAction(variantId: string) {
  const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  await requestStrapProcessing({
    variantId,
    actorUserId: actor.id,
    deferConsumers: (work) => after(work),
  });
  revalidatePath(`/admin/straps/${variantId}`);
  revalidatePath("/admin/coordination/operation");
}
