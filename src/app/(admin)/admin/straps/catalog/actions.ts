"use server";

import { revalidatePath } from "next/cache";
import { StrapCatalogOptionKind } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export async function createStrapCatalogOption(formData: FormData) {
  await requirePermission(PERMISSIONS.ACCESSORY_UPDATE);
  const kind = String(formData.get("kind") ?? "").trim().toUpperCase() as StrapCatalogOptionKind;
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? name).trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
  if (!Object.values(StrapCatalogOptionKind).includes(kind)) throw new Error("Loại danh mục không hợp lệ.");
  if (!name || !code) throw new Error("Thiếu tên danh mục.");
  await prisma.strapCatalogOption.upsert({
    where: { kind_code: { kind, code } },
    create: { kind, code, name },
    update: { name, isActive: true },
  });
  revalidatePath("/admin/straps/catalog");
}
