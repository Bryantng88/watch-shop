import { PERMISSIONS } from "@/constants/permissions";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

export type AcquisitionAction = "VIEW" | "CREATE" | "UPDATE" | "APPROVE" | "DELETE";
export type AcquisitionScope = "WATCH" | "ACCESSORY" | "ALL";

const PERMISSION_BY_SCOPE: Record<AcquisitionScope, Record<AcquisitionAction, string>> = {
  WATCH: {
    VIEW: PERMISSIONS.WATCH_ACQUISITION_VIEW,
    CREATE: PERMISSIONS.WATCH_ACQUISITION_CREATE,
    UPDATE: PERMISSIONS.WATCH_ACQUISITION_UPDATE,
    APPROVE: PERMISSIONS.WATCH_ACQUISITION_APPROVE,
    DELETE: PERMISSIONS.WATCH_ACQUISITION_DELETE,
  },
  ACCESSORY: {
    VIEW: PERMISSIONS.ACCESSORY_ACQUISITION_VIEW,
    CREATE: PERMISSIONS.ACCESSORY_ACQUISITION_CREATE,
    UPDATE: PERMISSIONS.ACCESSORY_ACQUISITION_UPDATE,
    APPROVE: PERMISSIONS.ACCESSORY_ACQUISITION_APPROVE,
    DELETE: PERMISSIONS.ACCESSORY_ACQUISITION_DELETE,
  },
  ALL: {
    VIEW: PERMISSIONS.ACQUISITION_VIEW_ALL,
    CREATE: PERMISSIONS.ACQUISITION_CREATE_ALL,
    UPDATE: PERMISSIONS.ACQUISITION_UPDATE_ALL,
    APPROVE: PERMISSIONS.ACQUISITION_APPROVE_ALL,
    DELETE: PERMISSIONS.ACQUISITION_DELETE_ALL,
  },
};

export function classifyAcquisitionScope(productTypes: readonly unknown[]): AcquisitionScope {
  const types = productTypes.map(String);
  if (types.length > 0 && types.every((type) => type === "WATCH")) return "WATCH";
  if (types.length > 0 && types.every((type) => type === "WATCH_STRAP" || type === "WATCH_CLASP")) return "ACCESSORY";
  return "ALL";
}

export function canAccessAcquisitionScope(
  permissions: readonly string[],
  action: AcquisitionAction,
  scope: AcquisitionScope,
) {
  return permissions.includes(PERMISSION_BY_SCOPE.ALL[action]) || permissions.includes(PERMISSION_BY_SCOPE[scope][action]);
}

export function resolveAcquisitionListScope(permissions: readonly string[]) {
  if (permissions.includes(PERMISSIONS.ACQUISITION_VIEW_ALL)) return "ALL" as const;
  const watch = permissions.includes(PERMISSIONS.WATCH_ACQUISITION_VIEW);
  const accessory = permissions.includes(PERMISSIONS.ACCESSORY_ACQUISITION_VIEW);
  if (watch && accessory) return "WATCH_AND_ACCESSORY_ONLY" as const;
  if (watch) return "WATCH_ONLY" as const;
  if (accessory) return "ACCESSORY_ONLY" as const;
  return "NONE" as const;
}

export async function authorizeAcquisitionScope(productTypes: readonly unknown[], action: AcquisitionAction) {
  const { user, permissions } = await getCurrentUserPermissions();
  if (!user) return { ok: false as const, status: 401 as const };
  const scope = classifyAcquisitionScope(productTypes);
  return canAccessAcquisitionScope(permissions, action, scope)
    ? { ok: true as const, user, scope }
    : { ok: false as const, status: 403 as const };
}

export async function authorizeAcquisitionAccess(acquisitionId: string, action: AcquisitionAction = "VIEW") {
  const row = await prisma.acquisition.findUnique({
    where: { id: acquisitionId },
    select: { acquisitionItem: { select: { productType: true } } },
  });
  if (!row) return { ok: false as const, status: 404 as const };
  return authorizeAcquisitionScope(row.acquisitionItem.map((item) => item.productType), action);
}
