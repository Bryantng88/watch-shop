import { PERMISSIONS } from "@/constants/permissions";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

export async function authorizeAcquisitionAccess(acquisitionId: string, mode: "VIEW" | "UPDATE" = "VIEW") {
  const { user, permissions } = await getCurrentUserPermissions();
  if (!user) return { ok: false as const, status: 401 as const };
  const general = mode === "VIEW" ? PERMISSIONS.ACQUISITION_VIEW : PERMISSIONS.ACQUISITION_UPDATE;
  if (permissions.includes(general)) return { ok: true as const, user, scope: "ALL" as const };
  const strap = mode === "VIEW" ? PERMISSIONS.STRAP_ACQUISITION_VIEW : PERMISSIONS.STRAP_ACQUISITION_UPDATE;
  if (!permissions.includes(strap)) return { ok: false as const, status: 403 as const };
  const row = await prisma.acquisition.findUnique({
    where: { id: acquisitionId },
    select: { acquisitionItem: { select: { productType: true } } },
  });
  if (!row) return { ok: false as const, status: 404 as const };
  const accessoryOnly = row.acquisitionItem.length > 0 && row.acquisitionItem.every((item) => item.productType === "WATCH_STRAP" || item.productType === "WATCH_CLASP");
  return accessoryOnly ? { ok: true as const, user, scope: "ACCESSORY_ONLY" as const } : { ok: false as const, status: 403 as const };
}
