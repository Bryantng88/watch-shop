"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { listAvailableClasps, listStraps } from "../server/strap-read.service";
import { installStrapOnWatch } from "../server/strap-command.service";

export async function listAvailableStrapsAction() {
  await requirePermission(PERMISSIONS.ACCESSORY_UPDATE);
  const rows = await listStraps();
  return rows.filter(
    (row) =>
      row.inventoryPolicy === "STOCKED" &&
      row.stockQty > 0 &&
      !row.attachedWatch,
  );
}

export async function listAvailableClaspsAction() {
  await requirePermission(PERMISSIONS.ACCESSORY_UPDATE);
  const rows = await listAvailableClasps();
  return rows.map((row) => ({
    variantId: row.id,
    title: row.Product.title,
    sku: row.sku,
    stockQty: row.stockQty,
    claspType: String(row.ClaspVariantSpec!.claspType),
    widthMM: row.ClaspVariantSpec!.widthMM,
    originType: String(row.ClaspVariantSpec!.originType),
    brandName: row.ClaspVariantSpec!.brandName,
  }));
}

export async function installStrapFromSpecAction(input: {
  watchId: string;
  variantId: string;
  claspVariantId?: string | null;
}) {
  const actor = await requirePermission(PERMISSIONS.ACCESSORY_UPDATE);
  const result = await installStrapOnWatch({
    watchId: input.watchId,
    variantId: input.variantId,
    claspVariantId: input.claspVariantId,
    ownershipMode: "WATCH_ATTACHED",
    actorUserId: actor.id,
    note: "Gắn từ Watch Spec / Media workspace",
    deferConsumers: (work) => after(work),
  });
  revalidatePath(`/admin/watches/${input.watchId}`);
  revalidatePath("/admin/straps");
  return { id: result.id };
}
