import { prisma } from "@/server/db/client";
import { toNumberPrice } from "../shared";

export async function getServiceCatalogOptions(opts?: { isActive?: boolean }) {
  const rows = await prisma.serviceCatalog.findMany({
    where: typeof opts?.isActive === "boolean" ? { isActive: opts.isActive } : { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, code: true, name: true, defaultPrice: true, isActive: true },
  });

  return rows.map((item) => ({
    id: item.id,
    code: item.code ?? null,
    name: item.name,
    defaultPrice: item.defaultPrice == null ? null : toNumberPrice(item.defaultPrice),
    isActive: item.isActive,
  }));
}
