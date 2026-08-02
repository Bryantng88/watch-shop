"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { listStraps } from "../server/strap-read.service";
import { installStrapOnWatch } from "../server/strap-command.service";

export async function listAvailableStrapsAction() {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const rows = await listStraps();
  return rows.filter(
    (row) =>
      row.inventoryPolicy === "STOCKED" &&
      row.stockQty > 0 &&
      !row.attachedWatch,
  );
}

export async function installStrapFromSpecAction(input: {
  watchId: string;
  variantId: string;
}) {
  const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  const result = await installStrapOnWatch({
    watchId: input.watchId,
    variantId: input.variantId,
    ownershipMode: "WATCH_ATTACHED",
    actorUserId: actor.id,
    note: "Gắn từ Watch Spec / Media workspace",
    deferConsumers: (work) => after(work),
  });
  revalidatePath(`/admin/watches/${input.watchId}`);
  revalidatePath("/admin/straps");
  return { id: result.id };
}
