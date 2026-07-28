import { PERMISSIONS } from "@/constants/permissions";
import { prisma } from "@/server/db/client";

const catalogCodes = Object.values(PERMISSIONS);
const activityCodes = [
  PERMISSIONS.ACTIVITY_READ,
  PERMISSIONS.ACTIVITY_EDIT,
] as const;

async function main() {
  const [permissions, taskViewRoles] = await Promise.all([
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
  ]);

  const persistedCodes = new Set(permissions.map((permission) => permission.code));
  const missingCatalogCodes = catalogCodes.filter((code) => !persistedCodes.has(code));
  const roleDrift = taskViewRoles.flatMap((role) => {
    const assigned = new Set(role.permissions.map((permission) => permission.code));
    const missing = activityCodes.filter((code) => !assigned.has(code));
    return missing.length ? [{ role: role.name, missing }] : [];
  });
  const result = {
    ok: missingCatalogCodes.length === 0 && roleDrift.length === 0,
    catalogCount: catalogCodes.length,
    persistedCatalogCount: persistedCodes.size,
    taskViewRoleCount: taskViewRoles.length,
    missingCatalogCodes,
    roleDrift,
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
