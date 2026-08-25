import { PERMISSIONS } from "@/constants/permissions";
import { prisma } from "@/server/db/client";

const catalogCodes = Object.values(PERMISSIONS);
const activityCodes = [
  PERMISSIONS.ACTIVITY_READ,
  PERMISSIONS.ACTIVITY_EDIT,
] as const;
const expectedRolePermissions: Record<string, readonly string[]> = {
  ADMIN: catalogCodes,
  SALE: [
    PERMISSIONS.ACCESSORY_ACQUISITION_VIEW,
    PERMISSIONS.ACCESSORY_ACQUISITION_CREATE,
    PERMISSIONS.REPORT_SALES_VIEW,
    PERMISSIONS.ORDER_PAYMENT_VIEW,
    PERMISSIONS.ORDER_PAYMENT_CREATE,
    PERMISSIONS.ORDER_PAYMENT_UPDATE,
    PERMISSIONS.ORDER_PAYMENT_DELETE,
  ],
  ACCESSORY_MANAGER: [
    PERMISSIONS.ACCESSORY_VIEW,
    PERMISSIONS.ACCESSORY_CREATE,
    PERMISSIONS.ACCESSORY_UPDATE,
    PERMISSIONS.ACCESSORY_DELETE,
    PERMISSIONS.ACCESSORY_ACQUISITION_VIEW,
    PERMISSIONS.ACCESSORY_ACQUISITION_CREATE,
    PERMISSIONS.ACCESSORY_ACQUISITION_UPDATE,
  ],
  SALE_ADMIN: [
    PERMISSIONS.TASK_VIEW,
    PERMISSIONS.PAYMENT_VIEW_ALL,
    PERMISSIONS.PAYMENT_CREATE_ALL,
    PERMISSIONS.PAYMENT_UPDATE_ALL,
    PERMISSIONS.PRODUCT_COST_VIEW,
    PERMISSIONS.REPORT_SALES_VIEW,
    PERMISSIONS.ACTIVITY_READ,
    PERMISSIONS.ACTIVITY_EDIT,
  ],
};
const retiredPermissionCodes = [
  "INVOICE_VIEW",
  "INVOICE_CREATE",
  "INVOICE_UPDATE",
  "INVOICE_DELETE",
  "ACQUISITION_VIEW",
  "ACQUISITION_CREATE",
  "ACQUISITION_UPDATE",
  "ACQUISITION_DELETE",
  "ACQUISITION_APPROVE",
  "STRAP_ACQUISITION_VIEW",
  "STRAP_ACQUISITION_CREATE",
  "STRAP_ACQUISITION_UPDATE",
  "PAYMENT_VIEW",
  "PAYMENT_CREATE",
  "PAYMENT_UPDATE",
  "PAYMENT_DELETE",
] as const;
const saleAcquisitionAllowlist = new Set<string>([
  PERMISSIONS.ACCESSORY_ACQUISITION_VIEW,
  PERMISSIONS.ACCESSORY_ACQUISITION_CREATE,
]);

async function main() {
  const [permissions, taskViewRoles, expectedRoles, retiredPermissions] = await Promise.all([
    prisma.permission.findMany({
      where: { code: { in: catalogCodes } },
      select: { code: true },
    }),
    prisma.role.findMany({
      where: {
        permissions: { some: { code: PERMISSIONS.TASK_VIEW } },
      },
      orderBy: { name: "asc" },
      select: {
        name: true,
        permissions: {
          where: { code: { in: [...activityCodes] } },
          select: { code: true },
        },
      },
    }),
    prisma.role.findMany({
      where: { name: { in: Object.keys(expectedRolePermissions) } },
      select: {
        name: true,
        permissions: { select: { code: true } },
      },
    }),
    prisma.permission.findMany({
      where: { code: { in: [...retiredPermissionCodes] } },
      select: { code: true },
    }),
  ]);

  const persistedCodes = new Set(permissions.map((permission) => permission.code));
  const missingCatalogCodes = catalogCodes.filter((code) => !persistedCodes.has(code));
  const roleDrift = taskViewRoles.flatMap((role) => {
    const assigned = new Set(role.permissions.map((permission) => permission.code));
    const missing = activityCodes.filter((code) => !assigned.has(code));
    return missing.length ? [{ role: role.name, missing }] : [];
  });
  const roleByName = new Map(expectedRoles.map((role) => [role.name, role]));
  const expectedRoleDrift = Object.entries(expectedRolePermissions).flatMap(([roleName, expected]) => {
    const role = roleByName.get(roleName);
    if (!role) return [{ role: roleName, missing: ["ROLE_MISSING"] }];
    const assigned = new Set(role.permissions.map((permission) => permission.code));
    const missing = expected.filter((code) => !assigned.has(code));
    return missing.length ? [{ role: roleName, missing }] : [];
  });
  const saleRole = roleByName.get("SALE");
  const forbiddenRoleDrift = (saleRole?.permissions ?? [])
    .map((permission) => permission.code)
    .filter((code) =>
      code.includes("ACQUISITION") && !saleAcquisitionAllowlist.has(code),
    )
    .map((code) => ({ role: "SALE", forbidden: code }));
  const result = {
    ok: missingCatalogCodes.length === 0 && roleDrift.length === 0 && expectedRoleDrift.length === 0 && forbiddenRoleDrift.length === 0 && retiredPermissions.length === 0,
    catalogCount: catalogCodes.length,
    persistedCatalogCount: persistedCodes.size,
    taskViewRoleCount: taskViewRoles.length,
    missingCatalogCodes,
    roleDrift,
    expectedRoleDrift,
    forbiddenRoleDrift,
    retiredPermissionCodesPresent: retiredPermissions.map((permission) => permission.code),
  };

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) throw new Error("PERMISSION_CATALOG_DATABASE_DRIFT");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
