"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";
import { listActiveStrapColors, listAvailableClasps, listStraps } from "../server/strap-read.service";
import { installStrapOnWatch } from "../server/strap-command.service";

function catalogCode(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export async function createQuickStrapColorAction(input: { name: string }) {
  await requireAnyPermission([
    PERMISSIONS.ACCESSORY_ACQUISITION_CREATE,
    PERMISSIONS.ACQUISITION_CREATE_ALL,
    PERMISSIONS.ACCESSORY_UPDATE,
  ]);
  const name = String(input.name ?? "").trim().replace(/\s+/g, " ");
  const code = catalogCode(name);
  if (!name || !code) throw new Error("Tên màu không hợp lệ.");
  const row = await prisma.strapCatalogOption.upsert({
    where: { kind_code: { kind: "COLOR", code } },
    create: { kind: "COLOR", code, name },
    update: { name, isActive: true },
    select: { id: true, code: true, name: true, colorHex: true },
  });
  revalidatePath("/admin/straps/catalog");
  revalidatePath("/admin/acquisitions/accessories/new");
  return row;
}

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

export async function listStrapColorsAction() {
  await requireAnyPermission([
    PERMISSIONS.ACCESSORY_ACQUISITION_CREATE,
    PERMISSIONS.ACQUISITION_CREATE_ALL,
    PERMISSIONS.ACCESSORY_UPDATE,
  ]);
  return listActiveStrapColors();
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
